import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../db'
import { type Database } from '../db.types'

export type TSprint = Database['public']['Tables']['sprints']['Row']

export const useSprintsStore = defineStore('sprints', () => {
  const currentSprint = ref<TSprint | null>(null)

  const fetchCurrentSprint = async () => {
    const now = new Date()

    const { data, error } = await supabase.from('sprints')
      .select()
      .lte('start_at', now.toISOString())
      .gte('finish_at', now.toISOString())

    if (error !== null) {
      throw Error(error.message)
    }

    currentSprint.value = data[0]
  }

  return {
    currentSprint,
    fetchCurrentSprint
  }
})
