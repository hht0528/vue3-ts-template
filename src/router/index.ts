import 'nprogress/nprogress.css'
import nProgress from 'nprogress'
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const errorRoute = [
  {
    path: '/:pathMatch(.*)',
    component: () => import('@/views/404/index.vue'),
  },
] as RouteRecordRaw[]

//获取模块
const modules: Record<string, any> = import.meta.glob(['./modules/*.ts'], { eager: true })

const routes: RouteRecordRaw[] = []

//动态添加路由
Object.keys(modules).forEach((key) => {
  const module = modules[key].default

  routes.push(module)
})
routes.push(...errorRoute)

// 路由配置
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

const noStatusPage = ['/login', '/404']

//前置守卫
router.beforeEach(async (_to, _from, next) => {
  //进度条
  nProgress.start()

  //获取token
  // const token = sessionStorage.getItem('userInfo')
  // const userIsLogin = token ? true : false
  // if (userIsLogin || noStatusPage.includes(_to.path)) {
  //   next()
  // } else {
  //   next('/login')
  // }
  next()
})

//后置守卫
router.afterEach((_to) => {
  nProgress.done()
})
export default router
