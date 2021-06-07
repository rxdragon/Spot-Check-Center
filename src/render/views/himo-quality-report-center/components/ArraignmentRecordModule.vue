<template>
  <div class="arraignment-record-module">
    <div class="panel-title mb-6">审核记录 - {{ recordInfo.id }}</div>
    <div class="record-base-info grid grid-cols-4 mb-4">
      <div class="info-item">订单号：{{ recordInfo.orderNum }}</div>
      <div class="info-item">拍摄产品：{{ recordInfo.productName }}</div>
      <div class="info-item">
        {{ type === SPOT_TYPE.MAKEUP ? '化妆师' : '摄影师' }}：{{ type === SPOT_TYPE.MAKEUP ? recordInfo.dresser : recordInfo.photographer }}
      </div>
      <div class="info-item">拍摄门店：{{ recordInfo.storeName }}</div>
    </div>
    <div class="photo-list overflow-x-auto overscroll-x-contain">
      <PhotoBox
        v-for="(photoItem, photoIndex) in recordInfo.photoList"
        :key="photoItem.id"
        :src="photoItem.path"
        version=""
        class="mr-4"
        @click="onSelectPhoto(photoIndex)"
      >
        <template #otherInfo>
          <div class="audio-ino">
            AI审核结果：
            <span
              v-if="type === SPOT_TYPE.MAKEUP"
              :class="photoItem.makeupDegreeType === 'normal' ? 'text-blue-600' : 'text-red-500'"
            >
              {{ photoItem.makeupDegree }}
            </span>
            <span
              v-if="type === SPOT_TYPE.PHOTOGRAPHY"
              :class="photoItem.photographyDegreeType === 'normal' ? 'text-blue-600' : 'text-red-500'"
            >
              {{ photoItem.photographyDegree }}
            </span>
          </div>
        </template>
      </PhotoBox>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue'

import { SPOT_TYPE } from '@/model/Enumerate'
import PhotoBox from '@/components/PhotoBox/index.vue'

export default defineComponent({
  name: 'ArraignmentRecordModule',
  components: { PhotoBox },
  props: {
    recordInfo: { type: Object, required: true },
  },
  emits: ['previewPhoto'],
  data () {
    return {
      SPOT_TYPE
    }
  },
  setup (props, { emit }) {
    const type = inject('type')
    const onSelectPhoto = (photoIndex: string | number | symbol) => {
      const photoData = props.recordInfo.photoList.map((photoItem: any, index: number) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { baseData, photoList, ...orderInfo } = props.recordInfo
        return {
          title: `第${index + 1}张图`,
          ...photoItem,
          orderInfo
        }
      })
      const data = {
        photoData,
        photoIndex
      }
      emit('previewPhoto', data)
    }

    return {
      onSelectPhoto,
      type
    }
  }
})
</script>

<style lang="less" scoped>
.arraignment-record-module {
  padding: 12px;
  margin-bottom: 12px;
  color: #333;
  background-color: #fafafa;
  border-radius: 10px;

  .record-base-info {
    font-size: 14px;
  }

  .photo-list {
    width: 100%;
    white-space: nowrap;

    .photo-box {
      display: inline-block;
      width: 253px;
      cursor: pointer;
      background-color: #fff;
    }

    .audio-ino {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
    }
  }
}
</style>
