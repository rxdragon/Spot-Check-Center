type ErrorType = [number, string]

const CardException: ErrorType[] = [[0xa11010001, '此类卡片已使用']]

export const errText: ErrorType[] = [...CardException]

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
