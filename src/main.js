import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './styles/theme.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'

import App from './App.vue'
import router from './router/index.js'
import i18n from './i18n/index.js'

const app = createApp(App)
const pinia = createPinia()

// Register all Element Plus icons globally
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

const currentLocale = localStorage.getItem('locale') || 'zh-CN'

app.use(pinia)
app.use(router)
app.use(i18n)
app.use(ElementPlus, {
  locale: currentLocale === 'zh-CN' ? zhCn : en,
})

app.mount('#app')
