/* eslint-disable no-unused-vars */

export enum DOWN_STATE {
  WAIT_DOWN = 'waitdown',
  PROGRESSING = 'progressing', // 下载中
  COMPLETED = 'completed', // 下载完成
  CANCELLED = 'cancelled', // 取消下载
  INTERRUPTED = 'interrupted' // 下载中断
}

export const downStateToCN = {
  [DOWN_STATE.WAIT_DOWN]: '等待下载',
  [DOWN_STATE.PROGRESSING]: '下载中',
  [DOWN_STATE.COMPLETED]: '下载完成',
  [DOWN_STATE.CANCELLED]: '取消下载',
  [DOWN_STATE.INTERRUPTED]: '下载中断'
}
