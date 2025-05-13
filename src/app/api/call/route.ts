import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { initiateCall } from '@/lib/vapi/server';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { customerPhoneNumber, assistantId, phoneNumberId } = body;

    if (!customerPhoneNumber || !customerPhoneNumber.startsWith('+1')) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
    }

    if (!assistantId || !phoneNumberId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Use our VAPI server module to initiate the call
    const result = await initiateCall({
      assistantId,
      phoneNumberId,
      customerPhoneNumber,
      type: 'outbound'
    });

    if (!result.success) {
      console.error('VAPI error:', result.error);
      return NextResponse.json({ error: 'Call failed', details: result.error }, { status: 500 });
    }

    // Optional: Log the call to Supabase
    await supabase.from('calls').insert({
      user_id: user.id,
      phone_number: customerPhoneNumber,
      vapi_call_id: result.call.id
    });

    return NextResponse.json({ success: true, vapiCallId: result.call.id });
  } catch (err: any) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Server error', message: err.message }, { status: 500 });
  }
} 