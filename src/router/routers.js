import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../layout/index'

Vue.use(Router)
export const constantRouterMap = [
  {
    path: '/login',
    meta: { title: 'sign in', noCache: true },
    component: (resolve) => require(['@/views/login'], resolve),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'home',
        component: (resolve) => require(['@/views/home'], resolve),
        hidden: true
      },
      {
        path: '/userManagement',
        component: (resolve) => require(['@/views/UserManagement/user'], resolve),
        hidden: true
      }
    ]
  }
]

export default new Router({
  mode: 'history', // nginx服务器需要配置
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
