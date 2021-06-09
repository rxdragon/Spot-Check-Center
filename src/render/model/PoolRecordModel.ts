import StreamOrderModel from '@/model/StreamOrderModel'
import PoolPhotoModel from '@/model/PoolPhotoModel'
import PoolAppealsModel from '@/model/PoolAppealsModel'

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
  id: number
  businessId: number | string
  commitInfo?: ICommitInfo
  streamInfo?: StreamOrderModel
  photoList?: PoolPhotoModel[]
  appealInfo?: PoolAppealsModel

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
  }

  // 获取流水信息
  getStreamInfo (externalStreamData: any) {
    const streamData = externalStreamData || _.get(this.base, 'streamData') || {}
    this.streamInfo = new StreamOrderModel(streamData)
  }

  // 获取照片相关数据
  getPoolPhotoList (externalPhotoData: any) {
    const photoList = externalPhotoData || _.get(this.base, 'photo') || []
    this.photoList = photoList.map((photoItem: any) => new PoolPhotoModel(photoItem))
  }

  // 获取申述相关信息
  getPoolAppealsModel (externalAppealInfo: any) {
    const appealInfo = externalAppealInfo || _.get(this.base, 'appeal') || {}
    this.appealInfo = new PoolAppealsModel(appealInfo)
  }
}
