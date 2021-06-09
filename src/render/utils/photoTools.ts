import {
  CNLevelToType
} from '@/model/Enumerate'

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
      type: CNLevelToType['小']
    }
    parentData.push(createData)
  })
  return {
    parentData
  }
}
