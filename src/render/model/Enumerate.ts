/* eslint-disable no-unused-vars */

/**
 * @description 门店类型
 */
export enum STORE_TYPE {
  BLUE = 'blue',
  MASTER = 'master',
  GOLD = 'gold',
  KIDS = 'kids',
  FAMILY = 'family',
  MAINTO = 'mainto',
  UNUSUAL = 'unusual'
}

// 门店中文
export const storeTypeToCN = {
  [STORE_TYPE.BLUE]: '蓝标',
  [STORE_TYPE.MASTER]: '大师',
  [STORE_TYPE.GOLD]: '大师',
  [STORE_TYPE.KIDS]: 'Kids',
  [STORE_TYPE.FAMILY]: 'Family',
  [STORE_TYPE.MAINTO]: '缦图',
  [STORE_TYPE.UNUSUAL]: '异常'
}

/**
 * @description 抽查类型
 */
export enum SPOT_TYPE {
  MAKEUP = 'makeup',
  PHOTOGRAPHY = 'photography'
}

// 抽查类型中文
export const spotTypeCN = {
  [SPOT_TYPE.MAKEUP]: '化妆',
  [SPOT_TYPE.PHOTOGRAPHY]: '摄影',
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

/**
 * @description 机构
 */
export enum ORGANIZATION_TYPE {
  HIMO = 'himo',
  SHOW_PIC = 'showpic',
  FAMILY = 'family'
}

// 机构中文
export const organizationTypeToCN = {
  [ORGANIZATION_TYPE.HIMO]: '海马体',
  [ORGANIZATION_TYPE.SHOW_PIC]: '修修兽',
  [ORGANIZATION_TYPE.FAMILY]: 'Family',
}

/**
 * @description 质检报告作用范围
 */
export enum QUALITY_REPORT_RANGE {
  REGION = 'region',
  ALL = 'all',
}

// 质检报告作用范围中文
export const QualityReportRangeToCN = {
  [QUALITY_REPORT_RANGE.REGION]: '区域',
  [QUALITY_REPORT_RANGE.ALL]: '全员',
}

export const CNLevelToType = {
  '小': 'small',
  '中': 'middle',
  '拔草': 'pull',
  '种草': 'plant'
}

/**
 * @description 质检报告分类
 */
export const QUALITY_TYPE = {
  HIMO_MAKEUP: 'himoMakeupPool', // 海马体化妆
  HIMO_PHOTOGRAPHY: 'himoPhotographyPool', // 海马体摄影
  FAMILY_MAKEUP: 'familyMakeupPool', // family化妆
  FAMILY_PHOTOGRAPHY: 'familyPhotographyPool' // family摄影
}
