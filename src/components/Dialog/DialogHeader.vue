<script setup lang="ts">
import IconClose from '@/assets/icons/close.svg'
</script>

<template>
  <header class="dialog-header">
    <h3 class="title">
      <slot />
    </h3>

    <button
      class="button-icon button-close"
      type="submit"
      value="cancel"
    >
      <IconClose class="icon-close" />
    </button>
  </header>
</template>

<style scoped>
.dialog-header {
  @apply
    grid
    items-center
    px-4
    py-3;

  grid-template-columns: 1fr auto;
}

.title {
  @apply
    m-0
    text-lg
    font-semibold;
}

.button-close {
  @apply
    w-6
    h-6
    text-slate-600
    bg-slate-300
    rounded-full;
}

.icon-close {
  @apply
    w-4
    h-4;
}
</style>
