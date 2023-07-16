<script setup lang="ts">
// TODO: Переименовать в Sprint и переструктурировать файлы
import { onBeforeMount, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useSprintsStore } from '../../stores/sprints'
import { useTasksStore } from '../../stores/tasks'
import * as CurrentSprint from './components'

const sprintsStore = useSprintsStore()
const tasksStore = useTasksStore()

const { currentSprint } = storeToRefs(sprintsStore)

onBeforeMount(() => {
  sprintsStore.fetchCurrentSprint()
})

watch(currentSprint, (currentSprint) => {
  if (!currentSprint) {
    return
  }

  tasksStore.fetchTasksBySprint(currentSprint.id)
})
</script>

<template>
  <div class="current-sprint">
    <CurrentSprint.Summary class="summary" />

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
  grid-area: summary;
}

.timeline {
  grid-area: timeline;
}
</style>
