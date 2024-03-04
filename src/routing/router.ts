import HomeComponent from '../HomeComponent.vue'
import demoRoutes from './demoRoutes'

const routes = [
  {
    name: 'home',
    path: '/',
    title: '',
    component: HomeComponent
  },
  ...demoRoutes
]

export { routes }
