import { ref } from 'vue'

export default function () {
  const inZoomIn = ref(false)
  const photoZoomStyle = ref('')
  const scaleNum = ref(25)
  
  /** 放大图片 */
  const zoom = (e: any) => {
    if (inZoomIn.value) {
      photoZoomStyle.value = ''
      inZoomIn.value = false
    } else {
      const imageWidth = e.target.clientWidth
      const imageHeight = e.target.clientHeight
      const _x = e.offsetX
      const _y = e.offsetY
      const clickX = (_x / imageWidth * 100).toFixed(2) + '%'
      const clickY = (_y / imageHeight * 100).toFixed(2) + '%'
      const zoomScale = (scaleNum.value * 4 + 100) / 100
      photoZoomStyle.value = `
        transform-origin: ${clickX} ${clickY};
        transform: scale(${zoomScale});
      `
      inZoomIn.value = true
    }
  }

  return {
    zoom,
    inZoomIn, photoZoomStyle, scaleNum
  }
}
