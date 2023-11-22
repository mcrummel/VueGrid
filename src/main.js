import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import './style.css'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPlus, faMagnifyingGlass, faPencil, faTrashCan } from '@fortawesome/free-solid-svg-icons'

import App from './App.vue'

import { routes } from './routing/router'
library.add(faPlus, faMagnifyingGlass, faPencil, faTrashCan)

const router = createRouter({
  history: createWebHistory(),
  routes
})

createApp(App)
  .use(router)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app')
