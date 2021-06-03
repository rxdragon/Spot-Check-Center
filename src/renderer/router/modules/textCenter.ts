import Layout from '@/layout/index.vue'

const textCenter = {
  path: '/text-center',
  component: Layout,
  name: 'TextCenter',
  redirect: '/text-center/text1',
  meta: { title: '测试中心', icon: 'el-icon-s-custom' },
  children: [
    {
      path: 'text1',
      name: 'text1',
      component: () => import('@/views/text-center/text1.vue'),
      meta: { title: '测试模块1', icon: '', breadcrumb: true }
    },
    {
      path: 'text2',
      name: 'text2',
      component: () => import('@/views/text-center/text2.vue'),
      meta: { title: '测试模块2', icon: '', breadcrumb: true }
    }
  ]
}

export default textCenter
