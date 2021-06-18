import type { IFileDownloadConfig } from '~/main/downModule/index.js'

import Zip from './jszip.js'
import { store } from '@/store/index'
import { newMessage } from '@/utils/message'
import ElectronDown from '@/utils/electronDown'

const domain = store.getters.imgDomain

export function downOnePicture (src: string, savePath?: string, rename?: string) {
  const url = src.includes('http') ? src : domain + src
  if (__APP__.config.globalProperties.$isElectron) {
    const ElectronDownInstance = ElectronDown.getInstance()
    const data: IFileDownloadConfig = {
      url: url,
      path: savePath || ''
    }
    if (rename) data.rename = rename
    ElectronDownInstance.addDownloadFile(data)
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
