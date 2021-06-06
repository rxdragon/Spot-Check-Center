import type { App } from 'vue'

import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue' // 布局

import himoMakeupEvaluateCenter from './modules/himoMakeupEvaluateCenter' // 海马体化妆评价中心
import himoPhotographyEvaluateCenter from './modules/himoPhotographyEvaluateCenter' // 海马体摄影评价中心
import familyMakeupEvaluateCenter from './modules/familyMakeupEvaluateCenter' // family化妆评价中心
import familyPhotographyEvaluateCenter from './modules/familyPhotographyEvaluateCenter' // family摄影评价中心
import familyQualityReportCenter from './modules/familyQualityReportCenter' // family质检报告中心
import himoQualityReportCenter from './modules/himoQualityReportCenter' // 海马体质检报告中心
import himoAppealCenter from './modules/himoAppealCenter' // 海马体申诉中心
import familyAppealCenter from './modules/familyAppealCenter' // family申诉中心
import accountManage from './modules/accountManage' // 权限管理

const base = window.__POWERED_BY_QIANKUN__ ? `/${__APP_INFO__.pkg.name}` : ''

/**
 * @description 更具是否是微前端来判断前面是否加前缀
 * @param routes
 * @returns
 */
function filterRoutes (routes: Array<RouteRecordRaw>) {
  const res: Array<RouteRecordRaw> = []
  routes.forEach((route: RouteRecordRaw) => {
    const tmp = { ...route }
    if (tmp.path) tmp.path = `${base}${tmp.path}`
    if (tmp.redirect) tmp.redirect = `${base}${tmp.redirect}`
    res.push(tmp)
  })
  return res
}

// 基础路由，不需要权限
const baseConstantRoutes: Array<RouteRecordRaw> = [
  {
    path: '/redirect',
    name: 'Redirect',
    component: Layout,
    meta: {
      title: 'Redirect',
      hidden: true
    },
    children: [
      {
        path: '/redirect/:path(.*)',
        name: 'Redirect',
        component: () => import('@/views/redirect/index.vue'),
        meta: {
          title: 'Redirect',
          hideBreadcrumb: true
        }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/login/login.vue'),
    meta: { hidden: true }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import(/* webpackChunkName: "home" */ '@/views/home/home.vue'),
        meta: { title: '概况', icon: 'el-icon-s-home', affix: true }
      }
    ]
  },
  {
    path: '/401',
    component: () => import(/* webpackChunkName: "401" */ '@/views/error-page/401.vue'),
    meta: { hidden: true }
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import(/* webpackChunkName: "404" */ '@/views/error-page/404.vue'),
    meta: { hidden: true }
  }
]
export const constantRoutes = filterRoutes(baseConstantRoutes)

const baseAsyncRoutes = [
  himoMakeupEvaluateCenter,
  himoPhotographyEvaluateCenter,
  familyMakeupEvaluateCenter,
  familyPhotographyEvaluateCenter,
  himoQualityReportCenter,
  familyQualityReportCenter,
  himoAppealCenter,
  familyAppealCenter,
  accountManage
]

export const asyncRoutes = filterRoutes(baseAsyncRoutes)

/**
 * @description 创建路由
 */

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior () {
    return {
      el: '#app',
      top: 0,
      left: 0,
      behavior: 'smooth'
    }
  },
  base,
  routes: constantRoutes
})

// url不变强制刷行
export function resetRouter () {
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

// 配置路由信息
export function setupRouter (app: App<Element>) {
  app.use(router)
}

export default router
