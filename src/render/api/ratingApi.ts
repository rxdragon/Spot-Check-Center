import OrderInfoModel from '@/model/OrderInfoModel'
import EvaluateModel from '@/model/EvaluateModel'
import PhotoInfoModel from '@/model/PhotoInfoModel'

// TODO: lj
/**
 * @description 评分明细
 * @param {*} params
 */
export function getPhotoRating () {
  const data = [{
    orderMsg: {},
    evaluate: {},
    photoList: []
  },{
    orderMsg: {},
    evaluate: {},
    photoList: []
  }]

  data.forEach((item: any) => {
    item.orderMsg = new OrderInfoModel(item.orderMsg)
    item.evalute = new EvaluateModel(item.evalute)

    const photoList = _.get(item, 'photoList') || []
    item.photoList = photoList.map((ele: any) => {
      return new PhotoInfoModel(ele)
    })
  })
  return data
}
