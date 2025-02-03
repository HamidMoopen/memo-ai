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
        const { messages } = await request.json();

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
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
            throw new Error('Failed to generate story with ChatGPT');
        }

        const data = await response.json();
        const storyContent = data.choices[0].message.content;
        
        // Clean the response to ensure it's valid JSON
        const cleanedContent = storyContent.trim().replace(/^```json\s*|\s*```$/g, '');
        
        try {
            // Parse the response into our StoryData format
            const storyData: StoryData = JSON.parse(cleanedContent);
            return NextResponse.json(storyData);
        } catch (error) {
            console.error('Failed to parse story data:', error);
            throw new Error('Failed to parse story data from ChatGPT response');
        }
    } catch (error) {
        console.error('Error generating story:', error);
        return NextResponse.json(
            { error: 'Failed to generate story' },
            { status: 500 }
        );
    }
} 