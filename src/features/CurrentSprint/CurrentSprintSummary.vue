<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import dayjs from 'dayjs'
import { useSprintsStore } from '../../stores/sprints'
import CurrentSprintTasks from './CurrentSprintTasks.vue'

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
</script>

<template>
  <section class="summary">
    <header
      class="duration"
      data-test-id="current-sprint-duration"
    >
      {{ duration }}
    </header>

    <CurrentSprintTasks />
  </section>
</template>

<style scoped>
.summary {
  @apply
    px-5
    py-3;
}

.duration {
  @apply
    text-xl
    font-semibold
    capitalize;

  grid-area: summary;
}
</style>
