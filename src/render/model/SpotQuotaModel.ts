export default class SpotQuotaModel {
  baseData?: any
  orderQuantity: number // 被评价单量
  dresserQuantity: string // 被评价化妆师
  staffAvgScore: number
  storeAvgScore?: string
  expertAvgScore?: string
  supervisorAvgScore?: string

  constructor (data: any) {
    this.baseData = data
    this.orderQuantity = _.get(data, 'count.all') || 0
    this.dresserQuantity = _.get(data, 'count_distinct.staff_id') || 0
    this.staffAvgScore = _.get(data, 'avg.commitInfo.star') || 0
    this.getAvg()
  }

  // 获取平均分
  getAvg () {
    let total = 0
    _.get(this.baseData, 'avg_group')['store_id-commitInfo.total'].map((item: any) => {
      total += item.result
    })
    this.storeAvgScore = (total / _.get(this.baseData, 'count_distinct.store_id')).toFixed(2)
    this.expertAvgScore = (total / _.get(this.baseData, 'count_distinct.store_id')).toFixed(2)
    this.supervisorAvgScore = (total / _.get(this.baseData, 'count_distinct.store_id')).toFixed(2)
  }
}
