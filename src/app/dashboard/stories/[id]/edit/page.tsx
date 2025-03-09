'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { DashboardHeader } from '../../../components/DashboardHeader'
import { Card, CardContent } from "../../../../../components/ui/card"

export default function EditStoryPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [story, setStory] = useState<any>(null)
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        async function fetchStory() {
            const { data, error } = await supabase
                .from('stories')
                .select('*')
                .eq('id', params.id)
                .single()

            if (error) {
                console.error('Error fetching story:', error)
                toast.error('Could not load the story')
                router.push('/dashboard/stories')
                return
            }

            setStory(data)
            setTitle(data.title)
            setContent(data.content)
            setIsLoading(false)
        }

        fetchStory()
    }, [params.id, router, supabase])

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const { error } = await supabase
                .from('stories')
                .update({
                    title,
                    content,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', params.id)

            if (error) throw error

            toast.success('Your story has been updated')
            router.push(`/dashboard/stories/${params.id}`)
        } catch (error) {
            console.error('Error updating story:', error)
            toast.error('Failed to update the story')
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div>
                <DashboardHeader
                    title="Edit Story"
                    description="Loading story details..."
                />
            </div>
        )
    }

    return (
        <div>
            <DashboardHeader
                title="Edit Story"
                description="Update your story details"
            />
            <div className="container mx-auto px-8 py-8">
                <Card className="rounded-3xl shadow">
                    <CardContent className="p-8">
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="title" className="block text-lg font-medium text-[#3c4f76] mb-2">
                                    Title
                                </label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                                    className="w-full text-lg p-3 rounded-xl border-2 border-gray-100"
                                />
                            </div>

                            <div>
                                <label htmlFor="content" className="block text-lg font-medium text-[#3c4f76] mb-2">
                                    Content
                                </label>
                                <Textarea
                                    id="content"
                                    value={content}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                                    className="w-full min-h-[300px] text-lg p-3 rounded-xl border-2 border-gray-100"
                                />
                            </div>

                            <div className="flex justify-end space-x-4 pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => router.push(`/dashboard/stories/${params.id}`)}
                                    className="text-[#3c4f76] border-2 border-[#3c4f76] hover:bg-[#3c4f76] hover:text-white px-6 py-3 rounded-xl"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    disabled={isSaving || !title.trim() || !content.trim()}
                                    className="bg-[#3c4f76] hover:bg-[#2a3b5a] text-white px-6 py-3 rounded-xl"
                                >
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
} 