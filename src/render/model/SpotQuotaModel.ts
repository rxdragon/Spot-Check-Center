export default class SpotQuotaModel {
  baseData?: any
  orderQuantity: number // 被评价单量
  dresserQuantity: number // 被评价化妆师
  staffAvgScore: number
  storeAvgScore?: number
  expertAvgScore?: number
  supervisorAvgScore?: number

  constructor (data: any) {
    this.baseData = data
    this.orderQuantity = _.get(data, 'count.all') || 0
    this.dresserQuantity = _.get(data, 'count_distinct.staff_id') || 0
    this.staffAvgScore = _.get(data, 'avg.commitInfo.star') || 0
    this.getAvg()
  }

  // 获取平均分
  getAvg () {
    const total = _.get(this.baseData, 'avg_group') || 0
    this.storeAvgScore = Math.ceil((total / _.get(this.baseData, 'count_distinct.store_id')))
    this.expertAvgScore = Math.ceil((total / _.get(this.baseData, 'count_distinct.store_id')))
    this.supervisorAvgScore = Math.ceil((total / _.get(this.baseData, 'count_distinct.store_id')))
  }
}
