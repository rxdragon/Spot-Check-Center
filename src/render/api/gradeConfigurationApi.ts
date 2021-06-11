import axios from '@/plugins/axios'
// eslint-disable-next-line no-unused-vars
import { getApiUrl, IEvaluateAPi } from './evaluateApi'
import GradeLabelModel, { SCORE_TYPE } from '@/model/GradeLabelModel'

/**
 * @description 获取标签配置
 */
export interface interactionGradeLabelModel extends GradeLabelModel {
  isEdit: boolean
  editName: string
}
export async function getScoreConfigByEdit (params: IEvaluateAPi): Promise<interactionGradeLabelModel[]> {
  const url = '/project_cloud/checkPool/getScoreConfig'
  // const url = `${getApiUrl(params.type, params.organizationType)}/getScoreConfig`

  const res: any = await axios({
    url,
    method: 'GET',
  })
  const createData: interactionGradeLabelModel[] = res.map((item: any) => {
    const gradeLabelModel = new GradeLabelModel(item)
    return {
      ...gradeLabelModel,
      isEdit: false,
      editName: gradeLabelModel.name
    }
  })
  return createData
}

/** 
 * @description 新增品类
 */
interface IAddScoreTypeParams extends IEvaluateAPi {
  name: string
}
export async function addScoreType (params: IAddScoreTypeParams) {
  const url = '/project_cloud/checkPool/addScoreType'
  // const url = `${getApiUrl(params.type, params.organizationType)}/addScoreType`

  const res = await axios({
    url,
    method: 'POST',
    data: params
  })
  return res
}

/**
 * @description 编辑类别名称
 * @param params 
 */
export async function editScoreTypeName (params: IEvaluateAPi): Promise<boolean> {
  const url = '/project_cloud/checkPool/editScoreType'
  // const url = `${getApiUrl(params.type, params.organizationType)}/editScoreType`
  const res: any = await axios({
    url,
    method: 'POST',
    data: params
  })

  return res
}

/**
 * @description 编辑分数
 * @param params 
 */
interface IEditScoreConfigParams extends IEvaluateAPi {
  id: number
  name: string
  children: {
    name: string
    score: number | string
    type: SCORE_TYPE
  }[]
}
export async function editScoreConfig (params: IEditScoreConfigParams) {
  const url = '/project_cloud/checkPool/editScoreConfig'
  // const url = `${getApiUrl(params.type, params.organizationType)}/editScoreConfig`

  const res: any = axios({
    url,
    method: 'PUT',
    data: params
  })
  return res
}

/**
 * @description 新增分数
 * @param params 
 */
 interface IAddScoreConfigParams extends IEvaluateAPi {
  name: string
  scoreTypeId: number
  children: {
    name: string
    score: number | string
    type: SCORE_TYPE
  }[]
}
export async function addScoreConfig (params: IAddScoreConfigParams): Promise<number> {
  const url = '/project_cloud/checkPool/addScoreConfig'
  // const url = `${getApiUrl(params.type, params.organizationType)}/addScoreConfig`

  const res: any = axios({
    url,
    method: 'POST',
    data: params
  })
  return res
}

/**
 * @description 删除评分项
 */
interface IDelScoreConfigParams extends IEvaluateAPi {
  id: number
}
export function delScoreConfig (params: IDelScoreConfigParams) {
  const url = '/project_cloud/checkPool/delScoreConfig'
  // const url = `${getApiUrl(params.type, params.organizationType)}/delScoreConfig`
  return axios({
    url,
    method: 'PUT',
    data: params
  })
}

