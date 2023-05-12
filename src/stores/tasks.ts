import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../db'
import { type Database } from '../db.types'
import { useUserStore } from './user'
import { useSprintsStore } from './sprints'

export type TTask = Database['public']['Tables']['tasks']['Row']
export type TNewTask = Database['public']['Tables']['tasks']['Insert']
export type TTaskPayload = Pick<TNewTask, 'name' | 'description' | 'planned_at' | 'is_done' | 'sprint_id'>
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

  const userStore = useUserStore()

  const createTask = async (task: TTaskPayload) => {
    if (userStore.user === null) {
      throw Error('User not found')
    }

    const { data, error } = await supabase.from('tasks')
      .insert([{
        ...task,
        user_id: userStore.user.id
      }])

    if (error !== null) {
      throw Error(error.message)
    }

    console.log(data)
  }

  const sprintStore = useSprintsStore()

  const createTaskByCurrentSprint = async (task: TTaskPayload) => {
    if (sprintStore.currentSprint === null) {
      throw Error('Sprint not found')
    }

    await createTask({
      ...task,
      sprint_id: sprintStore.currentSprint.id
    })
  }

  return {
    tasks,
    fetchTasksBySprint,
    createTask,
    createTaskByCurrentSprint
  }
})
