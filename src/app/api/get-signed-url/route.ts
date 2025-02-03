import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
        const apiKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;

        if (!agentId || !apiKey) {
            console.error('Missing environment variables:', {
                hasAgentId: !!agentId,
                hasApiKey: !!apiKey
            });
            throw new Error('Missing required environment variables');
        }

        const response = await fetch(
            `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
            {
                headers: {
                    'xi-api-key': apiKey,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('ElevenLabs API error:', {
                status: response.status,
                statusText: response.statusText,
                error: errorText
            });
            throw new Error(`Failed to get signed URL: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (!data.signed_url) {
            console.error('Missing signed_url in response:', data);
            throw new Error('Invalid response from ElevenLabs API');
        }

        return NextResponse.json({ signedUrl: data.signed_url });
    } catch (error) {
        console.error('Error getting signed URL:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to get signed URL' },
            { status: 500 }
        );
    }
} 