import AuditSpotPhotoModel from '@/model/AuditSpotPhotoModel'
/**
 * @description 抽片照片模型
 */
export default class PoolPhotoModel {
  id: string
  path: string // 照片地址
  makePath?: string // 批注图片地址
  auditSpotModel?: AuditSpotPhotoModel

  constructor (data: any) {
    this.id = _.get(data, 'id') || ''
    this.path = _.get(data, 'path') || ''
    // TODO: cf
    this.makePath = ''

    if (data.photo_quality) {
      this.auditSpotModel = new AuditSpotPhotoModel(data.photo_quality)
    }
  }
}
