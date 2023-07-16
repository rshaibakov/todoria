<script setup lang="ts">
import { ref } from 'vue'

const dialog = ref<HTMLDialogElement | null>(null)

defineExpose({
  dialog
})
</script>

<template>
  <dialog
    ref="dialog"
    class="dialog"
  >
    <slot />
  </dialog>
</template>

<style scoped>
.dialog {
  @apply
    p-0
    rounded-md
    text-base;

  width: 480px;
}

.dialog::backdrop {
  @apply
    bg-slate-600
    opacity-50;
}
</style>
