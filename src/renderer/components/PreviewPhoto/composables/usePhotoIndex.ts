import { ref, Ref, toRefs, watch, computed } from 'vue'

interface IUsePhotoIndexContext {
  photoArray: Ref<any[]>
  loading: Ref<boolean>
  emit: any
  props: {
    imgarray: any[]
    index: number
  }
}

export default function ({
  photoArray,
  loading,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  emit,
  props
}: IUsePhotoIndexContext) {
  const { index, } = toRefs(props)
  const photoIndex = ref(index.value)

  // 上一张
  const prePhoto = () => {
    const beforePath = photoArray.value[photoIndex.value].src
    if (photoIndex.value === 0) {
      photoIndex.value = photoArray.value.length - 1
    } else {
      photoIndex.value--
    }
    const nextPath = photoArray.value[photoIndex.value].src
    if (beforePath === nextPath) return
    loading.value = true
  }

  // 下一张
  const nextPhoto = () => {
    const beforePath = photoArray.value[photoIndex.value].src
    if (photoIndex.value === photoArray.value.length - 1) {
      photoIndex.value = 0
    } else {
      photoIndex.value++
    }
    const nextPath = photoArray.value[photoIndex.value].src
    if (beforePath === nextPath) return
    loading.value = true
  }

  // 当前限制照片
  const showPhoto = computed(() => {
    return photoArray.value[photoIndex.value] || {}
  })

  const { imgarray } = toRefs(props)
  watch(
    imgarray,
    (val) => {
      photoArray.value = JSON.parse(JSON.stringify(val))
    },
    {
      immediate: true
    }
  )

  return {
    photoIndex, showPhoto,
    prePhoto, nextPhoto
  }
}
