<script setup lang="ts">
const emit = defineEmits(['cancel'])
</script>

<template>
  <form class="form">
    <input
      class="text-field"
      type="text"
      placeholder="Название"
    >

    <textarea
      class="text-field"
      placeholder="Описание"
    />

    <input
      class="text-field"
      type="date"
    >

    <footer class="actions">
      <button
        class="button button-sm"
        type="button"
        @click="emit('cancel')"
      >
        Отмена
      </button>

      <button
        class="button button-sm button-primary"
        type="submit"
      >
        Добавить
      </button>
    </footer>
  </form>
</template>

<style scoped>
.form {
  @apply
    px-4
    py-4
    grid
    gap-4
    bg-white
    rounded;
}

.actions {
  @apply
    flex
    justify-end;
}
</style>
