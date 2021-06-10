import StreamOrderModel from '@/model/StreamOrderModel'
import AuditSpotPhotoModel from '@/model/AuditSpotPhotoModel'
import EvaluateTagsModel from '@/model/EvaluateTagsModel'

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
export default class EvaluateModel {
  // TODO: lj
  base: any
  id: number
  businessId: number | string
  commitInfo?: ICommitInfo
  streamInfo?: StreamOrderModel
  photoList?: AuditSpotPhotoModel[]
  tagInfo?: EvaluateTagsModel

  constructor (data: any) {
    this.base = data
    this.id = _.get(data, 'id') || 112
    this.businessId = 'C202012345678'
    this.commitInfo = {
      status: 'xxx',
      totalScore: 90,
      scoreConfigs: {
        id: 12312312,
        name: 'xxxx',
        score: '90',
        type: '类型',
        from: '来源',
        isExtra: '新款应用'
      }
    }
    this.getStreamInfo()
    this.getPoolPhotoList()
    this.getTags()
  }

  // 获取订单信息
  getStreamInfo () {
    const streamData = _.get(this.base, 'streamData') || _.get(this.base, 'streamOrder') || {}
    this.streamInfo = new StreamOrderModel(streamData)
  }

  // 获取照片相关数据
  getPoolPhotoList () {
    const photoList = _.get(this.base, 'photo') || _.get(this.base, 'photos') || []
    this.photoList = photoList.map((photoItem: any) => new AuditSpotPhotoModel(photoItem))
  }

  // 评价信息
  getTags () {
    this.tagInfo = new EvaluateTagsModel(this.base)
  }
}
