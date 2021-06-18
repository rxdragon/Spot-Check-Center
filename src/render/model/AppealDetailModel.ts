import AuditSpotPhotoModel from '@/model/AuditSpotPhotoModel'
import { APPEAL_STATUS, appealStatusToCN } from '@/model/AppealModel'
import StreamOrderModel from '@/model/StreamOrderModel'


export interface IAppealOrder {
  num: string
  productName: string
  dresser: string
  supervisor: string
  experts: string
  storeName: string
}

interface IExamineInfo {
  examineName: string
  date: string
}

/** 获取用户信息 */
// eslint-disable-next-line max-len
function getDresserName (list: any[]) {
  const nameList: string[] = list.map(item => item.nickname || item.name || '异常')
  const name = nameList.join(',')
  return {
    name
  }
}

/**
 * @description 申诉列表
 */
export default class AppealListModel {
  // TODO: lj
  base: any
  id: string
  appealNote: string
  orderInfo?: IAppealOrder[]
  status: string
  firstExamineInfo?: IExamineInfo
  secondExamineInfo?: IExamineInfo
  photoList?: AuditSpotPhotoModel[]
  streamInfo?: StreamOrderModel

  constructor (data: any) {
    this.base = data
    this.id = _.get(data, 'id') || ''
    const status: APPEAL_STATUS = _.get(data, 'status') || 'wait_first_appeal'
    this.status = appealStatusToCN[status]
    this.appealNote = _.get(data, 'appeal.note') || ''
    this.getOrderInfo()
    this.getFirstExamineInfo()
    this.getSecondExamineInfo()
    this.getPoolPhotoList()
    this.getStreamInfo()
  }

  // 获取订单table信息
  getOrderInfo () {
    const info = {
      num: _.get(this.base, 'order_num') || '',
      productName: _.get(this.base, 'product.name') || '',
      dresser: _.get(this.base, 'streamOrder.dressers.nickname') || '二二',
      supervisor: getDresserName(_.get(this.base, 'dressers.supervisor') || []).name,
      experts: getDresserName(_.get(this.base, 'dressers.experts') || []).name,
      storeName: _.get(this.base, 'store.name') || '门店',
    }
    this.orderInfo = [info]
  }

  // 获取订单信息
  getStreamInfo () {
    const streamData = _.get(this.base, 'streamData') || _.get(this.base, 'streamOrder') || {}
    this.streamInfo = new StreamOrderModel(streamData)
  }

  // 获取初审相关信息
  getFirstExamineInfo () {
    const info = {
      examineName: _.get(this.base, 'first_reviewer.name') || '五五',
      date: _.get(this.base, 'first_pass_at') || '2019-11-11'
    }
    this.firstExamineInfo = Object.assign(info)
  }

  // 获取复审相关信息
  getSecondExamineInfo () {
    const info = {
      examineName: _.get(this.base, 'second_reviewer.name') || '六六',
      date: _.get(this.base, 'second_pass_at') || '2019-11-11'
    }
    this.secondExamineInfo = Object.assign(info)
  }

  // 获取照片相关数据
  getPoolPhotoList () {
    const photoList = _.get(this.base, 'photos') || []
    this.photoList = photoList.map((photoItem: any) => new AuditSpotPhotoModel(photoItem.photo_quality))
  }
}
