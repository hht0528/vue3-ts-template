import { createApp } from 'vue'
import App from './App.vue'
import './styles/index.less'
import { setupPlugins } from './plugins'

async function bootstrap() {
  const app = createApp(App)
  setupPlugins(app)

  app.mount('#app')
}
bootstrap()
