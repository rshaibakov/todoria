<script setup lang="ts">
const props = defineProps<{ glyph: string }>()
</script>

<template>
  <svg aria-hidden="true">
    <use :href="`#${props.glyph}`" />
  </svg>
</template>
