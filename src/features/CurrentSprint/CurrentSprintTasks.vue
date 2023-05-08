<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useTasksStore } from '../../stores/tasks'
import CurrentSprintTask from './CurrentSprintTask.vue'

const tasksStore = useTasksStore()
const { tasks } = storeToRefs(tasksStore)
</script>

<template>
  <ul>
    <CurrentSprintTask
      v-for="task in tasks"
      :key="task.id"
      :task="task"
    />
  </ul>
</template>
