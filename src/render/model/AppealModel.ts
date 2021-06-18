// TODO lj
/* eslint-disable no-unused-vars */
import _ from 'lodash'

interface IAppealOrder {
  num: string
  dresser: string
  supervisor: string
  experts: string
  storeName: string
}

interface IExamineInfo {
  examineName: string
  date: string
}

export enum APPEAL_STATUS {
  WAIT_FIRST_APPEAL = 'wait_first_appeal', // 等待第一次审核
  FIRST_APPEAL = 'first_appeal', // 第一次审核
  FIRST_APPEAL_REJECTED = 'first_appeal_rejected', // 第一次审核拒绝
  WAIT_SECOND_APPEAL = 'wait_second_appeal', // 等待第二次审核
  SECOND_APPEAL = 'second_appeal', // 第二次审核
  SECOND_APPEAL_REJECTED = 'second_appeal_rejected' // 第二次审核拒绝
}

// 修图标准映射中文
export const appealStatusToCN = {
  [APPEAL_STATUS.WAIT_FIRST_APPEAL]: '待初审',
  [APPEAL_STATUS.FIRST_APPEAL]: '初审中',
  [APPEAL_STATUS.FIRST_APPEAL_REJECTED]: '初审拒绝',
  [APPEAL_STATUS.WAIT_SECOND_APPEAL]: '待复审',
  [APPEAL_STATUS.SECOND_APPEAL]: '复审中',
  [APPEAL_STATUS.SECOND_APPEAL_REJECTED]: '复审拒绝'
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
export class AppealListModel {
  // TODO: lj
  base: any
  id: string
  appealName: string
  orderInfo?: IAppealOrder
  appealDate: string
  status: string
  firstExamineInfo?: IExamineInfo
  secondExamineInfo?: IExamineInfo

  constructor (data: any) {
    this.base = data
    this.id = _.get(data, 'id') || ''
    this.appealName = _.get(data, 'name') || '一一'
    this.appealDate = _.get(data, 'created_at') || '2011-10-11'
    const status: APPEAL_STATUS = _.get(data, 'status') || 'wait_first_appeal'
    this.status = status
    this.getOrderInfo()
    this.getFirstExamineInfo()
    this.getSecondExamineInfo()
  }

  // 获取订单信息
  getOrderInfo () {
    const info = {
      num: _.get(this.base, 'order_num') || '',
      dresser: _.get(this.base, 'streamOrder.dressers.nickname') || '二二',
      supervisor: getDresserName(_.get(this.base, 'streamOrder.dressers.supervisor') || []).name,
      experts: getDresserName(_.get(this.base, 'streamOrder.dressers.experts') || []).name,
      storeName: _.get(this.base, 'store.name') || '门店',
    }
    this.orderInfo = Object.assign(info)
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
}
