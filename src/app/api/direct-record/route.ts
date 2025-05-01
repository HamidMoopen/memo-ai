import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServerClient'
import { Vapi } from '@vapi-ai/web'

// Initialize VAPI client
const vapi = new Vapi({
    apiKey: process.env.VAPI_API_KEY,
})

export async function POST(request: Request) {
    try {
        const supabase = supabaseServer()

        // Get current user
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser()

        if (userError || !user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const body = await request.json()
        const { title, description } = body

        if (!title) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 })
        }

        // Create a new recording session with VAPI
        const recording = await vapi.recordings.create({
            title: title,
            description: description || '',
            metadata: {
                userId: user.id,
                type: 'direct_record'
            }
        })

        // Store the recording reference in our database
        const { error: dbError } = await supabase
            .from('recordings')
            .insert({
                user_id: user.id,
                vapi_id: recording.id,
                title: title,
                description: description,
                type: 'direct_record',
                status: 'created'
            })

        if (dbError) {
            console.error('Database error:', dbError)
            return NextResponse.json({ error: 'Failed to save recording' }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            recording: {
                id: recording.id,
                title,
                description,
                status: 'created'
            }
        })

    } catch (error) {
        console.error('Direct recording error:', error)
        return NextResponse.json(
            { error: 'Failed to create recording' },
            { status: 500 }
        )
    }
} 