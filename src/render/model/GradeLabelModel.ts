import { v4 as uuid } from 'uuid'

/* eslint-disable no-unused-vars */
export enum GRADE_LEVEL {
  PULL = 'pull',
  PLANT = 'plant',
  SMALL = 'small',
  MIDDLE = 'middle'
}

// 修图标准映射中文
export const gradeLevelToCN = {
  [GRADE_LEVEL.SMALL]: '小',
  [GRADE_LEVEL.MIDDLE]: '中',
  [GRADE_LEVEL.PULL]: '拔草',
  [GRADE_LEVEL.PLANT]: '种草'
}

export const CNLevelToType = {
  '小': 'small',
  '中': 'middle',
  '拔草': 'pull',
  '种草': 'plant'
}

// 三级
export interface IGradeLevel {
  id: string | number
  name: string
  parent_id: string | number
  type: string
  score: number
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
  score: number
}

export enum SCORE_TYPE {
  DEDUCT = 'deduct',
  ADD = 'add'
}

export class GradeLevel {
  id: number
  name: string
  parentId: number
  score: number | string
  editScore: number | string
  scoreType: SCORE_TYPE
  

  constructor (gradeLevelItem: any, plant?: boolean) {
    this.id = gradeLevelItem.id || uuid()
    this.name = gradeLevelItem.name
    this.parentId = gradeLevelItem.parent_id
    this.score = gradeLevelItem.score || 0
    this.editScore = this.score
    this.scoreType = gradeLevelItem.type || (plant ? SCORE_TYPE.ADD : SCORE_TYPE.DEDUCT)
  }
}
export class GradeItem {
  id: number
  name: string
  parentId: number
  isNew: boolean
  isEdit: boolean
  editName: string
  children: GradeLevel[]

  constructor (gradeItem: any, isNew?: boolean) {
    this.id = gradeItem.id || uuid()
    this.name = gradeItem.name || ''
    this.parentId = gradeItem.parent_id
    this.isEdit = Boolean(isNew)
    this.isNew = Boolean(isNew)
    this.editName = this.name
    const childrenData = gradeItem.children || []
    this.children = childrenData.map((item: any) => new GradeLevel(item))
  }
}


export default class GradeLabelModel {
  id: number
  stringId: string
  name: string
  minScore: number
  maxScore: number
  children: GradeItem[]

  constructor (data: any) {
    this.id = data.id || uuid()
    this.stringId = String(this.id)
    this.name = data.name || ''
    this.minScore = 0
    this.maxScore = 100
    const childrenData = data.children || []
    this.children = childrenData.map((item: any) => new GradeItem(item))
  }
}
