import * as GetTags from '@/utils/getTags'

/**
 * @description 评价信息
 */
export default class EvaluateTagsModel {
  totalScore: string // 总评分
  raterName: string // 评分人
  isReEvaluate: boolean // 重新评价
  tags: GetTags.ITags[] // 评价标签

  constructor (data: any) {
    // TODO: lj
    this.totalScore = _.get(data, 'commitInfo.score') || ''
    this.raterName = _.get(data, 'takeStaffInfo.name') || ''
    this.isReEvaluate = Boolean(_.get(data, 'commitInfo.oldTakeStaffInfo'))

    const tags = _.get(data, 'tags') || []
    this.tags = GetTags.getTagInfo(tags).parentData
  }
}
