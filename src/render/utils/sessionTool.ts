import { userBaseInfo, authorityInfo } from '@/api/userApi'
import { IFilterSelectData } from '@/api/selectDataApi'

const isMicroSPA = Boolean(window.__POWERED_BY_QIANKUN__)

/**
 * @description 存储xStreamId
 * @param {*} code
 */
export function setXStreamId (code: string): void {
  if (isMicroSPA) {
    localStorage.setItem('xStreamId', code)
  } else {
    sessionStorage.setItem('xStreamId', code)
  }
}

/**
 * @description 获取XStreamId
 */
export function getXStreamId (): string {
  if (isMicroSPA) {
    return localStorage.getItem('xStreamId') as string
  } else {
    return sessionStorage.getItem('xStreamId') as string
  }
}

/**
 * @description 清除session缓存
 */
export function removeSession (): void {
  sessionStorage.clear()
  localStorage.clear()
}

/**
 * @description 设置问题标记
 * @param {*} collapse
 */
export function setCollapseStorage (collapse: number): void {
  const saveKey = 'online-collapse'
  const data = String(collapse)
  sessionStorage.setItem(saveKey, data)
}

/**
 * @description 获取问题标记
 * @param {*} params
 */
export function getCollapseStorage (): boolean {
  const saveKey = 'online-collapse'
  const data = sessionStorage.getItem(saveKey)
  return data ? Boolean(Number(data)) : false
}

/**
 * @description 设置登录过期时间
 * @param {*} time
 */
export function setXStreamIdExpireTime (time: number): void {
  sessionStorage.setItem('xStreamIdExpireTime', String(time))
}

/**
 * @description 获取登录过期时间
 */
export function getStreamIdExpireTime (): number {
  const returnTime = sessionStorage.getItem('xStreamIdExpireTime')
  return returnTime ? Number(returnTime) : 0
}

/**
 * @description 存储userInfo
 * @param {*} info
 */
export function setUserInfo (info: userBaseInfo): void {
  const data = JSON.stringify(info)
  // 增加标识
  sessionStorage.setItem(`${__APP_INFO__.pkg.name}-userInfo`, data)
}

/**
 * @description 获取用户session中的赞存信息
 */
export function getUserInfo (): userBaseInfo | null {
  try {
    const data: string | null = sessionStorage.getItem(`${__APP_INFO__.pkg.name}-userInfo`)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

/**
 * @description 存储用户权限
 * @param {*} permission
 */
export function setUserPermission (permission: authorityInfo[]): void {
  const data = JSON.stringify(permission)
  sessionStorage.setItem('userPermission', data)
}

/**
 * @description
 * @param {*} code 获取用户权限
 */
export function getUserPermission (): authorityInfo[] | null {
  try {
    const data: string | null = sessionStorage.getItem('userPermission')
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

/**
 * @description 保存伙伴数据
 */
export function saveStaffList (staffInfo: IFilterSelectData[]) {
  const saveKey = `staff-info`
  const data = JSON.stringify(staffInfo)
  localStorage.setItem(saveKey, data)
}

/**
 * @description 获取伙伴列表
 */
export function getStaffList () {
  const saveKey = `staff-info`
  const data = localStorage.getItem(saveKey)
  return data ? JSON.parse(data) : null
}
