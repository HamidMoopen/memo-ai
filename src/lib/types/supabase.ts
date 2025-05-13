export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          phone_number: string | null
          phone_number_verified: boolean
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          phone_number?: string | null
          phone_number_verified?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          phone_number?: string | null
          phone_number_verified?: boolean
        }
      }
    }
  }
} 