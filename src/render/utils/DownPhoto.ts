import Zip from './jszip.js'

import { store } from '@/store/index'
import { newMessage } from '@/utils/message'

const domain = store.getters.imgDomain

export function downOnePicture (src: string, savePath = '', rename = '') {
  const url = src.includes('http') ? src : domain + src
  if (__APP__.config.globalProperties.$DownIpc) {
    const data: { url: string, path: string, rename?: string } = {
      url: url,
      path: savePath
    }
    if (rename) data.rename = rename
    __APP__.config.globalProperties.$DownIpc.addDownloadFile(data)
    return
  }

  window.location.href = url + '?attname='
}

/**
 * @description 下载zip
 * @param {*} imgArr 照片列表
 */
export function downForZip (imgArr: string[], zipName = "照片", cb?: () => void) {
  const zipclass = new (Zip as any)()
  imgArr = imgArr.map(src => {
    return src.includes('http') ? src : domain + src
  })
  zipclass.downZip(imgArr, zipName, ()=> {
    if (cb) cb()
    newMessage.success('已添加下载，请勿关闭该浏览器标签')
  })
}
