import Layout from '@/layout/index.vue'

const himoAppealCenter = {
  path: '/himo-appeal-center',
  component: Layout,
  name: 'HimoAppealCenter',
  redirect: '/himo-appeal-center/himo-makeup-appeal',
  meta: { title: '海马体申述中心', icon: 'el-icon-s-custom' },
  children: [
    {
      path: 'himo-makeup-appeal',
      name: 'HimoMakeupAppeal',
      // eslint-disable-next-line max-len
      component: () => import(/* webpackChunkName: "HimoMakeupAppeal" */ '@/views/himo-appeal-center/himo-makeup-appeal.vue'),
      meta: { title: '化妆申述', icon: '', breadcrumb: true }
    },
    {
      path: 'himo-photography-appeal',
      name: 'HimoPhotographyAppeal',
      // eslint-disable-next-line max-len
      component: () => import(/* webpackChunkName: "HimoPhotographyAppeal" */ '@/views/himo-appeal-center/himo-photography-appeal.vue'),
      meta: { title: '摄影申述', icon: '', breadcrumb: true }
    },
    {
      path: 'himo-appeal-history',
      name: 'HimoAppealHistory',
      // eslint-disable-next-line max-len
      component: () => import(/* webpackChunkName: "HimoAppealHistory" */ '@/views/himo-appeal-center/himo-appeal-history.vue'),
      meta: { title: '申诉历史记录', icon: '', breadcrumb: true }
    },
    {
      path: 'himo-appeal-detail',
      name: 'HimoAppealDetail',
      // eslint-disable-next-line max-len
      component: () => import(/* webpackChunkName: "HimoAppealDetail" */ '@/views/himo-appeal-center/himo-appeal-detail.vue'),
      meta: { title: '申诉详情', icon: '', breadcrumb: true, hidden: true }
    }
  ]
}

export default himoAppealCenter
