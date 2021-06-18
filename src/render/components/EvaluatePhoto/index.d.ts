
import StreamOrderModel from '@/model/StreamOrderModel'
import AuditSpotPhotoModel from '@/model/AuditSpotPhotoModel'

export interface ISubmitData {
  tags: {
    id: idType
    score: number
  }[]

  photos: {
    markPath: string
    photoId: idType
  }[]
}

interface IphotoInfo extends StreamOrderModel {
  aiSpotLabel: AuditSpotPhotoModel['makeupDegree'] | AuditSpotPhotoModel['photographyDegree']
}

export interface IPhotoItemData {
  id: idType
  title: string
  src: string
  photoInfo: IphotoInfo
  markPath: string,
  markJson: string,
  markBase: string
}
