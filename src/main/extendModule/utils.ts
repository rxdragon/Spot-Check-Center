import type { BrowserWindow, IpcMain, IpcMainEvent } from "electron"

import path from 'path'
import fs from 'fs'
const userDir = global.userDir
const imageCachePath = path.join(userDir, 'imageCache')
import { shell } from 'electron'

function hasImageCache (imagePath: string) {
  return fs.existsSync(imagePath)
}

// 注册选中文件事件
function initUtils (win: BrowserWindow, ipcMain: IpcMain) {
  // 选择文件
  async function selectFile (event: IpcMainEvent, { filePath }: { filePath: string }) {
    const wc = win.webContents
    try {
      wc.debugger.attach('1.1')
    } catch (err) {
      console.error('Debugger attach failed : ', err)
    }
    try {
      const res = await wc.debugger.sendCommand('DOM.getDocument')
      const querySelectorRes = await wc.debugger.sendCommand('DOM.querySelector', {
        nodeId: res.root.nodeId,
        selector: '#el-upload-file .el-upload__input'
      })
      await wc.debugger.sendCommand('DOM.setFileInputFiles', {
        nodeId: querySelectorRes.nodeId,
        files: filePath // Actual list of paths
      })
      wc.debugger.detach()
    } catch (error) {
      console.error(error)
    }
  }

  // 打开文件夹
  function openFile (event: IpcMainEvent) {
    try {
      if (!hasImageCache(imageCachePath)) throw new Error('no find fileFolder')
      shell.showItemInFolder(imageCachePath)
      event.returnValue = 'success'
    } catch (error) {
      event.returnValue = error.message
    }
  }

  /**
   * @description 清楚图片缓存
   */
  function cleanImageCache (event: IpcMainEvent) {
    try {
      fs.readdir(imageCachePath, (err: any, data: string[]) => {
        if (err) throw err
        data.forEach((fileName: string) => {
          const deleteFilePath = path.join(imageCachePath, fileName)
          fs.unlinkSync(deleteFilePath)
        })
      })
      event.returnValue = 'success'
    } catch (error) {
      event.returnValue = error.message
    }
  }

  function getImageCache (event: IpcMainEvent) {
    try {
      fs.readdir(imageCachePath, (err: any, data: string | any[]) => {
        if (err) throw err
        event.returnValue = data.length
      })
    } catch (error) {
      event.returnValue = 'fail'
    }
  }

  // 获取路径地址
  function getUserDir (event: IpcMainEvent) {
    event.returnValue = userDir
  }

  ipcMain.on('utils:OpenFile', openFile)
  ipcMain.on('utils:clean-image-cache', cleanImageCache)
  ipcMain.on('utils:get-image-cache', getImageCache)
  ipcMain.on('utils:get-userDir', getUserDir)
  ipcMain.on('select-file', selectFile)
}

export default initUtils
