import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Roles from '../components/purview/Roles.vue'
import Rights from '../components/purview/Rights.vue'
import Goods from '../components/commodity/Goods.vue'
import Params from '../components/commodity/Params.vue'
import Categories from '../components/commodity/Categories.vue'
import Orders from '../components/board/Orders.vue'
import Reports from '../components/Statistics/Reports.vue'
Vue.use(VueRouter)

// 路由规则
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/roles', component: Roles },
      { path: '/rights', component: Rights },
      { path: '/goods', component: Goods },
      { path: '/params', component: Params },
      { path: '/categories', component: Categories },
      { path: '/orders', component: Orders },
      { path: '/reports', component: Reports }
    ]
  }
]

// 实例化路由
const router = new VueRouter({
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 判断是否前往登录页面
  if (to.fullPath === '/login') return next()
  // 如果不是前往登录页面，则判断是否登录
  const token = window.sessionStorage.getItem('token')
  // 已登录则放行
  if (token) return next()
  // 未登录强制跳转至登录页面
  next('/login')
})

export default router
