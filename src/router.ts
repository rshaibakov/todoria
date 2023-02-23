import { createRouter, createWebHistory } from 'vue-router'

import Home from './pages/Home.vue'
import Auth from './pages/Auth.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/auth', component: Auth }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
