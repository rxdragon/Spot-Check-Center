import { onMounted, onUnmounted } from 'vue'
interface IUseKeydown {
  prePhoto: any
  nextPhoto: any
  closePreview: any
  scaleNum: any
  judgeHasZoom: any
  showMarkPhoto: any
}

export default function ({
  prePhoto,
  nextPhoto,
  closePreview,
  scaleNum,
  judgeHasZoom,
  showMarkPhoto
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
        case 'Escape':
        case 'KeyS':
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
        case 'KeyX':
          showMarkPhoto()
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
