import axios from '@/plugins/axios'
import StaffModel from '@/model/StaffModel'
import { STORE_TYPE } from '@/model/Enumerate'

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

/**
 * @description 搜索用户信息
 */
export interface IGetStaffInfoParams {
  // mock数据 后面不需要staffNum 入参
  staffNum?: number | string
  staffId?: number | string
  staffName?: string
}
export async function getStaffInfo (params: IGetStaffInfoParams) {
  const res: any = await axios({
    // TODO:cf
    // url: '/project_photo_quality/staff/getStaffInfo'
    url: '/project_cloud/staff/getStaffInfo',
    method: 'GET',
    params
  })
  const createData = new StaffModel(res)
  return createData
}


/**
 * @description 获取全部门店信息
 * @param value 
 * @returns 
 */
function findTypeId (value: STORE_TYPE): number {
  switch (value) {
    case STORE_TYPE.BLUE:
      return -1
    case STORE_TYPE.MASTER:
      return -2
    case STORE_TYPE.KIDS:
      return -3
    case STORE_TYPE.MAINTO:
      return -4
    default:
      return -1
  }
}
interface IProductInfo {
  id: number
  pid: number
  label: string
  name?: STORE_TYPE
  children: any[]
  disabled?: boolean
}
export async function getAllStore (disabledId: any[] = []) {
  const res: any = await axios({
    // TODO:cf
    // url: '/project_photo_quality/staff/getStaffInfo'
    url: '/project_cloud/common/getAllProduct',
    method: 'GET',
  })
  let createData: IProductInfo[] = [
    {
      id: -1,
      pid: 0,
      name: STORE_TYPE.BLUE,
      label: '蓝标',
      children: []
    }, {
      id: -2,
      pid: 0,
      name: STORE_TYPE.MASTER,
      label: '大师',
      children: []
    }, {
      id: -3,
      pid: 0,
      name: STORE_TYPE.KIDS,
      label: 'kids',
      children: []
    }, {
      id: -4,
      pid: 0,
      name: STORE_TYPE.MAINTO,
      label: '缦图',
      children: []
    }
  ]
  res.forEach((productItem: any) => {
    const findType = createData.find(typeItem => typeItem.name === productItem.retouch_standard)
    if (findType) {
      const productInfo: IProductInfo = {
        children: [],
        id: productItem.id,
        pid: findTypeId(findType.name as STORE_TYPE),
        label: productItem.name || '暂无名称',
        disabled: disabledId.includes(productItem.id)
      }
      findType.children = [...findType.children, productInfo]
    }
  })
  createData = createData.filter(listItem => listItem.children.length)
  return createData
}

/**
 * @description 获取全部权限
 */
export interface IPermissionItem {
  desc: string
  idName: string
  id: number
  menu_id: number
  module_id: number
  name: string
  title: string
  isRole: boolean
}
export interface IMenuItem {
  checkPermission: number[]
  idName: string
  id: number
  isIndeterminate: boolean
  isShow: boolean
  module_id: number
  name: string
  permission: IPermissionItem[]
  setAll: boolean
  isRole: boolean
}
export interface IModuleItem {
  checkMenu: IMenuItem[]
  idName: string
  id: number
  isIndeterminate: boolean
  menu: IMenuItem[]
  name: string
  setAll: boolean
  isRole: boolean
}
export async function getJurisdictionList () {
  const res: any = await axios({
    url: '/project_cloud/staff/getPermissionList',
    method: 'GET'
  })

  const permissions: IModuleItem[] = []
  res.forEach((permissionItem: any) => {
    const nameArr = permissionItem.name.split('.')
    const titleNameArr = permissionItem.title.split('-')
    const moduleName = nameArr[0]
    const moduleTitleName = titleNameArr[0]
    const menuName = nameArr[1]
    const menuTitleName = titleNameArr[1]
    const permissionName = nameArr[2]
    const permissionTitleName = titleNameArr[2]
    const findModuleItem = permissions.find(moduleItem => moduleItem.idName === moduleName)
    if (findModuleItem) {
      const findMenuItem = findModuleItem.menu.find(menuItem => menuItem.idName === menuName)
      if (findMenuItem) {
        const newPermission = {
          desc: permissionTitleName,
          idName: permissionName,
          id: permissionItem.permission_id,
          menu_id: findMenuItem.id,
          module_id: findModuleItem.id,
          name: permissionName,
          title: permissionTitleName,
          isRole: false
        }
        findMenuItem.permission.push(newPermission)
      } else {
        const newPermission = {
          desc: permissionTitleName,
          idName: permissionName,
          id: permissionItem.permission_id,
          menu_id: 0,
          module_id: findModuleItem.id,
          name: permissionName,
          title: permissionTitleName,
          isRole: false
        }
        const menuItem = {
          checkPermission: [],
          idName: menuName,
          id: findModuleItem.menu.length,
          isIndeterminate: false,
          isShow: false,
          module_id: 0,
          name: menuTitleName,
          permission: [newPermission],
          setAll: false,
          isRole: false
        }
        findModuleItem.menu.push(menuItem)
      }
    } else {
      const newPermission = {
        desc: permissionTitleName,
        idName: permissionName,
        id: permissionItem.permission_id,
        menu_id: 0,
        module_id: 0,
        name: permissionName,
        title: permissionTitleName,
        isRole: false
      }
      const newMenu = {
        checkPermission: [],
        idName: menuName,
        id: 0,
        isIndeterminate: false,
        isShow: false,
        module_id: 0,
        name: menuTitleName,
        permission: [newPermission],
        setAll: false,
        isRole: false
      }
      const moduleItem = {
        checkMenu: [],
        idName: moduleName,
        id: permissions.length,
        isIndeterminate: false,
        menu: [newMenu],
        name: moduleTitleName,
        setAll: false,
        isRole: false
      }
      permissions.push(moduleItem)
    }
  })
  return permissions
}

/**
 * @description 获取角色组对应权限
 * @param params 
 */
interface IGetRoleInfoParams {
  roleId: number
  additionInfo: boolean
}
interface IGetRoleInfoRes {
  permissions: any[]
}
export async function getRoleInfo (params: IGetRoleInfoParams): Promise<IGetRoleInfoRes> {
  const res: any = await axios({
    // TODO:cf
    url: '/project_cloud/staff/getRoleInfo',
    method: 'GET',
    params
  })
  return res
}
