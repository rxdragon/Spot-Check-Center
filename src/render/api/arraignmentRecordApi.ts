import axios from '@/plugins/axios'
import { SPOT_TYPE } from '@/model/Enumerate'
import SpotCheckRecordModel from '@/model/SpotCheckRecordModel'
import AuditSpotPhotoModel from '@/model/AuditSpotPhotoModel'

export interface IgetAuditRecordTotalParams {
  type: SPOT_TYPE | string
  startAt?: string
  endAt?: string
  cloudOrderNum?: string
}

interface IgetAuditRecordTotalRes {
  auditRecordCount: number
  auditRecordProblemCount: number
  photoQualityCount: number
  photoQualityProblemCount: number
}

/**
 * @description 获取提审记录统计信息
 */
export async function getAuditRecordTotal (params: IgetAuditRecordTotalParams): Promise<IgetAuditRecordTotalRes> {
  let url = ''
  switch (params.type) {
    case SPOT_TYPE.MAKEUP:
      url = '/project_photo_quality/makeup/getAuditRecordTotal'
      break
    case SPOT_TYPE.PHOTOGRAPHY:
      url = '/project_photo_quality/photography/getAuditRecordTotal'
      break
    default:
      break
  }
  const res: any = await axios({
    url,
    method: 'POST',
    data: params
  })

  const createData: IgetAuditRecordTotalRes = {
    auditRecordCount: _.get(res, 'audit_record_count') || 0,
    auditRecordProblemCount: _.get(res, 'audit_record_problem_count') || 0,
    photoQualityCount: _.get(res, 'photo_quality_count') || 0,
    photoQualityProblemCount: _.get(res, 'photo_quality_problem_count') || 0
  }
  return createData
}


export interface IgetAuditRecordsParams {
  type: SPOT_TYPE | string
  startAt?: string
  endAt?: string
  cloudOrderNum?: string
  auditState?: string
  page: number
  pageSize: number
  supervisorArr?: string[]
  staffIds?: string[]
  orderNum?: string
  onlyNew?: boolean,
  onlyOld?: boolean
}

interface ISpotCheckRecordList extends SpotCheckRecordModel {
  photoList: any[]
}

interface IgetAuditRecordsRes {
  total: number
  list: SpotCheckRecordModel[]
}
/**
 * @description 获取提审列表
 */
export async function getAuditRecords (params: IgetAuditRecordsParams): Promise<IgetAuditRecordsRes> {
  let url = ''
  switch (params.type) {
    case SPOT_TYPE.MAKEUP:
      url = '/project_photo_quality/makeup/getAuditRecords'
      break
    case SPOT_TYPE.PHOTOGRAPHY:
      url = '/project_photo_quality/photography/getAuditRecords'
      break
    default:
      break
  }

  const res: any = await axios({
    url,
    method: 'POST',
    data: params
  })
  
  const listData: ISpotCheckRecordList[] = res.list.map((item: any) => {
    const photoQuality = _.get(item, 'photo_quality') || []
    const arraignmentData: ISpotCheckRecordList = {
      ...new SpotCheckRecordModel(item),
      photoList: photoQuality.map((photoItem: any) => new AuditSpotPhotoModel(photoItem))
    }
    return arraignmentData
  })

  const createData = {
    list: listData,
    total: res.total
  }
  return createData
}
