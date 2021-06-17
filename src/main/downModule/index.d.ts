import type { DownloadItem } from 'electron'

// 进度类型
export interface IDownProgressInfo {
  progress: number
  speedBytes: number
  speed: string
  remainingBytes: number
  remaining: string
  totalBytes: number
  total: string
  downloadedBytes: number
  downloaded: string
}
// 下载文件类型
export interface IDownInfo {
  savePath: string
  downURL: string
  mimeType: string
  hasUserGesture: boolean
  filename: string
  contentDisposition: string
  startTime: number
  state: "progressing" | "interrupted"
}
// onNeedDownload 下载配置
export interface IDownloadConfig {
  uuid: string
  url: string
  downloadFolder? :string
  path: string
  rename: string
}

// 下载配置
export interface IDownloadOptions extends IDownloadConfig {
  onProgress: (progress: IDownProgressInfo, downInfo: IDownInfo, item: DownloadItem) => void
}

// 下载成功回调内容
interface IDownCallBackInfo {
  url: string // 下载地址
  filePath: string // 保存地址
}

// 队列内容
export interface IQueueItem {
  url: string // 下载地址
  filename: string // 文件名字
  rename: string // 是否重命名
  downloadFolder: string
  path: string // 储存地址
  callback: (error, downInfo: IDownCallBackInfo) => void // 回调函数
  onProgress: (progress: IDownProgressInfo, downInfo: IDownInfo, item: DownloadItem) => void
}
