import Layout from '@/layout/index.vue'

const HimoPhotographyEvaluateCenter = {
  path: '/himo-photography-evaluate-center',
  component: Layout,
  name: 'HimoPhotographyEvaluateCenter',
  redirect: '/himo-photography-evaluate-center/himo-photography-evaluate',
  meta: { title: '海马体摄影评价中心', icon: 'el-icon-edit' },
  children: [
    {
      path: 'himo-photography-evaluate',
      name: 'HimoPhotographyEvaluate',
      // eslint-disable-next-line max-len
      component: () => import(/* webpackChunkName: "HimoPhotographyEvaluate" */ '@/views/himo-photography-evaluate-center/himo-photography-evaluate.vue'),
      meta: { title: '摄影评价', icon: '', breadcrumb: true }
    },
    {
      path: 'himo-photography-evaluate-history',
      name: 'HimoPhotographyEvaluateHistory',
      // eslint-disable-next-line max-len
      component: () => import(/* webpackChunkName: "HimoPhotographyEvaluateHistory" */ '@/views/himo-photography-evaluate-center/himo-photography-evaluate-history.vue'),
      meta: { title: '评价历史记录', icon: '', breadcrumb: true }
    },
    {
      path: 'himo-photography-evaluate-config',
      name: 'HimoPhotographyEvaluateConfig',
      // eslint-disable-next-line max-len
      component: () => import(/* webpackChunkName: "HimoPhotographyEvaluateConfig" */ '@/views/himo-photography-evaluate-center/himo-photography-evaluate-config.vue'),
      meta: { title: '评分项配置', icon: '', breadcrumb: true }
    }
  ]
}

export default HimoPhotographyEvaluateCenter
