import { NextResponse } from 'next/server'
import type { StoryData } from '@/types/story'

export async function POST(request: Request) {
    try {
        const data: StoryData = await request.json()
        
        // Here you would typically store this in a database
        // For now, we'll just log it and return success
        console.log('Storing story:', data)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error storing story:', error)
        return NextResponse.json(
            { error: 'Failed to store story' },
            { status: 500 }
        )
    }
} 