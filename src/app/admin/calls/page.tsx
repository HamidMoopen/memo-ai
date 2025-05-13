"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from "@/components/ui/button"
import { Phone } from "lucide-react"

interface CallData {
    call_id: string;
    status: string;
    summary: any;
    final_transcript: string;
    created_at: string;
    completed_at: string;
}

export default function CallsAdminPage() {
    const [calls, setCalls] = useState<CallData[]>([]);
    const [loading, setLoading] = useState(true);
    const [initiatingCall, setInitiatingCall] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        loadCalls();
    }, []);

    async function loadCalls() {
        const { data, error } = await supabase
            .from('calls')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error loading calls:', error);
            return;
        }

        setCalls(data || []);
        setLoading(false);
    }

    async function initiateTestCall() {
        try {
            setInitiatingCall(true);
            const response = await fetch('/api/call', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phoneNumber: process.env.NEXT_PUBLIC_VAPI_PHONE_NUMBER || '+19459998436'
                }),
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to initiate call');
            }

            // Reload calls after a short delay to show the new call
            setTimeout(loadCalls, 2000);
            
            alert('Call initiated! You should receive a call shortly.');
        } catch (error) {
            console.error('Error initiating call:', error);
            alert('Failed to initiate call. Please check console for details.');
        } finally {
            setInitiatingCall(false);
        }
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Call Testing Dashboard</h1>
                <Button 
                    onClick={initiateTestCall}
                    disabled={initiatingCall}
                    className="bg-primary hover:bg-primary/90"
                >
                    <Phone className="w-4 h-4 mr-2" />
                    {initiatingCall ? 'Initiating Call...' : 'Make Test Call'}
                </Button>
            </div>
            
            {loading ? (
                <div>Loading calls...</div>
            ) : calls.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">No calls found. Try making a test call!</p>
                    <Button 
                        onClick={initiateTestCall}
                        disabled={initiatingCall}
                        className="bg-primary hover:bg-primary/90"
                    >
                        <Phone className="w-4 h-4 mr-2" />
                        Make Your First Call
                    </Button>
                </div>
            ) : (
                <div className="space-y-6">
                    {calls.map((call) => (
                        <div 
                            key={call.call_id} 
                            className="bg-card rounded-lg p-6 shadow-md"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold">
                                    Call ID: {call.call_id}
                                </h2>
                                <span className={`px-3 py-1 rounded-full text-sm ${
                                    call.status === 'completed' 
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {call.status}
                                </span>
                            </div>
                            
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <p>Created: {new Date(call.created_at).toLocaleString()}</p>
                                {call.completed_at && (
                                    <p>Completed: {new Date(call.completed_at).toLocaleString()}</p>
                                )}
                            </div>

                            {call.summary && (
                                <div className="mt-4">
                                    <h3 className="font-medium mb-2">Summary</h3>
                                    <pre className="bg-muted p-4 rounded-md overflow-auto">
                                        {JSON.stringify(call.summary, null, 2)}
                                    </pre>
                                </div>
                            )}

                            {call.final_transcript && (
                                <div className="mt-4">
                                    <h3 className="font-medium mb-2">Transcript</h3>
                                    <p className="text-sm whitespace-pre-wrap">
                                        {call.final_transcript}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
} 