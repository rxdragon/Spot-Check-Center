import axios from '@/plugins/axios'
import { v4 as uuid } from 'uuid'
import { IgetScoreConfigListRes, ILabelClass, ILabelChildren } from '@/model/GradeLabelModel'

/**
 * @description 获取评分配置标签
 * @method GET
 * @returns {Array} 标记数据
 * @author cf 2021/06/09
 * @version @version 1.0.0
 */
export async function getScoreConfigList (): Promise<IgetScoreConfigListRes> {
  const url = '/project_cloud/checkPool' + '/getScoreConfig'
  const res: any = await axios({
    url,
    method: 'GET'
  })
  const chainLine: any = []

  const createData: ILabelClass[] = res.map((item: any) => {
    const childrenData = item.children || []
    const children: ILabelChildren[] = childrenData.map((childrenItem: any) => {
      chainLine.push(childrenItem.id)
      return {
        id: childrenItem.id,
        idString: String(childrenItem.id),
        name: childrenItem.name,
        children: childrenItem.children,
        parentId: childrenItem.score_type_id,
        value: ''
      }
    })
    // 如果有子项目才添加
    if (children.length) {
      children.unshift({
        id: uuid(),
        idString: uuid(),
        name: '一键评分',
        parentId: 0,
        value: '',
        isOneAll: true
      })
    }

    return {
      id: item.id,
      idString: String(item.id),
      name: item.name,
      children
    }
  })
  const labelClass = createData.filter((item: any) => item.children.length)
  return {
    labelClass,
    chainLine
  }
}
