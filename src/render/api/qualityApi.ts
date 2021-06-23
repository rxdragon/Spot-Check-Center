import axios from '@/plugins/axios'
import { ORGANIZATION_TYPE, SPOT_TYPE } from '@/model/Enumerate'
import SpotQuotaModel from '@/model/SpotQuotaModel'
import { IEvaluateAPi } from '@/api/evaluateApi'
import PoolRecordModel from '@/model/PoolRecordModel'

/**
 * @description 根据机构类型获取不同地址
 * @returns 
 */
export function getApiUrl (type: SPOT_TYPE, organizationType: ORGANIZATION_TYPE) {
  switch (`${organizationType}${type}`) {
    case `${ORGANIZATION_TYPE.HIMO}${SPOT_TYPE.MAKEUP}`:
      return '/project_photo_quality/himoMakeupPool'
    case `${ORGANIZATION_TYPE.HIMO}${SPOT_TYPE.PHOTOGRAPHY}`:
      return '/project_photo_quality/himoPhotographyPool'
    case `${ORGANIZATION_TYPE.FAMILY}${SPOT_TYPE.MAKEUP}`:
      return '/project_photo_quality/familyMakeupPool'
    case `${ORGANIZATION_TYPE.FAMILY}${SPOT_TYPE.PHOTOGRAPHY}`:
      return '/project_photo_quality/familyPhotographyPool'
    default:
      return ''
  }
}

export interface IgetQualityParams extends IEvaluateAPi {
  startTime: string
  endTime: string
  productIds?: idType[],
  problemTagsIds?: idType[],
  supervisorArr?: idType[],
  staffIds?: idType[],
  score?: number[],
  orderNum?: string,
  onlyNew?: boolean,
  onlyOld?: boolean,
  page?: number,
  pageSize?: number
}

export interface IGetReportRes {
  list: PoolRecordModel[],
  total: number
}

/**
 * @description 质检报告评分明细(全员)
 * @param {*} params
 */
export async function getAllQualityReport (params: IgetQualityParams): Promise<IGetReportRes> {
  // TODO lj
  const url = `${getApiUrl(params.type, params.organizationType)}/getAllQualityReport`
  const res: any = await axios({
    url,
    method: 'POST',
    data: params
  })
  const data = res.data
  const list: PoolRecordModel[] = data.map((item: any) => {
    const poolRecordModel = new PoolRecordModel(item)
    poolRecordModel.getStreamInfo(item.streamOrder)
    poolRecordModel.getTags()
    poolRecordModel.getPoolPhotoList(item.photos)
    return poolRecordModel
  })
  const createData: IGetReportRes = {
    list: list,
    total: res.total
  }
  return createData
}

/**
 * @description 质检报告评分明细(区域)
 * @param {*} params
 */
export async function getAreaQualityReport (params: IgetQualityParams): Promise<IGetReportRes> {
  // TODO lj
  const url = `${getApiUrl(params.type, params.organizationType)}/getAreaQualityReport`
  const res: any = await axios({
    url,
    method: 'POST',
    data: params
  })
  const data = res.data
  const list: PoolRecordModel[] = data.map((item: any, index: number) => {
    const poolRecordModel = new PoolRecordModel(item)
    poolRecordModel.getStreamInfo(item.streamOrder)
    poolRecordModel.getTags()
    poolRecordModel.getPoolPhotoList(item.photos)
    return poolRecordModel
  })
  const createData: IGetReportRes = {
    list: list,
    total: res.total
  }
  return createData
}

/**
 * @description 质检报告绩效(全员)
 * @param {*} params
 */
export async function getAllQuota (params: IgetQualityParams) {
  // TODO lj
  const url = `${getApiUrl(params.type, params.organizationType)}/getAllQuota`
  const res = await axios({
    url,
    method: 'POST',
    data: params
  })

  const data = new SpotQuotaModel(res)

  const createData = {
    data: data
  }
  return createData
}

/**
 * @description 质检报告绩效(区域)
 * @param {*} params
 */
export async function getAreaQuota (params: IgetQualityParams) {
  // TODO lj
  const url = `${getApiUrl(params.type, params.organizationType)}/getAreaQuota`
  const res = await axios({
    url,
    method: 'POST',
    data: params
  })

  const data = new SpotQuotaModel(res.data)
  const createData = {
    data: data
  }
  return createData
}

