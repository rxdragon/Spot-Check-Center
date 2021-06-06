
export default class EvaluateModel {
  totalScore: string | number // 总分
  scoringPerson: string // 评分人

  constructor (data: any) {
    this.totalScore = _.get(data, 'totalScore') || 0
    this.scoringPerson = _.get(data, 'scoringPerson') || ''
  }
}
