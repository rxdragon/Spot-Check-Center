import type { DownloadItem } from 'electron'
import { DOWN_STATE } from './downModuleEnum'

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
  state: DOWN_STATE
}

// 渲染进程调用下载如参
export interface IFileDownloadConfig {
  url: string // 下载文件的完整地址
  path: string // 保存文件地址文件夹
  downloadFolder?: string
  rename?: string
}

// onNeedDownload 下载配置
export interface IDownloadConfig extends IFileDownloadConfig {
  uuid: string
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
  callback: (error: any, downInfo: IDownCallBackInfo) => void // 回调函数
  onProgress: (progress: IDownProgressInfo, downInfo: IDownInfo, item: DownloadItem) => void
}


/** 渲染进程下下载item */
export interface IDownItem {
  // progressing 下载中 completed 下载完成 cancelled 取消下载 interrupted 下载中断
  status: DOWN_STATE // 下载状态
  canResume: boolean // 是否可以重新下载
  isUserPause: boolean // 是否是用户暂停
  orginName: string // 原始文件名字
  ext: string // 后缀 初始不可更改
  rename: string // 重命名
  fileName: string // 文件名 最后下载后的名字
  savePath: string // 保存地址
  config: IDownloadConfig // 下载配置信息
  process: IDownProgressInfo | Record<string, any> // 下载进入信息
  downInfo: IDownInfo | Record<string, any> // 下载信息
  iconSrc: string // 图标地址
}

// 主线程和渲染线程通信使用数据
export interface IDownloadProcessIpcData {
  uuid: string
  progress: IDownProgressInfo
  downInfo: IDownInfo
  status: DOWN_STATE // 状态
  canResume: boolean // 能否恢复下载
}
