// TODO lj
// import axios from '@/plugins/axios'
import { ORGANIZATION_TYPE } from '@/model/Enumerate'

export interface IcreateAppealParams {
  serviceType: string
  serviceId: string
  appealContent: string[]
  note: string
  remark?: string
}

/**
 * @description 发起申诉
 */
export async function createAppeal (params: IcreateAppealParams, axiosType: string) {
  let url
  switch (axiosType) {
    case ORGANIZATION_TYPE.HIMO:
      url = '/project_photo_quality/checkPool/familyAppeal/createAppeal'
      break
    case ORGANIZATION_TYPE.FAMILY:
      url = '/project_photo_quality/checkPool/himoAppeal/createAppeal'
      break
    default:
      break
  }
  return url
  // await axios({
  //   url,
  //   method: 'POST',
  //   params
  // })
}
