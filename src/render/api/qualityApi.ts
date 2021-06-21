// TODO lj
import axios from '@/plugins/axios'
import { ORGANIZATION_TYPE, SPOT_TYPE } from '@/model/Enumerate'
import EvaluateModel from '@/model/EvaluateModel'
import SpotQuotaModel from '@/model/SpotQuotaModel'
import { IEvaluateAPi } from '@/api/evaluateApi'

/**
 * @description 根据机构类型获取不同地址
 * @returns 
 */
export function getApiUrl (type: SPOT_TYPE, organizationType: ORGANIZATION_TYPE) {
  switch (`${organizationType}${type}`) {
    case `${ORGANIZATION_TYPE.HIMO}${SPOT_TYPE.MAKEUP}`:
      return '/project_photo_quality/himoMakeupPool'
    case `${ORGANIZATION_TYPE.HIMO}${SPOT_TYPE.PHOTOGRAPHY}`:
      return '/project_photo_quality/himoPhotographyPool'
    case `${ORGANIZATION_TYPE.FAMILY}${SPOT_TYPE.MAKEUP}`:
      return '/project_photo_quality/familyMakeupPool'
    case `${ORGANIZATION_TYPE.FAMILY}${SPOT_TYPE.PHOTOGRAPHY}`:
      return '/project_photo_quality/familyPhotographyPool'
    default:
      return ''
  }
}

export interface IgetQualityParams extends IEvaluateAPi {
  startTime: string
  endTime: string
  productIds?: number[],
  problemTagsIds?: string[],
  supervisorArr?: string[],
  staffIds?: string[],
  score?: number[],
  orderNum?: string,
  onlyNew?: boolean,
  onlyOld?: boolean,
  page?: number,
  pageSize?: number
}

export interface IGetReportRes {
  list: EvaluateModel[],
  total: number
}

/**
 * @description 质检报告评分明细(全员)
 * @param {*} params
 */
