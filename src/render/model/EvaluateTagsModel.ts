import { gradeLevelToCN } from '@/model/GradeLabelModel'
export interface ITags {
  id: string
  name: string
  type: string
}

/**
 * @description 处理comitInfo数据
 * @param {*} commitInfo 评价图片
 * @param {*} issueLabel 评价标签
 */
export function handleCommitInfo (issueLabel: any) {
  const parentData: ITags[] = []
  issueLabel.forEach((issueItem: any) => {
    const className = _.get(issueItem, 'parent.score_type.name') || '异常'
    const gradeName = _.get(issueItem, 'parent.name') || '异常'
    const createData:ITags = {
      id: issueItem.id,
      name: `${className}-${gradeName}-${issueItem.name}`,
      type: gradeLevelToCN['small']
    }
    parentData.push(createData)
  })
  return {
    parentData
  }
}

/**
 * @description 评价信息
 */
export default class EvaluateTagsModel {
  totalScore: string // 总评分
  RaterName: string // 评分人
  tags?: ITags[] // 评价标签
  constructor (data: any) {
    // TODO: lj
    this.totalScore = _.get(data, 'commitInfo.score') || ''
    this.RaterName = _.get(data, 'takeStaffInfo.name') || ''
    const tags = _.get(data, 'tags') || []
    this.tags = handleCommitInfo(tags).parentData
  }
}
