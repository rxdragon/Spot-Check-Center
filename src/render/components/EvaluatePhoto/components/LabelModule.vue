<template>
  <div class="label-module">
    <div class="label-select">
      <div
        v-for="gradeItem in lableChildren"
        :key="gradeItem.id"
        class="label-item"
        :class="{
          'is-active': gradeItem.id === activeId,
          'one-all-label': gradeItem.isOneAll,
          'small': gradeItem.value === 'small',
          'middle': gradeItem.value === 'middle',
          'pull': gradeItem.value === 'pull',
          'plant': gradeItem.value === 'plant',
        }"
        @click="selectGradeItem(gradeItem.id)"
      >
        {{ gradeItem.name }}
      </div>
    </div>
    <div v-if="activeLabel" class="degree-module">
      <div class="tip">
        <template v-if="!activeLabel.isOneAll">请选中“{{ activeLabel.name }}”问题程度</template>
        <template v-else>一键修改全部问题程度</template>
      </div>
      <div
        v-for="levelItem in greadeLevel"
        :key="levelItem.value"
        class="level-item"
        :class="{
          'is-active': activeLabel.value === levelItem.value
        }"
        @click="selectGradeLevel(levelItem.value)"
      >
        <div class="level-point" :class="levelItem.value" />
        {{ levelItem.lable }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, nextTick, ref, PropType } from 'vue'
import { GRADE_LEVEL, gradeLevelToCN, ILabelChildren, ILabelClass, ISelectId } from '@/model/GradeLabelModel'
import { newMessage } from '@/utils/message'

