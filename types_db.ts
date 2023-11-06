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
      aaa: {
        Row: {
          created_at: string
          id: number
          number: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          number?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          number?: number | null
        }
        Relationships: []
      }
      Users: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          followers: number | null
          id: number
          is_verified: boolean | null
          last_name: string | null
          username: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          followers?: number | null
          id?: number
          is_verified?: boolean | null
          last_name?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          followers?: number | null
          id?: number
          is_verified?: boolean | null
          last_name?: string | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      playlist_type: "Playlist" | "Album" | "Single" | "EP"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
