'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, X } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import type { StoryData } from '@/types/story'

export default function DirectRecordPage() {
    const params = useParams()
    const router = useRouter()
    const { toast } = useToast()
    const topic = params.topic as string
    const [isRecording, setIsRecording] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [currentStory, setCurrentStory] = useState<StoryData | null>(null)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [transcript, setTranscript] = useState('')

    useEffect(() => {
        const initializeRecording = async () => {
            try {
                // Create a new recording session
                const response = await fetch('/api/direct-record', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title: `My ${topic.replace(/-/g, ' ')} Story`,
                        description: `A story about ${topic.replace(/-/g, ' ')}`,
                        topic: topic
                    }),
                })

                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to initialize recording')
                }

                setCurrentStory(data.recording)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred')
            } finally {
                setIsLoading(false)
            }
        }

        initializeRecording()
    }, [topic])

    const handleStartRecording = async () => {
        try {
            setIsRecording(true)
            setError('')

            // Start the VAPI recording session
            const response = await fetch(`/api/direct-record/${currentStory?.id}/start`, {
                method: 'POST',
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Failed to start recording')
            }

            // Open the sidebar to show story preview
            setSidebarOpen(true)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
            setIsRecording(false)
        }
    }

    const handleStopRecording = async () => {
        try {
            setIsRecording(false)
            setError('')

            const response = await fetch(`/api/direct-record/${currentStory?.id}/stop`, {
                method: 'POST',
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Failed to stop recording')
            }

            toast({
                title: "Recording Complete",
                description: "Your story has been saved successfully.",
            })

            // Redirect to the story page
            router.push(`/story?data=${encodeURIComponent(JSON.stringify(currentStory))}`)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto py-8">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>Error</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-red-500">{error}</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex">
            {/* Main Content */}
            <div className="flex-1 min-h-screen bg-background p-8">
                <div className="max-w-2xl mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recording Session</CardTitle>
                            <CardDescription>
                                Recording your story about {topic.replace(/-/g, ' ')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-center">
                                    {isRecording ? (
                                        <Button
                                            onClick={handleStopRecording}
                                            variant="destructive"
                                            className="w-32"
                                        >
                                            Stop Recording
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={handleStartRecording}
                                            className="w-32"
                                        >
                                            Start Recording
                                        </Button>
                                    )}
                                </div>
                                {isRecording && (
                                    <div className="text-center">
                                        <div className="inline-block w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2" />
                                        Recording in progress...
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Story Preview Sidebar */}
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
                                    {currentStory.key_themes.map((theme, index) => (
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

                            {/* Historical Context */}
                            <div className="space-y-2">
                                <h3 className="text-lg font-medium text-[#3c4f76]">Historical Context</h3>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-[#3c4f76]">Time Periods</h4>
                                        <div className="space-y-2">
                                            {currentStory.historical_context.time_periods.map((period, index) => (
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
                                </div>
                            </div>

                            {/* Follow-up Topics */}
                            <div className="space-y-2">
                                <h3 className="text-lg font-medium text-[#3c4f76]">Follow-up Topics</h3>
                                <div className="space-y-2">
                                    {currentStory.follow_up_topics.map((topic, index) => (
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
                    </div>
                </div>
            )}
        </div>
    )
} 