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
      locations: {
        Row: {
          id: string
          name: string
          type: 'country' | 'state' | 'city' | 'locality'
          parent_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'country' | 'state' | 'city' | 'locality'
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'country' | 'state' | 'city' | 'locality'
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      // Add other tables as needed
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
  }
}
