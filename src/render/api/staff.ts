// TODO lj
// import axios from '@/plugins/axios'
import * as SessionTool from '@/utils/sessionTool'

interface IStaffSelect {
  label: string
  value: string
}

export type IFilterStaffData = {
  label: string
  value: string | number
  children?: IStaffSelect[]
}
// export IFilterRetouchStandardData

/**
 * @description 获取伙伴选择框数据
 */
export async function getStaffSelectList () {
  // TODO lj
  // const params = { needDelete: false }
  function handleData (msg: any) {
    const createData: IFilterStaffData[] = [{
      label: '未分组',
      value: 0,
      children: []
    }]
    msg.forEach(( staff: any ) => {
      const staffInfo: IStaffSelect = {
        value: staff.id,
        label: staff.nickname || staff.name || '暂无姓名'
      }
      if (staff.department_id) {
        const groudInfo = staff.department
        const findGroud = createData.find(item => item.value === staff.department_id)
        if (findGroud) {
          const children = findGroud.children || []
          findGroud.children = [...children, staffInfo]
        } else {
          createData.push({
            value: staff.department_id,
            label: (groudInfo && groudInfo.name) || '-',
            children: [staffInfo]
          })
        }
      } else {
        createData[0].children = [staffInfo]
      }
    })
    if ( createData[0].children && !createData[0].children.length) {
      createData.shift()
    }
    return createData
  }
  const data = SessionTool.getStaffList()
  if (data) {
    return handleData(data)
  } else {
    // TODO lj
    const msg: any = {
      "msg": [
        {
          "entry_at": "2015-08-07",
          "id": 1,
          "name": "杜秋冬",
          "nickname": "纳威"
        }
      ],
      "success": true
    }

    // const msg: any = await axios({
    //   url: '/project-photo-quality/common/getStaffs',
    //   method: 'get',
    //   params
    // })
    SessionTool.saveStaffList(msg.msg)
    return handleData(msg.msg)
  }
}
