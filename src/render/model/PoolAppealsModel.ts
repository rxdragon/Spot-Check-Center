import { SPOT_TYPE, spotTypeCN } from '@/model/Enumerate'

/**
 * @description 抽片申诉模型
 */
export default class PoolAppealsModel {
  base: any
  id: string | number
  state: string
  stateCN: string
  spotType: SPOT_TYPE
  spotTypeCN: string
  proposerName: string
  auditPeople: string
  handlerPeople: string
  appealResult: string
  appealRemark: string

  constructor (data: any) {
    // TODO: cf
    this.base = data
    this.id = 'asdas'
    this.state = 'appeal'
    this.stateCN = '初审中'
    this.spotType = SPOT_TYPE.MAKEUP
    this.spotTypeCN = spotTypeCN[this.spotType]
    this.proposerName = '申述人名字'
    this.auditPeople = '审核人名字'
    this.handlerPeople = '处理人名字'
    this.appealResult = '申述结果'
    this.appealRemark = '申述备注'
  }
}
