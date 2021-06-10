import { ref, Ref } from 'vue'
import { TOOL_TYPE } from '../components/ToolEnumerate'
import { fabric } from 'fabric'

export interface IOptionObj {
  width: number
  height: number
  penColor: string
  lineWidth: number
  drawType: TOOL_TYPE
}

interface IUseCanvasTool {
  optionObj: Ref<IOptionObj>
  mouseFrom: { x: number, y: number }
  mouseTo: { x: number, y: number }
  canvasFabric: Ref<fabric.Canvas | null>
  drawingObject: Ref<fabric.Object | null>
}

export default function useCanvasTool ({
  optionObj,
  mouseFrom,
  mouseTo,
  canvasFabric,
  drawingObject
}: IUseCanvasTool) {
  // 文本框操作
  const isPrevEditing = ref(false) // 是否处于编辑状态
  const textAction = (fEvent: any) => {
    if (optionObj.value.drawType !== TOOL_TYPE.TEXT) return
    const obj = fEvent.target
    if (obj && !obj.isType('text')) return
    if (isPrevEditing.value) {
      isPrevEditing.value = false
      return
    }

    const left = mouseFrom.x
    const top = mouseFrom.y
    const textColor = optionObj.value.penColor
    const newText = new fabric.IText('质量批注', {
      left,
      top,
      fontSize: 22,
      fill: textColor,
      hasControls: true,
      editable: true,
      selected: true,
      textAlign: 'center',
    })

    if (!canvasFabric.value) return
    canvasFabric.value.add(newText)
    
    newText.enterEditing()
    newText.selectAll()
    canvasFabric.value.setActiveObject(newText)
    isPrevEditing.value = true
  }
  // 绘制箭头
  const drawArrow = (fromX: number, fromY: number, toX: number, toY: number, theta: number, headlen: number) => {
    theta = typeof theta !== 'undefined' ? theta : 30
    headlen = typeof theta !== 'undefined' ? headlen : 10
    // 计算各角度和对应的P2,P3坐标
    const angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI
    const angle1 = (angle + theta) * Math.PI / 180
    const angle2 = (angle - theta) * Math.PI / 180
    const topX = headlen * Math.cos(angle1)
    const topY = headlen * Math.sin(angle1)
    const botX = headlen * Math.cos(angle2)
    const botY = headlen * Math.sin(angle2)
    let arrowX = fromX - topX
    let arrowY = fromY - topY
    let path = ' M ' + fromX + ' ' + fromY
    path += ' L ' + toX + ' ' + toY
    arrowX = toX + topX
    arrowY = toY + topY
    path += ' M ' + arrowX + ' ' + arrowY
    path += ' L ' + toX + ' ' + toY
    arrowX = toX + botX
    arrowY = toY + botY
    path += ' L ' + arrowX + ' ' + arrowY
    return path
  }
  // 创建箭头
  const createArrow = () => {
    const color = optionObj.value.penColor
    const drawWidth = optionObj.value.lineWidth
    const arrowpath = drawArrow(mouseFrom.x, mouseFrom.y, mouseTo.x, mouseTo.y, 30, 30)
    const canvasObject = new window.fabric.Path(
      arrowpath,
      {
        stroke: color,
        fill: 'rgba(255, 255, 255, 0)',
        strokeWidth: drawWidth
      }
    )
    return canvasObject
  }
  // 创建椭圆
  const createEllipse = () => {
    const color = optionObj.value.penColor
    const drawWidth = optionObj.value.lineWidth
    const left = mouseFrom.x
    const top = mouseFrom.y
    const canvasObject = new fabric.Ellipse({
      left: left,
      top: top,
      stroke: color,
      fill: 'rgba(255, 255, 255, 0)',
      originX: 'center',
      originY: 'center',
      rx: Math.abs(left - mouseTo.x),
      ry: Math.abs(top - mouseTo.y),
      strokeWidth: drawWidth
    })
    return canvasObject
  }
  // 创建直线
  const createLine = () => {
    const color = optionObj.value.penColor
    const drawWidth = optionObj.value.lineWidth
    const canvasObject = new fabric.Line(
      [mouseFrom.x, mouseFrom.y, mouseTo.x, mouseTo.y],
      {
        stroke: color,
        strokeWidth: drawWidth
      }
    )
    return canvasObject
  }
  // 绘画
  const drawing = () => {
    if (!canvasFabric.value) return
    if (drawingObject.value) {
      canvasFabric.value.remove(drawingObject.value)
    }
    let canvasObject = null
    switch (optionObj.value.drawType) {
      case 'arrow':
        canvasObject = createArrow()
        break
      case TOOL_TYPE.ELLIPSE:
        canvasObject = createEllipse()
        break
      case TOOL_TYPE.LINE:
        canvasObject = createLine()
        break
      default:
        break
    }
    if (canvasObject) {
      canvasFabric.value.add(canvasObject)
      drawingObject.value = canvasObject
    }
  }

  /** 更改绘画类型 */
  // 移动
  const changeMove = () => {
    if (!canvasFabric.value) return
    canvasFabric.value.selection = true
    canvasFabric.value.skipTargetFind = false
  }
  // 使用笔模式
  const changePen = () => {
    if (!canvasFabric.value) return
    canvasFabric.value.selection = false
    canvasFabric.value.isDrawingMode = true
    canvasFabric.value.skipTargetFind = true
  }
  // 放大
  const changeBlowup = () => {
    if (!canvasFabric.value) return
    canvasFabric.value.selection = false
    canvasFabric.value.isDrawingMode = false
    canvasFabric.value.skipTargetFind = true
  }
  // 删除
  const deletePath = () => {
    if (!canvasFabric.value) return
    const selectionObj = canvasFabric.value.getActiveObjects()
    for (const selectionItem of selectionObj) {
      canvasFabric.value.remove(selectionItem)
    }
    // 清楚选中框
    canvasFabric.value.discardActiveObject()
    // 如果是文字状态不更改模式
    if (optionObj.value.drawType === TOOL_TYPE.TEXT) return
    optionObj.value.drawType = TOOL_TYPE.MOVE
  }

  return {
    textAction,
    drawing,
    changeMove, changePen, changeBlowup, deletePath
  }
}
