// TODO lj
// import axios from '@/plugins/axios'
import EvaluateModel from '@/model/EvaluateModel'

export interface IgetQualityParams {
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

/**
 * @description 获取抽片结果
 * @param {*} params
 */
export async function getSpotCheckResult (params:IgetQualityParams, axiosType: string) {
  // TODO lj
  // const url = '/project_photo_quality/' + axiosType + '/getAllQualityReport'
  // await axios({
  //   url,
  //   method: 'GET',
  //   params
  // })
  const msg = { total: 10, data: [
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
        },
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
        },
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
        },
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
        },
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
              "name": "化妆组长",
              "nickname": "化妆组长"
            }
          ],
          "group_leader": [
            {
              "id": 1,
              "name": "化妆组长",
              "nickname": "化妆组长"
            }
          ],
          "supervisor": [
            {
              "id": 1,
              "name": "化妆组长",
              "nickname": "化妆组长"
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
      
    }, {
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
        },
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
              "name": "化妆组长",
              "nickname": "化妆组长"
            }
          ],
          "group_leader": [
            {
              "id": 1,
              "name": "化妆组长",
              "nickname": "化妆组长"
            }
          ],
          "supervisor": [
            {
              "id": 1,
              "name": "化妆组长",
              "nickname": "化妆组长"
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
      
    }] }
  const data = msg.data
  // if (!data.length) {
  //   return {
  //     list: [],
  //     allPhotoPath,
  //     // total: data.extend.processInfo[0].totalCount,
  //     pageTotal: data.total || null
  //   }
  // }
  const list = data.map((item: any) => {
    return new EvaluateModel(item)
  })
  const createData = {
    list: list,
    total: msg.total
  }
  return createData
}