export async function getAllQualityReport (params: IgetQualityParams): Promise<IGetReportRes> {
  // TODO lj
  const url = `${getApiUrl(params.type, params.organizationType)}/getAllQualityReport`
  const res: any = await axios({
    url,
    method: 'POST',
    data: params
  })
  // const msg = { total: 10, data: [
  //   {
  //     "_batch": 0,
  //     "_id": "5d9efbffb725ac300d264ddc",
  //     "businessId": 2,
  //     "commitInfo": {
  //       "oldTakeStaffInfo": 1,
  //       "picUrl": "www.baidu.com",
  //       "score": 10,
  //       "tags": [
  //         {
  //           "id": 2,
  //           "weights": 1
  //         }
  //       ],
  //       "takeStaffNum": 1
  //     },
  //     "commitNum": 1,
  //     "createdTime": "2019-10-10 17:38:07",
  //     "oldTakeStaffInfo": {
  //       "name": 33,
  //       "real_name": 2,
  //       "retouch_group": 298
  //     },
  //     "operatorStaffId": 2,
  //     "photo_id": 2,
  //     "photos": [
  //       {
  //         "id": 1,
  //         "path": "path",
  //         "photo_quality": {
  //           "_id": "60b33237317fd376e7403cb3",
  //           "ai_state": "success",
  //           "audit_record_id": "60b33237317fd376e7403cb2",
  //           "extend": {
  //             "info_makeup": {
  //               "degree": 5,
  //               "label": []
  //             },
  //             "info_phtghy": {
  //               "degree": 5,
  //               "label": []
  //             }
  //           },
  //           "finish_time": "2021-05-30 14:35:36",
  //           "path": "2021/05/30/lgn0C2Z2vjdwaQ2xIJ-uhqjMeANH.jpg"
  //         }
  //       },
  //       {
  //         "id": 1,
  //         "path": "path",
  //         "photo_quality": {
  //           "_id": "60b33237317fd376e7403cb3",
  //           "ai_state": "success",
  //           "audit_record_id": "60b33237317fd376e7403cb2",
  //           "extend": {
  //             "info_makeup": {
  //               "degree": 5,
  //               "label": []
  //             },
  //             "info_phtghy": {
  //               "degree": 5,
  //               "label": []
  //             }
  //           },
  //           "finish_time": "2021-05-30 14:35:36",
  //           "path": "2021/05/30/lgn0C2Z2vjdwaQ2xIJ-uhqjMeANH.jpg"
  //         }
  //       },
  //       {
  //         "id": 1,
  //         "path": "path",
  //         "photo_quality": {
  //           "_id": "60b33237317fd376e7403cb3",
  //           "ai_state": "success",
  //           "audit_record_id": "60b33237317fd376e7403cb2",
  //           "extend": {
  //             "info_makeup": {
  //               "degree": 5,
  //               "label": []
  //             },
  //             "info_phtghy": {
  //               "degree": 5,
  //               "label": []
  //             }
  //           },
  //           "finish_time": "2021-05-30 14:35:36",
  //           "path": "2021/05/30/lgn0C2Z2vjdwaQ2xIJ-uhqjMeANH.jpg"
  //         }
  //       },
  //       {
  //         "id": 1,
  //         "path": "path",
  //         "photo_quality": {
  //           "_id": "60b33237317fd376e7403cb3",
  //           "ai_state": "success",
  //           "audit_record_id": "60b33237317fd376e7403cb2",
  //           "extend": {
  //             "info_makeup": {
  //               "degree": 5,
  //               "label": []
  //             },
  //             "info_phtghy": {
  //               "degree": 5,
  //               "label": []
  //             }
  //           },
  //           "finish_time": "2021-05-30 14:35:36",
  //           "path": "2021/05/30/lgn0C2Z2vjdwaQ2xIJ-uhqjMeANH.jpg"
  //         }
  //       },
  //       {
  //         "id": 1,
  //         "path": "path",
  //         "photo_quality": {
  //           "_id": "60b33237317fd376e7403cb3",
  //           "ai_state": "success",
  //           "audit_record_id": "60b33237317fd376e7403cb2",
  //           "extend": {
  //             "info_makeup": {
  //               "degree": 5,
  //               "label": []
  //             },
  //             "info_phtghy": {
  //               "degree": 5,
  //               "label": []
  //             }
  //           },
  //           "finish_time": "2021-05-30 14:35:36",
  //           "path": "2021/05/30/lgn0C2Z2vjdwaQ2xIJ-uhqjMeANH.jpg"
  //         }
  //       }
  //     ],
  //     "status": "commit",
  //     "streamOrder": {
  //       "dresser_note": "dresser_note",
  //       "dressers": {
  //         "experts": [
  //           {
  //             "id": 1,
  //             "name": "化妆组长",
  //             "nickname": "化妆组长"
  //           }
  //         ],
  //         "group_leader": [
  //           {
  //             "id": 1,
  //             "name": "化妆组长",
  //             "nickname": "化妆组长"
  //           }
  //         ],
  //         "supervisor": [
  //           {
  //             "id": 1,
  //             "name": "化妆组长",
  //             "nickname": "化妆组长"
  //           }
  //         ]
  //       },
  //       "order_note": "order_note",
  //       "order_num": "T2021060710222011",
  //       "photoNum": 8,
  //       "photography_note": "photography_note",
  //       "product": {
  //         "id": 8,
  //         "name": "精致证件照 - 侧身"
  //       },
  //       "store": {
  //         "id": 1006,
  //         "name": "宁波天一广场店",
  //         "store_type": "blue"
  //       }
  //     },
  //     "tags": [
  //       {
  //         "id": 2,
  //         "name": "a",
  //         "parent": {
  //           "id": 1,
  //           "name": "a",
  //           "score_type": null,
  //           "score_type_id": 1
  //         },
  //         "score": 64,
  //         "type": ""
  //       }
  //     ],
  //     "takeStaffInfo": {
  //       "name": 33,
  //       "real_name": 2,
  //       "retouch_group": 298
  //     },
      
  //   }, {
  //     "_batch": 0,
  //     "_id": "5d9efbffb725ac300d264ddc",
  //     "businessId": 2,
  //     "commitInfo": {
  //       "oldTakeStaffInfo": 1,
  //       "picUrl": "www.baidu.com",
  //       "score": 10,
  //       "tags": [
  //         {
  //           "id": 2,
  //           "weights": 1
  //         }
  //       ],
  //       "takeStaffNum": 1
  //     },
  //     "commitNum": 1,
  //     "createdTime": "2019-10-10 17:38:07",
  //     "oldTakeStaffInfo": {
  //       "name": 33,
  //       "real_name": 2,
  //       "retouch_group": 298
  //     },
  //     "operatorStaffId": 2,
  //     "photo_id": 2,
  //     "photos": [
  //       {
  //         "id": 1,
  //         "path": "path",
  //         "photo_quality": {
  //           "_id": "60b33237317fd376e7403cb3",
  //           "ai_state": "success",
  //           "audit_record_id": "60b33237317fd376e7403cb2",
  //           "extend": {
  //             "info_makeup": {
  //               "degree": 5,
  //               "label": []
  //             },
  //             "info_phtghy": {
  //               "degree": 5,
  //               "label": []
  //             }
  //           },
  //           "finish_time": "2021-05-30 14:35:36",
  //           "path": "2021/05/30/lgn0C2Z2vjdwaQ2xIJ-uhqjMeANH.jpg"
  //         }
  //       },
  //       {
  //         "id": 1,
  //         "path": "path",
  //         "photo_quality": {
  //           "_id": "60b33237317fd376e7403cb3",
  //           "ai_state": "success",
  //           "audit_record_id": "60b33237317fd376e7403cb2",
  //           "extend": {
  //             "info_makeup": {
  //               "degree": 5,
  //               "label": []
  //             },
  //             "info_phtghy": {
  //               "degree": 5,
  //               "label": []
  //             }
  //           },
  //           "finish_time": "2021-05-30 14:35:36",
  //           "path": "2021/05/30/lgn0C2Z2vjdwaQ2xIJ-uhqjMeANH.jpg"
  //         }
  //       }
  //     ],
  //     "status": "commit",
  //     "streamOrder": {
  //       "dresser_note": "dresser_note",
  //       "dressers": {
  //         "experts": [
  //           {
  //             "id": 1,
  //             "name": "化妆组长",
  //             "nickname": "化妆组长"
  //           }
  //         ],
  //         "group_leader": [
  //           {
  //             "id": 1,
  //             "name": "化妆组长",
  //             "nickname": "化妆组长"
  //           }
  //         ],
  //         "supervisor": [
  //           {
  //             "id": 1,
  //             "name": "化妆组长",
  //             "nickname": "化妆组长"
  //           }
  //         ]
  //       },
  //       "order_note": "order_note",
  //       "order_num": "T2021060710222011",
  //       "photoNum": 8,
  //       "photography_note": "photography_note",
  //       "product": {
  //         "id": 8,
  //         "name": "精致证件照 - 侧身"
  //       },
  //       "store": {
  //         "id": 1006,
  //         "name": "宁波天一广场店",
  //         "store_type": "blue"
  //       }
  //     },
  //     "tags": [
  //       {
  //         "id": 2,
  //         "name": "a",
  //         "parent": {
  //           "id": 1,
  //           "name": "a",
  //           "score_type": null,
  //           "score_type_id": 1
  //         },
  //         "score": 64,
  //         "type": ""
  //       }
  //     ],
  //     "takeStaffInfo": {
  //       "name": 33,
  //       "real_name": 2,
  //       "retouch_group": 298
  //     },
      
  //   }] }
  const data = res.data
  // if (!data.length) {
  //   return {
  //     list: [],
  //     allPhotoPath,
  //     // total: data.extend.processInfo[0].totalCount,
  //     pageTotal: data.total || null
  //   }
  // }
  const list: EvaluateModel[] = data.map((item: any) => {
    return new EvaluateModel(item)
  })
  const createData: IGetReportRes = {
    list: list,
    total: res.total
  }
  return createData
}

