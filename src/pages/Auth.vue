<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '../stores/user'

const user = useUserStore()

const email = ref('')
const message = ref('')

const signIn = async () => {
  try {
    user.hasLoading = true
    message.value = ''

    const { error } = await user.signIn(email.value)

    if (error) {
      throw error
    }

    message.value = 'Ссылка для входа отправлена на почту'
  } catch (error) {
    if (error instanceof Error) {
      message.value = 'Произошла ошибка при отправлении ссылки. Попробуйте снова'
    }
  } finally {
    user.hasLoading = false
  }
}
</script>

<template>
  <form @submit.prevent="signIn">
    <div>
      <h1>Вход</h1>

      <div>
        <input
          v-model="email"
          type="email"
          placeholder="Твой email"
          required
        >
      </div>

      <div>
        <button
          type="submit"
          :disabled="user.hasLoading"
        >
          {{ user.hasLoading ? 'Загрузка' : 'Получить ссылку' }}
        </button>

        <div v-if="message">
          {{ message }}
        </div>
      </div>
    </div>
  </form>
</template>
