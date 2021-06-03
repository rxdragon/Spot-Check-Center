import Layout from '@/layout/index.vue'

const FamilyPhotographyEvaluateCenter = {
  path: '/family-photography-evaluate-center',
  component: Layout,
  name: 'familyPhotographyEvaluateCenter',
  redirect: '/family-photography-evaluate-center/family-photography-evaluate',
  meta: { title: 'Family化妆评价中心', icon: 'el-icon-s-custom' },
  children: [
    {
      path: 'family-photography-evaluate',
      name: 'FamilyPhotographyEvaluate',
      // eslint-disable-next-line max-len
      component: () => import(/* webpackChunkName: "FamilyPhotographyEvaluate" */ '@/views/family-photography-evaluate-center/family-photography-evaluate.vue'),
      meta: { title: '摄影评价', icon: '', breadcrumb: true }
    },
    {
      path: 'family-photography-evaluate-history',
      name: 'FamilyPhotographyEvaluateHistory',
      // eslint-disable-next-line max-len
      component: () => import(/* webpackChunkName: "FamilyPhotographyEvaluateHistory" */ '@/views/family-photography-evaluate-center/family-photography-evaluate-history.vue'),
      meta: { title: '评价历史记录', icon: '', breadcrumb: true }
    },
    {
      path: 'family-photography-evaluate-config',
      name: 'FamilyPhotographyEvaluateConfig',
      // eslint-disable-next-line max-len
      component: () => import(/* webpackChunkName: "FamilyPhotographyEvaluateConfig" */ '@/views/family-photography-evaluate-center/family-photography-evaluate-config.vue'),
      meta: { title: '评分项配置', icon: '', breadcrumb: true }
    }
  ]
}

export default FamilyPhotographyEvaluateCenter
