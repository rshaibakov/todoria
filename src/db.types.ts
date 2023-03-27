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
      oneTimeTasks: {
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
          createdAt: string | null
          finishAt: string | null
          id: string
          number: number | null
          startAt: string | null
          userId: string | null
        }
        Insert: {
          createdAt?: string | null
          finishAt?: string | null
          id?: string
          number?: number | null
          startAt?: string | null
          userId?: string | null
        }
        Update: {
          createdAt?: string | null
          finishAt?: string | null
          id?: string
          number?: number | null
          startAt?: string | null
          userId?: string | null
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
