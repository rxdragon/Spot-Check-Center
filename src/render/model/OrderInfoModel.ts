export default class OrderInfoModel {
  id: string // 订单号
  productName: string // 产品名称
  photoNum: number // 照片张数
  storeType: string // 门店类型
  storeName: string // 门店
  dresserLow: string // 化妆师
  dresserMiddle: string // 化妆督导
  dresserTop: string // 化妆专家
  orderRemarks: string // 订单备注
  filmRemarks: string // 摄影备注
  dressRemarks: string // 化妆备注

  constructor (data: any) {
    this.id = _.get(data, 'id', '')
    this.productName = _.get(data, 'productName', 'test')
    this.photoNum = _.get(data, 'photoNum', 11)
    this.storeType = _.get(data, 'storeType', '海马')
    this.storeName = _.get(data, 'storeName', '下沙海马')
    this.dresserLow = _.get(data, 'dresserLow', '张三')
    this.dresserMiddle = _.get(data, 'dresserMiddle', '里斯')
    this.dresserTop = _.get(data, 'dresserTop', '王武')
    this.orderRemarks = _.get(data, 'orderRemarks', 'vip订单')
    this.filmRemarks = _.get(data, 'filmRemarks', '要古风呀')
    this.dressRemarks = _.get(data, 'dressRemarks', '要浓妆呀')
  }
}
