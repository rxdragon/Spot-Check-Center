export default class PhotoInfoModel {
  id: string
  path: string // 照片地址
  makeupDegreeType: string
  photographyDegree: string

  constructor (data: any) {
    this.id = _.get(data, 'id', '111')
    // eslint-disable-next-line max-len
    this.path = _.get(data, 'path', 'https://cloud-dev.cdn-qn.hzmantu.com/compress/2020/06/17/ljj3UXg3uaY_C0DJ4kBsitaVV8UJ.jpg')
    this.makeupDegreeType = _.get(data, 'makeupDegreeType', 'normal')
    this.photographyDegree = _.get(data, 'photographyDegree', '啥')
  }
}
