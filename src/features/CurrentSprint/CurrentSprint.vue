<script setup lang="ts">
import { computed, onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'
import dayjs from 'dayjs'
import { useSprintsStore } from '../../stores/sprints'

const store = useSprintsStore()
const { currentSprint } = storeToRefs(store)

const days = computed(() => {
  if (!currentSprint.value) {
    return []
  }

  const startAt = dayjs(currentSprint.value?.start_at)
  const finishAt = dayjs(currentSprint.value?.finish_at)
  const diffDays = finishAt.diff(startAt, 'day')
  const days = []

  for (let i = 0; i <= diffDays; i++) {
    days.push(startAt.add(i, 'day').format('MMM D, YYYY'))
  }

  return days
})

onBeforeMount(() => {
  store.fetchCurrentSprint()
})
</script>

<template>
  <section class="current-sprint">
    <header>{{ currentSprint?.number }}</header>
  </section>
</template>

<style scoped>
.current-sprint {
  position: relative;
}
</style>
