import Layout from '@/layout/index.vue'

const FamilyMakeupEvaluateCenter = {
  path: '/family-makeup-evaluate-center',
  component: Layout,
  name: 'FamilyMakeupEvaluateCenter',
  redirect: '/family-makeup-evaluate-center/family-makeup-evaluate',
  meta: { title: 'Family化妆评价中心', icon: 'el-icon-edit' },
  children: [
    {
      path: 'family-makeup-evaluate',
      name: 'FamilyMakeupEvaluate',
      // eslint-disable-next-line max-len
      component: () => import(/* webpackChunkName: "FamilyMakeupEvaluate" */ '@/views/family-makeup-evaluate-center/family-makeup-evaluate.vue'),
      meta: { title: '化妆评价', icon: '', breadcrumb: true }
    },
    {
      path: 'family-makeup-evaluate-history',
      name: 'FamilyMakeupEvaluateHistory',
      // eslint-disable-next-line max-len
      component: () => import(/* webpackChunkName: "FamilyMakeupEvaluateHistory" */ '@/views/family-makeup-evaluate-center/family-makeup-evaluate-history.vue'),
      meta: { title: '评价历史记录', icon: '', breadcrumb: true }
    },
    {
      path: 'family-makeup-evaluate-config',
      name: 'FamilyMakeupEvaluateConfig',
      // eslint-disable-next-line max-len
      component: () => import(/* webpackChunkName: "FamilyMakeupEvaluateHistory" */ '@/views/family-makeup-evaluate-center/family-makeup-evaluate-config.vue'),
      meta: { title: '评分项配置', icon: '', breadcrumb: true }
    }
  ]
}

export default FamilyMakeupEvaluateCenter
