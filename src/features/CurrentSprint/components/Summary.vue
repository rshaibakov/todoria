<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import dayjs from 'dayjs'
import { useSprintsStore } from '../../../stores/sprints'
import { useTasksStore } from '../../../stores/tasks'
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
        <button class="button button-primary button-sm">
          Добавить задачу
        </button>
      </div>

      <ul class="items">
        <CurrentSprint.Task
          v-for="task in tasks"
          :key="task.id"
          data-test-id="current-sprint-task"
          :task="task"
        />
      </ul>
    </div>
  </section>
</template>

<style scoped>
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

.items {
  grid-area: items;
}
</style>
