<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

import CurrentSprint from '../features/CurrentSprint/CurrentSprint.vue'

const router = useRouter()
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
  <div class="root">
    <header class="header">
      <button
        data-test-id="sign-out-button"
        class="button-primary"
        :disabled="user.hasLoading"
        @click="signOut"
      >
        {{ user.hasLoading ? 'Загрузка' : 'Выйти' }}
      </button>

      <div
        v-if="message"
        data-test-id="sign-out-message"
      >
        {{ message }}
      </div>
    </header>

    <CurrentSprint class="current-sprint" />
  </div>
</template>

<style scoped>
.root {
  @apply
    grid
    h-full;

  grid-template-areas:
    "header"
    "current-sprint";
  grid-template-rows: 56px 1fr;
}

.header {
  grid-area: header;
}

.current-sprint {
  grid-area: current-sprint;
}
</style>
