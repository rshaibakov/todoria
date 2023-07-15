<script setup lang="ts">
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
    <header v-if="props.title">
      {{ title }}
    </header>

    <article v-bind="$attrs">
      <template v-if="$slots.default">
        <slot />
      </template>

      <template v-else>
        {{ props.message }}
      </template>
    </article>

    <footer>
      <menu>
        <button
          type="submit"
          value="cancel"
          autofocus
        >
          {{ props.cancelCaption }}
        </button>

        <button
          type="submit"
          value="confirm"
        >
          {{ props.confirmCaption }}
        </button>
      </menu>
    </footer>
  </form>
</template>
