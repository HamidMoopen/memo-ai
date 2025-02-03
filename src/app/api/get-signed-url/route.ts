import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const response = await fetch(
            `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID}`,
            {
                headers: {
                    'xi-api-key': process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY!,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to get signed URL: ${response.statusText}`);
        }

        const data = await response.json();
        return NextResponse.json({ signedUrl: data.signed_url });
    } catch (error) {
        console.error('Error getting signed URL:', error);
        return NextResponse.json(
            { error: 'Failed to get signed URL' },
            { status: 500 }
        );
    }
} 