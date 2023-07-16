<script setup lang="ts">
import { DIALOG_VALUES } from '.'
import DialogHeader from './DialogHeader.vue'
import DialogContent from './DialogContent.vue'
import DialogFooter from './DialogFooter.vue'

const props = withDefaults(defineProps<{
  message?: string,
  title?: string,
  confirmCaption?: string,
  cancelCaption?: string
}>(), {
  message: '',
  title: '',
  confirmCaption: 'Да',
  cancelCaption: 'Нет'
})
</script>

<template>
  <form method="dialog">
    <DialogHeader v-if="props.title || $slots.title">
      <slot name="title">
        {{ props.title }}
      </slot>
    </DialogHeader>

    <DialogContent>
      <slot>
        {{ props.message }}
      </slot>
    </DialogContent>

    <DialogFooter>
      <menu class="actions">
        <button
          class="button button-sm button-danger"
          type="submit"
          :value="DIALOG_VALUES.CANCEL"
          autofocus
        >
          {{ props.cancelCaption }}
        </button>

        <button
          class="button button-sm button-primary"
          type="submit"
          :value="DIALOG_VALUES.CONFIRM"
        >
          {{ props.confirmCaption }}
        </button>
      </menu>
    </DialogFooter>
  </form>
</template>

<style scoped>
.actions {
  @apply
    grid
    items-center
    justify-end
    gap-2;

  grid-template-columns: auto auto;
}
</style>
