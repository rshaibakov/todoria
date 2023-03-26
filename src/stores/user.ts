import { type Session } from '@supabase/supabase-js'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../db'

export const useUserStore = defineStore('user', () => {
  const session = ref<Session | null>(null)
  const hasLoading = ref(false)
  const isAuth = computed(() => session.value !== null)

  const signIn = async (email: string) => {
    return await supabase.auth.signInWithOtp({ email })
  }

  const signOut = async () => {
    return await supabase.auth.signOut()
  }

  const checkAuth = async () => {
    const { data } = await supabase.auth.getSession()
    session.value = data.session

    return session.value !== null
  }

  return {
    session,
    hasLoading,
    isAuth,
    signIn,
    signOut,
    checkAuth
  }
})
