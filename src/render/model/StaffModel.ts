export default class StaffModel {
  id: number
  name: string // 真实姓名
  nickName: string // 花名
  rolesName: string // 角色组姓名
  rolesId: number // 角色id
  positionText: string // 岗位名称
  available: boolean // 是否可用
  availableCN: string // 可用 中文字段
  departmentName: string // 部门名称
  positionName: string // 身份名称
  positionType: string // 身份类型
  positionId: idType // 身份
  permissions: { // 权限信息
    id: number
    name: string
    title: string
  }[]
  configStore: [] // 管辖门店

  constructor (staffData: any) {
    this.id = staffData.id || ''
    this.name = staffData.name || '异常'
    this.nickName = staffData.nickname || '异常'
    this.rolesName = _.get(staffData, 'roles.title') || '异常'
    this.rolesId = _.get(staffData, 'roles.role_id') || '异常'
    this.positionText = _.get(staffData, 'position_text') || '异常'
    this.positionName = _.get(staffData, 'position.name') || '异常'
    this.positionType = _.get(staffData, 'position.type') || '异常'
    this.positionId = _.get(staffData, 'position.id') || ''
    this.available = Boolean(staffData.account_available)
    this.availableCN = this.available ? '启用' : '禁用'
    this.departmentName = _.get(staffData, 'department.name') || '-'
    this.permissions = _.get(staffData, 'permissions') || []
    this.configStore = _.get(staffData, 'config_store_ids') || []
  }
}
