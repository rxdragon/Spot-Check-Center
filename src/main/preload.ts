import { contextBridge, ipcRenderer } from 'electron'
import originalFs from "original-fs"

// 把ipcRenderer挂载到window上，webview内部的js可以拿到这个模块

contextBridge.exposeInMainWorld( 'ElectronIpcRenderer', ipcRenderer )
contextBridge.exposeInMainWorld( 'OriginalFs', originalFs )
