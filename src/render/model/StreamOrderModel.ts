import { STORE_TYPE, storeTypeToCN } from '@/model/Enumerate'

export interface IPagerInfo {
  page: number
  pageSize: number
  index: number
  total: number
}

export interface IStaffInfo {
  name: string
  expertsName: string
  groupLeaderName: string
  supervisorName: string
}

/** 获取用户信息 */
function getStaffInfo (staffInfo: { staff: any, experts: any[], group_leader: any[], supervisor: any[]} ): IStaffInfo {
  const name = _.get(staffInfo, 'staff.nickname') || _.get(staffInfo, 'staff.name') || '-'
  const expertsInfo = staffInfo.experts || []
  const expertsNames = expertsInfo.map(item => item.nickname || item.name || '异常')
  const expertsName = expertsNames.join('、')

  const groupLeaderInfo = staffInfo.group_leader || []
  const groupLeaderNames = groupLeaderInfo.map(item => item.nickname || item.name || '异常')
  const groupLeaderName = groupLeaderNames.join('、')

  const supervisorInfo = staffInfo.supervisor || []
  const supervisorNames = supervisorInfo.map(item => item.nickname || item.name || '异常')
  const supervisorName = supervisorNames.join('、')

  return {
    name,
    expertsName,
    groupLeaderName,
    supervisorName
  }
}
/**
 * @description 流水信息模型
 */
export default class StreamOrderModel {
  spotNum?: string
  orderNum: string
  dresserInfo: IStaffInfo
  photographyerInfo: IStaffInfo
  productName: string
  storeName: string
  storeType: STORE_TYPE
  storeTypeCN: string
  photoCount: number
  note: {
    orderNote: string
    dresserNote: string
    photographyNote: string
  }

  constructor (data: any, pager?: IPagerInfo) {
    this.orderNum = _.get(data, 'order_num') || '异常'
    this.dresserInfo = getStaffInfo(_.get(data, 'dressers') || {})
    this.photographyerInfo = getStaffInfo(_.get(data, 'photographers') || {})
    this.productName = _.get(data, 'product.name') || '异常'
    this.storeName = _.get(data, 'store.name') || '异常'
    this.storeType = _.get(data, 'store.store_type') || STORE_TYPE.UNUSUAL
    this.storeTypeCN = storeTypeToCN[this.storeType]
    this.photoCount = _.get(data, 'photoNum') || 0
    this.note = {
      orderNote: _.get(data, 'order_note') || '-',
      dresserNote: _.get(data, 'dresser_note') || '-',
      photographyNote: _.get(data, 'photography_note') || '-'
    }

    if (pager) {
      this.getSpotNum(pager)
    }
  }

  // 获取编号
  getSpotNum (pager: IPagerInfo) {
    const spotNum = (pager.page - 1) * pager.pageSize + pager.index + 1
    this.spotNum = `${pager.total}-${spotNum}`
  }
}
