import { BrowserWindow, dialog, IpcMain, IpcMainEvent, OpenDialogSyncOptions } from 'electron'

// 注册diglog事件
function initDialog (_win: BrowserWindow, ipcMain: IpcMain) {
  // 显示保存弹框
  function showSavePathDiaLog (event: IpcMainEvent) {
    
    const options: OpenDialogSyncOptions = {
      title: '选择保存路径',
      defaultPath: '',
      buttonLabel: '确认',
      properties: ['openDirectory', 'createDirectory', 'promptToCreate']
    }
    const request = dialog.showOpenDialogSync(options)
    if (request) {
      event.returnValue = request
    } else {
      event.returnValue = ''
    }
  }

  ipcMain.on('change-savePath', showSavePathDiaLog)
}

export default initDialog
