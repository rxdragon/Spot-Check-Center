import axios from '@/plugins/axios'

/**
 * @description 获取七牛云接口
 * @param {*} params
 */
export async function getSignature () {
  const res = await axios({
    url: '/project_cloud/photoManager/getUploadToken',
    method: 'GET'
  })
  const createData = {
    token: res
  }
  return createData
}
