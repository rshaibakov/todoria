<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '../db'

const hasLoading = ref(false)
const email = ref('')
const message = ref('')

const signIn = async () => {
  try {
    hasLoading.value = true
    message.value = ''

    const { error } = await supabase.auth.signInWithOtp({
      email: email.value
    })

    if (error) {
      throw error
    }

    message.value = 'Ссылка для входа отправлена на почту'
  } catch (error) {
    if (error instanceof Error) {
      message.value = 'Произошла ошибка при отправлении ссылки. Попробуйте снова'
    }
  } finally {
    hasLoading.value = false
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
          :disabled="hasLoading"
        >
          {{ hasLoading ? 'Загрузка' : 'Получить ссылку' }}
        </button>

        <div v-if="message">
          {{ message }}
        </div>
      </div>
    </div>
  </form>
</template>
