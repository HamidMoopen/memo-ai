import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServerClient'

// Helper function to format phone number to E.164
function formatToE164(phoneNumber: string): string {
    // Remove all non-digit characters
    const digits = phoneNumber.replace(/\D/g, '')
    
    // If number starts with '1', remove it
    const withoutCountryCode = digits.startsWith('1') ? digits.slice(1) : digits
    
    // Ensure 10 digits and add +1 prefix
    if (withoutCountryCode.length !== 10) {
        throw new Error('Phone number must be exactly 10 digits')
    }
    
    return `+1${withoutCountryCode}`
}

export async function PATCH(request: Request) {
    try {
        const supabase = supabaseServer()

        // Get current user
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser()

        if (userError || !user) {
            console.error('🔒 Auth error:', userError?.message)
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        // Log full user context for debugging
        console.log('👤 User context:', {
            id: user.id,
            email: user.email,
            metadata: user.user_metadata
        })

        const body = await request.json()
        const rawPhoneNumber = body.phoneNumber

        if (!rawPhoneNumber) {
            return NextResponse.json({ error: 'Missing phone number' }, { status: 400 })
        }

        // Format phone number to E.164
        let phone_number: string
        try {
            phone_number = formatToE164(rawPhoneNumber)
            console.log('📱 Formatted phone number:', {
                raw: rawPhoneNumber,
                formatted: phone_number
            })
        } catch (error) {
            return NextResponse.json({ 
                error: 'Invalid phone number format. Must be 10 digits.',
                details: error instanceof Error ? error.message : 'Unknown error'
            }, { status: 400 })
        }

        const timestamp = new Date().toISOString()

        // Try upserting profile with full debug
        console.log('📝 Attempting profile upsert:', {
            id: user.id,
            phone_number,
            metadata: user.user_metadata
        })

        // Only include fields that exist in the profiles table
        const { error: upsertError, data: upsertData } = await supabase
            .from('profiles')
            .upsert({
                id: user.id,
                phone_number,  // Now guaranteed to be E.164 format
                name: user.user_metadata?.full_name || 'Test User',
                created_at: timestamp,
                updated_at: timestamp
            })
            .select()
            .single()

        if (upsertError) {
            console.error('🛑 Supabase upsert error (full dump):', JSON.stringify(upsertError, null, 2))
            return NextResponse.json(
                {
                    error: upsertError.message || 'Unknown upsert error',
                    details: upsertError.details || null,
                },
                { status: 500 }
            )
        }

        console.log('✅ Profile upserted successfully:', upsertData)
        return NextResponse.json({ success: true, data: upsertData })
    } catch (err: any) {
        console.error('🔥 Server catch error:', {
            message: err.message,
            stack: err.stack,
            details: err
        })
        return NextResponse.json({ 
            error: err.message || 'Unknown server error',
            details: err.stack
        }, { status: 500 })
    }
} 