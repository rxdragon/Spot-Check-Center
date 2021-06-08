import axios from '@/plugins/axios'

interface IImageInfo {
  width: number
  height: number
}
/**
 * @description 获取图片宽高
 */
export async function getImageInfo (src: string): Promise<IImageInfo> {

  // 创建虚拟dom获取图片宽高
  function imgDomGetImageInfo (imagePath: string): Promise<IImageInfo> {
    return new Promise ((resolve) => {
      const imageDom = new Image()
      imageDom.onload = () => {
        resolve({ width: imageDom.naturalWidth, height: imageDom.naturalHeight })
      }
      imageDom.onerror = () => {
        resolve({ width: 0, height: 0 })
      }
      imageDom.src = imagePath
    })
  }

  // 如果是七牛网络图片
  if (src.includes('qn.hzmantu.com')) {
    try {
      const res: any = await axios.get(`${src}?imageInfo`)
      const { width, height } = res
      return { width, height }
    } catch {
      const res = await imgDomGetImageInfo(src)
      return res
    }
  } else {
    const res = await imgDomGetImageInfo(src)
    return res
  }
}
