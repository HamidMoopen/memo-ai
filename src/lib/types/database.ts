export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      calls: {
        Row: {
          call_id: string
          status: string
          summary: Json | null
          final_transcript: string | null
          created_at: string
          completed_at: string | null
        }
        Insert: {
          call_id: string
          status?: string
          summary?: Json | null
          final_transcript?: string | null
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          call_id?: string
          status?: string
          summary?: Json | null
          final_transcript?: string | null
          created_at?: string
          completed_at?: string | null
        }
      }
      memory_contexts: {
        Row: {
          id: number
          call_id: string
          time_period: string
          location: string
          people_involved: string[]
          created_at: string
        }
      }
      emotional_moments: {
        Row: {
          id: number
          call_id: string
          emotion: string
          intensity: number
          context: string
          created_at: string
        }
      }
      transcripts: {
        Row: {
          id: number
          call_id: string
          transcript: string
          updated_at: string
        }
      }
      // ... existing tables ...
      stories: {
        Row: {
          category: string | null
          content: string
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
          life_chapter: string | null
          chapter_metadata: Json
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          user_id: string
          life_chapter?: string | null
          chapter_metadata?: Json
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
          life_chapter?: string | null
          chapter_metadata?: Json
        }
      }
      users: {
        Row: {
          id: string
          email: string
          created_at: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 