import type { AxiosPromise } from 'axios'

import axios from '@/plugins/axios'

import * as SessionTool from '@/utils/sessionTool'

/**
 * @description 使用token进行登录
 */
export async function login (params: { token: string }): Promise<string> {
  const res: any = await axios({
    url: '/manage_auth/login/sso',
    method: 'GET',
    headers: { 'X-Expose-Headers': 'X-Stream-Id, x-stream-id' },
    params
  })
  return res
}

/**
 * @description 退出登入
 */
export function logout (): AxiosPromise<any> {
  return axios({
    url: '/manage_auth/logout',
    method: 'GET'
  })
}

export type authorityInfo = {
  application: number | string
  id: number | string
  name: string
  title: string
}

/**
 * @description 获取个人权限
 */
export async function getAuthority (): Promise<authorityInfo[]> {
  const res: any = await axios({
    url: '/project_photo_quality/common/getAuthority',
    method: 'GET'
  })
  const msg: authorityInfo[] = res
  return msg
}

/**
 * @description 判断缓存是否过期
 */
export async function userExpire (): Promise<number> {
  const res: any = await axios({
    url: '/user_auth/auth/expire',
    method: 'GET'
  })
  const msg: number = res
  SessionTool.setXStreamIdExpireTime(msg)
  return msg
}

export type userBaseInfo = {
  id: number
  name: string
  nickname: string
  avatar: string
}
/**
 * @description 获取用户信息
 */
export async function info (): Promise<userBaseInfo> {
  const res: any = await axios({
    url: '/project_photo_quality/common/getSelfInfo'
  })

  const msg: userBaseInfo = res
  return msg
}
