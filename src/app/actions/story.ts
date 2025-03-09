'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

type SaveStoryParams = {
  title: string
  content: string
  category: string
}

export async function saveStory({ title, content, category }: SaveStoryParams) {
  try {
    const supabase = await createClient()
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { error: 'Not authenticated' }
    }
    
    // Insert the story into the database
    const { data, error } = await supabase
      .from('stories')
      .insert({
        user_id: user.id,
        title,
        content, // Just store the narrative text
        category,
      })
      .select()
      .single()
    
    if (error) {
      console.error('Error saving story:', error)
      return { error: error.message }
    }
    
    // Revalidate the stories page to show the new story
    revalidatePath('/dashboard/stories')
    
    return { data }
  } catch (error: any) {
    console.error('Error in saveStory:', error)
    return { error: error.message || 'An unknown error occurred' }
  }
}

export async function deleteStory(storyId: string) {
  try {
    const supabase = await createClient()
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { error: 'Not authenticated' }
    }
    
    // Delete the story
    const { error } = await supabase
      .from('stories')
      .delete()
      .eq('id', storyId)
      .eq('user_id', user.id) // Ensure the user owns the story
    
    if (error) {
      console.error('Error deleting story:', error)
      return { error: error.message }
    }
    
    // Revalidate the stories page
    revalidatePath('/dashboard/stories')
    
    return { success: true }
  } catch (error: any) {
    console.error('Error in deleteStory:', error)
    return { error: error.message || 'An unknown error occurred' }
  }
} 