<template>
  <div class="pool-module module-panel mb-6">
    <div v-if="poolItemData.streamInfo" class="module-title">
      <div class="title-chunk spot-num">编号：{{ poolItemData.streamInfo.spotNum }}</div>
      <div class="title-chunk product-name">产品名称：{{ poolItemData.streamInfo.productName }}</div>
      <div class="title-chunk store-type">
        门店类型：{{ poolItemData.streamInfo.storeTypeCN }}
        <div class="standard-icon">
          <div :class="`iconmap-standard-${poolItemData.streamInfo.storeType}`" />
        </div>
      </div>
    </div>
    <div class="photo-list overflow-x-auto overscroll-x-contain">
      <PhotoBox
        v-for="(photoItem, photoIndex) in poolItemData.photoList"
        :key="photoItem.id"
        version=""
        class="mr-4"
        :src="photoItem.path"
        @click="onSelectPhoto(photoIndex)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import type PoolRecordModel from '@/model/PoolRecordModel'
import { SPOT_TYPE } from '@/model/Enumerate'

import { defineComponent, PropType, inject } from 'vue'
import PhotoBox from '@/components/PhotoBox/index.vue'

export default defineComponent({
  name: 'PoolModule',
  components: { PhotoBox },
  props: {
    poolItemData: { type: Object as PropType<PoolRecordModel>, required: true }
  },
  emits: ['evaluatePhoto'],
  setup (props, { emit }) {
    const type = inject('type') as SPOT_TYPE

    const onSelectPhoto = (photoIndex: number) => {
      const photoData = props.poolItemData.photoList?.map((photoItem, index: number) => {
        const { streamInfo } = props.poolItemData
        const photoInfo = {
          ...streamInfo,
          aiSpotLabel: type === SPOT_TYPE.MAKEUP ? photoItem.auditSpotModel?.makeupDegree : photoItem.auditSpotModel?.photographyDegree,
        }
        return {
          // todo photoModel 增加完成src
          title: `原片（${index + 1}/${props.poolItemData.photoList?.length}）`,
          src: photoItem.path,
          photoInfo,
          markPath: '',
          markJson: '',
          markBase: ''
        }
      })

      const data = {
        photoData,
        photoIndex
      }
      emit('evaluatePhoto', data)
    }
    return {
      onSelectPhoto
    }
  }
})
</script>

<style lang="less" scoped>
.module-title {
  display: flex;
  font-size: 16px;

  .title-chunk {
    margin-right: 24px;
  }

  .store-type {
    display: flex;
    align-items: center;
  }
}

.photo-list {
  width: 100%;
  white-space: nowrap;

  .photo-box {
    display: inline-block;
    width: 253px;
    cursor: pointer;
  }
}
</style>
