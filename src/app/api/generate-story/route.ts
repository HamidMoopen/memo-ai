import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import OpenAI from 'openai';
import { LifeChapter } from '@/types/story';

// Check if OpenAI API key is configured
if (!process.env.OPENAI_API_KEY) {
    console.error('OpenAI API key is not configured');
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

interface Story {
    id: string;
    title: string;
    content: string;
    created_at: string;
    user_id: string;
    metadata: any;
    life_chapter?: LifeChapter;
    chapter_metadata?: {
        time_period: string;
        key_events: string[];
        locations: string[];
        people: string[];
        emotions: string[];
        lessons_learned: string[];
    };
}

interface GenerationOptions {
    writing_style?: 'formal' | 'casual' | 'poetic' | 'journalistic';
    tone?: 'reflective' | 'nostalgic' | 'humorous' | 'dramatic';
    perspective?: 'first_person' | 'third_person';
    focus?: 'personal' | 'professional' | 'family' | 'adventure';
    chapter_count?: number;
}

export async function POST(request: Request) {
    try {
        console.log('Starting story generation...');
        
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError) {
            console.error('Auth error:', authError);
            return NextResponse.json({ error: 'Authentication error' }, { status: 401 });
        }

        if (!user) {
            console.error('No user found');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        console.log('User authenticated:', user.id);

        // First, let's check if we have any stories in the database
        const { data: existingStories, error: storiesError } = await supabase
            .from('stories')
            .select('*')
            .order('created_at', { ascending: true });

        if (storiesError) {
            console.error('Error fetching stories:', storiesError);
            throw storiesError;
        }

        console.log('Total stories in database:', existingStories?.length || 0);

        // Get the options from the request
        const { options } = await request.json();
        const generationOptions: GenerationOptions = options || {};

        // Fetch user's stories
        const { data: userStories, error: userStoriesError } = await supabase
            .from('stories')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: true });

        if (userStoriesError) {
            console.error('Error fetching user stories:', userStoriesError);
            throw userStoriesError;
        }

        console.log('Found user stories:', userStories?.length || 0);

        // Prepare story context for the AI
        const storyContext = userStories && userStories.length > 0
            ? userStories
                .map((story: Story) => `Title: ${story.title}\n\nContent: ${story.content}`)
                .join('\n\n---\n\n')
            : 'No previous stories available. Please generate a new story based on the provided options.';

        console.log('Preparing to call OpenAI...');

        // Generate story using OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
                {
                    role: "system",
                    content: `You are an expert biographer and storyteller. Your task is to transform personal stories into compelling autobiography chapters. 
                    Follow these guidelines:
                    1. Maintain the person's authentic voice and perspective
                    2. Structure each chapter with proper narrative arc (exposition, rising action, climax, falling action, resolution)
                    3. Include emotional depth and personal reflection
                    4. Identify and develop key themes
                    5. Use descriptive language and vivid details
                    6. Ensure chronological coherence
                    7. Add appropriate transitions between events
                    8. Include personal insights and lessons learned
                    9. Analyze and incorporate the following metadata:
                       - Time periods and historical context
                       - Key locations and settings
                       - Important characters and relationships
                       - Significant events and turning points
                       - Cultural and societal influences
                       - Literary devices and narrative techniques
                       
                    Also determine which life chapter this story belongs to:
                    - early_childhood (0-5)
                    - childhood (6-12)
                    - teenage_years (13-19)
                    - young_adult (20-25)
                    - college
                    - early_career
                    - career_growth
                    - family_life
                    - mid_life
                    - late_career
                    - retirement
                    - legacy
                    
                    If no previous stories are available, create a new story that can serve as the foundation for future chapters.`
                },
                {
                    role: "user",
                    content: `Based on these personal stories, create ${generationOptions.chapter_count || 1} compelling autobiography chapters. 
                    Here's the context: ${storyContext}
                    
                    Writing Style: ${generationOptions.writing_style || 'formal'}
                    Tone: ${generationOptions.tone || 'reflective'}
                    Perspective: ${generationOptions.perspective || 'first_person'}
                    Focus: ${generationOptions.focus || 'personal'}
                    
                    Please structure the response as a JSON object with the following fields:
                    - chapters: Array of chapter objects, each containing:
                      - title: A compelling title for the chapter
                      - content: The full story content
                      - emotion: The primary emotion conveyed
                      - story_arc: Object containing exposition, rising_action, climax, falling_action, and resolution
                      - themes: Array of key themes
                      - writing_style: Description of the writing style used
                      - life_chapter: The life period this story belongs to (from the predefined list)
                      - chapter_metadata: Object containing:
                        - time_period: When the events took place
                        - locations: Array of key locations
                        - people: Array of important people
                        - key_events: Array of significant events
                        - emotions: Array of emotions experienced
                        - lessons_learned: Array of insights and lessons
                        - cultural_context: Cultural and societal context`
                }
            ],
            response_format: { type: "json_object" }
        });

        console.log('OpenAI response received');

        const response = completion.choices[0].message.content;
        if (!response) {
            console.error('No content in OpenAI response');
            throw new Error('No response from OpenAI');
        }

        const generatedStory = JSON.parse(response);
        console.log('Story generated successfully');

        // Save the generated story to the database
        const { error: saveError } = await supabase
            .from('stories')
            .insert({
                user_id: user.id,
                title: generatedStory.chapters[0].title,
                content: generatedStory.chapters.map((chapter: any) => chapter.content).join('\n\n'),
                life_chapter: generatedStory.chapters[0].life_chapter,
                chapter_metadata: {
                    time_period: generatedStory.chapters[0].chapter_metadata.time_period,
                    key_events: generatedStory.chapters[0].chapter_metadata.key_events,
                    locations: generatedStory.chapters[0].chapter_metadata.locations,
                    people: generatedStory.chapters[0].chapter_metadata.people,
                    emotions: generatedStory.chapters[0].chapter_metadata.emotions,
                    lessons_learned: generatedStory.chapters[0].chapter_metadata.lessons_learned
                },
                metadata: {
                    chapters: generatedStory.chapters.map((chapter: any) => ({
                        title: chapter.title,
                        emotion: chapter.emotion,
                        story_arc: chapter.story_arc,
                        themes: chapter.themes,
                        writing_style: chapter.writing_style,
                        metadata: chapter.metadata
                    }))
                }
            });

        if (saveError) {
            console.error('Error saving story:', saveError);
            throw saveError;
        }

        console.log('Story saved to database');
        return NextResponse.json(generatedStory);
    } catch (error) {
        console.error('Error in story generation:', error);
        if (error instanceof Error) {
            console.error('Error details:', error.message);
            console.error('Error stack:', error.stack);
        }
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to generate story' },
            { status: 500 }
        );
    }
} 