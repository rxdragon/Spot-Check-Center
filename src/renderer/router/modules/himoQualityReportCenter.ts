import Layout from '@/layout/index.vue'

const textCenter = {
  path: '/himo-quality-report-center',
  component: Layout,
  name: 'HimoQualityCenter',
  redirect: '/himo-quality-report-center/makeup-quality-report',
  meta: { title: '海马体质检报告中心', icon: 'el-icon-s-custom' },
  children: [
    {
      path: 'makeup-quality-report',
      name: 'MakeupQualityReport',
      // eslint-disable-next-line max-len
      component: () => import(/* webpackChunkName: "MakeupQualityReport" */ '@/views/himo-quality-report-center/makeup-quality-report.vue'),
      meta: { title: '化妆质检报告（全员）', icon: '', breadcrumb: true }
    },
    {
      path: 'photography-quality-report',
      name: 'PhotographyQualityReport',
      // eslint-disable-next-line max-len
      component: () => import(/* webpackChunkName: "PhotographyQualityReport" */ '@/views/himo-quality-report-center/photography-quality-report.vue'),
      meta: { title: '摄影质检报告（全员）', icon: '', breadcrumb: true }
    }
  ]
}

export default textCenter
