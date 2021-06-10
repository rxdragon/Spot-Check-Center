import StreamOrderModel, { IPagerInfo } from '@/model/StreamOrderModel'
import PoolPhotoModel from '@/model/PoolPhotoModel'
import PoolAppealsModel from '@/model/PoolAppealsModel'
import { v4 as uuid } from 'uuid'

interface IScoreConfigs {
  id: number
  name: string
  score: number | string
  type: string
  from: string
  isExtra: string
}

interface ICommitInfo {
  scoreConfigs: IScoreConfigs
  totalScore: string | number
  status: string
}

/**
 * @description 抽片记录
 */
export default class PoolRecordModel {
  // TODO: cf
  base: any
  id: number // 抽片记录id
  businessId: number | string
  commitInfo?: ICommitInfo
  streamInfo?: StreamOrderModel
  photoList?: PoolPhotoModel[]
  appealInfo?: PoolAppealsModel

  constructor (data: any) {
    this.base = data
    this.id = _.get(data, '_id') || uuid()
    this.businessId = _.get(data, 'businessId') || '-'
    
    // todo: cf 添加commitInfo
    // const commitInfo = _.get(data, 'commitInfo')
  }

  // 获取流水信息
  getStreamInfo (externalStreamData?: any, pagerInfo?: IPagerInfo) {
    const streamData = externalStreamData || _.get(this.base, 'streamOrder') || {}
    this.streamInfo = new StreamOrderModel(streamData, pagerInfo)
  }

  // 获取照片相关数据
  getPoolPhotoList (externalPhotoData?: any) {
    const photoList = externalPhotoData || _.get(this.base, 'photos') || []
    this.photoList = photoList.map((photoItem: any) => new PoolPhotoModel(photoItem))
  }

  // 获取申述相关信息
  getPoolAppealsModel (externalAppealInfo?: any) {
    const appealInfo = externalAppealInfo || _.get(this.base, 'appeal') || {}
    this.appealInfo = new PoolAppealsModel(appealInfo)
  }
}
