<script setup lang="ts">
import { ref } from 'vue'
import router from '../router'
import { useUserStore } from '../stores/user'

const user = useUserStore()

const message = ref('')

const signOut = async () => {
  try {
    user.hasLoading = true
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
    user.hasLoading = false
  }
}
</script>

<template>
  <div>
    <button
      :disabled="user.hasLoading"
      @click="signOut"
    >
      {{ user.hasLoading ? 'Загрузка' : 'Выйти' }}
    </button>

    <div v-if="message">
      {{ message }}
    </div>
  </div>
</template>
