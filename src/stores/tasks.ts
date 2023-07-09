import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../db'
import { type Database } from '../db.types'
import { useUserStore } from './user'
import { useSprintsStore, type TSprint } from './sprints'

export type TTask = Database['public']['Tables']['tasks']['Row']
export type TTaskPayloadByCreate = Pick<Database['public']['Tables']['tasks']['Insert'], 'name' | 'description' | 'planned_at' | 'is_done' | 'sprint_id'>
export type TTaskPayloadByUpdate = Database['public']['Tables']['tasks']['Update']

// TODO: Добавить обработку ошибок
export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<TTask[]>([])

  const fetchTasksBySprint = async (sprintId: TSprint['id']) => {
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

  const createTask = async (task: TTaskPayloadByCreate) => {
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

  const createTaskByCurrentSprint = async (task: TTaskPayloadByCreate) => {
    if (sprintStore.currentSprint === null) {
      throw Error('Sprint not found')
    }

    const newTask = await createTask({
      ...task,
      sprint_id: sprintStore.currentSprint.id
    })

    tasks.value = [newTask, ...tasks.value]

    if (newTask.planned_at !== null) {
      tasks.value = tasks.value.sort(sortTasks)
    }
  }

  // TODO: Требует рефакторинга
  const updateTask = async (taskId: TTaskPayloadByUpdate['id'], taskPayload: TTaskPayloadByUpdate) => {
    const currentTaskIndex = tasks.value.findIndex(task => task.id === taskId)
    const currentTask = tasks.value[currentTaskIndex]

    tasks.value.splice(currentTaskIndex, 1, { ...currentTask, ...taskPayload })

    if (taskPayload.planned_at !== currentTask.planned_at) {
      tasks.value = tasks.value.sort(sortTasks)
    }

    const { error } = await supabase.from('tasks')
      .update(taskPayload)
      .eq('id', taskId)

    if (error !== null) {
      tasks.value.splice(currentTaskIndex, 1, currentTask)

      if (taskPayload.planned_at !== currentTask.planned_at) {
        tasks.value = tasks.value.sort(sortTasks)
      }

      throw Error(error.message)
    }
  }

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

  return {
    tasks,
    fetchTasksBySprint,
    createTask,
    createTaskByCurrentSprint,
    updateTask
  }
})
