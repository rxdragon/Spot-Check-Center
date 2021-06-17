// eslint-disable-next-line max-len
import type { IDownItem, IDownloadConfig, IDownloadProcessIpcData, IFileDownloadConfig } from '~/main/downModule/index'
import type { IpcRendererEvent } from 'electron'

import { DOWN_STATE } from '~/main/downModule/downModuleEnum'
import { v4 as uuidv4 } from 'uuid'
import { getFileIcon } from '@/utils/getFileIcon'
import { store } from '@/store/index'
import * as selfPath from '@/utils/selfPath'
import { newMessage } from './message'


// 获取文件名
function getFileNameTool (src: string) {
  const fileExt = selfPath.getExtName(src)
  const fileName = selfPath.getBaseName(src, fileExt)
  return {
    name: fileName,
    ext: fileExt
  }
}

// 自增文件名字
function incrementFileName (savePath: string) {
  let fileNum = 0
  const dir = selfPath.getDirname(savePath)
  const { name, ext } = getFileNameTool(savePath)
  while (window.OriginalFs.existsSync(savePath)) {
    fileNum += 1
    savePath = selfPath.getFormat({
      dir,
      ext,
      name: `${name}(${fileNum})`
    })
  }
  return savePath
}
/**
 * @description 下载器单例模式
 */
export default class ElectronDown {
  private static instance: ElectronDown

  maxCount = 5
  waitDownloadList: any[] // 待下载队列
  downingLoadList: any[] // 正在下载队列
  downloadList: Record<string, IDownItem> // 全部队列信息
  onListChange: () => void

  private constructor () {
    this.waitDownloadList = []
    this.downingLoadList = []
    this.downloadList = {}
    this.onListChange = () => ({})

    if (!window.ElectronIpcRenderer) return
    window.ElectronIpcRenderer.on('download-manage:process', this.onDownloadProcess)
    window.ElectronIpcRenderer.on('download-manage:error', this.onDownloadError)
    window.ElectronIpcRenderer.on('download-manage:success', this.onDownloadSuccess)
  }

  /** 获取实例 */
  public static getInstance (): ElectronDown {
    if (!ElectronDown.instance) {
      ElectronDown.instance = new ElectronDown()
    }
    return ElectronDown.instance
  }

  /** 进行限流下载 */
  limitDownCount (uuid?: string) {
    if (!window.ElectronIpcRenderer) return
    if (uuid) {
      // 如果有传入uuid表示取消下载，清空downlingLoadList 数据
      const findDeleteIndex = this.downingLoadList.findIndex(item => item.config.uuid === uuid)
      if (findDeleteIndex >= 0) this.downingLoadList.splice(findDeleteIndex, 1)
    }
    if (this.downingLoadList.length < this.maxCount) {
      // 还需从待下载池子里获取的数量
      let takeCount = this.maxCount - this.downingLoadList.length
      if (this.waitDownloadList.length < takeCount) {
        takeCount = this.waitDownloadList.length
      }
      for (let index = 0; index < takeCount; index++) {
        const item = this.waitDownloadList[index]
        const downreq: { uuid: string, downloadConfig: IDownloadConfig } = {
          uuid: item.config.uuid,
          downloadConfig: item.config
        }
        const result = window.ElectronIpcRenderer.sendSync('download-manage:downloadFile', downreq)
        if (result === 'fail') throw new Error('pause fail, maybe already pause or uuid not exists')
        this.downingLoadList.push(item)
        this.waitDownloadList.splice(index, 1)
      }
    }
  }

  /** 单个添加下载 */
  addDownloadFile (fileDownloadConfig: IFileDownloadConfig) {
    const { name, ext } = getFileNameTool(fileDownloadConfig.url)
    const folderPath = store.getters.saveFolder
    const uuid = uuidv4()

    const electronDownConfig: IDownloadConfig = Object.assign(
      {},
      fileDownloadConfig,
      {
        uuid: uuidv4(),
        path: selfPath.joinPath(folderPath, fileDownloadConfig.path)
      }
    )

    const createData: IDownItem = {
      status: DOWN_STATE.WAIT_DOWN,
      canResume: false, // 是否可以重新下载
      isUserPause: false, // 是否是用户暂停
      orginName: name, // 原始文件名字
      ext, // 后缀 初始不可更改
      rename: fileDownloadConfig.rename || '',
      savePath: selfPath.joinPath(fileDownloadConfig.path, (uuid + '.download')),
      fileName: fileDownloadConfig.rename || `${name}${ext}`,
      config: electronDownConfig,
      process: {},
      downInfo: {},
      iconSrc: ''
    }
    this.downloadList[uuid] = createData
    this.waitDownloadList.push(this.downloadList[uuid])
    this.limitDownCount()
    this.onListChange()
  }

  /** 多个文件添加下载 */
  batchDownloadFiles (files: IFileDownloadConfig[]) {
    newMessage.success(`已添加${files.length}张照片至下载`)
    files.forEach(file => {
      this.addDownloadFile(file)
    })
  }

