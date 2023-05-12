<script setup lang="ts">
import { ref } from 'vue'
import { useTasksStore } from '../../../stores/tasks'

const emit = defineEmits(['cancel'])

const { createTaskByCurrentSprint } = useTasksStore()

const nameField = ref<HTMLInputElement | null>(null)
const descriptionField = ref<HTMLTextAreaElement | null>(null)
const dateField = ref<HTMLInputElement | null>(null)

const handleSubmit = () => {
  if (!nameField.value) {
    return
  }

  createTaskByCurrentSprint({
    name: nameField.value.value,
    description: descriptionField.value?.value
    // plannedAt: dateField.value?.value,
  })
}
</script>

<template>
  <form
    class="form"
    @submit.prevent="handleSubmit"
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
      ref="dateFiled"
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
