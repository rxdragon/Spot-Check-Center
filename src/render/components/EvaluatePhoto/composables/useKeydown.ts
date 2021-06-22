import { onMounted, onUnmounted } from 'vue'
import { TOOL_TYPE } from '../components/ToolEnumerate'


interface IUseKeydown {
  prePhoto: any
  nextPhoto: any
  closePreview: any
  scaleNum: any
  judgeHasZoom: any
  changeDrawType: any
}

export default function ({
  prePhoto,
  nextPhoto,
  closePreview,
  scaleNum,
  judgeHasZoom,
  changeDrawType
}: IUseKeydown) {
  onMounted (() => {
    document.onkeydown = (e) => {
      switch (e.code) {
        case 'KeyA':
        case 'ArrowLeft':
          prePhoto()
          break
        case 'KeyD':
        case 'ArrowRight':
          nextPhoto()
          break
        case 'AltRight':
        case 'KeyS':
        case 'Escape':
          closePreview()
          break
        case 'KeyQ':
        case 'Minus':
          if (scaleNum.value > 0) {
            scaleNum.value -= 5
          }
          judgeHasZoom()
          break
        case 'KeyE':
        case 'Equal':
          if (scaleNum.value < 100) {
            scaleNum.value += 5
          }
          judgeHasZoom()
          break
        case 'KeyV':
          changeDrawType({ type: TOOL_TYPE.MOVE, value: '' })
          break
        case 'KeyB':
          changeDrawType({ type: TOOL_TYPE.PEN, value: '' })
          break
        case 'KeyC':
          changeDrawType({ type: TOOL_TYPE.ARROW, value: '' })
          break
        case 'KeyZ':
          changeDrawType({ type: TOOL_TYPE.BLOWUP, value: '' })
          break
        case 'KeyT':
          changeDrawType({ type: TOOL_TYPE.TEXT, value: '' })
          break
        case 'Backspace':
          changeDrawType({ type: TOOL_TYPE.DELETE, value: '' })
          break
        default:
          break
      }
    }
  })

  onUnmounted (() => {
    document.onkeydown = null
  })
}
