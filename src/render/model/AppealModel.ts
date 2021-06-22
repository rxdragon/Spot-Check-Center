// TODO lj
/* eslint-disable no-unused-vars */
import _ from 'lodash'

interface IAppealOrder {
  num: string
  dresser: string
  dresserSupervisor: string
  dresserExperts: string
  photographer: string
  photographerSupervisor: string
  photographerExperts: string
  storeName: string
}

interface IExamineInfo {
  examineName: string
  date: string
}

export enum APPEAL_STATUS {
  WAIT_FIRST_APPEAL = 'wait_first_appeal', // 等待第一次审核
  FIRST_APPEAL = 'first_appeal', // 第一次审核
  WAIT_SECOND_APPEAL = 'wait_second_appeal', // 等待第二次审核
  SECOND_APPEAL = 'second_appeal', // 第二次审核
  APPEAL_REJECTED = 'first_appeal_rejected,second_appeal_rejected', // 审核拒绝
  FIRST_APPEAL_REJECTED = 'first_appeal_rejected', // 第一次审核拒绝
  SECOND_APPEAL_REJECTED = 'second_appeal_rejected', // 第二次审核拒绝
  FINISH = 'finish', // 审核通过
  EXPIRED = 'expired' // 过期未处理
}

// 修图标准映射中文
export const appealStatusToCN = {
  [APPEAL_STATUS.WAIT_FIRST_APPEAL]: '待初审',
  [APPEAL_STATUS.FIRST_APPEAL]: '初审中',
  [APPEAL_STATUS.WAIT_SECOND_APPEAL]: '待复审',
  [APPEAL_STATUS.SECOND_APPEAL]: '复审中',
  [APPEAL_STATUS.APPEAL_REJECTED]: '审核拒绝',
  [APPEAL_STATUS.FIRST_APPEAL_REJECTED]: '审核拒绝',
  [APPEAL_STATUS.SECOND_APPEAL_REJECTED]: '审核拒绝',
  [APPEAL_STATUS.FINISH]: '审核通过',
  [APPEAL_STATUS.EXPIRED]: '过期未处理'
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
export class AppealListModel {
  // TODO: lj
  base: any
  id: string
  appealName: string
  orderInfo?: IAppealOrder
  appealDate: string
  status: string
  statusCN: string
  firstExamineInfo?: IExamineInfo
  secondExamineInfo?: IExamineInfo

  constructor (data: any) {
    this.base = data
    this.id = _.get(data, 'id') || ''
    this.appealName = _.get(data, 'applicantInfo.nickname') || '-'
    this.appealDate = _.get(data, 'created_at') || '2011-10-11'
    const status: APPEAL_STATUS = _.get(data, 'status') || 'wait_first_appeal'
    this.status = status
    this.statusCN = appealStatusToCN[status]
    this.getOrderInfo()
    this.getFirstExamineInfo()
    this.getSecondExamineInfo()
  }

  // 获取订单信息
  getOrderInfo () {
    const info = {
      num: _.get(this.base, 'stream_order.order_num') || '-',
      dresser: getName(_.get(this.base, 'stream_order.dressers.staffs') || []).name,
      dresserSupervisor: getName(_.get(this.base, 'stream_order.dressers.supervisor') || []).name,
      dresserExperts: getName(_.get(this.base, 'stream_order.dressers.experts') || []).name,
      photographer: getName(_.get(this.base, 'stream_order.photographers.staffs') || []).name,
      photographerSupervisor: getName(_.get(this.base, 'stream_order.photographers.supervisor') || []).name,
      photographerExperts: getName(_.get(this.base, 'stream_order.photographers.experts') || []).name,
      storeName: _.get(this.base, 'store.name') || '-',
    }
    this.orderInfo = Object.assign(info)
  }

  // 获取初审相关信息
  getFirstExamineInfo () {
    const info = {
      examineName: _.get(this.base, 'firstReviewerInfo').name || '-',
      date: _.get(this.base, 'first_pass_at') || '-'
    }
    this.firstExamineInfo = Object.assign(info)
  }

  // 获取复审相关信息
  getSecondExamineInfo () {
    const info = {
      examineName: _.get(this.base, 'secondReviewerInfo').name || '-',
      date: _.get(this.base, 'second_pass_at') || '-'
    }
    this.secondExamineInfo = Object.assign(info)
  }
}
