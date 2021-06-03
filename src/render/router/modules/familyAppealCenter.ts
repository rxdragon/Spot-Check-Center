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
    }
  ]
}

export default familyAppealCenter
