import { STORE_TYPE, storeTypeToCN } from '@/model/Enumerate'
import { v4 as uuid } from 'uuid'

export interface ISpotRecordInfo {
  total: number
  commitNum: number
  deleteNum: number
  skipNum: number
  index: number
}

export interface IStaffInfo {
  staffIds: number[]
  name: string
  isNewStaff: boolean
  expertsName: string
  groupLeaderName: string
  supervisorName: string
}

/** 获取用户信息 */
// eslint-disable-next-line max-len
function getStaffInfo (staffInfo: { staffs: any[], experts: any[], group_leader: any[], supervisor: any[]} ): IStaffInfo {
  const staffsInfo = staffInfo.staffs || []
  const staffsNames = staffsInfo.map(item => item.nickname || item.name || '异常')
  let staffIds = staffsInfo.map(item => item.id)
  staffIds = staffIds.filter(item => item)
  const staffsName = staffsNames.join('、')

  const isNewStaff = staffsInfo.some(item => item.is_new_staff)

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
    staffIds,
    isNewStaff,
    name: staffsName,
    expertsName,
    groupLeaderName,
    supervisorName
  }
}
/**
 * @description 流水信息模型
 */
export default class StreamOrderModel {
  id: number
  spotNum?: string
  orderNum: string
  dresserInfo: IStaffInfo
  photographyerInfo: IStaffInfo
  productName: string
  storeName: string
  storeType: STORE_TYPE
  storeTypeCN: string
  photoCount: number
  showAppealBtn: boolean
  note: {
    orderNote: string
    dresserNote: string
    photographyNote: string
  }

  constructor (data: any, spotRecordInfo?: ISpotRecordInfo) {
    this.id = _.get(data, 'id') || uuid()
    this.orderNum = _.get(data, 'order_num') || '异常'
    this.dresserInfo = getStaffInfo(_.get(data, 'dressers') || {})
    this.photographyerInfo = getStaffInfo(_.get(data, 'photographers') || {})
    this.productName = _.get(data, 'product.name') || '异常'
    this.storeName = _.get(data, 'store.name') || '异常'
    this.storeType = _.get(data, 'store.store_type') || STORE_TYPE.UNUSUAL
    this.storeTypeCN = storeTypeToCN[this.storeType]
    this.photoCount = _.get(data, 'photoNum') || 0
    this.showAppealBtn = _.get(data, 'process_appeal') ? false : true
    this.note = {
      orderNote: _.get(data, 'order_note') || '-',
      dresserNote: _.get(data, 'dresser_note') || '-',
      photographyNote: _.get(data, 'photography_note') || '-'
    }

    if (spotRecordInfo) {
      this.getSpotNum(spotRecordInfo)
    }
  }

  // 获取编号
  getSpotNum (spotRecordInfo: ISpotRecordInfo) {
    const spotNum = spotRecordInfo.commitNum
      + spotRecordInfo.skipNum
      + spotRecordInfo.deleteNum
      + spotRecordInfo.index
      + 1
    this.spotNum = `${spotRecordInfo.total}-${spotNum}`
  }
}
