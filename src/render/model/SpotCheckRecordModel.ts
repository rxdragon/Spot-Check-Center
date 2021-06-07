/* eslint-disable no-unused-vars */
import { STORE_TYPE, storeTypeToCN } from '@/model/Enumerate'

export default class SpotCheckRecordModel {
  baseData?: any
  id: number | string = ''
  createdAt: string
  orderNum: string
  streamNum: string
  dresser: string
  photographer: string
  note: {
    orderNote: string
    dresserNote: string
    photographyNote: string
  }
  productName: string
  storeName: string
  storeType: STORE_TYPE
  storeTypeCN: string


  constructor (data: any) {
    this.baseData = data
    this.id = data._id
    this.createdAt = data.created_at
    this.orderNum = _.get(data, 'extend.cloud_order_num') || '异常'
    this.streamNum = _.get(data, 'extend.cloud_stream_num') || '异常'

    let dresser = _.get(data, 'extend.dressers') || []
    dresser = dresser.map((item: any) => item.nickname || item.name || '异常')
    this.dresser = dresser.join('、') || '-'
    let photographer = _.get(data, 'extend.photographers') || []
    photographer = photographer.map((item: any) => item.nickname || item.name || '异常')
    this.photographer = photographer.join('、') || '-'
    this.note = {
      orderNote: _.get(data, 'note.order_note') || '',
      dresserNote: _.get(data, 'note.dresser_note') || '',
      photographyNote: _.get(data, 'note.photography_note') || ''
    }
    this.productName = _.get(data, 'product.name') || '异常'
    this.storeName = _.get(data, 'store.name') || '异常'
    this.storeType = _.get(data, 'store.store_type') || ''
    this.storeTypeCN = storeTypeToCN[this.storeType] || '异常'
  }
}
