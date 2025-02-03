'use client';

import { useConversation } from '@11labs/react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import type { StoryData } from '@/types/story';

interface Message {
    source: 'user' | 'ai';
    message: string;
}

interface ConversationError {
    message: string;
    code?: string;
}

export function Conversation() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
    const [hasEnded, setHasEnded] = useState(false);

    const conversation = useConversation({
        onConnect: () => {
            console.log('Connected');
            toast.success('Connected to agent');
            setConversationHistory([]); // Clear history on new connection
            setHasEnded(false);
        },
        onDisconnect: () => {
            console.log('Disconnected');
            toast.info('Disconnected from agent');
            setHasEnded(true);
        },
        onMessage: (message: Message) => {
            console.log('Message:', message);
            setConversationHistory(prev => [...prev, message]);
            toast.info(message.message);
        },
        onError: (error: ConversationError) => {
            console.error('Error:', error);
            toast.error('Error during conversation');
            setError(error.message);
        },
    });

    const generateStory = async () => {
        setIsSaving(true);
        try {
            toast.info('Generating story from conversation...');
            
            // Generate story from conversation
            const storyResponse = await fetch('/api/generate-story', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messages: conversationHistory })
            });

            if (!storyResponse.ok) {
                throw new Error('Failed to generate story');
            }

            const storyData = await storyResponse.json();
            console.log('Generated story:', storyData);

            // Navigate to the story page with the data
            router.push(`/story?data=${encodeURIComponent(JSON.stringify(storyData))}`);
        } catch (error) {
            console.error('Error generating story:', error);
            toast.error('Failed to generate story');
        } finally {
            setIsSaving(false);
        }
    };

    const startConversation = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Request microphone permission
            await navigator.mediaDevices.getUserMedia({ audio: true });

            // Get signed URL for private agent
            const response = await fetch("/api/get-signed-url");
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to get signed URL');
            }
            const { signedUrl } = await response.json();

            // Start the conversation with signed URL
            await conversation.startSession({
                signedUrl,
            });

        } catch (error) {
            console.error('Failed to start conversation:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to start conversation');
            setError(error instanceof Error ? error.message : 'Failed to start conversation');
        } finally {
            setIsLoading(false);
        }
    }, [conversation]);

    const stopConversation = useCallback(async () => {
        try {
            await conversation.endSession();
        } catch (error) {
            console.error('Failed to stop conversation:', error);
            toast.error('Failed to stop conversation');
        }
    }, [conversation]);

    return (
        <div className="flex flex-col items-center gap-4">
            {error && (
                <div className="bg-red-500/10 text-red-500 p-4 rounded-lg mb-4">
                    {error}
                </div>
            )}
            
            <div className="flex gap-2">
                <button
                    onClick={startConversation}
                    disabled={isLoading || conversation.status === 'connected' || isSaving}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 relative"
                >
                    {isLoading ? 'Connecting...' : 'Start Conversation'}
                    {isLoading && (
                        <span className="absolute inset-0 flex items-center justify-center">
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        </span>
                    )}
                </button>
                <button
                    onClick={stopConversation}
                    disabled={conversation.status !== 'connected' || isSaving}
                    className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-300 relative"
                >
                    {isSaving ? 'Saving...' : 'Stop Conversation'}
                    {isSaving && (
                        <span className="absolute inset-0 flex items-center justify-center">
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        </span>
                    )}
                </button>
            </div>

            {hasEnded && conversationHistory.length > 0 && (
                <button
                    onClick={generateStory}
                    disabled={isSaving}
                    className="mt-4 px-6 py-3 bg-green-500 text-white rounded-full disabled:bg-gray-300 relative"
                >
                    {isSaving ? 'Generating Story...' : 'Generate Story'}
                    {isSaving && (
                        <span className="absolute inset-0 flex items-center justify-center">
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        </span>
                    )}
                </button>
            )}

            <div className="flex flex-col items-center">
                <p>Status: {conversation.status}</p>
                <p>Agent is {conversation.isSpeaking ? 'speaking' : 'listening'}</p>
            </div>
        </div>
    );
} 