export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      sprints: {
        Row: {
          created_at: string | null
          finish_at: string | null
          id: string
          number: number | null
          start_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          finish_at?: string | null
          id?: string
          number?: number | null
          start_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          finish_at?: string | null
          id?: string
          number?: number | null
          start_at?: string | null
          user_id?: string | null
        }
      }
      tasks: {
        Row: {
          createdAt: string | null
          description: string | null
          expirationAt: string | null
          id: string
          name: string
          userId: string
        }
        Insert: {
          createdAt?: string | null
          description?: string | null
          expirationAt?: string | null
          id?: string
          name: string
          userId: string
        }
        Update: {
          createdAt?: string | null
          description?: string | null
          expirationAt?: string | null
          id?: string
          name?: string
          userId?: string
        }
      }
      sprints: {
        Row: {
          created_at: string | null
          finish_at: string | null
          id: string
          number: number | null
          start_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          finish_at?: string | null
          id?: string
          number?: number | null
          start_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          finish_at?: string | null
          id?: string
          number?: number | null
          start_at?: string | null
          user_id?: string | null
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
