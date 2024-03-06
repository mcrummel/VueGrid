import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import './style.css'
import 'vue-grid/dist/style.css' // used when loading from the module

import { routes } from './routing/router'

import App from './App.vue'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faPlus, faMinus,
  faMagnifyingGlass,
  faPencil, faTrashCan,
  faRotate,
  faChevronRight, faChevronLeft
} from '@fortawesome/free-solid-svg-icons'
library.add(
  faPlus, faMinus,
  faMagnifyingGlass,
  faPencil, faTrashCan,
  faRotate,
  faChevronRight, faChevronLeft
)

const router = createRouter({
  history: createWebHistory(),
  routes
})

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
createApp(App)
  .use(router)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app')