/**
 * @description 质检报告评分明细(区域)
 * @param {*} params
 */
export async function getAreaQualityReport (params: IgetQualityParams): Promise<IGetReportRes> {
  // TODO lj
  const url = `${getApiUrl(params.type, params.organizationType)}/getAreaQualityReport`
  const res: any = await axios({
    url,
    method: 'POST',
    data: params
  })
  const data = res.data
  const list: EvaluateModel[] = data.map((item: any) => {
    return new EvaluateModel(item)
  })
  const createData: IGetReportRes = {
    list: list,
    total: res.total
  }
  return createData
}

/**
 * @description 质检报告绩效(全员)
 * @param {*} params
 */
export async function getAllQuota (params: IgetQualityParams) {
  // TODO lj
  const url = `${getApiUrl(params.type, params.organizationType)}/getAllQuota`
  const res = await axios({
    url,
    method: 'POST',
    params
  })
  // const res = {
  //   "msg": {
  //     "avg": {
  //       "commitInfo.star": 4.5
  //     },
  //     "avg_group": {
  //       "store_id-commitInfo.total": [
  //         {
  //           "_id": 1,
  //           "result": 2
  //         },
  //         {
  //           "_id": 2,
  //           "result": 4
  //         }
  //       ]
  //     },
  //     "count": {
  //       "all": 2
  //     },
  //     "count_distinct": {
  //       "staff_id": 1,
  //       "store_id": 1
  //     },
  //     "count_unwind": {
  //       "problem_tags": [
  //         {
  //           "_id": 4,
  //           "value": 2
  //         },
  //         {
  //           "_id": 3,
  //           "value": 2
  //         },
  //         {
  //           "_id": 2,
  //           "value": 2
  //         },
  //         {
  //           "_id": 1,
  //           "value": 2
  //         }
  //       ]
  //     },
  //     "max": {
  //       "commitInfo.star": 5
  //     },
  //     "min": {
  //       "commitInfo.star": 4
  //     },
  //     "sum": {
  //       "businessId": 238,
  //       "commitInfo.total": 9
  //     }
  //   },
  //   "success": true
  // }

  const data = new SpotQuotaModel(res)
  // if (!data.length) {
  //   return {
  //     list: [],
  //     allPhotoPath,
  //     // total: data.extend.processInfo[0].totalCount,
  //     pageTotal: data.total || null
  //   }
  // }

  const createData = {
    data: data
  }
  return createData
}

/**
 * @description 质检报告绩效(区域)
 * @param {*} params
 */
export async function getAreaQuota (params: IgetQualityParams) {
  // TODO lj
  const url = `${getApiUrl(params.type, params.organizationType)}/getAreaQuota`
  const res = await axios({
    url,
    method: 'POST',
    data: params
  })

  const data = new SpotQuotaModel(res.data)
  const createData = {
    data: data
  }
  return createData
}

