// TODO lj
import axios from '@/plugins/axios'
import { ORGANIZATION_TYPE } from '@/model/Enumerate'
import { AppealListModel } from '@/model/AppealModel'
import AppealDetailModel from '@/model/AppealDetailModel'

interface ICreateAppealParams {
  serviceType: string
  serviceId: string
  appealContent: string[]
  note: string
  remark?: string
}

/**
 * @description 根据机构类型获取不同地址
 * @returns 
 */
export function getApiUrl (organizationType: ORGANIZATION_TYPE) {
  switch (organizationType) {
    case ORGANIZATION_TYPE.HIMO:
      return '/project_photo_quality/checkPool/himoAppeal'
    case ORGANIZATION_TYPE.FAMILY:
      return '/project_photo_quality/checkPool/familyAppeal'
    default:
      return ''
  }
}

/**
 * @description 发起申诉
 */
export async function createAppeal (params: ICreateAppealParams, axiosType: ORGANIZATION_TYPE) {
  // eslint-disable-next-line no-unused-vars
  const url = `${getApiUrl(axiosType)}/createAppeal`
  await axios({
    url,
    method: 'POST',
    data: params
  })
}

export interface IGetAppealParams {
  startAt?: string
  endAt?: string
  cloudOrderNum?: string
  serviceType?: string
  appealStatus?: string[]
  inputStaffId?: string,
  staffIds?: string[],
  supervisorArr?: string[],
  page: number
  pageSize: number
}


/**
 * @description 获取申诉列表
 */
export async function getAppealByPage (params: IGetAppealParams, axiosType: ORGANIZATION_TYPE) {
  // eslint-disable-next-line no-unused-vars
  const url = `${getApiUrl(axiosType)}/getAppealByPage`
  const res: any = await axios({
    url,
    method: 'POST',
    data: params
  })
  // const res = {
  //   "msg": [
  //     {
  //       "applicant": 605268,
  //       "created_at": "2021-01-01 00:00:00",
  //       "first_pass_at": "2021-01-01 00:00:00",
  //       "first_reviewer": {
  //         "id": 605268,
  //         "name": "aa"
  //       },
  //       "first_reviewer_id": 605268,
  //       "id": 1,
  //       "note": "xxx",
  //       "result": "refusal",
  //       "second_pass_at": "2021-01-01 00:00:00",
  //       "second_reviewer": {
  //         "id": 605268,
  //         "name": "aa"
  //       },
  //       "second_reviewer_id": 605268,
  //       "status": "wait_first_appeal",
  //       "streamOrder": {
  //         "dresser_note": "dresser_note",
  //         "dressers": {
  //           "experts": [
  //             {
  //               "id": 1,
  //               "name": "化妆组长",
  //               "nickname": "化妆组长"
  //             }
  //           ],
  //           "group_leader": [
  //             {
  //               "id": 1,
  //               "name": "化妆组长",
  //               "nickname": "化妆组长"
  //             }
  //           ],
  //           "id": 1,
  //           "nickname": "aa",
  //           "supervisor": [
  //             {
  //               "id": 1,
  //               "name": "化妆组长",
  //               "nickname": "化妆组长"
  //             }
  //           ]
  //         },
  //         "order_note": "order_note",
  //         "order_num": "T2021060710222011",
  //         "photoNum": 8,
  //         "photography_note": "photography_note",
  //         "product": {
  //           "id": 8,
  //           "name": "精致证件照 - 侧身"
  //         },
  //         "store": {
  //           "id": 1006,
  //           "name": "宁波天一广场店",
  //           "store_type": "blue"
  //         }
  //       },
  //       "type": "makeup"
  //     }
  //   ],
  //   "success": true
  // }

  const createData: AppealListModel[] = res.items.map((appealItem: any) => {
    const appealListModel = new AppealListModel(appealItem)
    return appealListModel
  })
  return {
    list: createData,
    total: res.count
  }
}

/**
* @description 获取申诉绩效
*/
export async function getAppealQuota (params: IGetAppealParams, axiosType: ORGANIZATION_TYPE) {
  const url = `${getApiUrl(axiosType)}/getAppealQuota`
  const res = await axios({
    url,
    method: 'POST',
    data: params
  })
  return {
    count: _.get(res, 'count') || 0,
    refuseCount: _.get(res, 'refuseCount') || 0
  }
}

/**
* @description 获取申诉详情
*/
interface IGetAppealDetailParams {
  id: string
}
export async function getAppealDetail (params: IGetAppealDetailParams, axiosType: ORGANIZATION_TYPE) {
  // eslint-disable-next-line no-unused-vars
  const url = `${getApiUrl(axiosType)}/appealDetail`
  const res: any = await axios({
    url,
    method: 'GET',
    params
  })
  const createData: AppealDetailModel = new AppealDetailModel(res)
  return createData
}

/**
* @description 获取申诉详情
*/
interface IGetAppealCountParams {
  serviceType: string
}
export async function getAppealCount (params: IGetAppealCountParams, axiosType: ORGANIZATION_TYPE) {
  // eslint-disable-next-line no-unused-vars
  const url = `${getApiUrl(axiosType)}/getAppealCount`
  const res = await axios({
    url,
    method: 'POST',
    data: params
  })
  const createData = {
    firstCount: _.get(res, 'firstCount') || 0,
    secondCount: _.get(res, 'secondCount') || 0,
    total: _.get(res, 'total') || 0
  }
  
  return createData
}


export interface IExamineParams {
  id: number
  result: string
  note?: string
}
/**
* @description 初审审核
*/
export async function examineFirst (params: IExamineParams, axiosType: ORGANIZATION_TYPE) {
  // eslint-disable-next-line no-unused-vars
  const url = `${getApiUrl(axiosType)}/examineFirst`
  const res = await axios({
    url,
    method: 'POST',
    data: params
  })
  return res
}

/**
* @description 复审审核
*/
export async function examineSecond (params: IExamineParams, axiosType: ORGANIZATION_TYPE) {
  // eslint-disable-next-line no-unused-vars
  const url = `${getApiUrl(axiosType)}/examineSecond`
  const res = await axios({
    url,
    method: 'POST',
    data: params
  })
  return res
}

/**
* @description 初审绑定
*/
export async function bindFirst (params: IGetAppealDetailParams, axiosType: ORGANIZATION_TYPE) {
  const url = `${getApiUrl(axiosType)}/bindFirst`
  const res = await axios({
    url,
    method: 'POST',
    data: params
  })

  return res
}

/**
* @description 复审绑定
*/
export async function bindSecond (params: IGetAppealDetailParams, axiosType: ORGANIZATION_TYPE) {
  // eslint-disable-next-line no-unused-vars
  const url = `${getApiUrl(axiosType)}/bindSecond`
  const res = await axios({
    url,
    method: 'POST',
    data: params
  })
  
  return res
}

/**
 * @description 获取申诉历史记录
 */
export async function getAppealHistory (params: IGetAppealParams, axiosType: ORGANIZATION_TYPE) {
  // eslint-disable-next-line no-unused-vars
  const url = `${getApiUrl(axiosType)}/getAppealHistory`
  const res: any = await axios({
    url,
    method: 'POST',
    data: params
  })

  const createData: AppealListModel[] = res.items.map((appealItem: any) => {
    const appealListModel = new AppealListModel(appealItem)
    return appealListModel
  })
  return {
    list: createData,
    total: res.count
  }
}
