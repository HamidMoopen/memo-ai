/**
 * VAPI Call Handling Module
 * 
 * This module implements the VAPI call initiation logic using the current VAPI schema.
 * Key changes from previous implementation:
 * 1. Updated to use customer object instead of deprecated to/from fields
 * 2. Uses transport object with type and number for outbound calls
 * 3. Removes deprecated firstMessage field from the payload
 */

import { VapiClient } from '@vapi-ai/server-sdk';

if (!process.env.VAPI_API_KEY) {
    throw new Error('VAPI_API_KEY environment variable is not set');
}

if (!process.env.VAPI_ASSISTANT_ID) {
    throw new Error('VAPI_ASSISTANT_ID environment variable is not set');
}

if (!process.env.NEXT_PUBLIC_VAPI_PHONE_NUMBER) {
    throw new Error('NEXT_PUBLIC_VAPI_PHONE_NUMBER environment variable is not set');
}

const client = new VapiClient({ token: process.env.VAPI_API_KEY });

// Types for our call handling
export interface CallResponse {
    success: boolean;
    error?: string;
    call?: any; // We'll log the full call object for debugging
}

interface CallPayload {
    assistantId: string;
    phoneNumberId: string;
    customerPhoneNumber: string;
    type: 'outbound';
}

// Function to initiate a call
export async function initiateCall(payload: CallPayload): Promise<CallResponse> {
    try {
        const { assistantId, phoneNumberId, customerPhoneNumber, type } = payload;

        // Validate phone number format
        const formattedNumber = customerPhoneNumber.startsWith('+') ? customerPhoneNumber : `+1${customerPhoneNumber}`;

        console.log('Environment variables:', {
            VAPI_API_KEY: process.env.VAPI_API_KEY?.slice(0, 5) + '...',
            VAPI_ASSISTANT_ID: process.env.VAPI_ASSISTANT_ID,
            NEXT_PUBLIC_VAPI_PHONE_NUMBER: process.env.NEXT_PUBLIC_VAPI_PHONE_NUMBER
        });

        console.log('About to initiate call with config:', {
            assistantId,
            phoneNumberId,
            customerPhoneNumber: formattedNumber,
            type
        });

        // Create call using the assistantId and customer object
        const call = await client.calls.create({
            assistantId,
            phoneNumberId,
            customer: {
                number: formattedNumber
            }
        });

        console.log('VAPI Response:', {
            success: true,
            callData: call
        });
        // Log all available properties from the response
        console.log('Call response properties:', Object.keys(call));

        return {
            success: true,
            call
        };
    } catch (error) {
        console.error('Error initiating call:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to initiate call'
        };
    }
} 