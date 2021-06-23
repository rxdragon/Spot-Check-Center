import StreamOrderModel, { ISpotRecordInfo } from '@/model/StreamOrderModel'
import PoolPhotoModel from '@/model/PoolPhotoModel'
import PoolAppealsModel from '@/model/PoolAppealsModel'
import EvaluateTagsModel from '@/model/EvaluateTagsModel'
import { v4 as uuid } from 'uuid'


/**
 * @description 抽片记录
 */
export default class PoolRecordModel {
  base: any
  id: string // 抽片记录id
  businessId: number | string
  photoCount: number
  streamInfo?: StreamOrderModel
  photoList?: PoolPhotoModel[]
  appealInfo?: PoolAppealsModel
  tagInfo?: EvaluateTagsModel

  constructor (data: any) {
    this.base = data
    this.id = _.get(data, '_id') || uuid()
    this.businessId = _.get(data, 'businessId') || '-'
    const photos = _.get(this.base, 'photos') || []
    this.photoCount = photos.length
  }

  // 获取流水信息
  getStreamInfo (externalStreamData?: any, spotRecordInfo?: ISpotRecordInfo) {
    const streamData = externalStreamData || _.get(this.base, 'streamOrder') || {}
    this.streamInfo = new StreamOrderModel(streamData, spotRecordInfo)
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

  // 获取评价信息
  getTags (externalTagInfo?: any) {
    const tagInfo = externalTagInfo || this.base || {}
    this.tagInfo = new EvaluateTagsModel(tagInfo)
  }
}
