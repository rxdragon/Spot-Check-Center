// todo: cf
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ORGANIZATION_TYPE, SPOT_TYPE } from '@/model/Enumerate'

import axios from '@/plugins/axios'
import { v4 as uuid } from 'uuid'
import { IgetScoreConfigListRes, ILabelClass, ILabelChildren } from '@/model/GradeLabelModel'
import PoolRecordModel from '@/model/PoolRecordModel'

// 请求api接口
export interface IEvaluateAPi {
  type: any
  organizationType: ORGANIZATION_TYPE
}

/**
 * @description 更具机构和抽片类型获取不同地址
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

/**
 * @description 获取评分配置标签
 * @method GET
 * @returns {Array} 标记数据
 * @author cf 2021/06/09
 * @version @version 1.0.0
 */
export async function getScoreConfigList (): Promise<IgetScoreConfigListRes> {
  // TODO:cf 增加类型请求接口
  const url = '/project_cloud/checkPool' + '/getScoreConfig'
  const res: any = await axios({
    url,
    method: 'GET'
  })
  const chainLine: any = []

  const createData: ILabelClass[] = res.map((item: any) => {
    const childrenData = item.children || []
    const children: ILabelChildren[] = childrenData.map((childrenItem: any) => {
      chainLine.push(childrenItem.id)
      return {
        id: childrenItem.id,
        idString: String(childrenItem.id),
        name: childrenItem.name,
        children: childrenItem.children,
        parentId: childrenItem.score_type_id,
        value: ''
      }
    })
    // 如果有子项目才添加
    if (children.length) {
      children.unshift({
        id: uuid(),
        idString: uuid(),
        name: '一键评分',
        parentId: 0,
        value: '',
        isOneAll: true
      })
    }

    return {
      id: item.id,
      idString: String(item.id),
      name: item.name,
      children
    }
  })
  const labelClass = createData.filter((item: any) => item.children.length)
  return {
    labelClass,
    chainLine
  }
}

/**
 * @description 抽片逻辑
 */
interface ITakePhotoParams extends IEvaluateAPi {
  productIds: Array<string | number>
  formalStaffCount: string | number
  newStaffCount: string | number
}

export async function takePhoto (params: ITakePhotoParams): Promise<string> {
  const url = `${getApiUrl(params.type, params.organizationType)}/takePhoto`
  const res: any = await axios({
    url,
    method: 'POST',
    data: params
  })
  return res
}

/**
 * @description 获取抽片结果
 */
interface IGetSpotCheckResultParams extends IEvaluateAPi {
  uuid: string
}
interface IGetSpotCheckResultRes {
  formalStaffNum: number
  formalStaffStreamNum: number
  spotAllPeople: number
  newStaffNum: number
  newStaffStreamNum: number
  streamOrderNum: number
}

export async function getSpotCheckResult (params: IGetSpotCheckResultParams): Promise<IGetSpotCheckResultRes> {
  const url = `${getApiUrl(params.type, params.organizationType)}/getSpotCheckResult`
  const res: any = await axios({
    url,
    method: 'GET',
    params
  })

  const createData = {
    formalStaffNum: res.formalStaffNum,
    formalStaffStreamNum: res.formalStaffStreamNum,
    spotAllPeople: res.makeupNum || res.photographerNum || 0,
    newStaffNum: res.newStaffNum,
    newStaffStreamNum: res.newStaffStreamNum,
    streamOrderNum: res.streamOrderNum,
  }

  return createData
}

/**
 * @description 获取抽片结果列表
 */
