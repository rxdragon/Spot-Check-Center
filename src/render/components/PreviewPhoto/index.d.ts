import StreamOrderModel from '@/model/StreamOrderModel'
import AuditSpotPhotoModel from '@/model/AuditSpotPhotoModel'


export interface IPhotoPreviewItem extends AuditSpotPhotoModel {
  id: idType
  title: string
  src: string
  compressSrc: string
  orderInfo: StreamOrderModel
  markPath: string
}
