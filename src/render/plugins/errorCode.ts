type ErrorType = [number, string]

const CheckPoolException: ErrorType[] = [
  [0xA25004009, '正在抽片中'],
  [0xA25004010, '暂无数据']
]

export const errText: ErrorType[] = [
  ...CheckPoolException
]

type ErrType = {
  error_code?: number | string
  error_msg?: Record<any, any> | string
}

const errMap = new Map(errText)
export const errorCode = {
  getMsg: (err: ErrType): string => {
    const codeNum = Number(err.error_code)
    return errMap.get(codeNum) || JSON.stringify(err.error_msg)
  }
}
