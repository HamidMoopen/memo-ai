import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Types for our tool calls
interface SaveContextParams {
    time: string;
    location: string;
    people?: string[];
}

interface EmotionalMomentParams {
    emotion: string;
    intensity: number;
    context: string;
}

interface ToolCall {
    name: string;
    parameters: any;
}

interface VapiEvent {
    type: string;
    data: {
        callId: string;
        toolCalls?: ToolCall[];
        transcript?: string;
        summary?: {
            topics: string[];
            sentiment: string;
        };
    };
}

// Add this near the top of the file
const DEBUG = process.env.NODE_ENV === 'development';

function debugLog(message: string, data?: any) {
    if (DEBUG) {
        console.log(`🔍 [VAPI Debug] ${message}`, data ? JSON.stringify(data, null, 2) : '');
    }
}

export async function POST(request: Request) {
    try {
        debugLog('Received webhook request');
        
        // Log headers in development
        if (DEBUG) {
            const headers = Object.fromEntries(request.headers.entries());
            debugLog('Request headers:', headers);
        }

        const event: VapiEvent = await request.json();
        debugLog('Parsed event:', event);

        const supabase = await createClient();
        
        switch (event.type) {
            case 'tool-call':
                if (event.data.toolCalls) {
                    debugLog('Processing tool calls:', event.data.toolCalls);
                    
                    for (const tool of event.data.toolCalls) {
                        debugLog(`Processing tool: ${tool.name}`, tool.parameters);
                        
                        switch (tool.name) {
                            case 'saveContext':
                                debugLog('Saving context to Supabase');
                                const contextResult = await supabase.from('memory_contexts').insert({
                                    call_id: event.data.callId,
                                    time_period: tool.parameters.time,
                                    location: tool.parameters.location,
                                    people_involved: tool.parameters.people || [],
                                    created_at: new Date().toISOString()
                                });
                                debugLog('Context save result:', contextResult);
                                break;

                            case 'markEmotionalMoment':
                                debugLog('Saving emotional moment to Supabase');
                                const emotionResult = await supabase.from('emotional_moments').insert({
                                    call_id: event.data.callId,
                                    emotion: tool.parameters.emotion,
                                    intensity: tool.parameters.intensity,
                                    context: tool.parameters.context,
                                    created_at: new Date().toISOString()
                                });
                                debugLog('Emotion save result:', emotionResult);
                                break;
                        }
                    }
                }
                break;

            case 'conversation-update':
                if (event.data.transcript) {
                    debugLog('Updating transcript');
                    const transcriptResult = await supabase.from('transcripts').upsert({
                        call_id: event.data.callId,
                        transcript: event.data.transcript,
                        updated_at: new Date().toISOString()
                    }, {
                        onConflict: 'call_id'
                    });
                    debugLog('Transcript update result:', transcriptResult);
                }
                break;

            case 'end-of-call-report':
                debugLog('Processing end of call report');
                const callResult = await supabase.from('calls').update({
                    status: 'completed',
                    summary: event.data.summary,
                    final_transcript: event.data.transcript,
                    completed_at: new Date().toISOString()
                }).eq('call_id', event.data.callId);
                debugLog('Call completion result:', callResult);

                if (event.data.transcript) {
                    debugLog('Processing final story');
                    // Here we'll add story processing logic later
                }
                break;

            default:
                debugLog(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('❌ Error processing webhook:', error);
        debugLog('Error details:', error);
        return NextResponse.json(
            { error: 'Failed to process webhook' },
            { status: 500 }
        );
    }
} 