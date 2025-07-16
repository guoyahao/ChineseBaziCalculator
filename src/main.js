import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './components/Home.vue'
import BaZi from './components/BaZi.vue'
import LiuYao from './components/LiuYao.vue'
import Calendar from './components/Calendar.vue'
import LiuYaoFishing from './components/LiuYaoFishing.vue'
import EnhancedLiuYao from './components/EnhancedLiuYao.vue'
import ZiWei from './components/ZiWei.vue'
const routes = [
  { path: '/', component: Home },
  { path: '/bazi', component: BaZi },
  { path: '/liuyao', component: LiuYao },
  { path: '/calendar', component: Calendar },
  { path: '/enhanced-liuyao', component: EnhancedLiuYao },
  { path: '/fishing-liuyao', component: LiuYaoFishing },
  { path: '/ziwei', component: ZiWei }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
app.use(router)
app.mount('#app') 