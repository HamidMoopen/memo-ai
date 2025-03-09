'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { DashboardHeader } from '../../../components/DashboardHeader'
import { Card, CardContent } from "@/components/ui/card"

type tParams = Promise<{ id: string }>

export default async function EditStoryPage(props: { params: tParams }) {
    const { id } = await props.params;
    const router = useRouter()
    const [story, setStory] = useState<any>(null)
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        async function fetchStory() {
            // Extract the ID from params
            const storyId = id

            const { data, error } = await supabase
                .from('stories')
                .select('*')
                .eq('id', storyId)
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
    }, [id, router, supabase])

    const handleSave = async () => {
        if (!title.trim() || !content.trim()) {
            toast.error('Title and content are required')
            return
        }

        setIsSaving(true)
        try {
            const { error } = await supabase
                .from('stories')
                .update({
                    title,
                    content,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)

            if (error) {
                throw new Error(error.message)
            }

            toast.success('Story updated successfully')
            router.push(`/dashboard/stories/${id}`)
        } catch (error: any) {
            console.error('Error updating story:', error)
            toast.error('Failed to update story')
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="container mx-auto py-8 px-4 md:px-8">
                <DashboardHeader
                    title="Loading..."
                    backLink="/dashboard/stories"
                />
                <div className="mt-8 flex justify-center">
                    <div className="w-8 h-8 border-4 border-[#3c4f76] border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8 px-4 md:px-8">
            <DashboardHeader
                title="Edit Story"
                backLink={`/dashboard/stories/${id}`}
                backLinkText="Back to Story"
            />

            <div className="mt-8">
                <Card>
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="title" className="text-sm font-medium text-[#383f51]">
                                    Title
                                </label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                                    className="w-full text-lg p-3 rounded-xl border-2 border-gray-100"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="content" className="text-sm font-medium text-[#383f51]">
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
                                    onClick={() => router.push(`/dashboard/stories/${id}`)}
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