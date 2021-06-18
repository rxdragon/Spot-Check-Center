import StreamOrderModel from "./StreamOrderModel"

interface scoreConfigs {
  name: string
  id: number | string
  parentId: number | string
  score: number | string
  type: string
  from: string
  is_extra: string
}

export default class PoolItemModel {
  baseData: any
  businessId: number | string
  commitInfo: {
    scoreConfigs: scoreConfigs
    totalScore: number | string
    status: string
  }
  orderInfo?: StreamOrderModel

  constructor (data: any) {
    this.baseData = data
    this.businessId = data.businessId
    this.commitInfo = {
      scoreConfigs: {
        name: 'asfsad',
        id: 234,
        parentId: 345,
        score: 324324,
        type: 'ghgfh',
        from: 'yyhhh',
        is_extra: 'hhhh'
      },
      totalScore: 'asfas',
      status: 'asdfsfgf',
    }
  }

  public getOrderInfo () {
    const orderInfo = _.get(this.baseData, 'order_info') || {}
    this.orderInfo = new StreamOrderModel(orderInfo)
  }
}
