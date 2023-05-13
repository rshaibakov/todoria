<script setup lang="ts">
import { ref } from 'vue'
import { useTasksStore } from '../../../stores/tasks'

const emit = defineEmits(['cancel', 'createdTask'])

const { createTaskByCurrentSprint } = useTasksStore()

const nameField = ref<HTMLInputElement | null>(null)
const descriptionField = ref<HTMLTextAreaElement | null>(null)
const dateField = ref<HTMLInputElement | null>(null)

const onSubmit = async () => {
  if (!nameField.value) {
    return
  }

  // TODO: Добавить обработку ошибок
  await createTaskByCurrentSprint({
    name: nameField.value.value,
    description: descriptionField.value?.value,
    planned_at: dateField.value?.value || null
  })

  emit('createdTask')
}
</script>

<template>
  <form
    class="form"
    @submit.prevent="onSubmit"
  >
    <input
      ref="nameField"
      class="text-field"
      type="text"
      placeholder="Название"
      required
    >

    <textarea
      ref="descriptionField"
      class="text-field"
      placeholder="Описание"
    />

    <input
      ref="dateField"
      class="text-field"
      type="date"
    >

    <footer class="actions">
      <button
        class="button button-sm"
        type="button"
        @click="emit('cancel')"
      >
        Отмена
      </button>

      <button
        class="button button-sm button-primary"
        type="submit"
      >
        Добавить
      </button>
    </footer>
  </form>
</template>

<style scoped>
.form {
  @apply
    px-4
    py-4
    grid
    gap-4
    bg-white
    rounded;
}

.actions {
  @apply
    flex
    justify-end;
}
</style>
