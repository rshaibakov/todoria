import { ref } from 'vue'

export const useTaskForm = () => {
  const hasOpenedTaskForm = ref<boolean>(false)

  const toggleTaskForm = (isOpened: boolean) => {
    hasOpenedTaskForm.value = isOpened
  }

  return {
    hasOpenedTaskForm,
    toggleTaskForm
  }
}
