<script setup lang="ts">
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

    <button
      class="button button-sm button-primary"
      type="submit"
    >
      Добавить
    </button>
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
</style>
