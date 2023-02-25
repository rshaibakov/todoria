<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '../stores/user'

const user = useUserStore()

const email = ref('')
const message = ref('Ссылка для входа отправлена на почту')

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
  <section class="root">
    <form
      class="form"
      @submit.prevent="signIn"
    >
      <h1 class="h1">
        Вход
      </h1>

      <div class="fields">
        <input
          v-model="email"
          class="text-field"
          type="email"
          placeholder="Твой email"
          required
        >

        <button
          class="button-primary"
          type="submit"
          :disabled="user.hasLoading"
        >
          {{ user.hasLoading ? 'Загрузка...' : 'Получить ссылку' }}
        </button>
      </div>

      <div
        v-if="message"
        class="message"
      >
        {{ message }}
      </div>
    </form>
  </section>
</template>

<style scoped>
.root {
  @apply
    flex
    justify-center
    items-center
    w-full
    h-full;
}

.form {
  @apply
    w-full
    px-6;
}

.fields {
  @apply
    flex
    flex-wrap
    mb-2;
}

.text-field {
  @apply
    w-full
    mb-4;
}

.message {
  @apply
    text-sm
    text-gray-500;
}

.button-primary {
  @apply w-full;
}

@screen md {
  .form {
    width: 600px;
  }

  .fields {
    @apply flex-nowrap;
  }

  .text-field {
    @apply
      flex-grow
      w-auto
      mb-0
      mr-4;
  }

  .button-primary {
    width: 180px;
  }
}
</style>
