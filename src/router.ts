import { createRouter, createWebHistory } from 'vue-router'

import Home from './pages/Home.vue'
import Auth from './pages/Auth.vue'
import { useUserStore } from './stores/user'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/auth',
    name: 'Auth',
    component: Auth
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to) => {
  const { checkAuth } = useUserStore()
  const isAuth = await checkAuth()

  if (to.name !== 'Auth' && !isAuth) {
    return { name: 'Auth' }
  }

  if (to.name === 'Auth' && isAuth) {
    return { name: 'Home' }
  }
})

export default router
