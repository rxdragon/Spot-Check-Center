import { CNLevelToType } from '@/model/GradeLabelModel'
export interface ITags {
  id: string
  name: string
  type: string
}
interface ITypeToCN {
  '小': string
  '中': string
  '拔草': string
  '种草': string
}

export function getTagInfo (label: any) {
  const parentData: ITags[] = []
  label.forEach((issueItem: any) => {
    const className = _.get(issueItem, 'parent.score_type.name') || '异常'
    const gradeName = _.get(issueItem, 'parent.name') || '异常'
    const name: keyof ITypeToCN = issueItem.name
    const createData: ITags = {
      id: issueItem.id,
      name: `${className}-${gradeName}-${issueItem.name}`,
      type: CNLevelToType[name]
    }
    parentData.push(createData)
  })
  return {
    parentData
  }
}
