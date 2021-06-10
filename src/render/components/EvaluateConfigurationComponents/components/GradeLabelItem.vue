<template>
  <div class="grade-label-item mb-6">
    <div class="label-title flex justify-between items-center p-4 text-gray-800">
      <template v-if="!gradeLabelInfo.isEdit">
        {{ gradeLabelInfo.name }}
      </template>
      <template v-else>
        <el-input
          v-noSpecialChar
          class="input-box"
          :model-value="gradeLabelInfo.editName"
          maxlength="8"
          placeholder="请输入评分项名称"
          @input="onGradeLabelNameChagne"
        />
      </template>

      <div class="edit-tool">
        <template v-if="!gradeLabelInfo.isEdit">
          <el-button
            class="tool-item"
            type="primary"
            size="mini"
            round
            @click="editGradeLabel"
          >
            <i class="el-icon-edit-outline" />
          </el-button>
          <el-button
            class="tool-item"
            type="danger"
            size="mini"
            round
            @click="deleteScoreGroup"
          >
            <i class="el-icon-delete" />
          </el-button>
        </template>
        <template v-else>
          <el-button
            class="tool-item"
            type="info"
            size="small"
            @click="cancelEditGradeLabel"
          >
            取消
          </el-button>
          <el-button
            class="tool-item"
            type="primary"
            size="small"
            @click="saveGradeLabel"
          >
            保存
          </el-button>
        </template>
      </div>
    </div>
    <div class="level-list divide-y divide-gray-200">
      <div class="level-header level-row grid grid-cols-2 px-4 leading-10">
        <div class="level-title flex-1">问题程度</div>
        <div class="level-content flex-1 pl-4">分值</div>
      </div>
      <div v-for="gradeLevelItem in gradeLabelInfo.children" :key="gradeLevelItem.id" class="level-row grid grid-cols-2 px-4 leading-10">
        <div class="level-title flex-1">{{ gradeLevelItem.name }}</div>
        <div
          class="level-content flex-1 pl-4"
          :class="{
            'text-red-500': gradeLevelItem.scoreType === SCORE_TYPE.DEDUCT,
            'text-green-500': gradeLevelItem.scoreType === SCORE_TYPE.ADD
          }"
        >
          <div v-if="gradeLabelInfo.isEdit" class="edit-score">
            {{ gradeLevelItem.scoreType === SCORE_TYPE.ADD ? '加分项' : '扣分项' }}
            <el-input-number
              v-model="gradeLevelItem.editScore"
              v-numberOnly
              type="number"
              style="width: 140px;"
              class="ml-10"
              size="mini"
              :min="0"
              :max="100"
            />
          </div>
          <div v-else class="static-score">
            <span class="symbol-type">{{ gradeLevelItem.scoreType === SCORE_TYPE.DEDUCT ? '-' : '+' }}</span>
            {{ gradeLevelItem.score }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, toRefs, inject } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store/index'

import { GradeItem, SCORE_TYPE } from '@/model/GradeLabelModel'
import { ORGANIZATION_TYPE, SPOT_TYPE } from '@/model/Enumerate'

import { ElMessageBox } from 'element-plus'
import { newMessage } from '~/render/utils/message'
import * as GradeConfigurationApi from '@/api/gradeConfigurationApi'

