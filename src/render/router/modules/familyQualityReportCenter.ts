import Layout from '@/layout/index.vue'

const FamilyQualityReportCenter = {
  path: '/family-quality-report-center',
  component: Layout,
  name: 'FamilyQualityReportCenter',
  redirect: '/family-quality-report-center/family-makeup-quality-report',
  meta: { title: 'Family质检报告中心', icon: 'el-icon-s-custom' },
  children: [
    {
      path: 'family-makeup-quality-report',
      name: 'FamilyMakeupQualityReport',
      // eslint-disable-next-line max-len
      component: () => import(/* webpackChunkName: "FamilyMakeupQualityReport" */ '@/views/family-quality-report-center/family-makeup-quality-report.vue'),
      meta: { title: '化妆质检报告（全员）', icon: '', breadcrumb: true }
    },
    {
      path: 'family-makeup-quality-report-area',
      name: 'FamilyMakeupQualityReportArea',
      // eslint-disable-next-line max-len
      component: () => import(/* webpackChunkName: "FamilyMakeupQualityReportArea" */ '@/views/family-quality-report-center/family-makeup-quality-report-area.vue'),
      meta: { title: '化妆质检报告（区域）', icon: '', breadcrumb: true }
    },
    {
      path: 'family-photography-quality-report',
      name: 'FamilyPhotographyQualityReport',
      // eslint-disable-next-line max-len
      component: () => import(/* webpackChunkName: "FamilyPhotographyQualityReport" */ '@/views/family-quality-report-center/family-photography-quality-report.vue'),
      meta: { title: '摄影质检报告（全员）', icon: '', breadcrumb: true }
    },
    {
      path: 'family-photography-quality-report-area',
      name: 'FamilyPhotographyQualityReportArea',
      // eslint-disable-next-line max-len
      component: () => import(/* webpackChunkName: "FamilyPhotographyQualityReportArea" */ '@/views/family-quality-report-center/family-photography-quality-report-area.vue'),
      meta: { title: '摄影质检报告（区域）', icon: '', breadcrumb: true }
    },
  ]
}

export default FamilyQualityReportCenter
