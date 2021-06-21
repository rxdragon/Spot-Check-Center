
/**
 * @description 获取保存路径
 */
export function getSavePath () {
  return new Promise(resolve => {
    window.CloudDb.query_by_index({
      tableName: 'setting',
      indexName: 'settingKey',
      target: 'savePath',
      success: (res: string) => resolve(res),
      error: () => resolve(null)
    })
  })
}

/**
 * @description 设置保存路径
 * @param {*} value
 */
export function setSavePath (value: string) {
  return new Promise<void>((resolve, reject) => {
    window.CloudDb.insert({
      tableName: 'setting',
      data: {
        settingKey: 'savePath',
        settingValue: value
      },
      success: () => resolve(),
      error: (err: any) => reject(err)
    })
  })
}

/**
 * @description 更新保存路径
 * @param {*} value
 */
export function updateSavePath (value: string) {
  return new Promise<void>((resolve, reject) => {
    window.CloudDb.update({
      tableName: 'setting',
      condition: (item: { settingKey: string }) => item.settingKey === 'savePath',
      handle: (r: { settingValue: any }) => {
        r.settingValue = value
      },
      success: () => resolve()
    })
  })
}

/**
 * @description 获取自动开启按钮开关
 */
export function getSetting (key: string) {
  return new Promise(resolve => {
    window.CloudDb.query_by_index({
      tableName: 'setting',
      indexName: 'settingKey',
      target: key,
      success: (res: string) => resolve(res),
      error: () => resolve(null)
    })
  })
}

/**
 * @description 设置缓存开关
 * @param {*} value
 */
export function setSetting (key: string, value: string) {
  return new Promise<void>((resolve, reject) => {
    window.CloudDb.insert({
      tableName: 'setting',
      data: {
        settingKey: key,
        settingValue: value
      },
      success: () => resolve(),
      error: (err: any) => reject(err)
    })
  })
}

/**
 * @description 更新保存路径
 * @param {*} value
 */
export function updateSetting (key: string, value: string | number) {
  return new Promise<void>((resolve, reject) => {
    window.CloudDb.update({
      tableName: 'setting',
      condition: (item: { settingKey: string }) => item.settingKey === key,
      handle: (r: { settingValue: any }) => {
        r.settingValue = value
      },
      success: () => resolve()
    })
  })
}
