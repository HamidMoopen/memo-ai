'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export default function RecordingSessionPage() {
    const params = useParams()
    const recordingId = params.id as string
    const [isRecording, setIsRecording] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [recordingData, setRecordingData] = useState<any>(null)

    useEffect(() => {
        const initializeRecording = async () => {
            try {
                // Fetch recording details
                const response = await fetch(`/api/direct-record/${recordingId}`)
                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch recording details')
                }

                setRecordingData(data.recording)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred')
            } finally {
                setIsLoading(false)
            }
        }

        initializeRecording()
    }, [recordingId])

    const handleStartRecording = async () => {
        try {
            setIsRecording(true)
            setError('')

            // Initialize VAPI recording session
            const response = await fetch(`/api/direct-record/${recordingId}/start`, {
                method: 'POST',
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Failed to start recording')
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
            setIsRecording(false)
        }
    }

    const handleStopRecording = async () => {
        try {
            setIsRecording(false)
            setError('')

            const response = await fetch(`/api/direct-record/${recordingId}/stop`, {
                method: 'POST',
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Failed to stop recording')
            }
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
        <div className="container mx-auto py-8">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>{recordingData?.title || 'Recording Session'}</CardTitle>
                    <CardDescription>
                        {recordingData?.description || 'Direct recording session'}
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
    )
} 