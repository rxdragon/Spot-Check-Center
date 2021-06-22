/* eslint-disable no-unused-vars */

enum AI_STATE {
  SUCCESS = 'success',
  REJECT = 'reject'
}

export default class AuditSpotPhotoModel {
  base: any
  id: idType // 照片审核id
  makeupDegree: string | undefined // 化妆评分
  makeupDegreeType: string | undefined // 化妆评分类型
  photographyDegree: string | undefined // 摄影评分
  photographyDegreeType: string | undefined // 摄影评分类型

  constructor (data: any) {
    this.base = data
    this.id = data._id
    this.getAiState()
  }

  // 获取ai审核结果信息
  getAiState () {
    if (this.base.ai_state === AI_STATE.SUCCESS) {
      const infoMakeup = _.get(this.base, 'extend.info_makeup.degree', '')
      const infoPhtghy = _.get(this.base, 'extend.info_phtghy.degree', '')

      if (Number(infoMakeup) === 5) {
        this.makeupDegree = '正常'
        this.makeupDegreeType = 'normal'
      } else {
        this.makeupDegree = `异常-${infoMakeup}`
        this.makeupDegreeType = 'error'
      }

      if (Number(infoPhtghy) === 5) {
        this.photographyDegree = '正常'
        this.photographyDegreeType = 'normal'
      } else {
        this.photographyDegree = `异常-${infoPhtghy}`
        this.photographyDegreeType = 'error'
      }
    } else {
      this.makeupDegree = `ai-拒绝`
      this.makeupDegreeType = 'error'
      this.photographyDegree = `ai-拒绝`
      this.photographyDegreeType = 'error'
    }
  }
}
