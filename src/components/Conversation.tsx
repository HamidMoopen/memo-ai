'use client';

import { useCallback, useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Mic, Pause, Play, ChevronLeft, ChevronDown, Copy, Square } from 'lucide-react';
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

    return (
        <div className="relative max-w-full overflow-x-hidden">
            {/* Story Sidebar - Only render when we have a story */}
            {currentStory && (
                <div 
                    className={`fixed right-0 top-0 h-full w-96 bg-memory-dark border-l border-memory-purple/20 transform transition-transform duration-300 ease-in-out z-[100] shadow-xl ${
                        sidebarOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                >
                    <div className="p-6 h-full overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-serif text-memory-cream">Generated Story</h2>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="text-memory-cream/60 hover:text-memory-cream"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                        </div>
                        
                        {/* Story Sections */}
                        <div className="space-y-6">
                            {/* Narrative */}
                            <div className="space-y-2">
                                <h3 className="text-lg font-medium text-memory-cream/90">Narrative</h3>
                                <textarea
                                    className="w-full h-32 bg-memory-purple/10 text-memory-cream/90 p-3 rounded-lg resize-none"
                                    value={currentStory.story_narrative}
                                    onChange={(e) => setCurrentStory({
                                        ...currentStory,
                                        story_narrative: e.target.value
                                    })}
                                />
                            </div>

                            {/* Key Themes */}
                            <div className="space-y-2">
                                <h3 className="text-lg font-medium text-memory-cream/90">Key Themes</h3>
                                <div className="space-y-2">
                                    {currentStory.key_themes.map((theme: string, index: number) => (
                                        <input
                                            key={index}
                                            type="text"
                                            className="w-full bg-memory-purple/10 text-memory-cream/90 p-2 rounded"
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
                                <h3 className="text-lg font-medium text-memory-cream/90">Notable Quotes</h3>
                                <div className="space-y-2">
                                    {currentStory.notable_quotes.map((quote: string, index: number) => (
                                        <input
                                            key={index}
                                            type="text"
                                            className="w-full bg-memory-purple/10 text-memory-cream/90 p-2 rounded"
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
                                <h3 className="text-lg font-medium text-memory-cream/90">Historical Context</h3>
                                
                                {/* Time Periods */}
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium text-memory-cream/80">Time Periods</h4>
                                    <div className="space-y-2">
                                        {currentStory.historical_context.time_periods.map((period: string, index: number) => (
                                            <input
                                                key={index}
                                                type="text"
                                                className="w-full bg-memory-purple/10 text-memory-cream/90 p-2 rounded"
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
                                    <h4 className="text-sm font-medium text-memory-cream/80">Events</h4>
                                    <div className="space-y-2">
                                        {currentStory.historical_context.events.map((event: string, index: number) => (
                                            <input
                                                key={index}
                                                type="text"
                                                className="w-full bg-memory-purple/10 text-memory-cream/90 p-2 rounded"
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
                                    <h4 className="text-sm font-medium text-memory-cream/80">Cultural Context</h4>
                                    <div className="space-y-2">
                                        {currentStory.historical_context.cultural_context.map((context: string, index: number) => (
                                            <input
                                                key={index}
                                                type="text"
                                                className="w-full bg-memory-purple/10 text-memory-cream/90 p-2 rounded"
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
                                <h3 className="text-lg font-medium text-memory-cream/90">Follow-up Topics</h3>
                                <div className="space-y-2">
                                    {currentStory.follow_up_topics.map((topic: string, index: number) => (
                                        <input
                                            key={index}
                                            type="text"
                                            className="w-full bg-memory-purple/10 text-memory-cream/90 p-2 rounded"
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
                    </div>
                </div>
            )}

            {/* Main Content Container */}
            <div className="w-full">
                <div className="flex flex-col items-center gap-4">
                    {error && (
                        <div className="bg-red-500/10 text-red-500 p-4 rounded-lg mb-4">
                            {error}
                        </div>
                    )}
                    
                    {/* Recording Button */}
                    <Button
                        onClick={toggleRecording}
                        disabled={isLoading}
                        size="lg"
                        className={`
                            w-20 h-20 rounded-full shadow-lg transition-all duration-300
                            ${recordingState === 'listening' ? 'bg-memory-orange hover:bg-memory-orange-light' : 
                              'bg-memory-purple hover:bg-memory-purple-light'}
                        `}
                    >
                        {isLoading ? (
                            <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : recordingState === 'listening' ? (
                            <Square className="w-6 h-6" />
                        ) : (
                            <Mic className="w-6 h-6" />
                        )}
                    </Button>

                    {/* Recording Status */}
                    <div className="text-sm font-medium text-memory-cream/80">
                        {recordingState === 'listening' ? 'Listening...' : 'Ready to start'}
                    </div>
                </div>
            </div>
        </div>
    );
} 