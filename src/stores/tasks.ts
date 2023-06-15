import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../db'
import { type Database } from '../db.types'
import { useUserStore } from './user'
import { useSprintsStore } from './sprints'

export type TTask = Database['public']['Tables']['tasks']['Row']
export type TCreatedTask = Pick<Database['public']['Tables']['tasks']['Insert'], 'name' | 'description' | 'planned_at' | 'is_done' | 'sprint_id'>
export type TUpdatedTask = Database['public']['Tables']['tasks']['Update']
export type TSprintId = Database['public']['Tables']['sprints']['Row']['id']

// TODO: Добавить обработку ошибок
export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<TTask[]>([])

  const fetchTasksBySprint = async (sprintId: TSprintId) => {
    const { data, error } = await supabase.from('tasks')
      .select()
      .eq('sprint_id', sprintId)
      .order('planned_at', { ascending: true, nullsFirst: true })
      .order('created_at', { ascending: false })

    if (error !== null) {
      throw Error(error.message)
    }

    tasks.value = data
  }

  const userStore = useUserStore()

  const createTask = async (task: TCreatedTask) => {
    if (userStore.user === null) {
      throw Error('User not found')
    }

    const { data, error } = await supabase.from('tasks')
      .insert({
        ...task,
        user_id: userStore.user.id
      })
      .select()

    if (error !== null) {
      throw Error(error.message)
    }

    if (data === null) {
      throw Error('Not response with data by new task')
    }

    return data[0]
  }

  const sprintStore = useSprintsStore()

  const sortTasks = (a: TTask, b: TTask) => {
    if (a.planned_at !== null && b.planned_at !== null) {
      return a.planned_at > b.planned_at ? 1 : -1
    }

    if (a.planned_at === null && b.planned_at !== null) {
      return -1
    }

    if (a.planned_at !== null && b.planned_at === null) {
      return 1
    }

    return 0
  }

  const createTaskByCurrentSprint = async (task: TCreatedTask) => {
    if (sprintStore.currentSprint === null) {
      throw Error('Sprint not found')
    }

    const newTask = await createTask({
      ...task,
      sprint_id: sprintStore.currentSprint.id
    })

    if (newTask.planned_at !== null) {
      tasks.value = [newTask, ...tasks.value].sort(sortTasks)
    } else {
      tasks.value = [newTask, ...tasks.value]
    }
  }

  const updateTask = async (taskId: TUpdatedTask['id'], task: TUpdatedTask) => {
    const updatedTaskIndex = tasks.value.findIndex(task => task.id === taskId)
    tasks.value.splice(updatedTaskIndex, 1, { ...tasks.value[updatedTaskIndex], ...task })

    const { error } = await supabase.from('tasks')
      .update(task)
      .eq('id', taskId)

    if (error !== null) {
      throw Error(error.message)
    }
  }

  return {
    tasks,
    fetchTasksBySprint,
    createTask,
    createTaskByCurrentSprint,
    updateTask
  }
})
