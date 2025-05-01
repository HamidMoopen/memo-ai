import { createClient } from '@/lib/supabase/server';
import OpenAI from 'openai';

interface StorySegment {
    content: string;
    speaker: string;
    timestamp_start: string;
    timestamp_end: string;
}

interface ProcessedStory {
    title: string;
    content: string;
    time_period: string;
    location: string;
    story_type: string;
    life_stage: string;
    people: Array<{
        name: string;
        relationship: string;
        role_in_story: string;
    }>;
    emotions: Array<{
        emotion: string;
        intensity: number;
        context: string;
        timestamp: string;
    }>;
    themes: Array<{
        theme: string;
        confidence: number;
    }>;
    segments: StorySegment[];
}

export async function processStory(callId: string, transcript: string): Promise<string> {
    const supabase = await createClient();
    const openai = new OpenAI();

    // 1. Use AI to analyze the transcript
    const analysis = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            {
                role: "system",
                content: "Analyze this story transcript and extract key elements: title, time period, location, people, emotions, themes, and story segments. Format as JSON."
            },
            {
                role: "user",
                content: transcript
            }
        ]
    });

    const processedStory: ProcessedStory = JSON.parse(analysis.choices[0].message.content);

    // 2. Save the main story entry
    const { data: storyData, error: storyError } = await supabase
        .from('story_entries')
        .insert({
            call_id: callId,
            title: processedStory.title,
            content: processedStory.content,
            time_period: processedStory.time_period,
            location: processedStory.location,
            story_type: processedStory.story_type,
            life_stage: processedStory.life_stage
        })
        .select('id')
        .single();

    if (storyError) throw storyError;
    const storyId = storyData.id;

    // 3. Save people mentioned
    if (processedStory.people.length > 0) {
        await supabase
            .from('story_people')
            .insert(
                processedStory.people.map(person => ({
                    story_id: storyId,
                    ...person
                }))
            );
    }

    // 4. Save emotional moments
    if (processedStory.emotions.length > 0) {
        await supabase
            .from('story_emotions')
            .insert(
                processedStory.emotions.map(emotion => ({
                    story_id: storyId,
                    ...emotion
                }))
            );
    }

    // 5. Save themes
    if (processedStory.themes.length > 0) {
        await supabase
            .from('story_themes')
            .insert(
                processedStory.themes.map(theme => ({
                    story_id: storyId,
                    ...theme
                }))
            );
    }

    // 6. Save story segments
    if (processedStory.segments.length > 0) {
        await supabase
            .from('story_segments')
            .insert(
                processedStory.segments.map((segment, index) => ({
                    story_id: storyId,
                    segment_order: index + 1,
                    ...segment
                }))
            );
    }

    return storyId;
} 