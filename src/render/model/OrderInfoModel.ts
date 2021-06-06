export default class OrderInfoModel {
  id: string // 订单号
  productName: string // 产品名称
  photoNum: string | number // 照片张数
  storeType: string // 门店类型
  storeName: string // 门店
  dresserLow: string // 化妆师
  dresserMiddle: string // 化妆督导
  dresserTop: string // 化妆专家
  orderRemarks: string // 订单备注
  filmRemarks: string // 摄影备注
  dressRemarks: string // 化妆备注

  constructor (data: any) {
    this.id = _.get(data, 'id') || ''
    this.productName = _.get(data, 'productName') || ''
    this.photoNum = _.get(data, 'photoNum') || 0
    this.storeType = _.get(data, 'storeType') || ''
    this.storeName = _.get(data, 'storeName') || ''
    this.dresserLow = _.get(data, 'dresserLow') || ''
    this.dresserMiddle = _.get(data, 'dresserMiddle') || ''
    this.dresserTop = _.get(data, 'dresserTop') || ''
    this.orderRemarks = _.get(data, 'orderRemarks') || ''
    this.filmRemarks = _.get(data, 'filmRemarks') || ''
    this.dressRemarks = _.get(data, 'dressRemarks') || ''
  }
}
