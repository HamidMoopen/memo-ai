import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ChevronLeft, Calendar } from "lucide-react"
import { StoryActions } from './StoryActions'

type tParams = Promise<{ id: string }>

export default async function StoryPage(props: { params: tParams }) {
    // First, resolve the id parameter
    const { id } = await props.params

    const supabase = await createClient()

    // Fetch the story by ID
    const { data: story, error } = await supabase
        .from('stories')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !story) {
        console.error('Error fetching story:', error)
        notFound()
    }

    return (
        <div className="container mx-auto py-8 px-4 md:px-8">
            <div className="flex justify-between items-center mb-6">
                <Link href="/dashboard/stories">
                    <Button variant="ghost" className="flex items-center text-[#3c4f76]">
                        <ChevronLeft className="mr-2 h-5 w-5" />
                        Back to Stories
                    </Button>
                </Link>

                <StoryActions storyId={id} />
            </div>

            <div className="bg-white rounded-3xl shadow-md p-8">
                <h1 className="text-3xl font-bold text-[#3c4f76] mb-4">{story.title}</h1>

                <div className="flex items-center text-gray-500 mb-8">
                    <Calendar className="mr-2 h-5 w-5" />
                    <span>{new Date(story.created_at).toLocaleDateString()}</span>
                    <span className="mx-3">•</span>
                    <span className="bg-[#3c4f76]/10 text-[#3c4f76] px-4 py-1 rounded-full">
                        {story.category}
                    </span>
                </div>

                <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap text-lg leading-relaxed text-[#383f51]">
                        {story.content}
                    </p>
                </div>
            </div>
        </div>
    )
} 