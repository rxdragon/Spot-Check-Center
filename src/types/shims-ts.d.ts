declare type Recordable<T = any> = Record<string, T>

import 'axios'
declare module 'axios' {
  export interface AxiosRequestConfig {
    retry?: number
    retryDelay?: number
  }
}

import type { App } from 'vue'

import type { IpcRenderer, Shell } from 'electron'
declare global {
  
  const __APP_INFO__: {
    pkg: {
      name: string
      version: string
      dependencies: Recordable<string>
      devDependencies: Recordable<string>
    }
    lastBuildTime: string
  }

  const __APP__: App

  interface Window {
    __POWERED_BY_QIANKUN__: boolean
    __VUE_DEVTOOLS_GLOBAL_HOOK__: boolean
    BUILD_TIME: any
    _: any
    __APP__: App
    ElectronIpcRenderer?: IpcRenderer
    ElectronShell?: Shell
    ElectronIpcRendererAddListener?: {
      invoke: IpcRenderer['invoke']
      on: IpcRenderer['on']
      once: IpcRenderer['once']
      postMessage: IpcRenderer['postMessage']
      removeAllListeners: IpcRenderer['removeAllListeners']
    }
    OriginalFs?: any
  }

  namespace _ {
  }
}

import 'vue-router'
declare module 'vue-router' {
  interface RouterOptions {
    base?: string
  }

  interface RouteMeta {
    // 是可选的
    hidden?: boolean
    title?: string
    noCache?: boolean
    affix?: boolean
  }
}

import { ElMessageBoxShortcutMethod } from 'element-plus/lib/el-message-box/src/message-box.type.d'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $microSPA: boolean
    $isDev: boolean
    $showTags: boolean
    $showHeader: boolean
    $showTitle: boolean
    $isElectron: boolean
    $msgbox: ElMessageBoxShortcutMethod
    $alert: ElMessageBoxShortcutMethod
    $confirm: ElMessageBoxShortcutMethod
    $prompt: ElMessageBoxShortcutMethod
    $newMessage: any
    // element 下载功能
    $DownIpc: any
  }
}

declare module 'path-to-regexp'

declare module 'js-base64'
