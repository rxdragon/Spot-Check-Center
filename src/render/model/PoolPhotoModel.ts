/**
 * @description 抽片照片模型
 */
export default class PoolPhotoModel {
  id: string
  path: string // 照片地址
  makePath?: string // 批注图片地址
  constructor (data: any) {
    // TODO: cf
    this.id = _.get(data, 'id', '111')
    this.path = 'https://cloud-dev.cdn-qn.hzmantu.com/compress/2020/06/17/ljj3UXg3uaY_C0DJ4kBsitaVV8UJ.jpg'
    this.makePath = ''
  }
}
