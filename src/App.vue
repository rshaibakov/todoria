<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue'
import { RouterView, useRouter } from 'vue-router'

import { supabase } from './db'

const router = useRouter()

const session = ref()

onMounted(async () => {
  const { data } = await supabase.auth.getSession()
  session.value = data.session

  supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session
  })
})

watchEffect(async () => {
  router.push(session.value ? '/' : '/auth')
})
</script>

<template>
  <RouterView />
</template>
