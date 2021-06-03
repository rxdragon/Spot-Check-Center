import Layout from '@/layout/index.vue'

const himoMakeupEvaluateCenter = {
  path: '/himo-makeup-evaluate-center',
  component: Layout,
  name: 'HimoMakeupEvaluateCenter',
  redirect: '/himo-makeup-evaluate-center/himo-makeup-evaluate',
  meta: { title: '海马体化妆评价中心', icon: 'el-icon-s-custom' },
  children: [
    {
      path: 'himo-makeup-evaluate',
      name: 'HimoMakeupEvaluate',
      // eslint-disable-next-line max-len
      component: () => import(/* webpackChunkName: "HimoMakeupEvaluate" */ '@/views/himo-makeup-evaluate-center/himo-makeup-evaluate.vue'),
      meta: { title: '化妆评价', icon: '', breadcrumb: true }
    },
    {
      path: 'himo-makeup-evaluate-history',
      name: 'HimoMakeupEvaluateHistory',
      // eslint-disable-next-line max-len
      component: () => import(/* webpackChunkName: "HimoMakeupEvaluateHistory" */ '@/views/himo-makeup-evaluate-center/himo-makeup-evaluate-history.vue'),
      meta: { title: '评价历史记录', icon: '', breadcrumb: true }
    },
    {
      path: 'himo-makeup-evaluate-config',
      name: 'HimoMakeupEvaluateConfig',
      // eslint-disable-next-line max-len
      component: () => import(/* webpackChunkName: "HimoMakeupEvaluateHistory" */ '@/views/himo-makeup-evaluate-center/himo-makeup-evaluate-config.vue'),
      meta: { title: '评分项配置', icon: '', breadcrumb: true }
    }
  ]
}

export default himoMakeupEvaluateCenter
