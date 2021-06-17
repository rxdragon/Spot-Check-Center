
import type { IDownloadOptions, IQueueItem, IDownInfo, IDownProgressInfo } from './index.d'

/* eslint-disable no-console */
'use strict'
import path from 'path'
import electron, { BrowserWindow, net } from 'electron'
import fs from 'fs'
import console from 'console'

const app = electron.app
let downloadFolder = '' // 下载路径
let lastWindowCreated: BrowserWindow // window对象

const queue: IQueueItem[] = [] // 队列信息

// 查看是否在队列中
const _popQueueItem = (url: string) => {
  const queueItem = queue.find(item => item.url === url)
  if (!queueItem) return queueItem

  queue.splice(queue.indexOf(queueItem), 1)
  return queueItem
}

// 转换数据大小格式
const _bytesToSize = (bytes: number, decimals?: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1000
  const dm = decimals || 2
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

// 单文件下载
const download = (options: IDownloadOptions, callback: IQueueItem['callback']) => {
  // 获取当前激活窗口，或者创建时最后的窗口
  const win = BrowserWindow.getFocusedWindow() || lastWindowCreated
  const url = decodeURIComponent(options.url)
  // 文件名字
  const filename = (options.uuid + '.download') || decodeURIComponent(path.basename(options.url))
  // 保存文件夹
  const folder = options.downloadFolder || downloadFolder
  // 保存路径
  const filePath = path.join(folder, options.path.toString(), filename.split(/[?#]/)[0])

  // 下载文件
  function downfile (filePath: string, response?: electron.IncomingMessage) {
    // 添加队列
    const createQueueItem: IQueueItem = {
      url: url, // 下载地址
      filename: filename, // 文件名字
      callback: callback, // 回调函数
      rename: options.rename, // 是否重命名
      downloadFolder: folder,
      path: options.path.toString(), // 储存地址
      onProgress: options.onProgress // 监听下载
    }
    queue.push(createQueueItem)

    // 检查是否存在文件
    if (fs.existsSync(filePath) && response) {
      console.log('检查是否存在文件')
      const stats = fs.statSync(filePath)
      const fileOffset = stats.size

      // 服务器文件大小 content-length 可能为数组
      const serverFileSize = parseInt(response.headers['content-length'] as string)

      // 判断本地文件和服务器文件大小 继续下载 TODO
      if (fileOffset < serverFileSize) {
        const interOptions: electron.CreateInterruptedDownloadOptions = {
          path: filePath, // 下载的绝对路径
          urlChain: [options.url], // 完整的 url 下载地址
          offset: fileOffset, // 下载的开始范围
          length: serverFileSize, // 下载的总长度
          lastModified: response.headers['last-modified'] as string
        }
        win.webContents.session.createInterruptedDownload(interOptions)

      } else {
        console.log(url + '本地文件大于等于服务器文件，不需要下载')
        const finishedDownloadCallback = callback
        finishedDownloadCallback(null, { url, filePath })
      }
    } else {
      // 下载文件
      console.log(filename + url + '本地未下载，将要开始下载')
      win.webContents.downloadURL(options.url)
    }
  }

  // 请求文件存不存在
  function checkOnlineHasFile () {
    // 发起链接
    const request = net.request(options.url)
    
    // todo: cf 未知功能
    // if (options.headers) {
    //   options.headers.forEach((h) => { request.setHeader(h.name, h.value) })
    //   // Modify the user agent for all requests to the following urls.
    //   const filter = { urls: [options.url] }
    //   session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
    //     options.headers.forEach((h) => { details.requestHeaders[h.name] = h.value })
    //     // details.requestHeaders['User-Agent'] = 'MyAgent'
    //     callback({ cancel: false, requestHeaders: details.requestHeaders })
    //   })
    // }

    request.on('error', function (error) {
      const finishedDownloadCallback = callback
      const filename = (options.uuid + '.download') || decodeURIComponent(path.basename(options.url))
      const message = `The request for ${filename} was interrupted: ${error}`
      finishedDownloadCallback(new Error(message), { url: options.url, filePath: filePath })
    })

    request.on('response', function (response) {
      // 停止请求
      request.abort() // 取消继续获取数据
      downfile(filePath, response)
    })

    request.end()
  }

  // 判断是否是本地文件
  if (options.url.includes('blob')) {
    downfile(filePath)
  } else {
    checkOnlineHasFile()
  }
}

// 批量下载
const bulkDownload = (options: any, callback: any) => {
  options = Object.assign({}, { urls: [], path: '' }, options)

  console.log(options)

  // const urlsCount = options.urls.length
  // const finished = []
  // const errors = []

  // options.urls.forEach((url: string) => {
  //   download(
  //     { url, path: options.path, onProgress: options.onProgress },
  //     function (error, itemInfo) {
  //       if (error) {
  //         errors.push(itemInfo.url)
  //       } else {
  //         finished.push(itemInfo.url)
  //       }

  //       const errorsCount = errors.length
  //       const finishedCount = finished.length

  //       if (typeof options.onResult === 'function') {
  //         options.onResult(finishedCount, errorsCount, itemInfo.url)
  //       }

  //       if ((finishedCount + errorsCount) === urlsCount) {
  //         if (errorsCount > 0) {
  //           callback(new Error(errorsCount + ' downloads failed'), finished, errors)
  //         } else {
  //           callback(null, finished, [])
  //         }
  //       }
  //     })
  // })
}

// 注册监听事件
interface registerOpts {
  downloadFolder: string
}
function _registerListener (win: BrowserWindow, opts: registerOpts) {
  lastWindowCreated = win
  downloadFolder = opts.downloadFolder || downloadFolder // 下载路径

  const listener = (e: electron.Event, item: electron.DownloadItem) => {
    const itemUrl = decodeURIComponent(item.getURLChain()[0] || item.getURL())
    const queueItem = _popQueueItem(itemUrl)
    const ReceivedBytesArr: number[] = []
    console.log(queue, 'queue')
    if (!queueItem) return

    const folder = queueItem.downloadFolder || downloadFolder
    const itemFilename = queueItem.filename
    const filePath = path.join(folder, queueItem.path, itemFilename)
    const totalBytes = item.getTotalBytes()
    let speedValue = 0
    let receivedBytes: number // 下载项目的接收字节
    item.setSavePath(filePath)

    // 如果下载中断
    console.log(item.getState())

    if (item.getState() === 'interrupted') {
      item.resume()
    }

    item.on('updated', (event, state) => {

      receivedBytes = item.getReceivedBytes() // 下载项目的接收字节
      ReceivedBytesArr.push(receivedBytes)

      if (ReceivedBytesArr.length >= 2) {
        const PreviousReceivedBytes = (ReceivedBytesArr.shift() as number)
        // eslint-disable-next-line max-len
        speedValue = Math.max(PreviousReceivedBytes, ReceivedBytesArr[0]) - Math.min(PreviousReceivedBytes, ReceivedBytesArr[0])
      }

      const progress: IDownProgressInfo = {
        progress: receivedBytes * 100 / totalBytes, // 进度
        speedBytes: speedValue, // 速度
        speed: _bytesToSize(speedValue) + '/sec', // 速度
        remainingBytes: totalBytes - receivedBytes, // 剩余
        remaining: _bytesToSize(totalBytes - receivedBytes),
        totalBytes: totalBytes, // 全部
        total: _bytesToSize(totalBytes),
        downloadedBytes: receivedBytes, // 已下载
        downloaded: _bytesToSize(receivedBytes)
      }

      const downInfo: IDownInfo = {
        savePath: item.getSavePath(), // 保存路径
        downURL: item.getURL(), // 下载地址
        mimeType: item.getMimeType(), // MIME 类型
        hasUserGesture: item.hasUserGesture(), // 是否具有用户手势
        filename: item.getFilename(), // 下载文件名
        contentDisposition: item.getContentDisposition(), // 响应头中的Content-Disposition字段
        startTime: item.getStartTime(), // 开始下载时间
        state
      }

      if (typeof queueItem.onProgress === 'function') {
        queueItem.onProgress(progress, downInfo, item)
      }
    })

    item.on('done', (e, state) => {
      const finishedDownloadCallback = queueItem.callback

      if (!win.isDestroyed()) { win.setProgressBar(-1) }
      // 如果下载中断
      console.log('down', state, item.getURL())

      if (state === 'interrupted') {
        const message = `该文件${item.getFilename()} 下载中断`
        finishedDownloadCallback(new Error(message), { url: item.getURL(), filePath })
      } else if (state === 'completed') {
        if (process.platform === 'darwin') { app.dock.downloadFinished(filePath) }
        finishedDownloadCallback(null, { url: item.getURL(), filePath })
      }
    })
  }
  win.webContents.session.on('will-download', listener)
}

// 注册
const register = (opts: registerOpts) => {
  app.on('browser-window-created', (e, win) => {
    _registerListener(win, opts)
  })
}

export default {
  register,
  download,
  bulkDownload
}
