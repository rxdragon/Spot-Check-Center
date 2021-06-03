import axios from 'axios'
import ApiError from './ApiError'

import { errorCode } from './errorCode'
import { newMessage } from '@/utils/message'
import router from '@/router'

import * as SessionTool from '@/utils/sessionTool'
import * as UserApi from '@/api/userApi'

axios.defaults.timeout = 20000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.baseURL = process.env.VUE_APP_BASE_API
// 超时重新请求配置
axios.defaults.retry = 4
axios.defaults.retryDelay = 500

const WHITE_REQUEST: string[] = []

/**
 * @description 抛出信息
 * @param message 信息
 * @returns
 */
function errorMessage (message: string) {
  return new Promise<void>(resolve => {
    newMessage({
      type: 'error',
      message: message,
      duration: 1500,
      offset: 98,
      onClose: () => {
        resolve()
      }
    })
  })
}

/**
 * @description 设置请求头信息
 */
axios.interceptors.request.use(
  (config) => {
    const xstreamId = SessionTool.getXStreamId()
    if (xstreamId) {
      config.headers['x-stream-id'] = xstreamId
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * @description 对响应数据进行处理
 */
axios.interceptors.response.use(
  (response) => {
    let res: any = null
    res = response.data
    if (response.data.msg === 'login success') {
      res = response.headers['x-stream-id']
    }
    if (res.success) return res.msg
    return res
  },
  (error) => {
    const requestPathArr = error.config.url.split('/')
    const requestPath = requestPathArr[requestPathArr.length - 1]
    const config = error.config
    // 如果config不存在或未设置重试选项，返回数据
    // 针对白名单处理
    if (WHITE_REQUEST.includes(requestPath)) {
      const message = '请求错误'
      // 设置变量
      config.__retryCount = config.__retryCount || 0
      // 检查最大重复此时
      if (config.__retryCount >= config.retry) {
        return Promise.reject(message)
      }
      config.__retryCount += 1 // 增加重试次数
      // 创建新的请求
      const backoff = new Promise<void>(function (resolve) {
        setTimeout(function () {
          resolve()
        }, config.retryDelay || 1)
      })
      if (error.message.indexOf('timeout') !== -1) {
        return backoff.then(function () {
          return axios(config)
        })
      } else {
        return Promise.reject(new ApiError(message))
      }
    }

    // 普通的请求
    if (!error.response) {
      // 请求没有任何返回值：网络差，无服务
      const message = '网络错误，请稍后再试！'
      errorMessage(message)
      return Promise.reject(new ApiError(message))
    }

    // 没有权限
    if (error.error_code === 401) {
      SessionTool.removeSession()
      router.push(`/login`)
      UserApi.logout()
    }

    // 请求成功 但是报错
    const data = error.response.data
    const noData = !data
    const serverError
      = data && (!data.error_code || (data.error_code !== 401 && data.error_code < 1000))
    const isPermissionsError = data.error_code === 403

    // 服务器抛错

    if (noData || serverError) {
      let message = '系统繁忙，请稍后再试：' + data.error_msg
      if (isPermissionsError) {
        message = '暂无该权限，请联系管理员' + data.error_msg
      }
      errorMessage(message)
      return Promise.reject(new ApiError(message))
    }

    const message = errorCode.getMsg(data)
    errorMessage(message)
    return Promise.reject(new ApiError(message))
  }
)

export default axios
