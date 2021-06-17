/* eslint-disable no-unused-vars */

export enum DOWN_STATE {
  WAIT_DOWN = 'waitdown',
  PROGRESSING = 'progressing', // 下载中
  COMPLETED = 'completed', // 下载完成
  CANCELLED = 'cancelled', // 取消下载
  INTERRUPTED = 'interrupted' // 下载中断
}
