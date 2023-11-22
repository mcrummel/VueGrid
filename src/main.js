import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import './style.css'
import App from './App.vue'

import { routes } from './routing/router'

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)

console.log(routes)

app
  .use(router)
  .mount('#app')
