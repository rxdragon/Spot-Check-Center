import axios from '@/plugins/axios'
import StaffModel from '@/model/StaffModel'

export interface ISelectType {
  label: string
  value: number
}
/**
 * @description 获取全部角色信息
 * @returns 
 */
export async function getAllRole () {
  const res: any = await axios({
    // mock 假数据
    url: '/project_cloud/common/getAllRole',
    method: 'GET'
  })
  const createData: ISelectType[] = res.map((roleItem: any) => {
    return {
      label: roleItem.name,
      value: roleItem.id
    }
  })
  return createData
}

/**
 * @description 获取伙伴列表
 */
export interface IGetStaffListParams {
  staffId?: number | string
  staffName?: string
  roleId?: number | string
  page: number
  pageSize: number
}
interface IGetStaffListRes {
  list: StaffModel[],
  total: number
}
export async function getStaffList (params: IGetStaffListParams): Promise<IGetStaffListRes> {
  const res: any = await axios({
    // TODO:cf
    // url: '/project_photo_quality/staff/getStaffList'
    url: '/project_cloud/staff/getStaffListByPage',
    method: 'GET',
    params
  })
  const createData = res.list.map((staffItem: any) => {
    return new StaffModel(staffItem)
  })
  return {
    list: createData,
    total: res.total
  }
}

/**
 * @description 禁用账号
 */
interface IDisableStaffParams {
  staffId: number | string
}
export async function disableStaff (params: IDisableStaffParams): Promise<boolean> {
  const res: any = await axios({
    // TODO:cf
    // url: '/project_photo_quality/staff/disableStaff'
    url: '/project_cloud/staff/disableStaff',
    method: 'PUT',
    data: params
  })
  return res
}

/**
 * @description 启用账号
 */
 interface IEnableStaffParams {
  staffId: number | string
}
export async function enableStaff (params: IEnableStaffParams): Promise<boolean> {
  const res: any = await axios({
    // TODO:cf
    // url: '/project_photo_quality/staff/enableStaff'
    url: '/project_cloud/staff/enableStaff',
    method: 'PUT',
    data: params
  })
  return res
}