interface IGetSpotCheckResultListParams extends IEvaluateAPi {
  uuid: string
  page: number
  pageSize: number
  skip: number
  limit: number
}
interface IGetSpotCheckResultListRes {
  total: number
  list: PoolRecordModel[]
}
// eslint-disable-next-line max-len
export async function getSpotCheckResultList (params: IGetSpotCheckResultListParams): Promise<IGetSpotCheckResultListRes> {
  // const url = `${getApiUrl(params.type, params.organizationType)}/getSpotCheckResultList`
  // const res: any = await axios({
  //   url,
  //   method: 'GET',
  //   params
  // })

  const res = {
    "_id": "5d9efbffb725ac300d264ddc",
    "batchUUId": "08c3cbe7-7106-44e2-905b-08caa76cfa78",
    "commitNum": 1,
    "createdTime": "2019-10-10 17:38:07",
    "data": [
      {
        "_batch": 0,
        "_id": "5d9efbffb725ac300d264ddc",
        "businessId": 2,
        "commitInfo": {
          "oldTakeStaffInfo": 600000,
          "photos": {
            "id": 1,
            "picUrl": "www.baidu.com"
          },
          "score": 10,
          "tags": [
            {
              "id": 2,
              "weights": 1
            }
          ],
          "takeStaffNum": 600000
        },
        "createdTime": "2019-10-10 17:38:07",
        "operatorStaffId": 2,
        "photos": [
          {
            "id": 1,
            "path": "https://cloud-dev.cdn-qn.hzmantu.com/compress/2020/06/17/ljj3UXg3uaY_C0DJ4kBsitaVV8UJ.jpg",
            "photo_quality": {
              "_id": "60b33237317fd376e7403cb3",
              "ai_state": "success",
              "audit_record_id": "60b33237317fd376e7403cb2",
              "extend": {
                "info_makeup": {
                  "degree": 5,
                  "label": []
                },
                "info_phtghy": {
                  "degree": 5,
                  "label": []
                }
              },
              "finish_time": "2021-05-30 14:35:36",
              "path": "2021/05/30/lgn0C2Z2vjdwaQ2xIJ-uhqjMeANH.jpg"
            }
          },
          {
            "id": 2,
            "path": "https://cloud-dev.cdn-qn.hzmantu.com/upload_dev/2021/06/07/For1yk41pocbeTppJeqF95ijLvSz.jpg",
            "photo_quality": {
              "_id": "60b33237317fd376e7403cb3",
              "ai_state": "success",
              "audit_record_id": "60b33237317fd376e7403cb2",
              "extend": {
                "info_makeup": {
                  "degree": 3,
                  "label": []
                },
                "info_phtghy": {
                  "degree": 5,
                  "label": []
                }
              },
              "finish_time": "2021-05-30 14:35:36",
              "path": "2021/05/30/lgn0C2Z2vjdwaQ2xIJ-uhqjMeANH.jpg"
            }
          }
        ],
        "status": "commit",
        "streamOrder": {
          "dresser_note": "dresser_note",
          "order_note": "order_note",
          "order_num": "T2021060710222011",
          "photoNum": 8,
          "photographers": {
            "experts": [
              {
                "id": 1,
                "name": "摄影组长",
                "nickname": "摄影组长"
              }
            ],
            "group_leader": [
              {
                "id": 1,
                "name": "摄影组长",
                "nickname": "摄影组长"
              }
            ],
            "supervisor": [
              {
                "id": 1,
                "name": "摄影组长",
                "nickname": "摄影组长"
              }
            ]
          },
          "photography_note": "photography_note",
          "product": {
            "id": 8,
            "name": "精致证件照 - 侧身"
          },
          "store": {
            "id": 1006,
            "name": "宁波天一广场店",
            "store_type": "blue"
          }
        },
        "total": 10
      },
      {
        "_batch": 0,
        "_id": "5d9efbffb725ac300d264dds",
        "businessId": 3,
        "commitInfo": {
          "oldTakeStaffInfo": 600000,
          "photos": {
            "id": 1,
            "picUrl": "www.baidu.com"
          },
          "score": 10,
          "tags": [
            {
              "id": 2,
              "weights": 1
            }
          ],
          "takeStaffNum": 600000
        },
        "createdTime": "2019-10-10 17:38:07",
        "operatorStaffId": 2,
        "photos": [
          {
            "id": 3,
            "path": "https://cloud.cdn-qn.hzmantu.com/upload/2021/06/09/loSwh57hVThEgwJ0LSuMX_7zi_2L.jpg",
            "photo_quality": {
              "_id": "60b33237317fd376e7403cb3",
              "ai_state": "success",
              "audit_record_id": "60b33237317fd376e7403cb2",
              "extend": {
                "info_makeup": {
                  "degree": 5,
                  "label": []
                },
                "info_phtghy": {
                  "degree": 5,
                  "label": []
                }
              },
              "finish_time": "2021-05-30 14:35:36",
              "path": "2021/05/30/lgn0C2Z2vjdwaQ2xIJ-uhqjMeANH.jpg"
            }
          },
          {
            "id": 4,
            "path": "https://cloud.cdn-qn.hzmantu.com/upload/2021/06/09/FmTXbyZwtkigV-n0h5tjyycsxWcT.jpg",
            "photo_quality": {
              "_id": "60b33237317fd376e7403cb3",
              "ai_state": "success",
              "audit_record_id": "60b33237317fd376e7403cb2",
              "extend": {
                "info_makeup": {
                  "degree": 3,
                  "label": []
                },
                "info_phtghy": {
                  "degree": 5,
                  "label": []
                }
              },
              "finish_time": "2021-05-30 14:35:36",
              "path": "2021/05/30/lgn0C2Z2vjdwaQ2xIJ-uhqjMeANH.jpg"
            }
          }
        ],
        "status": "commit",
        "streamOrder": {
          "dresser_note": "化妆备注",
          "order_note": "order_note",
          "order_num": "T2021060710222011",
          "photoNum": 2,
          "photographers": {
            "experts": [
              {
                "id": 1,
                "name": "摄影组长",
                "nickname": "摄影组长"
              }
            ],
            "group_leader": [
              {
                "id": 1,
                "name": "摄影组长",
                "nickname": "摄影组长"
              }
            ],
            "supervisor": [
              {
                "id": 1,
                "name": "摄影组长",
                "nickname": "摄影组长"
              }
            ]
          },
          "photography_note": "摄影备注",
          "product": {
            "id": 8,
            "name": "精致证件照 - 侧身"
          },
          "store": {
            "id": 1006,
            "name": "宁波天一广场店",
            "store_type": "master"
          }
        },
        "total": 10
      }
    ],
    "extend": {
      "currentProcess": 1,
      "processInfo": [
        {
          "currentGroup": 6,
          "totalCount": 10,
          "totalGroup": 6
        }
      ],
      "totalProcess": 1
    },
    "operatorStaffId": 1,
    "status": "success",
    "total": 10
  }

  const createData: PoolRecordModel[] = res.data.map((poolRecordItem: any, poolRecordIndex: number) => {
    const poolRecordModel = new PoolRecordModel(poolRecordItem)
    const pagerInfo = {
      page: params.page,
      pageSize: params.pageSize,
      index: poolRecordIndex,
      total: res.total,
    }
    poolRecordModel.getStreamInfo(poolRecordItem.streamOrder, pagerInfo)
    poolRecordModel.getPoolPhotoList()
    return poolRecordModel
  })
  return {
    list: createData,
    total: res.total
  }
}

