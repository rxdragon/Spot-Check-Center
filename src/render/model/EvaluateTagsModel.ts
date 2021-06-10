import * as PhotoTools from '@/utils/photoTool'

/**
 * @description 评价信息
 */
export default class EvaluateTagsModel {
  totalScore: string // 总评分
  raterName: string // 评分人
  tags?: PhotoTools.ITags[] // 评价标签
  constructor (data: any) {
    // TODO: lj
    this.totalScore = _.get(data, 'commitInfo.score') || ''
    this.raterName = _.get(data, 'takeStaffInfo.name') || ''
    const tags = _.get(data, 'tags') || []
    this.tags = PhotoTools.handleCommitInfo(tags).parentData
  }
}
