import { type Session } from '@supabase/supabase-js'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../db'

export const useUserStore = defineStore('user', () => {
  const session = ref<Session | null>(null)
  const isAuth = computed(() => session.value !== null)

  const checkAuth = async () => {
    const { data } = await supabase.auth.getSession()
    session.value = data.session

    return session.value !== null
  }

  return {
    session,
    isAuth,
    checkAuth
  }
})