export default defineComponent({
  name: 'GradeLabelItem',
  props: {
    gradeLabelInfo: { type: Object as PropType<GradeItem>, required: true },
    gradeLabelList: { type: Array as PropType<GradeItem[]>, required: true }
  },
  setup (props) {
    const type = inject('type') as SPOT_TYPE
    const organizationType = inject('organizationType') as ORGANIZATION_TYPE
    const store = useStore()
    const route = useRoute()

    const { gradeLabelInfo, gradeLabelList } = toRefs(props)
    // 编辑文本
    const editGradeLabel = () => {
      gradeLabelInfo.value.isEdit = true
    }
    // 取消编辑
    const cancelEditGradeLabel = () => {
      const findDeleteIndex = gradeLabelList.value.findIndex(item => item.id === gradeLabelInfo.value.id)
      if (findDeleteIndex < 0) return newMessage.warning('未找到评分标签')
      if (gradeLabelInfo.value.isNew) {
        gradeLabelList.value.splice(findDeleteIndex, 1)
      } else {
        gradeLabelInfo.value.isEdit = false
      }
    }

    // 监听文本框数据变化
    const onGradeLabelNameChagne = (value: string) => {
      gradeLabelInfo.value.editName = value
    }

    /** 删除标签 */
    const deleteScoreGroup = async () => {
      try {
        await ElMessageBox.confirm('是否确定删除该评分项?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        // 没有保存过的， 不需要调接口
        const findDeleteIndex = gradeLabelList.value.findIndex(item => item.id === gradeLabelInfo.value.id)
        if (findDeleteIndex < 0) return newMessage.warning('未找到评分标签')

        if (gradeLabelInfo.value.isNew) {
          gradeLabelList.value.splice(findDeleteIndex, 1)
          return
        }

        const req = { id: gradeLabelInfo.value.id, type, organizationType }
        try {
          store.dispatch('settingStore/showLoading', route.name)
          await GradeConfigurationApi.delScoreConfig(req)
          gradeLabelList.value.splice(findDeleteIndex, 1)
        } finally {
          store.dispatch('settingStore/hiddenLoading', route.name)
        }
      } catch {
        console.warn('取消确认')
      }
    }

    /** 保存标签 */
    const saveGradeLabel = async () => {
      const hasError = gradeLabelInfo.value.children.some(levelItem => {
        return levelItem.editScore === undefined || levelItem.editScore === ''
      })
      if (hasError) return newMessage.warning('请填写分值')
      const hasDuplicate = gradeLabelList.value.some(gradeLabelItem => {
        return gradeLabelItem.id !== gradeLabelInfo.value.id && gradeLabelItem.name === gradeLabelInfo.value.editName
      })
      if (hasDuplicate) return newMessage.warning('存在相同的评分项')
      if (!gradeLabelInfo.value.editName) return newMessage.warning('请填写评分项名称')

      const levelInfo = gradeLabelInfo.value.children.map(levelItem => {
        return {
          id: levelItem.id,
          name: levelItem.name,
          score: levelItem.editScore,
          type: levelItem.scoreType
        }
      })

      const baseReq = {
        name: gradeLabelInfo.value.editName,
        children: levelInfo,
        type,
        organizationType
      }

      try {
        store.dispatch('settingStore/showLoading', route.name)
        if (!gradeLabelInfo.value.isNew) {
          const req = {
            id: gradeLabelInfo.value.id,
            ...baseReq
          }
          await GradeConfigurationApi.editScoreConfig(req)
        } else {
          const req = {
            scoreTypeId: gradeLabelInfo.value.parentId,
            ...baseReq
          }
          const id = await GradeConfigurationApi.addScoreConfig(req)
          gradeLabelInfo.value.id = id
        }
        gradeLabelInfo.value.children.forEach(levelItem => levelItem.score = levelItem.editScore)
        gradeLabelInfo.value.name = gradeLabelInfo.value.editName
        gradeLabelInfo.value.isEdit = false
        gradeLabelInfo.value.isNew = false
      } finally {
        store.dispatch('settingStore/hiddenLoading', route.name)
      }
    }

    return {
      SCORE_TYPE,
      onGradeLabelNameChagne,
      editGradeLabel, cancelEditGradeLabel, saveGradeLabel,
      deleteScoreGroup
    }
  }
})
</script>

<style lang="less" scoped>
.grade-label-item {
  overflow: hidden;
  background-color: #fafafa;
  border-radius: 8px;

  .label-title {
    font-size: 16px;
    font-weight: 700;
    line-height: 36px;
    background-color: #eaeaea;

    .input-box {
      width: 250px;
    }

    .edit-tool {
      .tool-item {
        i {
          font-size: 16px;
        }
      }
    }
  }

  .level-list {
    .edit-score {
      font-size: 14px;
    }
  }
}
</style>
