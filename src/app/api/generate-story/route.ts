import { NextResponse } from 'next/server';
import type { StoryData } from '@/types/story';

const SYSTEM_PROMPT = `You are a story analyzer that processes conversations and extracts meaningful narratives and insights. 
Given a conversation between a user and an AI agent, generate a structured story following this exact JSON format:

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

Important: Return ONLY the JSON object, no markdown formatting or additional text.`;

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

        const { messages } = await request.json();
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            console.error('Invalid or empty messages array:', messages);
            return NextResponse.json(
                { error: 'Invalid conversation data' },
                { status: 400 }
            );
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
                    { role: 'user', content: 'Here is the conversation to analyze:' },
                    ...messages.map((msg: { source: string, message: string }) => ({
                        role: msg.source === 'user' ? 'user' : 'assistant',
                        content: msg.message
                    })),
                    { role: 'user', content: 'Generate the story data in the specified JSON format. Return ONLY the JSON object.' }
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
            const storyData: StoryData = JSON.parse(cleanedContent);
            
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