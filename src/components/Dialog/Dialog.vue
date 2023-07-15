<script setup lang="ts">
import { ref } from 'vue'

const dialog = ref<HTMLDialogElement | null>(null)

defineExpose({
  dialog
})
</script>

<template>
  <dialog ref="dialog">
    <slot />
  </dialog>
</template>
