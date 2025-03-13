'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2, Share2, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { deleteStory } from '@/app/actions/story'
import { toast } from 'sonner'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface StoryActionsProps {
    storyId: string
}

export function StoryActions({ storyId }: StoryActionsProps) {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    const handleEdit = () => {
        router.push(`/dashboard/stories/${storyId}/edit`)
    }

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const result = await deleteStory(storyId)

            if (result.error) {
                throw new Error(result.error)
            }

            toast.success('Story deleted successfully')
            router.push('/dashboard/stories')
        } catch (error: any) {
            console.error('Error deleting story:', error)
            toast.error('Failed to delete story')
        } finally {
            setIsDeleting(false)
            setShowDeleteDialog(false)
        }
    }

    const handleShare = () => {
        // Copy the URL to clipboard
        const url = `${window.location.origin}/dashboard/stories/${storyId}`
        navigator.clipboard.writeText(url)
        toast.success('Link copied to clipboard')
    }

    return (
        <>
            <div className="flex space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="text-[#3c4f76] border-2 border-[#3c4f76] hover:bg-[#3c4f76] hover:text-white rounded-xl"
                    onClick={handleEdit}
                >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-[#3c4f76] border-2 border-[#3c4f76] hover:bg-[#3c4f76] hover:text-white rounded-xl"
                        >
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuItem onClick={handleShare} className="cursor-pointer">
                            <Share2 className="h-4 w-4 mr-2" />
                            Copy Link
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 border-2 border-red-500 hover:bg-red-500 hover:text-white rounded-xl"
                    onClick={() => setShowDeleteDialog(true)}
                >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                </Button>
            </div>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent className="rounded-xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your story.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-500 hover:bg-red-600 rounded-xl"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
} 