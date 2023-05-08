<script setup lang="ts">
import { computed } from 'vue'
import dayjs from 'dayjs'
import { TTask } from '../../stores/tasks'

const props = defineProps<{ task: TTask }>()

const taskPlannedAt = computed(() => dayjs(props.task.planned_at).format('ddd, D MMMM'))
</script>

<template>
  <li class="task">
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
  </li>
</template>

<style scoped>
.task {
  @apply
    px-2
    py-1;
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
