// 订单配置
export interface ProjectConfig {
  projectTitle: string
  // 是否显示标签系统
  showTags: boolean
  // 是否显示面包屑
  showHeader: boolean
  // 是否显示标题
  showTitle: boolean
}

// 指令集合
export interface DirectiveObjConfig {
  [key: string]: any; // 索引签名
}