/**
 * @description 获取今日抽片指标
 */
interface IGetTodayEvaluateCountRes {
  evaluationPhotoNum: number
  evaluationStreamNum: number
}

export async function getTodayEvaluateCount (params: IEvaluateAPi): Promise<IGetTodayEvaluateCountRes> {
  // const url = `${getApiUrl(params.type, params.organizationType)}/getTodayEvaluateCount`
  // const res: any = axios({
  //   url,
  //   method: 'GET',
  // })

  // TODo:cf mock
  const res = {
    "evaluationPhotoNum": 1,
    "evaluationStreamNum": 1
  }
  return res
}

/**
 * @description 获取今日是否有抽片数据
 */
export async function getHaveSpotCheckResult (params: IEvaluateAPi): Promise<string> {
  // const url = `${getApiUrl(params.type, params.organizationType)}/getHaveSpotCheckResult`
  // const res: any = axios({
  //   url,
  //   method: 'GET',
  // })

  // TODo:cf mock
  const res = 'uuid'
  return res
}

/**
 * @description 跳过伙伴
 * @param params 
 */
interface ISkipStaffParams extends IEvaluateAPi {
  staffIds: number[]
  poolItemId: string
}

export async function skipStaff (params: ISkipStaffParams): Promise<boolean> {
  const url = `${getApiUrl(params.type, params.organizationType)}/skipStaff`
  const res: any = await axios({
    url,
    method: 'POST',
    data: params
  })
  return res
}

/**
 * @description 换一单
 * @param params 
 */
interface IChangePoolParams extends IEvaluateAPi {
  poolItemId: string
}
export async function changePool (params: IChangePoolParams): Promise<boolean> {
  const url = `${getApiUrl(params.type, params.organizationType)}/changeItem`
  const res: any = await axios({
    url,
    method: 'POST',
    data: params
  })
  return res
}

/**
 * @description 提交评分配置
 * @param params 
 */
interface IEmptyPoolByStaffIdParams extends IEvaluateAPi {
  photos: {
    markPath: string
    photoId: number
  }[]
  poolItemId: string
  tags: {
    id: number
    score: number
  }[]
}
export async function emptyPoolByStaffId (params: IEmptyPoolByStaffIdParams): Promise<boolean> {
  const url = `${getApiUrl(params.type, params.organizationType)}/emptyPoolByStaffId`
  const res: any = await axios({
    url,
    method: 'POST',
    data: params
  })

  return res
}
