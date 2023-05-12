import { type Session, type User } from '@supabase/supabase-js'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../db'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const hasLoading = ref(false)
  const isAuth = computed(() => session.value !== null)

  const signIn = async (email: string) => {
    return await supabase.auth.signInWithOtp({ email })
  }

  const signOut = async () => {
    return await supabase.auth.signOut()
  }

  // TODO: Разбить на разные функции для получения данных о пользователе и сессии
  const checkAuth = async () => {
    const { data } = await supabase.auth.getSession()

    session.value = data.session

    if (data.session !== null) {
      user.value = data.session.user
    }

    return session.value !== null
  }

  return {
    user,
    session,
    hasLoading,
    isAuth,
    signIn,
    signOut,
    checkAuth
  }
})
