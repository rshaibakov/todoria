<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <main class="main">
    <RouterView />
  </main>
</template>

<style scoped>
.main {
  @apply bg-slate-200;

  height: 100%;
}
</style>
