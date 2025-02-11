import { NextResponse } from 'next/server';
import type { StoryData } from '@/types/story';

const SYSTEM_PROMPT = `You are a story analyzer that processes conversations and extracts meaningful narratives and insights. 
Based on the user's messages ONLY (ignore any AI responses), provide a structured response with the following sections:

1. Story Narrative:
   - Write a complete narrative that maintains the person's voice and perspective
   - Focus on their direct experiences and memories
   - Keep the tone personal and authentic

2. Key Themes (2-3):
   - List the major recurring themes from their story
   - Examples: Family, Loss, Resilience, Career, etc.

3. Notable Quotes (1-2):
   - Extract direct, meaningful quotes from their story
   - Choose quotes that capture significant moments or emotions

4. Historical Context:
   Time Periods:
   - List specific years or decades mentioned
   - Include general time periods relevant to their story

   Events:
   - List major personal events from their story
   - Include relevant historical events they mentioned

   Cultural Context:
   - Note cultural elements from their story
   - Include societal context of their experiences

5. Follow-up Topics (2-3):
   - Suggest natural conversation topics based on their story
   - Focus on areas they might want to elaborate on

Format each section clearly and ensure all sections are filled out. If certain information isn't explicitly mentioned, make reasonable inferences based on the context provided, but stay true to their story.

If a previous story is provided, incorporate its content and continue the narrative while maintaining consistency.`;

// Helper function to convert OpenAI's text response to our story format
function convertResponseToStoryJSON(text: string): StoryData {
    // Split the text into sections based on numbered headers
    const sections = text.split(/\d+\.\s+/);
    
    // Remove any empty sections
    const nonEmptySections = sections.filter(s => s.trim());

    // Extract narrative (first section)
    const narrativeSection = nonEmptySections[0] || '';
    const narrative = narrativeSection
        .replace(/Story Narrative:?\s*/i, '')
        .trim();

    // Extract themes (second section)
    const themesSection = nonEmptySections[1] || '';
    const themes = themesSection
        .replace(/Key Themes.*?:/i, '')
        .split(/[,\n]/)
        .map(t => t.trim())
        .filter(t => t && !t.includes('-'));

    // Extract quotes (third section)
    const quotesSection = nonEmptySections[2] || '';
    const quotes = quotesSection
        .replace(/Notable Quotes.*?:/i, '')
        .split(/["\n]/)
        .map(q => q.trim())
        .filter(q => q && !q.includes('-'));

    // Extract historical context (fourth section)
    const historicalSection = nonEmptySections[3] || '';
    
    // Parse time periods
    const timePeriodMatch = historicalSection.match(/Time Periods:([\s\S]*?)(?=Events:|$)/);
    const timePeriods = timePeriodMatch 
        ? timePeriodMatch[1].split(/[,\n]/).map(t => t.trim()).filter(t => t && !t.includes('-'))
        : ['Recent Times'];

    // Parse events
    const eventsMatch = historicalSection.match(/Events:([\s\S]*?)(?=Cultural Context:|$)/);
    const events = eventsMatch
        ? eventsMatch[1].split(/[,\n]/).map(e => e.trim()).filter(e => e && !e.includes('-'))
        : ['Personal Events'];

    // Parse cultural context
    const culturalMatch = historicalSection.match(/Cultural Context:([\s\S]*?)(?=\d|$)/);
    const culturalContext = culturalMatch
        ? culturalMatch[1].split(/[,\n]/).map(c => c.trim()).filter(c => c && !c.includes('-'))
        : ['Contemporary Culture'];

    // Extract follow-up topics (fifth section)
    const topicsSection = nonEmptySections[4] || '';
    const followUpTopics = topicsSection
        .replace(/Follow-up Topics.*?:/i, '')
        .split(/[,\n]/)
        .map(t => t.trim())
        .filter(t => t && !t.includes('-'));

    return {
        story_narrative: narrative,
        key_themes: themes.length > 0 ? themes : ['Personal Growth'],
        notable_quotes: quotes.length > 0 ? quotes : ['Memorable moment'],
        historical_context: {
            time_periods: timePeriods,
            events: events,
            cultural_context: culturalContext
        },
        follow_up_topics: followUpTopics.length > 0 ? followUpTopics : ['Further Discussion']
    };
}

export const maxDuration = 60; // Set max duration to 60 seconds (Vercel hobby plan limit)
export const dynamic = 'force-dynamic'; // Disable static optimization

export async function POST(request: Request) {
    try {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            console.error('Missing OpenAI API key');
            return NextResponse.json(
                { error: 'OpenAI API key not configured' },
                { status: 500 }
            );
        }

        const { messages, previousStory } = await request.json();
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            console.error('Invalid or empty messages array:', messages);
            return NextResponse.json(
                { error: 'Invalid conversation data' },
                { status: 400 }
            );
        }

        // Validate message format and filter out assistant messages
        const validMessages = messages.filter(msg => 
            msg && 
            typeof msg.content === 'string' && 
            msg.content.trim() !== '' &&
            msg.role === 'user'  // Only include user messages
        ).map(msg => ({
            role: 'user',
            content: msg.content
        }));

        if (validMessages.length === 0) {
            return NextResponse.json(
                { error: 'No valid user messages found in conversation' },
                { status: 400 }
            );
        }

        // Prepare messages array with previous story context if available
        const contextMessages = [];
        if (previousStory) {
            contextMessages.push({
                role: 'system',
                content: 'Here is the previous story content to incorporate and continue:',
            });
            contextMessages.push({
                role: 'assistant',
                content: JSON.stringify(previousStory, null, 2),
            });
        }

        // Set a timeout for the OpenAI request
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 50000); // 50 second timeout to allow for processing time

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: 'gpt-4',
                    messages: [
                        { role: 'system', content: SYSTEM_PROMPT },
                        ...contextMessages,
                        ...validMessages
                    ],
                    temperature: 0.7,
                }),
                signal: controller.signal
            });

            clearTimeout(timeout);

            if (!response.ok) {
                const errorData = await response.text();
                console.error('OpenAI API error:', {
                    status: response.status,
                    statusText: response.statusText,
                    error: errorData
                });
                return NextResponse.json(
                    { error: `OpenAI API error: ${response.statusText}` },
                    { status: response.status }
                );
            }

            const data = await response.json();
            if (!data.choices?.[0]?.message?.content) {
                console.error('Invalid response from OpenAI:', data);
                return NextResponse.json(
                    { error: 'Invalid response format from OpenAI' },
                    { status: 500 }
                );
            }

            const storyContent = data.choices[0].message.content;
            const storyData = convertResponseToStoryJSON(storyContent);
            
            // Validate the story data structure
            if (!storyData.story_narrative || !storyData.key_themes || !storyData.notable_quotes) {
                console.error('Invalid story data structure:', storyData);
                return NextResponse.json(
                    { error: 'Failed to parse story data' },
                    { status: 500 }
                );
            }

            return NextResponse.json(storyData);
        } catch (error: any) {
            clearTimeout(timeout);
            if (error.name === 'AbortError') {
                return NextResponse.json(
                    { error: 'Request timed out while generating story' },
                    { status: 504 }
                );
            }
            throw error;
        }
    } catch (error) {
        console.error('Error generating story:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to generate story' },
            { status: 500 }
        );
    }
} 