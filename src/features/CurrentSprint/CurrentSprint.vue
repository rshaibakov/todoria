<script setup lang="ts">
import { computed, onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'
import dayjs from 'dayjs'
import { useSprintsStore } from '../../stores/sprints'

const store = useSprintsStore()
const { currentSprint } = storeToRefs(store)

const sourceDateFormat = 'YYYY-MM-DD'
const displayedDateFormat = 'ddd, D MMMM'
const duration = computed(() => {
  if (!currentSprint.value) {
    return ''
  }

  const startAt = dayjs(currentSprint.value.start_at, sourceDateFormat).format(displayedDateFormat)
  const finishAt = dayjs(currentSprint.value.finish_at, sourceDateFormat).format(displayedDateFormat)
  return `${startAt} - ${finishAt}`
})

onBeforeMount(() => {
  store.fetchCurrentSprint()
})
</script>

<template>
  <div class="current-sprint">
    <section class="summary">
      <header
        class="duration"
        data-test-id="current-sprint-duration"
      >
        {{ duration }}
      </header>
    </section>

    <section class="timeline" />
  </div>
</template>

<style scoped>
.current-sprint {
  @apply
    grid;

  grid-template-areas: "summary timeline";
  grid-template-columns: 480px 1fr;
}

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

.timeline {
  grid-area: timeline;
}
</style>
