// TODO lj
import axios from '@/plugins/axios'
// import * as SessionTool from '@/utils/sessionTool'

interface ISelect {
  label: string
  value: string
}

export interface IFilterSelectData {
  label: string
  value: string | number
  children?: ISelect[]
}
// export IFilterRetouchStandardData

/**
 * @description 获取伙伴选择框数据
 */
export async function getStaffSelectList () {
  // TODO lj
  // const params = { needDelete: false }
  const msg: any
      = {
        "msg": [
          {
            "children": [
              {
                "config_staff_ids": [
                  1,
                  2,
                  3
                ],
                "config_store_ids": [
                  1,
                  2,
                  3
                ],
                "id": 1,
                "name": "张三",
                "position_id": "1"
              }
            ],
            "id": 1,
            "name": "金沙印象城"
          }
        ],
        "success": true
      }

  // const msg: any = await axios({
  //   url: '/project-photo-quality/common/getStaffs',
  //   method: 'get',
  //   params
  // })
  const data = msg.msg
  const newData: IFilterSelectData[] = data.map((item: any) => {
    const childrenData = item.children || []
    const children = childrenData.map((childrenItem: any) => {
      return {
        label: childrenItem.name,
        value: childrenItem.id
      }
    })
    return {
      label: item.name,
      value: item.id,
      children: children
    }
  })
  return newData
}


/**
 * @description 获取职能选择框数据
 */
 interface IJobContentParams {
  type: string
}
export async function getJobContentSelectList (params: IJobContentParams) {
  // TODO lj
  // const params = { needDelete: false }
  // TODO lj
  // const msg: any = {
  //   "msg": [
  //     {
  //       "children": [{
  //         "config_staff_ids": [
  //           1,
  //           2,
  //           3
  //         ],
  //         "config_store_ids": [
  //           1,
  //           2,
  //           3
  //         ],
  //         "id": 1,
  //         "name": "张三",
  //         "position_id": "1"
  //       }],
  //       "id": 1,
  //       "name": "化妆组长"
  //     },
  //     {
  //       "children": [{
  //         "config_staff_ids": [
  //           1,
  //           2,
  //           3
  //         ],
  //         "config_store_ids": [
  //           1,
  //           2,
  //           3
  //         ],
  //         "id": 1,
  //         "name": "张三三",
  //         "position_id": "2"
  //       }],
  //       "id": 1,
  //       "name": "化妆组长"
  //     }
  //   ],
  //   "success": true
  // }

  const msg: any = await axios({
    url: '/project-photo-quality/common/getPositionStaffs',
    method: 'get',
    params
  })

  const data = msg.msg
  const newData: IFilterSelectData[] = data.map((item: any) => {
    const childrenData = item.children || []
    const children = childrenData.map((childrenItem: any) => {
      return {
        label: childrenItem.name,
        value: childrenItem.id
      }
    })
    return {
      label: item.name,
      value: item.id,
      children: children
    }
  })
  return newData
}

/**
 * @description 获取评价标签选择框数据
 */
