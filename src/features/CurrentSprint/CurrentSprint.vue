<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'
import dayjs from 'dayjs'
import { useSprintsStore } from '../../stores/sprints'

const store = useSprintsStore()
const { currentSprint } = storeToRefs(store)

const formatDate = 'ddd, D MMMM'
const startAt = dayjs(currentSprint.value?.start_at).format(formatDate)
const finishAt = dayjs(currentSprint.value?.finish_at).format(formatDate)

onBeforeMount(() => {
  store.fetchCurrentSprint()
})
</script>

<template>
  <div class="current-sprint">
    <section class="summary">
      <header class="duration">
        {{ startAt }} - {{ finishAt }}
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
