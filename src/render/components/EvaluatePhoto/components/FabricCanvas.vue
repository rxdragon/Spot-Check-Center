<template>
  <div class="fabric-canvas">
    <canvas id="mark-canvas" ref="markCanvas" />
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, onMounted, toRefs, PropType, reactive, watch } from 'vue'
import { fabric } from 'fabric'
import { TOOL_TYPE } from './ToolEnumerate'
import useCanvasTool, { IOptionObj } from '../composables/useCanvasTool'



export default defineComponent({
  name: 'FabricCanvas',
  props: {
    optionObj: { type: Object as PropType<IOptionObj>, required: true }
  },
  setup (props) {
    const { optionObj } = toRefs(props)
    const markCanvas = ref<any>(null)
    const canvasFabric = ref<fabric.Canvas | null>(null)
    const mouseFrom = reactive({ x: 0, y: 0 }) // 鼠标起始坐标点
    const mouseTo = reactive({ x: 0, y: 0 }) // 鼠标结束坐标点
    const moveCount = ref(0) // 移动数
    const drawingObject = ref<fabric.Object | null>(null) // 绘画的对象

    /** canvas 公共方法 */
    // 返回鼠标在canvas中的坐标系
    const transformMouse = (mouseX: number, mouseY: number) => {
      return { x: mouseX, y: mouseY }
    }
    // 判断是否在绘画
    const doDrawing = ref(false) // 是否在绘画状态
    const judgeIsDrawing = () => {
      const drawingTypes = [TOOL_TYPE.PEN, TOOL_TYPE.ELLIPSE, TOOL_TYPE.LINE, TOOL_TYPE.ARROW]
      if (drawingTypes.includes(optionObj.value.drawType)) {
        doDrawing.value = true
      } else {
        doDrawing.value = false
      }
    }

    /** 绘画相关动作 */
    const { textAction, drawing, changeMove, changePen, changeBlowup, deletePath } = useCanvasTool({
      optionObj, mouseFrom, mouseTo, canvasFabric, drawingObject
    })

    /** 相关鼠标时间 */
    // 监听canvas鼠标按下
    const onMouseDown = (options: any) => {
      const xy = transformMouse(options.e.offsetX, options.e.offsetY)
      mouseFrom.x = xy.x
      mouseFrom.y = xy.y
      judgeIsDrawing()
      textAction(options)
    }
    // 鼠标抬起
    const onMouseUp = (options: any) => {
      const xy = transformMouse(options.e.offsetX, options.e.offsetY)
      mouseTo.x = xy.x
      mouseTo.y = xy.y
      drawingObject.value = null
      moveCount.value = 1
      doDrawing.value = false
    }
    // 鼠标移动
    const onMouseMove = (options: any) => {
      if (moveCount.value % 2 && !doDrawing.value) return
      moveCount.value++
      const xy = transformMouse(options.e.offsetX, options.e.offsetY)
      mouseTo.x = xy.x
      mouseTo.y = xy.y
      drawing()
    }

    // 创建画布
    const createCanvas = () => {
      onMounted(() => {
        canvasFabric.value = new fabric.Canvas(markCanvas.value, {
          isDrawingMode: false,
          selection: false,
          skipTargetFind: true,
          width: optionObj.value.width,
          height: optionObj.value.height
        })
        canvasFabric.value.freeDrawingBrush.color = optionObj.value.penColor // 设置自由绘颜色
        canvasFabric.value.freeDrawingBrush.width = optionObj.value.lineWidth
        canvasFabric.value.on('mouse:down', onMouseDown)
        canvasFabric.value.on('mouse:up', onMouseUp)
        canvasFabric.value.on('mouse:move', onMouseMove)
      })
    }
    createCanvas()

    /** 重置画布大小 */
    const resetCanvas = (imgWidth: number, imgHeight: number) => {
      if (!canvasFabric.value) return
      canvasFabric.value.setZoom(1)
      canvasFabric.value.setWidth(imgWidth)
      canvasFabric.value.setHeight(imgHeight)
    }
    watch(
      [
        () => optionObj.value.width,
        () => optionObj.value.height
      ],
      () => {
        resetCanvas(optionObj.value.width, optionObj.value.height)
      },
      {
        deep: true
      }
    )

    /** 更改颜色 */
    watch(
      () => optionObj.value.penColor,
      (colorValue) => {
        if (!canvasFabric.value) return
        canvasFabric.value.freeDrawingBrush.color = colorValue
      }
    )

    /** 更改线宽 */
    watch(
      () => optionObj.value.lineWidth,
      (lineWidthValue) => {
        if (!canvasFabric.value) return
        canvasFabric.value.freeDrawingBrush.width = lineWidthValue
      }
    )

    watch(
      () => optionObj.value.drawType,
      (drawType) => {
        if (!canvasFabric.value) return
        canvasFabric.value.selection = false
        canvasFabric.value.skipTargetFind = true
        canvasFabric.value.isDrawingMode = false
        switch (drawType) {
          case TOOL_TYPE.PEN:
            changePen()
            break
          case TOOL_TYPE.TEXT:
          case TOOL_TYPE.MOVE:
            changeMove()
            break
          case TOOL_TYPE.BLOWUP:
            changeBlowup()
            break
          case TOOL_TYPE.DELETE:
            deletePath()
            break
          default:
            break
        }
      }
    )

    /** 对外能力 */
    // 提供json数据
    const exportJsonInfo = () => {
      if (!canvasFabric.value) return ''
      if (canvasFabric.value.isEmpty()) return ''
      const canvasJson = canvasFabric.value.toJSON()
      return canvasJson
    }

    // 清空数据
    const clearCanvas = () => {
      if (!canvasFabric.value) return
      if (canvasFabric.value.isEmpty()) return
      canvasFabric.value.clear()
    }

    /** 加载json */
    const loadMarkJson = (markJsonInfo: any) => {
      return new Promise<void>((reslove) => {
        if (!canvasFabric.value) return reslove()
        if (!markJsonInfo) return reslove()
        canvasFabric.value.loadFromJSON(
          markJsonInfo,
          () => {
            reslove()
          }
        )
      })
    }

    return {
      markCanvas,
      exportJsonInfo, clearCanvas, loadMarkJson
    }
  }
})
</script>

<style lang="less" scoped>
.fabric-canvas {
  position: absolute;
  z-index: 3000;
}
</style>
