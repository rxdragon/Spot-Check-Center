// todo: cf
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ORGANIZATION_TYPE, SPOT_TYPE } from '@/model/Enumerate'

import axios from '@/plugins/axios'
import { v4 as uuid } from 'uuid'
import { IgetScoreConfigListRes, ILabelClass, ILabelChildren } from '@/model/GradeLabelModel'
import PoolRecordModel from '@/model/PoolRecordModel'

// 请求api接口
export interface IEvaluateAPi {
  type: any
  organizationType: ORGANIZATION_TYPE
}

/**
 * @description 更具机构和抽片类型获取不同地址
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

/**
 * @description 获取评分配置标签
 * @method GET
 * @returns {Array} 标记数据
 * @author cf 2021/06/09
 * @version @version 1.0.0
 */
export async function getScoreConfigList (params: IEvaluateAPi): Promise<IgetScoreConfigListRes> {
  const url = `${getApiUrl(params.type, params.organizationType)}/getScoreConfig`
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

/**
 * @description 抽片逻辑
 */
interface ITakePhotoParams extends IEvaluateAPi {
  productIds: Array<string | number>
  formalStaffCount: string | number
  newStaffCount: string | number
}

export async function takePhoto (params: ITakePhotoParams): Promise<string> {
  const url = `${getApiUrl(params.type, params.organizationType)}/takePhoto`
  const res: any = await axios({
    url,
    method: 'POST',
    data: params
  })
  return res
}

/**
 * @description 获取抽片结果列表
 */
interface IGetSpotCheckResultListParams extends IEvaluateAPi {
  uuid: string
  page: number
  pageSize: number
  skip: number
  limit: number
}

interface IGetSpotCheckResultRes {
  formalStaffNum: number
  formalStaffStreamNum: number
  spotAllPeople: number
  newStaffNum: number
  newStaffStreamNum: number
  streamOrderNum: number
}
interface IGetSpotCheckResultListRes {
  total: number
  list: PoolRecordModel[]
  processInfo: IGetSpotCheckResultRes
}
// eslint-disable-next-line max-len
export async function getSpotCheckResultList (params: IGetSpotCheckResultListParams): Promise<IGetSpotCheckResultListRes> {
  const url = `${getApiUrl(params.type, params.organizationType)}/getSpotCheckResultList`
  const res: any = await axios({
    url,
    method: 'GET',
    params
  })
  const spotTotal = _.get(res, 'extend.processInfo[0].currentGroup')
  const processInfo = _.get(res, 'extend.processInfo') || {}
  const createData: PoolRecordModel[] = res.data.map((poolRecordItem: any, poolRecordIndex: number) => {
    const poolRecordModel = new PoolRecordModel(poolRecordItem)
    const pagerInfo = {
      page: params.page,
      pageSize: params.pageSize,
      index: poolRecordIndex,
      total: spotTotal,
    }
    poolRecordModel.getStreamInfo(poolRecordItem.streamOrder, pagerInfo)
    poolRecordModel.getPoolPhotoList()
    return poolRecordModel
  })
  return {
    list: createData,
    total: spotTotal,
    processInfo: {
      formalStaffNum: processInfo.formalStaffNum,
      formalStaffStreamNum: processInfo.formalStaffStreamNum,
      spotAllPeople: processInfo.makeupNum || processInfo.photographerNum || 0,
      newStaffNum: processInfo.newStaffNum,
      newStaffStreamNum: processInfo.newStaffStreamNum,
      streamOrderNum: processInfo.streamOrderNum
    }
  }
}

/**
 * @description 获取今日抽片指标
 */
interface IGetTodayEvaluateCountRes {
  evaluationPhotoNum: number
  evaluationStreamNum: number
}

export async function getTodayEvaluateCount (params: IEvaluateAPi): Promise<IGetTodayEvaluateCountRes> {
  const url = `${getApiUrl(params.type, params.organizationType)}/getTodayEvaluateCount`
  const res: any = axios({
    url,
    method: 'GET',
  })
  return res
}

/**
 * @description 获取今日是否有抽片数据
 */
export async function getHaveSpotCheckResult (params: IEvaluateAPi): Promise<string> {
  const url = `${getApiUrl(params.type, params.organizationType)}/getHaveSpotCheckResult`
  const res: any = axios({
    url,
    method: 'GET',
  })
  return res
}

/**
 * @description 跳过伙伴
 * @param params 
 */
interface ISkipStaffParams extends IEvaluateAPi {
  staffIds: number[]
  poolItemId: string
}

export async function skipStaff (params: ISkipStaffParams): Promise<boolean> {
  const url = `${getApiUrl(params.type, params.organizationType)}/skipStaff`
  const res: any = await axios({
    url,
    method: 'POST',
    data: params
  })
  return res
}

/**
 * @description 换一单
 * @param params 
 */
interface IChangePoolParams extends IEvaluateAPi {
  poolItemId: string
}
export async function changePool (params: IChangePoolParams): Promise<boolean | PoolRecordModel> {
  const url = `${getApiUrl(params.type, params.organizationType)}/changeItem`
  const res: any = await axios({
    url,
    method: 'POST',
    data: params
  })
  // TODO: cf 对更换的订单进行处理
  return res
}

/**
 * @description 提交评分配置
 * @param params 
 */
interface IEmptyPoolByStaffIdParams extends IEvaluateAPi {
  photos: {
    markPath: string
    photoId: idType
  }[]
  poolItemId: idType
  tags: {
    id: idType
    score: number
  }[]
}
export async function emptyPoolByStaffId (params: IEmptyPoolByStaffIdParams): Promise<boolean> {
  const url = `${getApiUrl(params.type, params.organizationType)}/emptyPoolByStaffId`
  const res: any = await axios({
    url,
    method: 'POST',
    data: params
  })

  return res
}
