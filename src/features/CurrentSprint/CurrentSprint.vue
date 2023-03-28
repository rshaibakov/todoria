<script setup lang="ts">
import { computed, onBeforeMount, onMounted } from 'vue'
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

onMounted(() => {
  const scrollContainer = document.querySelector('[data-js-id=current-sprint-days]')

  if (scrollContainer) {
    scrollContainer.addEventListener('wheel', (event) => {
      event.preventDefault()
      scrollContainer.scrollLeft += (<WheelEvent>event).deltaY
    })
  }
})
</script>

<template>
  <section>
    <header>{{ currentSprint?.number }}</header>

    <ul
      class="days"
      data-js-id="current-sprint-days"
    >
      <li
        v-for="day in days"
        :key="day"
        data-test-id="current-sprint-day"
        class="day"
      >
        {{ day }}
      </li>
    </ul>
  </section>
</template>

<style scoped>
.days {
  @apply
    py-4
    flex
    flex-nowrap
    gap-x-4
    overflow-x-hidden;

  height: 500px;
}

.day {
  @apply
    px-4
    py-2
    rounded-md
    shadow-md;

  min-width: 14%;
}
</style>
