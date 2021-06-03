/* eslint-disable new-cap */
import type { IMessageOptions, MessageParams } from 'element-plus/lib/el-message/src/types'

import { ElMessage } from 'element-plus'

export const newMessage: any = (params: IMessageOptions) => {
  const newParams: MessageParams = { ...params }
  ElMessage(newParams)
}

['success', 'warning', 'info', 'error'].forEach((type: any) => {
  newMessage[type] = (options: IMessageOptions | string) => {
    if (typeof options === 'string') {
      options = {
        message: options
      }
    }
    options.type = type
    return newMessage(options)
  }
})
