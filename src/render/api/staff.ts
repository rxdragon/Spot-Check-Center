// TODO lj
// import axios from '@/plugins/axios'
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
export async function getJobContentSelectList () {
  // TODO lj
  // const params = { needDelete: false }
  // TODO lj
  const msg: any = {
    "msg": [
      {
        "children": [{
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
        }],
        "id": 1,
        "name": "化妆组长"
      },
      {
        "children": [{
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
          "name": "张三三",
          "position_id": "2"
        }],
        "id": 1,
        "name": "化妆组长"
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
