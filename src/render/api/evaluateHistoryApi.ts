// import axios from '@/plugins/axios'
import { SPOT_TYPE } from '@/model/Enumerate'
import PoolRecordModel from '@/model/PoolRecordModel'

export interface IgetHistoryRecordsParams {
  type: SPOT_TYPE | string
  productIds?: number[]
  staffIds?: string[]
  supervisorArr?: string[]
  problemTagsIds?: string[]
  score?: number[]
  startAt?: string
  endAt?: string
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
  // let url = ''
  // switch (params.type) {
  //   case SPOT_TYPE.MAKEUP:
  //     url = '/project_photo_quality/makeup/getHistoryRecords'
  //     break
  //   case SPOT_TYPE.PHOTOGRAPHY:
  //     url = '/project_photo_quality/photography/getHistoryRecords'
  //     break
  //   default:
  //     break
  // }

  // const res: any = await axios({
  //   url,
  //   method: 'POST',
  //   data: params
  // })

  const res = {
    "msg": {
      "data": [
        {
          "_batch": 0,
          "_id": "5d9efbffb725ac300d264ddc",
          "businessId": 2,
          "commitInfo": {
            "oldTakeStaffInfo": 1,
            "picUrl": "www.baidu.com",
            "score": 10,
            "tags": [
              {
                "id": 2,
                "weights": 1
              }
            ],
            "takeStaffNum": 1
          },
          "commitNum": 1,
          "createdTime": "2019-10-10 17:38:07",
          "oldTakeStaffInfo": {
            "name": 33,
            "real_name": 2,
            "retouch_group": 298
          },
          "operatorStaffId": 2,
          "photo_id": 2,
          "photos": [
            {
              "id": 1,
              "path": "path",
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
            }
          ],
          "status": "commit",
          "streamOrder": {
            "dresser_note": "dresser_note",
            "dressers": {
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
            "order_note": "order_note",
            "order_num": "T2021060710222011",
            "photoNum": 8,
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
          "tags": [
            {
              "id": 2,
              "name": "a",
              "parent": {
                "id": 1,
                "name": "a",
                "score_type": null,
                "score_type_id": 1
              },
              "score": 64,
              "type": ""
            }
          ],
          "takeStaffInfo": {
            "name": 33,
            "real_name": 2,
            "retouch_group": 298
          },
          "total": 10
        }
      ]
    },
    "success": true
  }
  const listData: PoolRecordModel[] = res.msg.data.map((historyRecordItem: any, historyRecordIndex: number) => {
    const poolRecordModel = new PoolRecordModel(historyRecordItem)
    const pagerInfo = {
      page: params.page,
      pageSize: params.pageSize,
      index: historyRecordIndex,
      total: res.msg.data[0].total,
    }
    poolRecordModel.getStreamInfo(historyRecordItem.streamOrder, pagerInfo)
    poolRecordModel.getPoolPhotoList()
    poolRecordModel.getTags(historyRecordItem)
    return poolRecordModel
  })
  const createData = {
    list: listData,
    total: res.msg.data[0].total
  }
  return createData
}
