<template>
  <div class="grade-label">
    <div class="label-header">
      <div class="panel-title">标签栏</div>
    </div>
    <transition name="el-fade-in-linear" mode="out-in">
      <LoadingTea v-if="loading" class="loading-box" />
      <div v-else class="lable-main">
        <el-collapse v-if="labelClass.length" v-model="activeNames">
          <el-collapse-item
            v-for="labelClassItem in labelClass"
            :key="labelClassItem.id"
            :title="labelClassItem.name"
            :name="labelClassItem.idString"
          >
            <LabelModule :label-class="labelClassItem" @deleteLable="deleteLabel" @addLabel="addLabel" />
          </el-collapse-item>
        </el-collapse>
        <div v-else class="tip">请联系主管添加评分</div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import type { ILabelClass, ISelectId } from '@/model/GradeLabelModel'

import { defineComponent, ref } from 'vue'
import LoadingTea from '@/components/LoadingTea/index.vue'
import LabelModule from './LabelModule.vue'
import * as EvaluateApi from '@/api/evaluateApi'

export default defineComponent({
  name: 'GradeLabel',
  components: { LoadingTea, LabelModule },
  setup () {
    const loading = ref(false)

    const activeLabelId = ref('')
    const activeNames = ref([])

    /** 获取全部标签信息 */
    const labelClass = ref<ILabelClass[]>([])
    const chainLine = ref<any[]>([])
    const getAllLabel = async () => {
      try {
        loading.value = true
        const res = await EvaluateApi.getScoreConfigList()
        labelClass.value = res.labelClass
        chainLine.value = res.chainLine
      } finally {
        loading.value = false
      }
    }
    getAllLabel()
    
    /** 全部激活标签数据 */
    const selectAllData = ref<Record<string, ISelectId>>({})

    // 添加标签
    const addLabel = (labelInfo: ISelectId) => {
      selectAllData.value[labelInfo.levelId] = labelInfo
    }
    // 删除标签
    const deleteLabel = (id: string) => {
      delete selectAllData.value[id]
    }
    // 重置标签
    const resetSelectLabel = () => {
      selectAllData.value = {}
    }
    // 获取全部标签
    const getAllSelectLabel = () => {
      const selectIds = Object.keys(selectAllData.value)
      return selectIds
    }

    return {
      loading,
      activeLabelId,
      chainLine,
      activeNames,
      labelClass,
      addLabel, deleteLabel, resetSelectLabel, getAllSelectLabel
    }
  },
})
</script>

<style lang="less" scoped>
.grade-label {
  @border-color: 1px solid #666;
  @gradeLabelBack: #393939;

  width: 100%;
  min-height: 400px;
  font-size: 12px;
  color: #eee;

  .label-header {
    padding: 14px 12px;

    .panel-title {
      color: #eee;
    }
  }

  & /deep/ .el-collapse {
    border-top: @border-color;
    border-bottom: none;

    .el-collapse-item__header {
      padding-left: 12px;
      font-size: 14px;
      line-height: 20px;
      color: #eee;
      background-color: @gradeLabelBack;
      border-bottom: @border-color;

      &.is-active {
        border-bottom: transparent;
      }
    }

    .el-collapse-item__wrap {
      font-size: 12px;
      color: #eee;
      background-color: @gradeLabelBack;
      border-bottom: @border-color;

      .el-collapse-item__content {
        padding: 0 12px 14px;
        color: #eee;
      }
    }
  }

  .loading-box {
    display: flex;
    align-items: center;
    justify-content: center;
    height: calc(100% - 60px);
  }

  .lable-main {
    .tip {
      padding: 14px 12px;
      font-size: 14px;
      font-weight: bolder;
    }
  }
}
</style>
