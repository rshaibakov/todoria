<script setup lang="ts">
import { supabase } from '../db'
import { ref } from 'vue'

const hasLoading = ref(true)
const message = ref('')

const signOut = async () => {
  try {
    hasLoading.value = true
    message.value = ''

    const { error } = await supabase.auth.signOut()

    if (error) {
      throw error
    }
  } catch (error) {
    if (error instanceof Error) {
      message.value = error.message
    }
  } finally {
    hasLoading.value = false
  }
}
</script>

<template>
  <div>
    <button
      :disabled="hasLoading"
      @click="signOut"
    >
      Выйти
    </button>

    <div v-if="message">
      {{ message }}
    </div>
  </div>
</template>
