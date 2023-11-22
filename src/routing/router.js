import HomeComponent from '../HomeComponent.vue'
import demoRoutes from './demoRoutes.js'

export const routes = [
  {
    name: 'home',
    path: '/',
    component: HomeComponent
  },
  ...demoRoutes
]
