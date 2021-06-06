/* eslint-disable no-unused-vars */

/**
 * @description 门店类型
 */
export enum STORE_TYPE {
  BLUE = 'blue',
  MASTER = 'master',
  KIDS = 'kids',
  MAINTO = 'mainto'
}

/**
 * @description 身份中文
 */
export const storeTypeToCN = {
  [STORE_TYPE.BLUE]: '蓝标',
  [STORE_TYPE.MASTER]: '大师',
  [STORE_TYPE.KIDS]: 'kids',
  [STORE_TYPE.MAINTO]: '缦图'
}


/**
 * @description AI标签类型
 */
export enum AI_TAG_TYPE {
  NORMAL = 'normal',
  ABNORMAL = 'abnormal',
  AIREFUSE = 'airefuse'
}

/**
 * @description AI标签中文
 */
export const AiTagToCN = {
  [AI_TAG_TYPE.NORMAL]: '正常',
  [AI_TAG_TYPE.ABNORMAL]: '异常',
  [AI_TAG_TYPE.AIREFUSE]: 'AI拒绝审核',
}
