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
    @click="toggleTaskForm(true)"
  >
    <CurrentSprint.TaskForm
      v-if="hasOpenedTaskForm"
      :task="task"
      @cancel="toggleTaskForm(false)"
      @saved="toggleTaskForm(false)"
    />

    <template v-else>
      <div class="primary">
        <span class="name">
          {{ props.task.name }}
        </span>

        <span class="planned-at">
          {{ taskPlannedAt }}
        </span>
      </div>

      <div class="description">
        {{ props.task.description }}
      </div>
    </template>
  </li>
</template>

<style scoped>
.task {
  @apply
    px-2
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
    text-sm;
}
</style>