  /** 暂停单个下载文件 */
  pause (uuid: string) {
    if (!window.ElectronIpcRenderer) return
    const result = window.ElectronIpcRenderer.sendSync('download-manage:pause', { uuid })
    if (result === 'fail') throw new Error('pause fail, maybe already pause or uuid not exists')
    this.downloadList[uuid].status = DOWN_STATE.PROGRESSING
    this.downloadList[uuid].isUserPause = true
    this.onListChange()
  }

  /** 恢复下载 */
  resume (uuid: string) {
    if (!window.ElectronIpcRenderer) return
    const result = window.ElectronIpcRenderer.sendSync('download-manage:resume', { uuid })
    if (result === 'fail') throw new Error('pause fail, maybe not pause or uuid not exists')
    this.downloadList[uuid].status = DOWN_STATE.INTERRUPTED
    this.downloadList[uuid].isUserPause = false
    this.onListChange()
  }

  /** 删除单个下载项目 */
  deleteItem (uuid: string) {
    if (!window.ElectronIpcRenderer) return
    if (this.downloadList[uuid] && this.downloadList[uuid].status !== DOWN_STATE.COMPLETED) {
      const result = window.ElectronIpcRenderer.sendSync('download-manage:delete', { uuid })
      if (result === 'fail') throw new Error('pause fail, maybe not pause or uuid not exists')
    }
    const findDeleteIndex = this.waitDownloadList.findIndex(item => item.config.uuid === uuid)
    if (findDeleteIndex >= 0) this.waitDownloadList.splice(findDeleteIndex, 1)
    delete this.downloadList[uuid]
    this.onListChange()
  }

  /** 将完成项目转移到 列表 */
  async transferToVuexList (uuid: string) {
    await store.dispatch('downLoadedListStore/addDownloadItem', { downloadItem: this.downloadList[uuid] })
    this.deleteItem(uuid)
  }

  /** 清空数据 */
  clearAll () {
    for (const uuid in this.downloadList) {
      // eslint-disable-next-line max-len
      if (this.downloadList[uuid].status === DOWN_STATE.COMPLETED || this.downloadList[uuid].status === DOWN_STATE.CANCELLED) {
        delete this.downloadList[uuid]
      }
    }
    this.onListChange()
  }

  /** 取消下载 */
  cancel (uuid: string) {
    if (!window.ElectronIpcRenderer) return
    const result = window.ElectronIpcRenderer.sendSync('download-manage:cancel', { uuid })
    if (result === 'fail') throw new Error('pause fail, maybe not pause or uuid not exists')
    this.downloadList[uuid].status = DOWN_STATE.CANCELLED
    this.limitDownCount(uuid)
    this.onListChange()
  }

  /** 更改下载完成后名字 */
  changeSaveName (item: IDownItem) {
    const oldFilePath = item.downInfo.savePath
    const oldDir = selfPath.getDirname(oldFilePath)
    let newFileName = item.orginName + item.ext
    if (item.rename) {
      newFileName = item.rename
    }
    let newFilePath = selfPath.joinPath(oldDir, newFileName)
    newFilePath = incrementFileName(newFilePath)
    window.OriginalFs.rename(oldFilePath, newFilePath, async (err: any) => {
      if (err) {
        console.error(err)
      }
      item.savePath = newFilePath
      item.iconSrc = await getFileIcon(newFilePath)
      this.onListChange()
    })
  }

  /** 监听下载 */
  // eslint-disable-next-line max-len
  async onDownloadProcess (event: IpcRendererEvent, { uuid, progress, downInfo, status, canResume }: IDownloadProcessIpcData) {
    if (uuid in this.downloadList) {
      this.downloadList[uuid].canResume = canResume
      this.downloadList[uuid].process = progress
      this.downloadList[uuid].status = status
      this.downloadList[uuid].downInfo = downInfo
      const iconSrc = await getFileIcon(this.downloadList[uuid].savePath)
      this.downloadList[uuid].iconSrc = iconSrc
      this.onListChange()
    }
  }

  /** 监听下载出错 */
  onDownloadError (event: IpcRendererEvent, { uuid }: { uuid: string }) {
    if (uuid in this.downloadList) {
      this.downloadList[uuid].status = DOWN_STATE.INTERRUPTED
      this.limitDownCount(uuid)
      console.error(uuid, 'error')
      this.onListChange()
    }
  }

  /** 监听下载成功 */
  onDownloadSuccess (event: IpcRendererEvent, { uuid }: { uuid: string }) {
    if (uuid in this.downloadList) {
      this.downloadList[uuid].status = DOWN_STATE.COMPLETED
      this.limitDownCount(uuid)
      this.changeSaveName(this.downloadList[uuid])
    }
  }


  /** 获取全部队列 */
  getDownloadList () {
    return this.downloadList
  }

  /** 注册列表改变时候的回调 */
  registerOnListChange (cb: () => void) {
    this.onListChange = cb
  }
}
