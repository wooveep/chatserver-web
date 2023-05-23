/*
 * @Author: cloudyi.li
 * @Date: 2023-03-23 13:51:37
 * @LastEditTime: 2023-05-22 12:14:05
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/main.ts
 */
import { createApp } from 'vue'
import App from './App.vue'
import { setupI18n } from './locales'
import { setupAssets, setupScrollbarStyle } from './plugins'
import { setupStore } from './store'
import { setupRouter } from './router'

async function bootstrap() {
  const app = createApp(App)
  setupStore(app)

  setupAssets()
  setupScrollbarStyle()

  setupI18n(app)

  await setupRouter(app)

  app.mount('#app')
}

bootstrap()
