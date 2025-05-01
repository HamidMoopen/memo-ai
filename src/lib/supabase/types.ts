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
      profiles: {
        Row: {
          id: string
          phone_number: string | null
          phone_number_verified: boolean
          updated_at: string
          created_at: string
        }
        Insert: {
          id: string
          phone_number?: string | null
          phone_number_verified?: boolean
          updated_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          phone_number?: string | null
          phone_number_verified?: boolean
          updated_at?: string
          created_at?: string
        }
      }
      // Add other tables as needed
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T] 