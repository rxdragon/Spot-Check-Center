import Idb from 'idb-js' //  引入Idb
import { store } from '@/store/index'
import db_cloud_config from './db_cloud_config'

import * as Setting from './getSetting'

let downloadFolder = ''
if (window.ElectronIpcRenderer) {
  downloadFolder = window.ElectronIpcRenderer.sendSync('app:getPath', 'desktop')
}


export default async function initIndexDb (resetData) {
  // eslint-disable-next-line new-cap
  const cloudDb = await Idb(db_cloud_config)
  window.CloudDb = cloudDb
  if (!resetData) return

  await initSavePath()
  // // 缓存开关
  await initImageCacheSwitch()
}

/**
 * @description 初始化配置
 */
export async function initSavePath () {
  const savePathObj = await Setting.getSavePath()
  const savePath = savePathObj ? savePathObj.settingValue : downloadFolder
  store.dispatch('settingStore/setSavePath', savePath)
  if (!savePathObj) {
    Setting.setSavePath(downloadFolder)
  }
}

/**
 * @description 图片缓存开关初始化
 */
export async function initImageCacheSwitch () {
  const imageCacheSwitchObj = await Setting.getSetting('imageCacheSwitch')
  const imageCacheSwitch = imageCacheSwitchObj ? imageCacheSwitchObj.settingValue : 0
  store.dispatch('settingStore/setImageCacheSwitch', imageCacheSwitch)
  if (!imageCacheSwitch) {
    Setting.setSetting('imageCacheSwitch', imageCacheSwitch)
  }
}
