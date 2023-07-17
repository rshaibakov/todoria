<script setup lang="ts">
import { ref } from 'vue'

const dialog = ref<HTMLDialogElement | null>(null)

defineExpose({
  dialog
})

const onClick = (event: Event) => {
  const target = event.target as HTMLElement

  if (target?.nodeName === 'DIALOG') {
    dialog.value?.close()
  }
}
</script>

<template>
  <dialog
    ref="dialog"
    class="dialog"
    @click="onClick"
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
