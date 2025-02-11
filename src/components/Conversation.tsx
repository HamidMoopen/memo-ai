'use client';

import { useCallback, useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Mic, Pause, Play, ChevronLeft, ChevronDown, Copy, Square, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { useSidebar } from '@/contexts/SidebarContext';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface ConversationProps {
    category: string;
}

export function Conversation({ category }: ConversationProps) {
    const router = useRouter();
    const { sidebarOpen, setSidebarOpen } = useSidebar();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
    const [currentStory, setCurrentStory] = useState<any>(null);
    const conversationRef = useRef<any>(null);

    // Track recording state
    const [recordingState, setRecordingState] = useState<'idle' | 'listening'>('idle');

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.code === 'Space' && !isLoading) {
                event.preventDefault();
                toggleRecording();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [recordingState, isLoading]);

    const initializeConversation = async (signedUrl: string) => {
        try {
            // @ts-ignore - ElevenLabs types are not complete
            const { Conversation } = await import('@11labs/client');

            conversationRef.current = await Conversation.startSession({
                signedUrl,
                onConnect: () => {
                    console.log('Connected');
                    toast.success('Connected to agent');
                    setRecordingState('listening');
                    setSidebarOpen(true);
                },
                onDisconnect: () => {
                    console.log('Disconnected');
                    toast.info('Disconnected from agent');
                    setRecordingState('idle');
                },
                onMessage: ((data: { message: string; source: 'user' | 'assistant' }) => {
                    console.log('Message:', data);
                    const message: Message = {
                        role: data.source,
                        content: data.message
                    };
                    setConversationHistory(prev => [...prev, message]);

                    // Generate story after each user message, using previous story as context
                    if (data.source === 'user') {
                        generateStory();
                    }
                }) as any,
                onError: (error: string) => {
                    console.error('Error:', error);
                    toast.error('Error during conversation');
                    setError(error);
                }
            });
        } catch (error) {
            console.error('Failed to initialize conversation:', error);
            throw error;
        }
    };

    const toggleRecording = async () => {
        if (recordingState === 'idle') {
            try {
                setIsLoading(true);
                setError(null);
                await navigator.mediaDevices.getUserMedia({ audio: true });
                const response = await fetch('/api/get-signed-url');
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to get signed URL');
                }

                await initializeConversation(data.signedUrl);
            } catch (error) {
                console.error('Failed to start conversation:', error);
                toast.error(error instanceof Error ? error.message : 'Failed to start conversation');
                setError(error instanceof Error ? error.message : 'Failed to start conversation');
            } finally {
                setIsLoading(false);
            }
        } else if (recordingState === 'listening') {
            try {
                if (conversationRef.current) {
                    await conversationRef.current.endSession();
                }
                setRecordingState('idle');
                toast.info('Conversation ended');
            } catch (error) {
                console.error('Failed to end conversation:', error);
                toast.error('Failed to end conversation');
            }
        }
    };

    const generateStory = async () => {
        setIsSaving(true);
        try {
            // Always include the most recent messages
            const validMessages = conversationHistory.filter(msg =>
                msg && typeof msg.content === 'string' && msg.content.trim() !== ''
            );

            if (validMessages.length === 0) {
                toast.error('No valid conversation content to generate story');
                return;
            }

            const storyResponse = await fetch('/api/generate-story', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: validMessages,
                    previousStory: currentStory // Always pass previous story for context
                })
            });

            if (!storyResponse.ok) {
                const errorData = await storyResponse.json();
                throw new Error(errorData.error || 'Failed to generate story');
            }

            const storyData = await storyResponse.json();

            // Validate story data structure
            if (!storyData.story_narrative || !Array.isArray(storyData.key_themes) || !Array.isArray(storyData.notable_quotes)) {
                throw new Error('Invalid story data structure received');
            }

            // Update the current story with the new data
            setCurrentStory(storyData);

            // Keep the sidebar open as the story updates
            setSidebarOpen(true);

            // Only show success toast on first generation
            if (!currentStory) {
                toast.success('Story generated successfully');
            }
        } catch (error) {
            console.error('Error generating story:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to generate story');
        } finally {
            setIsSaving(false);
        }
    };

    const saveStory = async () => {
        // Implementation of saveStory function
    };

    return (
        <div className="flex">
            {/* Sidebar */}
            {sidebarOpen && currentStory && (
                <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg p-8 overflow-y-auto">
                    <div className="space-y-8">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-[#3c4f76]">Story Preview</h2>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="text-[#383f51] hover:text-[#3c4f76]"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Story Narrative */}
                            <div className="space-y-2">
                                <h3 className="text-lg font-medium text-[#3c4f76]">Story</h3>
                                <textarea
                                    className="w-full h-32 bg-gray-50 text-[#383f51] p-3 rounded-xl border-2 border-gray-100"
                                    value={currentStory.story_narrative}
                                    onChange={(e) => {
                                        setCurrentStory({
                                            ...currentStory,
                                            story_narrative: e.target.value
                                        });
                                    }}
                                />
                            </div>

                            {/* Key Themes */}
                            <div className="space-y-2">
                                <h3 className="text-lg font-medium text-[#3c4f76]">Key Themes</h3>
                                <div className="space-y-2">
                                    {currentStory.key_themes.map((theme: string, index: number) => (
                                        <input
                                            key={index}
                                            type="text"
                                            className="w-full bg-gray-50 text-[#383f51] p-3 rounded-xl border-2 border-gray-100"
                                            value={theme}
                                            onChange={(e) => {
                                                const newThemes = [...currentStory.key_themes];
                                                newThemes[index] = e.target.value;
                                                setCurrentStory({
                                                    ...currentStory,
                                                    key_themes: newThemes
                                                });
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Notable Quotes */}
                            <div className="space-y-2">
                                <h3 className="text-lg font-medium text-[#3c4f76]">Notable Quotes</h3>
                                <div className="space-y-2">
                                    {currentStory.notable_quotes.map((quote: string, index: number) => (
                                        <input
                                            key={index}
                                            type="text"
                                            className="w-full bg-gray-50 text-[#383f51] p-3 rounded-xl border-2 border-gray-100"
                                            value={quote}
                                            onChange={(e) => {
                                                const newQuotes = [...currentStory.notable_quotes];
                                                newQuotes[index] = e.target.value;
                                                setCurrentStory({
                                                    ...currentStory,
                                                    notable_quotes: newQuotes
                                                });
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Historical Context */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-[#3c4f76]">Historical Context</h3>

                                {/* Time Periods */}
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium text-[#3c4f76]">Time Periods</h4>
                                    <div className="space-y-2">
                                        {currentStory.historical_context.time_periods.map((period: string, index: number) => (
                                            <input
                                                key={index}
                                                type="text"
                                                className="w-full bg-gray-50 text-[#383f51] p-3 rounded-xl border-2 border-gray-100"
                                                value={period}
                                                onChange={(e) => {
                                                    const newPeriods = [...currentStory.historical_context.time_periods];
                                                    newPeriods[index] = e.target.value;
                                                    setCurrentStory({
                                                        ...currentStory,
                                                        historical_context: {
                                                            ...currentStory.historical_context,
                                                            time_periods: newPeriods
                                                        }
                                                    });
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Events */}
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium text-[#3c4f76]">Events</h4>
                                    <div className="space-y-2">
                                        {currentStory.historical_context.events.map((event: string, index: number) => (
                                            <input
                                                key={index}
                                                type="text"
                                                className="w-full bg-gray-50 text-[#383f51] p-3 rounded-xl border-2 border-gray-100"
                                                value={event}
                                                onChange={(e) => {
                                                    const newEvents = [...currentStory.historical_context.events];
                                                    newEvents[index] = e.target.value;
                                                    setCurrentStory({
                                                        ...currentStory,
                                                        historical_context: {
                                                            ...currentStory.historical_context,
                                                            events: newEvents
                                                        }
                                                    });
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Cultural Context */}
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium text-[#3c4f76]">Cultural Context</h4>
                                    <div className="space-y-2">
                                        {currentStory.historical_context.cultural_context.map((context: string, index: number) => (
                                            <input
                                                key={index}
                                                type="text"
                                                className="w-full bg-gray-50 text-[#383f51] p-3 rounded-xl border-2 border-gray-100"
                                                value={context}
                                                onChange={(e) => {
                                                    const newContexts = [...currentStory.historical_context.cultural_context];
                                                    newContexts[index] = e.target.value;
                                                    setCurrentStory({
                                                        ...currentStory,
                                                        historical_context: {
                                                            ...currentStory.historical_context,
                                                            cultural_context: newContexts
                                                        }
                                                    });
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Follow-up Topics */}
                            <div className="space-y-2">
                                <h3 className="text-lg font-medium text-[#3c4f76]">Follow-up Topics</h3>
                                <div className="space-y-2">
                                    {currentStory.follow_up_topics.map((topic: string, index: number) => (
                                        <input
                                            key={index}
                                            type="text"
                                            className="w-full bg-gray-50 text-[#383f51] p-3 rounded-xl border-2 border-gray-100"
                                            value={topic}
                                            onChange={(e) => {
                                                const newTopics = [...currentStory.follow_up_topics];
                                                newTopics[index] = e.target.value;
                                                setCurrentStory({
                                                    ...currentStory,
                                                    follow_up_topics: newTopics
                                                });
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <Button
                            onClick={saveStory}
                            disabled={isSaving}
                            className="w-full bg-[#3c4f76] hover:bg-[#2a3b5a] text-white py-6 rounded-2xl text-lg"
                        >
                            {isSaving ? "Saving..." : "Save Story"}
                        </Button>
                    </div>
                </div>
            )}

            {/* Main Content Container */}
            <div className="w-full">
                <div className="flex flex-col items-center gap-4">
                    {error && (
                        <div className="bg-red-100 text-red-600 p-4 rounded-2xl mb-4">
                            {error}
                        </div>
                    )}

                    {/* Recording Button */}
                    <Button
                        onClick={toggleRecording}
                        disabled={isLoading}
                        size="lg"
                        className={`
                            w-20 h-20 rounded-2xl shadow-lg transition-all duration-300
                            ${recordingState === 'listening'
                                ? 'bg-[#3c4f76] hover:bg-[#2a3b5a]'
                                : 'bg-[#3c4f76] hover:bg-[#2a3b5a]'}
                        `}
                    >
                        {isLoading ? (
                            <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : recordingState === 'listening' ? (
                            <Square className="w-6 h-6 text-white" />
                        ) : (
                            <Mic className="w-6 h-6 text-white" />
                        )}
                    </Button>

                    {/* Recording Status */}
                    <div className="text-sm font-medium text-[#383f51]">
                        {recordingState === 'listening' ? 'Listening...' : 'Ready to start'}
                    </div>
                </div>
            </div>
        </div>
    );
} 