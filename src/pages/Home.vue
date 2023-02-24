<script setup lang="ts">
import { ref } from 'vue'
import router from '../router'
import { useUserStore } from '../stores/user'

const user = useUserStore()

const hasLoading = ref(false)
const message = ref('')

const signOut = async () => {
  try {
    hasLoading.value = true
    message.value = ''

    const { error } = await user.signOut()

    if (error) {
      throw error
    }

    router.push({ name: 'Auth' })
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