export async function getEvaluateSelectList () {
  // eslint-disable-next-line max-len
  const msg = { "success": true,"msg": [{ "id": 12,"name": "\u6211\u7684\u540d\u5b57","max_score": 100,"min_score": 0,"created_at": "2021-06-10 21:34:06","updated_at": "2021-06-10 21:34:06","from": "check_pool","deleted_at": null,"children": [] },{ "id": 11,"name": "\u65b0\u7684\u540d\u5b57","max_score": 100,"min_score": 0,"created_at": "2021-06-10 21:33:42","updated_at": "2021-06-10 21:33:42","from": "check_pool","deleted_at": null,"children": [] },{ "id": 10,"name": "\u65b0\u5e73\u6cea","max_score": 100,"min_score": 0,"created_at": "2021-06-10 21:20:26","updated_at": "2021-06-10 21:20:26","from": "check_pool","deleted_at": null,"children": [] },{ "id": 9,"name": "\u6d4b\u8bd52","max_score": 100,"min_score": 0,"created_at": "2021-06-04 09:00:53","updated_at": "2021-06-10 18:23:47","from": "check_pool","deleted_at": null,"children": [{ "id": 720,"parent_id": 0,"name": "\u6d4b\u8bd5\u5f90\u6602\u4ea92","score": 0,"score_type_id": 9,"type": "deduct","from": "check_pool","children": [{ "id": 724,"parent_id": 720,"name": "\u79cd\u8349","score": 2,"score_type_id": 0,"type": "add","from": "check_pool" },{ "id": 723,"parent_id": 720,"name": "\u62d4\u8349","score": 2,"score_type_id": 0,"type": "deduct","from": "check_pool" },{ "id": 722,"parent_id": 720,"name": "\u4e2d","score": 2,"score_type_id": 0,"type": "deduct","from": "check_pool" },{ "id": 721,"parent_id": 720,"name": "\u5c0f","score": 2,"score_type_id": 0,"type": "deduct","from": "check_pool" }] },{ "id": 715,"parent_id": 0,"name": "\u65b0\u589e\u6d4b\u8bd5\u9879\u76ee","score": 0,"score_type_id": 9,"type": "deduct","from": "check_pool","children": [{ "id": 719,"parent_id": 715,"name": "\u79cd\u8349","score": 6,"score_type_id": 0,"type": "add","from": "check_pool" },{ "id": 718,"parent_id": 715,"name": "\u62d4\u8349","score": 5,"score_type_id": 0,"type": "deduct","from": "check_pool" },{ "id": 717,"parent_id": 715,"name": "\u4e2d","score": 3,"score_type_id": 0,"type": "deduct","from": "check_pool" },{ "id": 716,"parent_id": 715,"name": "\u5c0f","score": 4,"score_type_id": 0,"type": "deduct","from": "check_pool" }] },{ "id": 660,"parent_id": 0,"name": "\u6ee4\u955c","score": 0,"score_type_id": 9,"type": "deduct","from": "check_pool","children": [{ "id": 664,"parent_id": 660,"name": "\u62d4\u8349","score": 0,"score_type_id": 0,"type": "deduct","from": "check_pool" },{ "id": 663,"parent_id": 660,"name": "\u79cd\u8349","score": 0,"score_type_id": 0,"type": "add","from": "check_pool" },{ "id": 662,"parent_id": 660,"name": "\u4e2d","score": 0,"score_type_id": 0,"type": "deduct","from": "check_pool" },{ "id": 661,"parent_id": 660,"name": "\u5c0f","score": 0,"score_type_id": 0,"type": "deduct","from": "check_pool" }] },{ "id": 655,"parent_id": 0,"name": "\u80cc\u666f","score": 0,"score_type_id": 9,"type": "deduct","from": "check_pool","children": [{ "id": 659,"parent_id": 655,"name": "\u62d4\u8349","score": 0,"score_type_id": 0,"type": "deduct","from": "check_pool" },{ "id": 658,"parent_id": 655,"name": "\u79cd\u8349","score": 0,"score_type_id": 0,"type": "add","from": "check_pool" },{ "id": 657,"parent_id": 655,"name": "\u4e2d","score": 0,"score_type_id": 0,"type": "deduct","from": "check_pool" },{ "id": 656,"parent_id": 655,"name": "\u5c0f","score": 0,"score_type_id": 0,"type": "deduct","from": "check_pool" }] },{ "id": 650,"parent_id": 0,"name": "\u900f\u660e","score": 0,"score_type_id": 9,"type": "deduct","from": "check_pool","children": [{ "id": 654,"parent_id": 650,"name": "\u62d4\u8349","score": 41,"score_type_id": 0,"type": "deduct","from": "check_pool" },{ "id": 653,"parent_id": 650,"name": "\u79cd\u8349","score": 100,"score_type_id": 0,"type": "add","from": "check_pool" },{ "id": 652,"parent_id": 650,"name": "\u4e2d","score": 4,"score_type_id": 0,"type": "deduct","from": "check_pool" },{ "id": 651,"parent_id": 650,"name": "\u5c0f","score": 2,"score_type_id": 0,"type": "deduct","from": "check_pool" }] },{ "id": 645,"parent_id": 0,"name": "\u91c7\u5149","score": 0,"score_type_id": 9,"type": "deduct","from": "check_pool","children": [{ "id": 649,"parent_id": 645,"name": "\u62d4\u8349","score": 40,"score_type_id": 0,"type": "deduct","from": "check_pool" },{ "id": 648,"parent_id": 645,"name": "\u79cd\u8349","score": 10,"score_type_id": 0,"type": "add","from": "check_pool" },{ "id": 647,"parent_id": 645,"name": "\u4e2d","score": 2,"score_type_id": 0,"type": "deduct","from": "check_pool" },{ "id": 646,"parent_id": 645,"name": "\u5c0f","score": 1,"score_type_id": 0,"type": "deduct","from": "check_pool" }] }] },{ "id": 8,"name": "\u6ee4\u955c","max_score": 100,"min_score": 0,"created_at": "2021-04-25 14:42:14","updated_at": "2021-04-25 14:42:14","from": "check_pool","deleted_at": null,"children": [{ "id": 630,"parent_id": 0,"name": "\u80cc\u666f","score": 0,"score_type_id": 8,"type": "deduct","from": "check_pool","children": [{ "id": 634,"parent_id": 630,"name": "\u62d4\u8349","score": 5,"score_type_id": 0,"type": "deduct","from": "check_pool" },{ "id": 633,"parent_id": 630,"name": "\u79cd\u8349","score": 4,"score_type_id": 0,"type": "add","from": "check_pool" },{ "id": 632,"parent_id": 630,"name": "\u4e2d","score": 3,"score_type_id": 0,"type": "deduct","from": "check_pool" },{ "id": 631,"parent_id": 630,"name": "\u5c0f","score": 1,"score_type_id": 0,"type": "deduct","from": "check_pool" }] }] },{ "id": 3,"name": "\u8c03\u5149","max_score": 100,"min_score": 0,"created_at": "2021-03-22 15:38:50","updated_at": "2021-03-22 15:38:50","from": "check_pool","deleted_at": null,"children": [{ "id": 625,"parent_id": 0,"name": "\u7709\u6bdb","score": 0,"score_type_id": 3,"type": "deduct","from": "check_pool","children": [{ "id": 629,"parent_id": 625,"name": "\u62d4\u8349","score": 10,"score_type_id": 0,"type": "deduct","from": "check_pool" },{ "id": 628,"parent_id": 625,"name": "\u79cd\u8349","score": 4,"score_type_id": 0,"type": "add","from": "check_pool" },{ "id": 627,"parent_id": 625,"name": "\u4e2d","score": 2,"score_type_id": 0,"type": "deduct","from": "check_pool" },{ "id": 626,"parent_id": 625,"name": "\u5c0f","score": 1,"score_type_id": 0,"type": "deduct","from": "check_pool" }] },{ "id": 317,"parent_id": 0,"name": "\u4eae\u5ea6","score": 0,"score_type_id": 3,"type": "deduct","from": "check_pool","children": [{ "id": 321,"parent_id": 317,"name": "\u79cd\u8349","score": 4,"score_type_id": 0,"type": "add","from": "check_pool" },{ "id": 320,"parent_id": 317,"name": "\u4e2d","score": 2,"score_type_id": 0,"type": "deduct","from": "check_pool" },{ "id": 319,"parent_id": 317,"name": "\u5c0f","score": 1,"score_type_id": 0,"type": "deduct","from": "check_pool" },{ "id": 318,"parent_id": 317,"name": "\u62d4\u8349","score": 10,"score_type_id": 0,"type": "deduct","from": "check_pool" }] },{ "id": 307,"parent_id": 0,"name": "\u773c\u775b","score": 0,"score_type_id": 3,"type": "deduct","from": "check_pool","children": [{ "id": 311,"parent_id": 307,"name": "\u79cd\u8349","score": 4,"score_type_id": 0,"type": "add","from": "check_pool" },{ "id": 310,"parent_id": 307,"name": "\u4e2d","score": 2,"score_type_id": 0,"type": "deduct","from": "check_pool" },{ "id": 309,"parent_id": 307,"name": "\u5c0f","score": 1,"score_type_id": 0,"type": "deduct","from": "check_pool" },{ "id": 308,"parent_id": 307,"name": "\u62d4\u8349","score": 10,"score_type_id": 0,"type": "deduct","from": "check_pool" }] }] },{ "id": 2,"name": "\u78e8\u76ae","max_score": 100,"min_score": 0,"created_at": "2021-03-22 15:37:47","updated_at": "2021-03-22 15:37:47","from": "check_pool","deleted_at": null,"children": [{ "id": 486,"parent_id": 0,"name": "\u6db2\u5316","score": 0,"score_type_id": 2,"type": "deduct","from": "check_pool","children": [{ "id": 490,"parent_id": 486,"name": "\u79cd\u8349","score": 4,"score_type_id": 0,"type": "add","from": "check_pool" },{ "id": 489,"parent_id": 486,"name": "\u4e2d","score": 2,"score_type_id": 0,"type": "deduct","from": "check_pool" },{ "id": 488,"parent_id": 486,"name": "\u5c0f","score": 1,"score_type_id": 0,"type": "deduct","from": "check_pool" },{ "id": 487,"parent_id": 486,"name": "\u62d4\u8349","score": 10,"score_type_id": 0,"type": "deduct","from": "check_pool" }] },{ "id": 322,"parent_id": 0,"name": "\u76ae\u80a4","score": 0,"score_type_id": 2,"type": "deduct","from": "check_pool","children": [{ "id": 326,"parent_id": 322,"name": "\u79cd\u8349","score": 4,"score_type_id": 0,"type": "add","from": "check_pool" },{ "id": 325,"parent_id": 322,"name": "\u4e2d","score": 2,"score_type_id": 0,"type": "deduct","from": "check_pool" },{ "id": 324,"parent_id": 322,"name": "\u5c0f","score": 1,"score_type_id": 0,"type": "deduct","from": "check_pool" },{ "id": 323,"parent_id": 322,"name": "\u62d4\u8349","score": 10,"score_type_id": 0,"type": "deduct","from": "check_pool" }] }] },{ "id": 1,"name": "\u6db2\u5316","max_score": 0,"min_score": 80,"created_at": null,"updated_at": null,"from": "check_pool","deleted_at": null,"children": [{ "id": 570,"parent_id": 0,"name": "\u5149\u6cfd","score": 0,"score_type_id": 1,"type": "deduct","from": "check_pool","children": [{ "id": 574,"parent_id": 570,"name": "\u62d4\u8349","score": 10,"score_type_id": 0,"type": "deduct","from": "check_pool" },{ "id": 573,"parent_id": 570,"name": "\u79cd\u8349","score": 4,"score_type_id": 0,"type": "add","from": "check_pool" },{ "id": 572,"parent_id": 570,"name": "\u4e2d","score": 2,"score_type_id": 0,"type": "deduct","from": "check_pool" },{ "id": 571,"parent_id": 570,"name": "\u5c0f","score": 1,"score_type_id": 0,"type": "deduct","from": "check_pool" }] },{ "id": 232,"parent_id": 0,"name": "\u5934\u90e8","score": 0,"score_type_id": 1,"type": "deduct","from": "check_pool","children": [{ "id": 236,"parent_id": 232,"name": "\u79cd\u8349","score": 4,"score_type_id": 0,"type": "add","from": "check_pool" },{ "id": 235,"parent_id": 232,"name": "\u62d4\u8349","score": 10,"score_type_id": 0,"type": "deduct","from": "check_pool" },{ "id": 234,"parent_id": 232,"name": "\u4e2d","score": 2,"score_type_id": 0,"type": "deduct","from": "check_pool" },{ "id": 233,"parent_id": 232,"name": "\u5c0f","score": 1,"score_type_id": 0,"type": "deduct","from": "check_pool" }] }] }] }
  return msg.msg
}
