<template>
  <div class="mark-tool">
    <!-- 移动 -->
    <div class="tool" :class="{ 'active': drawType === TOOL_TYPE.MOVE }" @click.capture="changeDrawType(TOOL_TYPE.MOVE)">
      <el-tooltip
        class="item"
        effect="dark"
        content="移动"
        placement="top"
      >
        <div class="tool-dom">
          <i id="move" class="el-icon-rank" />
          <span class="shortcut">V</span>
        </div>
      </el-tooltip>
    </div>
    <!-- 画笔 -->
    <div class="tool" :class="{ 'active': drawType === TOOL_TYPE.PEN }" @click="changeDrawType(TOOL_TYPE.PEN)">
      <el-popover
        placement="right-start"
        width="30"
        popper-class="pen-weight"
        trigger="hover"
      >
        <template #reference>
          <div class="tool-dom">
            <i id="pen" class="el-icon-edit" />
            <span class="shortcut">B</span>
          </div>
        </template>
        <div class="pen-list">
          <div
            v-for="penWeightItem in penWeight"
            :key="penWeightItem.label"
            class="pen-item"
            @click="changeLineWidth(penWeightItem)"
          >
            <div
              class="pen-box"
              :class="penWeightItem.active ? penWeightItem.label + ' active' : penWeightItem.label "
            />
          </div>
        </div>
      </el-popover>
    </div>
    <!-- 圆圈 -->
    <div
      class="tool"
      :class="{ 'active': drawType === TOOL_TYPE.ELLIPSE }"
      @click="changeDrawType(TOOL_TYPE.ELLIPSE)"
    >
      <el-tooltip
        class="item"
        effect="dark"
        content="圆圈"
        placement="top"
      >
        <div class="tool-dom">
          <div class="circle" />
        </div>
      </el-tooltip>
    </div>
    <!-- 箭头 -->
    <div
      class="tool"
      :class="{ 'active': canvasOption.drawType === TOOL_TYPE.ARROW }"
      @click="changeDrawType(TOOL_TYPE.ARROW)"
    >
      <el-tooltip
        class="item"
        effect="dark"
        content="箭头"
        placement="right"
      >
        <div class="tool-dom">
          <i id="arrow" class="el-icon-top-right" />
          <span class="shortcut">C</span>
        </div>
      </el-tooltip>
    </div>
    <!-- 放大 -->
    <div
      class="tool"
      :class="{ 'active': drawType === TOOL_TYPE.BLOWUP }"
      @click="changeDrawType(TOOL_TYPE.BLOWUP)"
    >
      <el-tooltip
        class="item"
        effect="dark"
        content="放大"
        placement="top"
      >
        <div class="tool-dom">
          <i id="blowup" class="el-icon-search" />
          <span class="shortcut">Z</span>
        </div>
      </el-tooltip>
    </div>
    <!-- 文本 -->
    <div class="tool" :class="{ 'active': drawType === TOOL_TYPE.TEXT }" @click.capture="changeDrawType(TOOL_TYPE.TEXT)">
      <el-tooltip
        class="item"
        effect="dark"
        content="文本框"
        placement="top"
      >
        <div class="tool-dom">
          <i id="move" class="el-icon-document" />
          <span class="shortcut">T</span>
        </div>
      </el-tooltip>
    </div>
    <!-- 删除 -->
    <div class="tool" @click="changeDrawType(TOOL_TYPE.DELETE)">
      <el-tooltip
        class="item"
        effect="dark"
        content="删除"
        placement="top"
      >
        <div class="tool-dom">
          <i id="delete" class="el-icon-delete" />
        </div>
      </el-tooltip>
    </div>
    <!-- 颜色 -->
    <div class="tool tool-color">
      <el-color-picker :model-value="canvasOption.penColor" size="mini" @change="onColorChange" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, toRefs, reactive } from 'vue'
import { TOOL_TYPE as toolType } from './ToolEnumerate'

export default defineComponent({
  name: 'MarkTool',
  props: {
    canvasOption: { type: Object, required: true }
  },
  emits: ['changeTool'],
  setup (props, { emit }) {
    const TOOL_TYPE = ref(toolType)

    /** 获取画笔类型 */
    const { canvasOption } = toRefs(props)
    const drawType = computed(() => canvasOption.value.drawType)

    // 更改绘画类型
    const changeDrawType = (type: toolType) => {
      const data = { type, value: '' }
      emit('changeTool', data)
    }

    // 更改颜色
    const onColorChange = (value: string) => {
      const data = { type: toolType.COLOR, value }
      emit('changeTool', data)
    }

    // 更改线宽
    const penWeight = reactive([
      {
        label: 'min',
        size: 2,
        active: true
      },
      {
        label: 'mid',
        size: 6,
        active: false
      },
      {
        label: 'big',
        size: 10,
        active: false
      }
    ])
    const changeLineWidth = (penWeightItem: any) => {
      penWeight.forEach(item => { item.active = false })
      penWeightItem.active = true
      canvasOption.value.lineWidth = penWeightItem.size
    }

    return {
      TOOL_TYPE,
      drawType,
      changeDrawType,
      onColorChange,
      penWeight, changeLineWidth
    }
  }
})
</script>

<style lang="less" scoped>
.mark-tool {
  display: flex;
  flex-wrap: wrap;
  padding: 20px 12px 6.5px;
  margin-left: -13.5px;
  font-size: 12px;
  color: #eee;
  border-bottom: 1px solid #666;

  .tool {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 25px;
    height: 25px;
    margin-bottom: 13.5px;
    margin-left: 13.5px;
    font-size: 14px;
    line-height: 1;
    color: #eee;
    text-align: center;
    cursor: pointer;
    background-clip: content-box;
    border-radius: 3px;
    transition: all 0.3s ease;

    .circle {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 1px solid;
      border-radius: 50%;
    }

    .shortcut {
      position: absolute;
      right: 1px;
      bottom: 2px;
      font-size: 8px;
      line-height: 1;
    }

    &:hover {
      color: #eee;
      background-color: #282828;
    }

    &.active {
      color: #eee;
      background-color: #282828;
    }
  }

  .tool-color {
    :deep(.el-color-picker--mini) {
      height: 25px !important;
    }

    :deep(.el-color-picker__trigger) {
      width: 25px !important;
      height: 25px !important;
      border: none;
    }

    &:hover {
      background-color: rgba(0, 0, 0, 0);
    }
  }
}
</style>

<style lang="less">
.pen-weight {
  min-width: 30px !important;
  padding: 0 !important;
  margin-left: 16px !important;
  background-color: #535353 !important;
  border-color: #535353 !important;

  .pen-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 78px;

    .pen-item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 26px;
      cursor: pointer;

      .pen-box {
        background-color: #282828;
        border-radius: 50%;

        &.active {
          background-color: #eee;
        }
      }

      .min {
        width: 2px;
        height: 2px;
      }

      .mid {
        width: 6px;
        height: 6px;
      }

      .big {
        width: 10px;
        height: 10px;
      }
    }
  }

  .el-popper__arrow {
    border-color: #535353 !important;
    border-right-color: #535353 !important;

    &::before {
      background: #535353 !important;
      border-color: #535353 !important;
    }
  }
}
</style>
