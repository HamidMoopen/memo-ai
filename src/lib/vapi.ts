import { Vapi } from '@vapi-ai/web';

// Initialize VAPI client
const vapi = new Vapi({
    apiKey: process.env.VAPI_API_KEY,
    baseURL: process.env.VAPI_BASE_URL || 'https://api.vapi.ai',
});

// Types for our call handling
export interface CallResponse {
    callId: string;
    status: string;
    error?: string;
}

export interface ConversationData {
    callId: string;
    transcript: string;
    metadata: {
        duration: number;
        startTime: string;
        endTime: string;
    };
    context: {
        topics: string[];
        sentiment: string;
        keyPoints: string[];
    };
}

// Function to initiate a call
export async function initiateCall(phoneNumber: string): Promise<CallResponse> {
    try {
        const response = await vapi.calls.create({
            phoneNumber,
            assistantId: process.env.VAPI_ASSISTANT_ID,
            metadata: {
                source: 'eterna',
                type: 'story_collection'
            }
        });

        return {
            callId: response.id,
            status: 'initiated'
        };
    } catch (error) {
        console.error('Error initiating call:', error);
        return {
            callId: '',
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

// Function to handle call events
export async function handleCallEvent(event: any) {
    const { type, data } = event;

    switch (type) {
        case 'conversation-update':
            await processTranscript(data);
            break;
        case 'end-of-call-report':
            await processCallEnd(data);
            break;
        case 'function-call':
            await processFunctionCall(data);
            break;
        default:
            console.log(`Unhandled event type: ${type}`);
    }
}

// Helper function to process transcripts
async function processTranscript(data: any) {
    // Process real-time transcript updates
    console.log('Processing transcript update:', data);
    // TODO: Update UI or database with latest transcript
}

// Helper function to process call end
async function processCallEnd(data: any) {
    // Here we'll save the conversation to Supabase
    const conversationData: ConversationData = {
        callId: data.callId,
        transcript: data.transcript,
        metadata: {
            duration: data.duration,
            startTime: data.startTime,
            endTime: data.endTime
        },
        context: {
            topics: extractTopics(data.transcript),
            sentiment: analyzeSentiment(data.transcript),
            keyPoints: extractKeyPoints(data.transcript)
        }
    };

    // TODO: Save to Supabase
    return conversationData;
}

// Helper function to process function calls
async function processFunctionCall(data: any) {
    // Handle any custom function calls from the VAPI assistant
    console.log('Processing function call:', data);
    // TODO: Implement function call handling
}

// Helper functions for conversation analysis
function extractTopics(transcript: string): string[] {
    // TODO: Implement topic extraction
    return [];
}

function analyzeSentiment(transcript: string): string {
    // TODO: Implement sentiment analysis
    return 'neutral';
}

function extractKeyPoints(transcript: string): string[] {
    // TODO: Implement key points extraction
    return [];
} 