export default defineComponent({
  name: 'LabelModule',
  props: {
    labelClass: { type: Object as PropType<ILabelClass> , required: true },
  },
  emits: ['addLabel', 'deleteLable'],
  setup (props, { emit }) {
    const greadeLevel = reactive([{
      lable: gradeLevelToCN[GRADE_LEVEL.PLANT],
      value: GRADE_LEVEL.PLANT
    }, {
      lable: gradeLevelToCN[GRADE_LEVEL.SMALL],
      value: GRADE_LEVEL.SMALL
    }, {
      lable: gradeLevelToCN[GRADE_LEVEL.MIDDLE],
      value: GRADE_LEVEL.MIDDLE
    }, {
      lable: gradeLevelToCN[GRADE_LEVEL.PULL],
      value: GRADE_LEVEL.PULL
    }])

    const lableChildren = computed(() => props.labelClass.children)

    // 激活展开一级标签
    const activeId = ref<number | string>('')
    const selectGradeItem = (id: number | string) => {
      activeId.value = id
    }

    // 判断分数一直
    const judgeIsAllGradeLevelSame = () => {
      let levels: any = new Set()
      lableChildren.value.forEach(lableItem => {
        if (!lableItem.isOneAll) { levels.add(lableItem.value) }
      })
      levels = [...levels]
      // 评分一致
      const findOneLable = lableChildren.value.find(item => item.isOneAll)
      if (!findOneLable) return
      if (levels.length === 1) {
        findOneLable.value = levels[0]
      } else {
        findOneLable.value = ''
      }
    }

    /** 激活标签 */
    const findLevelObj = (labelItem: ILabelChildren, value: GRADE_LEVEL) => {
      if (!labelItem.children) return undefined
      const findGradeLevelObj = labelItem.children.find(item => item.name === gradeLevelToCN[value])
      return findGradeLevelObj
    }
    // 删除选中标签组内的标签
    const deleteLable = (lableItem: ILabelChildren, level: GRADE_LEVEL) => {
      const findLevel = findLevelObj(lableItem, level)
      if (!findLevel) return newMessage.warning('未找到对应标签')
      const levelId = findLevel.id
      emit('deleteLable', levelId)
    }
    // 添加标签
    const addLable = (lableItem: ILabelChildren, level: GRADE_LEVEL) => {
      const findLevel = findLevelObj(lableItem, level)
      if (!findLevel) {
        newMessage.warning('未找到对应标签')
        return false
      }

      const classId = props.labelClass.id
      const lableId = findLevel.parent_id
      const levelId = findLevel.id
      const chainCircuitId = `${classId}-${lableId}-${levelId}`
      // 添加id
      const className = props.labelClass.name
      const lableName = lableItem.name
      const levelName = findLevel.name
      const chainCircuitName = `${className}/${lableName}/${levelName}`

      const lableInfo: ISelectId = {
        name: chainCircuitName,
        id: chainCircuitId,
        levelId,
        type: level
      }
      emit('addLabel', lableInfo)
      return true
    }
    // 当前激活二级标签
    const activeLabel = computed(() => {
      const findActiveLable = lableChildren.value.find(item => item.id === activeId.value)
      return findActiveLable
    })
    // 选中标签评分
    const selectGradeLevel = async (value: GRADE_LEVEL) => {
      if (!activeLabel.value) return
      await nextTick()
      function setLableItemGradeLevel (lableItem: ILabelChildren, level: GRADE_LEVEL) {
        if (lableItem.value) {
          deleteLable(lableItem, (lableItem.value as GRADE_LEVEL))
        }
        const canAddLable = addLable(lableItem, level)
        if (!canAddLable) return
        lableItem.value = level
      }

      // 判断是否一键修改
      if (!activeLabel.value.isOneAll) {
        if (activeLabel.value.value === value) {
          deleteLable(activeLabel.value, activeLabel.value.value)
          activeLabel.value.value = ''
        } else {
          setLableItemGradeLevel(activeLabel.value, value)
        }
      } else {
        // 将全部二级标签对应的value设置为统一值
        lableChildren.value.forEach(lableItem => {
          if (lableItem.isOneAll) return
          if (!activeLabel.value) return

          if (activeLabel.value.value === value) {
            deleteLable(lableItem, (lableItem.value as GRADE_LEVEL))
            lableItem.value = ''
          } else {
            setLableItemGradeLevel(lableItem, value)
          }
        })
      }
      judgeIsAllGradeLevelSame()
    }

    return {
      greadeLevel,
      lableChildren,
      activeId, activeLabel,
      selectGradeItem,
      selectGradeLevel
    }
  },
})
</script>

<style lang="less" scoped>
@defaultColor: #909399;

.label-item {
  display: inline-block;
  width: max-content;
  padding: 4px 16px;
  margin-right: 10px;
  margin-bottom: 10px;
  color: #fff;
  text-align: center;
  cursor: pointer;
  user-select: none;
  background-color: @defaultColor;
  border: 1px solid transparent;
  border-radius: 4px;

  &.is-active {
    border: 1px solid #fff;
  }

  &.one-all-label {
    width: 100%;
    background-color: @defaultColor !important;
  }
}

.degree-module {
  .tip {
    margin-bottom: 6px;
    font-size: 12px;
    color: #eee;
    user-select: none;
  }

  .level-item {
    display: flex;
    align-items: center;
    width: 100%;
    height: 38px;
    padding: 9px 16px;
    margin-bottom: 6px;
    font-size: 12px;
    color: #c0c4cc;
    cursor: pointer;
    user-select: none;
    background-color: rgba(0, 0, 0, 0.2);
    border: 1px solid transparent;
    border-radius: 4px;
    transition: all 0.3s;

    .level-point {
      width: 4px;
      height: 4px;
      margin-right: 10px;
      border-radius: 100%;
    }

    &.is-active {
      background-color: rgba(0, 0, 0, 0.4);
      border: 1px solid #fff;
    }
  }
}

.small {
  background-color: #ff8f00;
}

.middle {
  background-color: #ff8f00;
}

.pull {
  background-color: #ff3974;
}

.plant {
  background-color: #38bc7f;
}
</style>
