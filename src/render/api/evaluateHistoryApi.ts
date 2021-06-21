// import axios from '@/plugins/axios'
import { ORGANIZATION_TYPE } from '@/model/Enumerate'
import PoolRecordModel from '@/model/PoolRecordModel'
// import { getApiUrl } from '@/api/evaluateApi'

export interface IgetHistoryRecordsParams {
  type: any
  organizationType: ORGANIZATION_TYPE
  productIds?: number[]
  staffIds?: string[]
  supervisorArr?: string[]
  problemTagsIds?: string[]
  score?: number[]
  startTime?: string
  endTime?: string
  cloudOrderNum?: string
  page: number
  pageSize: number
}

// interface IHistoryRecordList extends PoolRecordModel {
//   photoList: AuditSpotPhotoModel[]
// }

interface IgetHistoryRecordsRes {
  list: PoolRecordModel[]
  total: number
}
/**
 * @description 获取历史记录列表
 */
export async function getHistoryRecords (params: IgetHistoryRecordsParams): Promise<IgetHistoryRecordsRes> {
  // const url = `${getApiUrl(params.type, params.organizationType)}/getSearchHistory`
  // const res: any = await axios({
  //   url,
  //   method: 'POST',
  //   data: params
  // })

  // const res = {
  //   "data": [
  //     {
  //       "_batch": 0,
  //       "_id": "5d9efbffb725ac300d264ddc",
  //       "businessId": 2,
  //       "commitInfo": {
  //         "oldTakeStaffInfo": 1,
  //         "picUrl": "www.baidu.com",
  //         "score": 10,
  //         "tags": [
  //           {
  //             "id": 2,
  //             "weights": 1
  //           }
  //         ],
  //         "takeStaffNum": 1
  //       },
  //       "commitNum": 1,
  //       "createdTime": "2019-10-10 17:38:07",
  //       "oldTakeStaffInfo": {
  //         "name": 33,
  //         "real_name": 2,
  //         "retouch_group": 298
  //       },
  //       "operatorStaffId": 2,
  //       "photo_id": 2,
  //       "photos": [
  //         {
  //           "id": 1,
  //           "path": "path",
  //           "photo_quality": {
  //             "_id": "60b33237317fd376e7403cb3",
  //             "ai_state": "success",
  //             "audit_record_id": "60b33237317fd376e7403cb2",
  //             "extend": {
  //               "info_makeup": {
  //                 "degree": 5,
  //                 "label": []
  //               },
  //               "info_phtghy": {
  //                 "degree": 5,
  //                 "label": []
  //               }
  //             },
  //             "finish_time": "2021-05-30 14:35:36",
  //             "path": "2021/05/30/lgn0C2Z2vjdwaQ2xIJ-uhqjMeANH.jpg"
  //           }
  //         }
  //       ],
  //       "status": "commit",
  //       "streamOrder": {
  //         "dresser_note": "dresser_note",
  //         "dressers": {
  //           "experts": [
  //             {
  //               "id": 1,
  //               "name": "摄影组长",
  //               "nickname": "摄影组长"
  //             }
  //           ],
  //           "group_leader": [
  //             {
  //               "id": 1,
  //               "name": "摄影组长",
  //               "nickname": "摄影组长"
  //             }
  //           ],
  //           "supervisor": [
  //             {
  //               "id": 1,
  //               "name": "摄影组长",
  //               "nickname": "摄影组长"
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
  //       "tags": [
  //         {
  //           "id": 2,
  //           "name": "a",
  //           "parent": {
  //             "id": 1,
  //             "name": "a",
  //             "score_type": null,
  //             "score_type_id": 1
  //           },
  //           "score": 64,
  //           "type": ""
  //         }
  //       ],
  //       "takeStaffInfo": {
  //         "name": 33,
  //         "real_name": 2,
  //         "retouch_group": 298
  //       },
  //       "total": 10
  //     }
  //   ],
  //   "success": true
  // }
  // const listData: PoolRecordModel[] = res.data.map((historyRecordItem: any, historyRecordIndex: number) => {
  //   const poolRecordModel = new PoolRecordModel(historyRecordItem)
  //   const pagerInfo = {
  //     page: params.page,
  //     pageSize: params.pageSize,
  //     index: historyRecordIndex,
  //     total: res.data[0].total,
  //   }
  //   poolRecordModel.getStreamInfo(historyRecordItem.streamOrder, pagerInfo)
  //   poolRecordModel.getPoolPhotoList()
  //   poolRecordModel.getTags(historyRecordItem)
  //   return poolRecordModel
  // })
  const createData = {
    list: [],
    total: 10
  }
  return createData
}

/**
 * @description 获取评价标签选择框数据
 */
 interface ISelect {
  label: string
  value: string
}

export interface IFilterSelectData {
  label: string
  value: string | number
  children?: ISelect[]
}
interface ISelectParams {
  type: string
}
export async function getEvaluateSelectList (params: ISelectParams) {
  // const msg: any = await axios({
  //   url: '/project-photo-quality/common/getScoreConfigTree',
  //   method: 'get',
  //   params
  // })

  const msg = {
    "msg": [{
      "children": [{
        "children": [{
          "id": 4,
          "name": "拔草",
          "score": 5,
          "type": "deduct"
        }],
        "id": 3,
        "name": "服装",
        "score": 1,
        "type": "deduct"
      }],
      "id": 2,
      "name": "液化"
    }],
    "success": true
  }

  return msg.msg
}
