import { createApp } from 'vue'
import { createPinia } from 'pinia'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import router from './router'
import App from './App.vue'
import './db'
import './style.css'

dayjs.locale('ru')

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.mount('#app')
