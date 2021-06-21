import AuditSpotPhotoModel from '@/model/AuditSpotPhotoModel'
import { APPEAL_STATUS, appealStatusToCN } from '@/model/AppealModel'
import StreamOrderModel from '@/model/StreamOrderModel'
import * as GetTags from '@/utils/getTags'


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
function getName (list: any[]) {
  const realList = (list instanceof Array) ? list : []
  const nameList: string[] = realList.map(item => item.nickname || item.name || '-')
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
  statusCN: string
  rejectedNote: string
  firstExamineInfo?: IExamineInfo
  secondExamineInfo?: IExamineInfo
  photoList?: AuditSpotPhotoModel[]
  streamInfo?: StreamOrderModel
  tagsList?: GetTags.ITags[]

  constructor (data: any) {
    this.base = data
    this.id = _.get(data, 'id') || ''
    const status: APPEAL_STATUS = _.get(data, 'status') || 'wait_first_appeal'
    this.statusCN = appealStatusToCN[status]
    this.status = status
    this.appealNote = _.get(data, 'appeal.note') || ''
    this.rejectedNote = _.get(data, 'rejected_note') || ''
    this.getOrderInfo()
    this.getFirstExamineInfo()
    this.getSecondExamineInfo()
    this.getPoolPhotoList()
    this.getStreamInfo()
    this.getTags()
  }

  // 获取订单table信息
  getOrderInfo () {
    const info = {
      num: _.get(this.base, 'stream_order.order_num') || '',
      productName: _.get(this.base, 'stream_order.product.name') || '',
      dresser: '11', // TODO lj
      supervisor: getName(_.get(this.base, 'stream_order.dressers.supervisor') || []).name,
      experts: getName(_.get(this.base, 'stream_order.dressers.experts') || []).name,
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
      examineName: getName(_.get(this.base, 'firstReviewerInfo')).name || '-',
      date: _.get(this.base, 'first_pass_at') || '-'
    }
    this.firstExamineInfo = Object.assign(info)
  }

  // 获取复审相关信息
  getSecondExamineInfo () {
    const info = {
      examineName: getName(_.get(this.base, 'secondReviewerInfo')).name || '-',
      date: _.get(this.base, 'second_pass_at') || '-'
    }
    this.secondExamineInfo = Object.assign(info)
  }

  // 获取照片相关数据
  getPoolPhotoList () {
    const photoList = _.get(this.base, 'photos') || []
    this.photoList = photoList.map((photoItem: any) => new AuditSpotPhotoModel(photoItem.photo_quality))
  }

  // 获取申诉标签
  getTags () {
    const tagsList = _.get(this.base, 'appeal_content') || []
    this.tagsList = GetTags.getTagInfo(tagsList).parentData
  }
}
