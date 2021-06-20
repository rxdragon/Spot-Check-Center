import axios from '@/plugins/axios'
import { store } from '@/store/index'
import { CNLevelToType } from '@/model/Enumerate'

export interface ITags {
  id: string
  name: string
  type: string
}

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

/**
 * @description 处理图片地址
 * @param {String} path 图片地址
 */
export function handlePicPath (path: string) {
  let resPath = ''
  // 线上环境存储目录
  const prodFilePath = 'upload/'
  // 开发环境存储目录
  const devFilePath = 'upload_dev/'
  resPath = (path.replace(devFilePath, '')).replace(prodFilePath, '')
  return resPath
}

/**
 * @description 处理comitInfo数据
 * @param {*} commitInfo 评价图片
 * @param {*} issueLabel 评价标签
 */
export function handleCommitInfo (issueLabel: any) {
  const parentData: ITags[] = []
  issueLabel.forEach((issueItem: any) => {
    const className = _.get(issueItem, 'parent.score_type.name') || '异常'
    const gradeName = _.get(issueItem, 'parent.name') || '异常'
    const createData: ITags = {
      id: issueItem.id,
      name: `${className}-${gradeName}-${issueItem.name}`,
      type: CNLevelToType['小']
    }
    parentData.push(createData)
  })
  return {
    parentData
  }
}

/**
 * @description 补全图片地址
 * @param path 
 * @returns 
 */
export function compleImagePath (path: string) {
  if (path.includes('http')) return path
  if (path.includes('blob')) return path
  return `${store.getters.imgDomain}${path}`
}

/**
 * @description 补全图片地址
 * @param path 
 * @returns 
 */
export function compleCompressImagePath (path: string) {
  if (path.includes('http')) return path
  if (path.includes('blob')) return path
  return `${store.getters.imgCompressDomain}${path}`
}
