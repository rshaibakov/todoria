import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../db'
import { type Database } from '../db.types'

export type TTask = Database['public']['Tables']['tasks']['Row']
export type TSprintId = Database['public']['Tables']['sprints']['Row']['id']

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<TTask[] | null>(null)

  const fetchTasksBySprint = async (sprintId: TSprintId) => {
    const { data, error } = await supabase.from('tasks')
      .select()
      .eq('sprint_id', sprintId)

    if (error !== null) {
      throw Error(error.message)
    }

    tasks.value = data
  }

  return {
    tasks,
    fetchTasksBySprint
  }
})
