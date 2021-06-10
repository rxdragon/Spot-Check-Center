/* eslint-disable no-unused-vars */
export enum GRADE_LEVEL {
  SMALL = 'small',
  MIDDLE = 'middle',
  PULL = 'pull',
  PLANT = 'plant'
}

// 修图标准映射中文
export const gradeLevelToCN = {
  [GRADE_LEVEL.SMALL]: '小',
  [GRADE_LEVEL.MIDDLE]: '中',
  [GRADE_LEVEL.PULL]: '拔草',
  [GRADE_LEVEL.PLANT]: '种草'
}

// 三级
export interface IGradeLevel {
  id: string | number
  name: string
  parent_id: string | number
}

// 二级
export interface ILabelChildren {
  id: string | number
  idString: string
  name: string
  parentId: string | number
  value: GRADE_LEVEL | string
  children?: IGradeLevel[]
  isOneAll?: boolean
}

// 一级
export interface ILabelClass {
  id: string | number
  idString: string
  name: string
  children: ILabelChildren[]
}

export interface IgetScoreConfigListRes {
  chainLine: any[]
  labelClass: ILabelClass[]
}

export interface ISelectId {
  id: string | number
  name: string
  levelId: string | number
  type: GRADE_LEVEL
}
