// 封装继承

export default class ApiError extends Error {
  name = 'ApiError'
  message = ''

  constructor (message: string) {
    super()
    this.message = message
  }
}
