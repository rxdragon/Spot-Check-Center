import { contextBridge, ipcRenderer, shell, IpcRendererEvent } from 'electron'
import originalFs from "original-fs"

// 把ipcRenderer挂载到window上，webview内部的js可以拿到这个模块

contextBridge.exposeInMainWorld( 'ElectronIpcRenderer', ipcRenderer )
contextBridge.exposeInMainWorld(
  'ElectronIpcRendererAddListener',
  {
    invoke: (channel: string, ...args: any[]) => {
      ipcRenderer.invoke(channel, args)
    },
    on: (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) => {
      ipcRenderer.on(channel, listener)
    },
    once: (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) => {
      ipcRenderer.once(channel, listener)
    },
    postMessage: (channel: string, message: any, transfer?: MessagePort[]) => {
      ipcRenderer.postMessage(channel, message, transfer)
    },
    removeAllListeners: (channel: string) => {
      ipcRenderer.removeAllListeners(channel)
    },

  }
)
contextBridge.exposeInMainWorld( 'ElectronShell', shell )
contextBridge.exposeInMainWorld( 'OriginalFs', originalFs )
