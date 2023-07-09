<script setup lang="ts">
import { ref } from 'vue'
import dayjs from 'dayjs'
import { TTask, useTasksStore } from '../../../stores/tasks'

const props = defineProps<{ task?: TTask }>()
const emit = defineEmits(['cancel', 'remove', 'submit'])

const { createTaskByCurrentSprint, updateTask } = useTasksStore()

const nameField = ref<HTMLInputElement | null>(null)
const descriptionField = ref<HTMLTextAreaElement | null>(null)
const dateField = ref<HTMLInputElement | null>(null)

const isForUpdate = props.task !== undefined
const taskPlannedAt = isForUpdate
  ? props.task.planned_at && dayjs(props.task?.planned_at).format('YYYY-MM-DD')
  : ''

const onSubmit = async () => {
  if (!nameField.value) {
    return
  }

  emit('submit')

  if (isForUpdate) {
    await updateTask(props.task.id, {
      name: nameField.value.value,
      description: descriptionField.value?.value,
      planned_at: dateField.value?.value || null
    })
  } else {
    await createTaskByCurrentSprint({
      name: nameField.value.value,
      description: descriptionField.value?.value,
      planned_at: dateField.value?.value || null
    })
  }
}
</script>

<template>
  <form
    class="form"
    data-test-id="task-form"
    @submit.prevent="onSubmit"
  >
    <input
      ref="nameField"
      class="text-field"
      :value="props.task?.name || ''"
      type="text"
      placeholder="Название"
      required
    >

    <textarea
      ref="descriptionField"
      class="text-field"
      :value="props.task?.description || ''"
      placeholder="Описание"
    />

    <input
      ref="dateField"
      class="text-field"
      data-test-id="task-form-planned-at-field"
      :value="taskPlannedAt"
      type="date"
    >

    <footer class="actions">
      <button
        v-if="isForUpdate"
        class="button button-sm button-danger remove-button"
        data-test-id="task-form-remove-button"
        type="button"
        @click.stop="emit('remove')"
      >
        Удалить
      </button>

      <button
        class="button button-sm cancel-button"
        data-test-id="task-form-cancel-button"
        type="button"
        @click.stop="emit('cancel')"
      >
        Отмена
      </button>

      <button
        class="button button-sm button-primary save-button"
        data-test-id="task-form-submit-button"
        type="submit"
      >
        {{ isForUpdate ? 'Обновить' : 'Добавить' }}
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
    grid;

  grid-template-columns: [one] 1fr [two] 1fr [three] 1fr [four] 1fr [five];
}

.remove-button {
  grid-column: one / span two;
}

.cancel-button {
  grid-column: three / span four;
}

.save-button {
  grid-column: four / span five;
}
</style>
