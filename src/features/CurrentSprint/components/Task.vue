<script setup lang="ts">
import { computed } from 'vue'
import dayjs from 'dayjs'
import { TTask } from '../../../stores/tasks'
import { useTaskForm } from '../composables/useTaskForm'
import * as CurrentSprint from '.'

const props = defineProps<{ task: TTask }>()

const { hasOpenedTaskForm, toggleTaskForm } = useTaskForm()

const taskPlannedAt = computed(() => props.task.planned_at && dayjs(props.task.planned_at).format('ddd, D MMMM'))
</script>

<template>
  <li
    class="task"
    tabindex="0"
    :aria-label="`Редактировать задачу ${props.task.name}`"
    @click="toggleTaskForm(true)"
    @keypress.space="toggleTaskForm(true)"
  >
    <CurrentSprint.TaskForm
      v-if="hasOpenedTaskForm"
      :task="task"
      @cancel="toggleTaskForm(false)"
      @submit="toggleTaskForm(false)"
    />

    <template v-else>
      <div class="primary">
        <span
          class="name"
          data-test-id="task-name"
        >
          {{ props.task.name }}
        </span>

        <span
          v-if="taskPlannedAt"
          class="planned-at"
          data-test-id="task-planned-at"
        >
          {{ taskPlannedAt }}
        </span>
      </div>

      <div
        v-if="props.task.description"
        class="description"
        data-test-id="task-description"
      >
        {{ props.task.description }}
      </div>
    </template>
  </li>
</template>

<style scoped>
.task {
  @apply
    py-1
    cursor-pointer;
}

.task + .task {
  @apply
    border-t
    border-slate-300;
}

.primary {
  @apply
    px-2
    w-full
    flex
    flex-nowrap
    items-center
    justify-between;
}

.name {
  @apply
    text-base;
}

.planned-at {
  @apply
    text-sm;
}

.description {
  @apply
    px-2
    text-sm;
}
</style>
