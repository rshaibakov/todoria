<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import dayjs from 'dayjs'
import { useSprintsStore } from '../../../stores/sprints'
import { useTasksStore } from '../../../stores/tasks'
import { useTaskForm } from '../composables/useTaskForm'
import * as CurrentSprint from './'

const sprintsStore = useSprintsStore()
const { currentSprint } = storeToRefs(sprintsStore)

const displayedDateFormat = 'ddd, D MMMM'
const duration = computed(() => {
  if (!currentSprint.value) {
    return ''
  }

  const startAt = dayjs(currentSprint.value.start_at).format(displayedDateFormat)
  const finishAt = dayjs(currentSprint.value.finish_at).format(displayedDateFormat)
  return `${startAt} - ${finishAt}`
})

const tasksStore = useTasksStore()
const { tasks } = storeToRefs(tasksStore)
const { hasOpenedTaskForm, toggleTaskForm } = useTaskForm()
</script>

<template>
  <section class="summary">
    <h2
      class="title"
      data-test-id="current-sprint-title"
    >
      Спринт #{{ currentSprint?.number }} [{{ duration }}]
    </h2>

    <div class="group">
      <h3 class="caption">
        Задачи
      </h3>

      <div class="actions">
        <button
          class="button button-primary button-sm"
          data-test-id="current-sprint-task-add-button"
          @click="toggleTaskForm(true)"
        >
          Добавить задачу
        </button>
      </div>

      <CurrentSprint.TaskForm
        v-if="hasOpenedTaskForm"
        class="task-form"
        @cancel="toggleTaskForm(false)"
        @submit="toggleTaskForm(false)"
      />

      <TransitionGroup
        class="items"
        name="flip-list"
        tag="ul"
      >
        <CurrentSprint.Task
          v-for="task in tasks"
          :key="task.id"
          data-test-id="current-sprint-task"
          :task="task"
        />
      </TransitionGroup>
    </div>
  </section>
</template>

<style scoped>
.flip-list-move {
  transition: transform 0.2s;
}

.summary {
  @apply
    px-5
    py-3;
}

.title {
  @apply
    text-xl
    font-semibold
    capitalize;

  grid-area: summary;
}

.group {
  @apply
    grid
    py-2;

  grid-template: 1fr auto / 1fr;
  grid-template-areas:
    "caption actions"
    "task-form task-form"
    "items items";
}

.caption {
  @apply
    mb-2
    text-lg;

  grid-area: caption;
}

.actions {
  grid-area: actions;
}

.task-form {
  grid-area: task-form;
}

.items {
  grid-area: items;
}
</style>
