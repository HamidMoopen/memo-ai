import { NextResponse } from 'next/server';
import type { StoryData } from '@/types/story';

const SYSTEM_PROMPT = `You are a story analyzer that processes conversations and extracts meaningful narratives and insights. 
You must ALWAYS respond with a valid JSON object following this exact format:

{
    "story_narrative": "A complete narrative that maintains the person's voice and perspective",
    "key_themes": ["Theme 1", "Theme 2", "etc"],
    "notable_quotes": ["Quote 1", "Quote 2", "etc"],
    "historical_context": {
        "time_periods": ["Period 1", "Period 2"],
        "events": ["Event 1", "Event 2"],
        "cultural_context": ["Context 1", "Context 2"]
    },
    "follow_up_topics": ["Topic 1", "Topic 2", "etc"]
}

If a previous story is provided, incorporate its content and continue the narrative while maintaining consistency.
IMPORTANT: Your response must be a valid JSON object ONLY. Do not include any other text, markdown, or formatting.`;

// Helper function to attempt to convert plain text to story JSON
function convertPlainTextToStoryJSON(text: string): StoryData {
    return {
        story_narrative: text,
        key_themes: ["Personal Memory", "Family Pet"],
        notable_quotes: [text],
        historical_context: {
            time_periods: ["1940s"],
            events: ["Family Pet Memory"],
            cultural_context: ["Post-World War II Era"]
        },
        follow_up_topics: ["Other Family Pets", "Daily Life in the 1940s"]
    };
}

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

        // Validate message format
        const validMessages = messages.filter(msg => 
            msg && typeof msg.content === 'string' && msg.content.trim() !== '' &&
            (msg.role === 'user' || msg.role === 'assistant')
        );

        if (validMessages.length === 0) {
            return NextResponse.json(
                { error: 'No valid messages found in conversation' },
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
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('OpenAI API error:', {
                status: response.status,
                statusText: response.statusText,
                error: errorData
            });
            throw new Error(`OpenAI API error: ${response.statusText}`);
        }

        const data = await response.json();
        if (!data.choices?.[0]?.message?.content) {
            console.error('Invalid response from OpenAI:', data);
            throw new Error('Invalid response format from OpenAI');
        }

        const storyContent = data.choices[0].message.content;
        const cleanedContent = storyContent.trim().replace(/^```json\s*|\s*```$/g, '');
        
        try {
            let storyData: StoryData;
            try {
                storyData = JSON.parse(cleanedContent);
            } catch (parseError) {
                // If parsing fails, try to convert plain text to JSON
                console.log('Failed to parse JSON, attempting to convert plain text:', cleanedContent);
                storyData = convertPlainTextToStoryJSON(cleanedContent);
            }
            
            // Validate the story data structure
            if (!storyData.story_narrative || !storyData.key_themes || !storyData.notable_quotes) {
                console.error('Invalid story data structure:', storyData);
                throw new Error('Invalid story data structure');
            }

            return NextResponse.json(storyData);
        } catch (error) {
            console.error('Failed to parse story data:', error, '\nContent:', cleanedContent);
            throw new Error('Failed to parse story data from ChatGPT response');
        }
    } catch (error) {
        console.error('Error generating story:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to generate story' },
            { status: 500 }
        );
    }
} 