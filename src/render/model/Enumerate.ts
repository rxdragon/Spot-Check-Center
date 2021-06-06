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
