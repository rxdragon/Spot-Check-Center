<template>
  <div class="grade-class-item module-panel">
    <div class="add-grade-label-wrap mb-6">
      <el-button type="primary" @click="addGradeLabel">添加评分项</el-button>
    </div>
    <div class="grade-label-list">
      <transition-group name="list-complete" tag="p">
        <GradeLabelItem
          v-for="gradeLabelItem in gradeLabelList"
          :key="gradeLabelItem.id"
          :grade-label-info="gradeLabelItem"
          :grade-label-list="gradeLabelList"
          class="list-complete-item"
        />
      </transition-group>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, toRefs } from 'vue'
import * as GradeConfigurationApi from '@/api/gradeConfigurationApi'
import GradeLabelItem from './GradeLabelItem.vue'
import { GradeLevel, GRADE_LEVEL, gradeLevelToCN, GradeItem } from '@/model/GradeLabelModel'

export default defineComponent({
  name: 'GradeClassItem',
  components: { GradeLabelItem },
  props: {
    gradeClassInfo: { type: Object as PropType<GradeConfigurationApi.interactionGradeLabelModel>, required: true }
  },
  setup (props) {
    const { gradeClassInfo } = toRefs(props)
    const gradeLabelList = computed(() => props.gradeClassInfo.children)

    /** 添加评分项目 */
    const addGradeLabel = () => {
      const levelVales = Object.values(GRADE_LEVEL)
      const newGradeItem = new GradeItem({ parent_id: gradeClassInfo.value.id }, true)
      const levelChildren = levelVales.map(item => {
        const baseData = {
          name: gradeLevelToCN[item],
          parentId: newGradeItem.id
        }
        const isPlant = item === GRADE_LEVEL.PLANT
        return new GradeLevel(baseData, isPlant)
      })
      newGradeItem.children = levelChildren
      gradeClassInfo.value.children.unshift(newGradeItem)
    }

    return {
      gradeLabelList,
      addGradeLabel
    }
  }
})
</script>


<style lang="less" scoped>
.grade-label-list {
  width: 100%;

  p {
    position: relative;
    width: 100%;
  }
}
</style>
