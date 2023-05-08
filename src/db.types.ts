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
          created_at: string | null
          description: string | null
          id: string
          is_done: boolean | null
          name: string
          planned_at: string | null
          sprint_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_done?: boolean | null
          name: string
          planned_at?: string | null
          sprint_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_done?: boolean | null
          name?: string
          planned_at?: string | null
          sprint_id?: string | null
          user_id?: string
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
