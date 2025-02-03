"use client"

import Link from "next/link"
import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { questions, type QuestionCategory } from "@/lib/questions"
import { Button } from "@/components/ui/button"
import { toast } from 'sonner'
import { Toaster } from 'sonner'
import type { StoryData } from '@/types/story'
import { Conversation } from '@/components/Conversation'

export default function RecordPage() {
    // Add mounted state
    const [mounted, setMounted] = useState(false)
    const searchParams = useSearchParams()
    const [category, setCategory] = useState<QuestionCategory>("growing-up")
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [isRecording, setIsRecording] = useState(false)
    const [conversation, setConversation] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [currentAgentMessage, setCurrentAgentMessage] = useState<string>("")

    // Move currentQuestions calculation inside useCallback dependencies
    const currentQuestions = questions[category]
    const displayCategory = category.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')

    // Update handleRecording with initialization check and retry
    const handleRecording = useCallback(async () => {
        setError(null)

        if (!isRecording) {
            setIsRecording(true)
            
            try {
                // Wait for SDK to initialize (up to 5 seconds)
                let attempts = 0
                while (!window.elevenlabs || !window.elevenLabsInitialized) {
                    if (attempts >= 10) {
                        throw new Error('ElevenLabs SDK failed to initialize. Please refresh the page and try again.')
                    }
                    await new Promise(resolve => setTimeout(resolve, 500))
                    attempts++
                }

                console.log('Starting conversation with ElevenLabs agent...')
                const conversation = await window.elevenlabs.agent.start({
                    agentId: 'qPh6aLux5ur3fOysTKl5',
                    context: {
                        category: displayCategory,
                        currentQuestion: currentQuestions[currentQuestion]
                    }
                })
                
                console.log('Conversation started successfully')
                setConversation(conversation)

                conversation.on('update', (message: string) => {
                    console.log('Agent:', message)
                    setCurrentAgentMessage(message)
                    toast.info(message)
                })

                conversation.on('error', (error: Error) => {
                    console.error('Conversation error:', error)
                    toast.error('Error during conversation')
                    setError(error.message)
                    setIsRecording(false)
                })

                conversation.on('end', async () => {
                    try {
                        const data = await conversation.getData()
                        console.log('Extracted Data:', data)
                        await saveStoryData(data)
                    } catch (error) {
                        console.error('Error processing conversation:', error)
                        toast.error('Error processing conversation')
                    } finally {
                        setIsRecording(false)
                    }
                })

            } catch (error) {
                console.error('Error starting conversation:', error)
                toast.error(error instanceof Error ? error.message : 'Failed to start conversation')
                setError(error instanceof Error ? error.message : 'Failed to start conversation')
                setIsRecording(false)
            }
        } else {
            try {
                setIsRecording(false)
                if (conversation) {
                    await conversation.stop()
                }
            } catch (error) {
                console.error('Error stopping conversation:', error)
                toast.error('Failed to stop conversation')
            }
        }
    }, [isRecording, conversation, displayCategory, currentQuestions, currentQuestion])

    // Add mounted effect
    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        const categoryParam = searchParams.get("category") as QuestionCategory
        setCategory(categoryParam || "growing-up")
        setIsLoading(false)
    }, [searchParams])

    useEffect(() => {
        return () => {
            setCurrentAgentMessage("")
        }
    }, [])

    // Return null if not mounted
    if (!mounted || isLoading) {
        return null
    }

    const nextQuestion = () => {
        setCurrentQuestion((prev) => (prev + 1) % currentQuestions.length)
    }

    const previousQuestion = () => {
        setCurrentQuestion((prev) => (prev - 1 + currentQuestions.length) % currentQuestions.length)
    }

    // Function to save story data
    const saveStoryData = async (data: StoryData) => {
        setIsSaving(true)
        try {
            const response = await fetch('/api/stories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })

            if (!response.ok) {
                throw new Error('Failed to save story')
            }

            toast.success('Story saved successfully!')
        } catch (error) {
            console.error('Error saving story:', error)
            toast.error('Failed to save story')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#461635] text-white">
            <div className="container mx-auto px-4 py-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-16">
                    <Link href="/topics" className="text-white">
                        <ChevronLeft className="w-8 h-8" />
                    </Link>
                    <h1 className="text-2xl font-serif">Memory Lane</h1>
                    <div className="w-8" />
                </div>

                {/* Content */}
                <div className="max-w-2xl mx-auto text-center space-y-8">
                    <h2 className="text-4xl font-serif mb-4">{displayCategory}</h2>
                    <p className="text-xl text-gray-200 mb-16">Below are some initial prompts to provide inspiration.</p>

                    {/* Question Carousel */}
                    <div className="relative py-8">
                        <button
                            onClick={previousQuestion}
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
                            aria-label="Previous question"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>

                        <div className="text-2xl font-serif px-16">{currentQuestions[currentQuestion]}</div>

                        <button
                            onClick={nextQuestion}
                            className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
                            aria-label="Next question"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Dots */}
                    <div className="flex justify-center gap-2 py-8">
                        {currentQuestions.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentQuestion(index)}
                                className={`w-2 h-2 rounded-full ${index === currentQuestion ? "bg-white" : "bg-white/30"}`}
                                aria-label={`Go to question ${index + 1}`}
                            />
                        ))}
                    </div>

                    {/* Conversation Component */}
                    <div className="mb-32">
                        <Conversation />
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-md">
                            {error}
                        </div>
                    )}
                </div>
            </div>

            {/* Add toast container */}
            <Toaster />
        </div>
    )
}