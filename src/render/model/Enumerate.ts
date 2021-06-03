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
