import { App } from 'vue'
import setupPinia from './pinia'
import router from '@/router'

export function setupPlugins(app: App) {
  setupPinia(app)
  app.use(router)
}
