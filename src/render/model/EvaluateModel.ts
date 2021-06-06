
export default class EvaluateModel {
  totalScore: string // 总分
  scoringPerson: string // 评分人


  constructor (data: any) {
    this.totalScore = _.get(data, 'totalScore', '10')
    this.scoringPerson = _.get(data, 'scoringPerson', '张三')
  }
}
