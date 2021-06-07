/* eslint-disable no-unused-vars */
import { STORE_TYPE, storeTypeToCN } from '@/model/Enumerate'

export default class StreamOrderModel {
  baseData: any
  orderNum: number | string = ''
  dresserName: string
  photographyerName: string
  productName: string
  photoCount: number | string =''

  storeName: string
  storeType: STORE_TYPE
  storeTypeCN: string

  note: {
    orderNote: string
    dresserNote: string
    photographyNote: string
  }

  constructor (data: any) {
    this.baseData = data
    this.orderNum = 'T2020201302313'
    this.dresserName = '-'
    this.photographyerName = '-'

    this.productName = 'productName'
    this.photoCount = 4

    this.storeName = 'asfasd'
    this.storeType = STORE_TYPE.BLUE
    this.storeTypeCN = storeTypeToCN[this.storeType] || '异常'

    this.note = {
      orderNote: 'orderNote',
      dresserNote: 'dresserNote',
      photographyNote: 'photographyNote'
    }
  }
}
