import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const data = await request.json()
        
    console.log('Received Vapi callback:', data)
    
    // Extract user ID from the call metadata
    const userId = data.customer?.metadata?.user_id
    
    if (!userId) {
      console.error('No user ID found in callback data')
      return NextResponse.json(
        { message: 'No user ID found in callback data' },
        { status: 400 }
      )
    }
    
    // Save call data to your database
    // This is just an example - adjust according to your schema
    if (data.status === 'completed' && data.structuredData) {
        console.log('TODO - save call data to database')
        console.log(data) 
    }
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('Error processing Vapi callback:', error)
    return NextResponse.json(
      { message: 'Failed to process callback' },
      { status: 500 }
    )
  }
} 