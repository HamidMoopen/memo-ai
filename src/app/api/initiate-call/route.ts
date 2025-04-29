import { NextResponse } from 'next/server'
import { Vapi, VapiClient } from "@vapi-ai/server-sdk"
import { createClient } from '@/lib/supabase/server'

// Initialize Vapi client
const vapi = new VapiClient({
  token: process.env.VAPI_API_KEY as string,
})

export async function POST(request: Request) {
  try {
    const { phoneNumber } = await request.json()
    
    if (!phoneNumber || !phoneNumber.startsWith('+1') || phoneNumber.length !== 12) {
      return NextResponse.json(
        { message: 'Invalid phone number format. Must be a US number in E.164 format (+1XXXXXXXXXX)' },
        { status: 400 }
      )
    }
    
    // Get the user ID from Supabase session
    const supabase = createClient()
    const { data: { user } } = await (await supabase).auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not authenticated' },
        { status: 401 }
      )
    }
    
    // Create the call using Vapi
    const call = await vapi.calls.create({
      name: "Storytime with Eterna",
      assistantId: process.env.VAPI_ASSISTANT_ID as string,
      phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID as string,
      customer: {
        number: phoneNumber,
      },
      assistantOverrides: {
        server: {
          headers: {
            user_id: user.id,
            email: user.email,
            name: user.user_metadata?.full_name || 'Eterna User'
          },
          // Make sure NEXT_PUBLIC_BASE_URL is set to your ngrok URL
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/vapi-callback`,
        },
      }
    });

    return NextResponse.json({ success: true, userId: user.id })
    
  } catch (error) {
    console.error('Error initiating call:', error)
    
    // Provide more detailed error information
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          message: 'Failed to initiate call', 
          error: error.message,
          details: error
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { message: 'Failed to initiate call' },
      { status: 500 }
    )
  }
} 