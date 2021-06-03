import dayjs from 'dayjs'

/**
 * @description 格式化时间
 * @param time 
 * @returns 
 */
export function formatTime (time: dayjs.ConfigType | undefined): string {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

/**
 * @description 搜索开始时间
 * @param time 
 * @returns 
 */
export function searchStartTime (time: dayjs.ConfigType | undefined): string {
  return dayjs(time).format('YYYY-MM-DD 00:00:00')
}

/**
 * @description 搜索结束时间
 * @param time 
 * @returns 
 */
export function searchEndTime (time: dayjs.ConfigType | undefined): string {
  return dayjs(time).format('YYYY-MM-DD 23:59:59')
}
