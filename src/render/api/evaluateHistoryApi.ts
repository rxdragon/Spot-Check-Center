import axios from '@/plugins/axios'
import PoolRecordModel from '@/model/PoolRecordModel'
import { getApiUrl, IEvaluateAPi } from '@/api/evaluateApi'
import { SPOT_TYPE, ORGANIZATION_TYPE } from '@/model/Enumerate'

/**
 * @description 获取历史记录列表
 */
export interface IgetHistoryRecordsParams extends IEvaluateAPi {
  page: number
  pageSize: number
  startTime?: string
  endTime?: string
  productIds?: idType[]
  problemTagsIds?: idType[]
  staffIds?: idType[]
  score?: number[]
  orderNum?: string
  onlyNew?: boolean
  onlyOld?: boolean
  supervisorArr?: idType[]
}

interface IgetHistoryRecordsRes {
  list: PoolRecordModel[]
  total: number
}
export async function getHistoryRecords (params: IgetHistoryRecordsParams): Promise<IgetHistoryRecordsRes> {
  const url = `${getApiUrl(params.type, params.organizationType)}/getSearchHistory`
  const res: any = await axios({
    url,
    method: 'POST',
    data: params
  })

  const listData: PoolRecordModel[] = res.data.map((historyRecordItem: any) => {
    const poolRecordModel = new PoolRecordModel(historyRecordItem)
    poolRecordModel.getStreamInfo(historyRecordItem.streamOrder)
    poolRecordModel.getPoolPhotoList()
    poolRecordModel.getTags(historyRecordItem)
    return poolRecordModel
  })

  const createData = {
    list: listData,
    total: 10
  }
  return createData
}

/**
 * @description 获取评价标签选择框数据
 */
function getPoolType (type: SPOT_TYPE, organizationType: ORGANIZATION_TYPE) {
  switch (`${organizationType}${type}`) {
    case `${ORGANIZATION_TYPE.HIMO}${SPOT_TYPE.MAKEUP}`:
      return 'himo_makeup_pool'
    case `${ORGANIZATION_TYPE.HIMO}${SPOT_TYPE.PHOTOGRAPHY}`:
      return 'himo_photography_pool'
    case `${ORGANIZATION_TYPE.FAMILY}${SPOT_TYPE.MAKEUP}`:
      return 'family_makeup_pool'
    case `${ORGANIZATION_TYPE.FAMILY}${SPOT_TYPE.PHOTOGRAPHY}`:
      return 'family_photography_pool'
    default:
      return ''
  }
}
 interface ISelect {
  label: string
  value: string
}

export interface IFilterSelectData {
  label: string
  value: string | number
  children?: ISelect[]
}

export async function getEvaluateSelectList (params: IEvaluateAPi) {
  const newParams = {
    poolName: getPoolType(params.type, params.organizationType),
    withTrashed: false
  }
  const res: any = await axios({
    url: '/project_photo_quality/common/getScoreConfigTree',
    method: 'GET',
    params: newParams
  })
 
  return res
}
