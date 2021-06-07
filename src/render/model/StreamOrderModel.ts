import { STORE_TYPE, storeTypeToCN } from '@/model/Enumerate'

interface IPagerInfo {
  page: number
  pageSize: number
  index: number
  total: number
}
/**
 * @description 流水信息模型
 */
export default class StreamOrderModel {
  id: number
  spotNum?: string
  orderNumber: string
  dresserName: string
  photographyerName: string
  productName: string
  storeName: string
  storeType: STORE_TYPE
  storeTypeCN: string
  photoCount: number
  aiSpotLabel: string
  note: {
    orderNote: string
    dresserNote: string
    photographyNote: string
  }

  constructor (data: any, pager?: IPagerInfo) {
    // TODO: cf
    this.id = _.get(data, 'id') || 1
    this.orderNumber = 'T202012345678'
    this.dresserName = '张志国'
    this.photographyerName = '泰得'
    this.productName = 'The Girl'
    this.storeName = '龙湖天街'
    this.storeType = STORE_TYPE.BLUE
    this.storeTypeCN = storeTypeToCN[this.storeType]
    this.photoCount = 4
    this.aiSpotLabel = '异常'
    this.note = {
      orderNote: '这里是订单备注',
      dresserNote: '这里摄影备注',
      photographyNote: '这里是化妆备注'
    }

    if (pager) {
      this.getSpotNum(pager)
    }
  }

  // 获取编号
  getSpotNum (pager: IPagerInfo) {
    const spotNum = (pager.page - 1) * pager.pageSize + pager.index
    this.spotNum = `${pager.total}-${spotNum}`
  }
}
