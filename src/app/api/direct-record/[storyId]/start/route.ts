import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServerClient'
import Vapi from '@vapi-ai/web'

const vapi = new Vapi(process.env.VAPI_API_KEY || '')

export async function POST(
    request: Request,
    { params }: { params: { storyId: string } }
) {
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

        const recordingId = params.storyId

        // ... existing code ...
    } catch (error) {
        // ... existing error handling code ...
    }
} 