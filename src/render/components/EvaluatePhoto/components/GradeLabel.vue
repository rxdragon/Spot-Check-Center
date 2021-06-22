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

import { defineComponent, inject, ref } from 'vue'
import { ORGANIZATION_TYPE, SPOT_TYPE } from '@/model/Enumerate'
import LoadingTea from '@/components/LoadingTea/index.vue'
import LabelModule from './LabelModule.vue'
import * as EvaluateApi from '@/api/evaluateApi'

export default defineComponent({
  name: 'GradeLabel',
  components: { LoadingTea, LabelModule },
  setup () {
    // eslint-disable-next-line no-unused-vars
    const type = inject('type') as SPOT_TYPE
    // eslint-disable-next-line no-unused-vars
    const organizationType = inject('organizationType') as ORGANIZATION_TYPE

    const loading = ref(false)

    const activeLabelId = ref('')
    const activeNames = ref([])

    /** 获取全部标签信息 */
    let backUpLabelData: ILabelClass[] = []
    const labelClass = ref<ILabelClass[]>([])
    const chainLine = ref<any[]>([])
    const getAllLabel = async () => {
      try {
        loading.value = true
        const req = { type, organizationType }
        const res = await EvaluateApi.getScoreConfigList(req)
        backUpLabelData = JSON.parse(JSON.stringify(res.labelClass))
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
      labelClass.value = JSON.parse(JSON.stringify(backUpLabelData))
    }
    // 获取全部标签
    const getAllSelectLabel = () => {
      const selectTags = Object.values(selectAllData.value)
      const tags = selectTags.map(item => {
        return {
          id: item.levelId,
          score: item.score
        }
      })
      return tags
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
  max-height: calc(100% - 60px);
  overflow: overlay;
  font-size: 12px;
  color: #eee;
  user-select: none;

  .label-header {
    position: sticky;
    top: 0;
    padding: 14px 12px;
    background-color: #535353;

    .panel-title {
      color: #eee;
    }
  }

  :deep(.el-collapse) {
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
