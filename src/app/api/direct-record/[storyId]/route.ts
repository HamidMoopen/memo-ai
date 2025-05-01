import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServerClient'
import { Vapi } from '@vapi-ai/web'

const vapi = new Vapi({
    apiKey: process.env.VAPI_API_KEY,
})

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
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

        const recordingId = params.id

        // Verify the recording belongs to the user
        const { data: recording, error: fetchError } = await supabase
            .from('recordings')
            .select('*')
            .eq('id', recordingId)
            .eq('user_id', user.id)
            .single()

        if (fetchError || !recording) {
            return NextResponse.json(
                { error: 'Recording not found or unauthorized' },
                { status: 404 }
            )
        }

        // Stop the VAPI recording session
        await vapi.recordings.stop(recording.vapi_id)

        // Update recording status
        const { error: updateError } = await supabase
            .from('recordings')
            .update({ status: 'completed' })
            .eq('id', recordingId)

        if (updateError) {
            console.error('Failed to update recording status:', updateError)
        }

        return NextResponse.json({
            success: true,
            status: 'completed'
        })

    } catch (error) {
        console.error('Stop recording error:', error)
        return NextResponse.json(
            { error: 'Failed to stop recording' },
            { status: 500 }
        )
    }
} 