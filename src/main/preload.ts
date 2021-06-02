import { ipcRenderer } from 'electron'
// 把ipcRenderer挂载到window上，webview内部的js可以拿到这个模块

(window as any).ElectronIpcRenderer = ipcRenderer
