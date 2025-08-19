import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
const pinia = createPinia()
const app = createApp(App)
const queryClient = new QueryClient()

app.use(VueQueryPlugin, {
  queryClient,
})

app.use(pinia)
app.mount('#app')
