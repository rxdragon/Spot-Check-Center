export default class StaffModel {
  id: number
  name: string // 真实姓名
  nickName: string // 花名
  rolesName: string // 角色组姓名
  rolesId: number // 角色id
  positionName: string // 岗位名称
  positionType: string // 岗位类型
  available: boolean // 是否可用
  availableCN: string

  constructor (staffData: any) {
    this.id = staffData.id || ''
    this.name = staffData.real_name || '异常'
    this.nickName = staffData.name || '异常'
    this.rolesName = _.get(staffData, 'roles.title') || '异常'
    this.rolesId = _.get(staffData, 'roles.role_id') || '异常'
    this.positionName = _.get(staffData, 'position.name') || '异常'
    this.positionType = _.get(staffData, 'position.type') || '异常'
    this.available = Boolean(staffData.account_available)
    this.availableCN = this.available ? '启用' : '禁用'
  }
}
