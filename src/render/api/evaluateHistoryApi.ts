import axios from '@/plugins/axios'
import PoolRecordModel from '@/model/PoolRecordModel'
import { getApiUrl, IEvaluateAPi } from '@/api/evaluateApi'

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
  // todo:cf
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
 interface ISelect {
  label: string
  value: string
}

export interface IFilterSelectData {
  label: string
  value: string | number
  children?: ISelect[]
}
interface ISelectParams {
  type: string
}
export async function getEvaluateSelectList (params: ISelectParams) {
  // const msg: any = await axios({
  //   url: '/project-photo-quality/common/getScoreConfigTree',
  //   method: 'get',
  //   params
  // })

  const msg = {
    "msg": [{
      "children": [{
        "children": [{
          "id": 4,
          "name": "拔草",
          "score": 5,
          "type": "deduct"
        }],
        "id": 3,
        "name": "服装",
        "score": 1,
        "type": "deduct"
      }],
      "id": 2,
      "name": "液化"
    }],
    "success": true
  }

  return msg.msg
}
