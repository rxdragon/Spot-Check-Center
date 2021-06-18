import Layout from '@/layout/index.vue'

const familyAppealCenter = {
  path: '/family-appeal-center',
  component: Layout,
  name: 'FamilyAppealCenter',
  redirect: '/family-appeal-center/family-makeup-appeal',
  meta: { title: 'Family申述中心', icon: 'el-icon-s-custom' },
  children: [
    {
      path: 'family-makeup-appeal',
      name: 'FamilyMakeupAppeal',
      // eslint-disable-next-line max-len
      component: () => import(/* webpackChunkName: "FamilyMakeupAppeal" */ '@/views/family-appeal-center/family-makeup-appeal.vue'),
      meta: { title: '化妆申述', icon: '', breadcrumb: true }
    },
    {
      path: 'family-photography-appeal',
      name: 'FamilyPhotographyAppeal',
      // eslint-disable-next-line max-len
      component: () => import(/* webpackChunkName: "FamilyPhotographyAppeal" */ '@/views/family-appeal-center/family-photography-appeal.vue'),
      meta: { title: '摄影申述', icon: '', breadcrumb: true }
    },
    {
      path: 'family-appeal-history',
      name: 'FamilyAppealHistory',
      // eslint-disable-next-line max-len
      component: () => import(/* webpackChunkName: "FamilyAppealHistory" */ '@/views/family-appeal-center/family-appeal-history.vue'),
      meta: { title: '申诉历史记录', icon: '', breadcrumb: true }
    },
    {
      path: 'family-appeal-detail',
      name: 'FamilyAppealDetail',
      // eslint-disable-next-line max-len
      component: () => import(/* webpackChunkName: "FamilyAppealDetail" */ '@/views/family-appeal-center/family-appeal-detail.vue'),
      meta: { title: '申诉详情', icon: '', breadcrumb: true, hidden: true }
    }
  ]
}

export default familyAppealCenter
