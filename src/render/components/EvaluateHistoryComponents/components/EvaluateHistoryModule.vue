<template>
  <div class="evaluate-history-module">
    <div class="panel-title mb-6">照片信息</div>
    <div class="photo-list overflow-x-auto overscroll-x-contain">
      <PhotoBox
        v-for="(photoItem, photoIndex) in photoList"
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
    <el-divider />
    <div class="panel-title mb-6">订单信息</div>
    <div class="order-info grid grid-cols-5 mb-4">
      <div class="info-item">订单号：{{ streamInfo.orderNum }}</div>
      <div class="info-item">产品名称：{{ streamInfo.productName }}</div>
      <div class="info-item">照片张数：{{ streamInfo.productName }}</div>
      <div class="info-item">门店类型：{{ streamInfo.storeName }}</div>
      <div class="info-item">门店：{{ streamInfo.storeName }}</div>
    </div>
    <div class="order-info grid grid-cols-5 mb-4">
      <div class="info-item">
        化妆师：{{ type === SPOT_TYPE.MAKEUP ? recordInfo.dresserName : recordInfo.photographer }}
      </div>
      <div class="info-item">
        化妆督导：{{ type === SPOT_TYPE.MAKEUP ? recordInfo.streamInfo.dresser : recordInfo.streamInfo.photographer }}
      </div>
      <div class="info-item">
        化妆专家：{{ type === SPOT_TYPE.MAKEUP ? recordInfo.streamInfo.dresser : recordInfo.streamInfo.photographer }}
      </div>
    </div>
    <div class="order-info grid grid-cols-1 mb-4">
      <div class="info-item">订单备注：{{ note.orderNote }}</div>
    </div>
    <div class="order-info grid grid-cols-1 mb-4">
      <div class="info-item">摄影备注：{{ note.photographyNote }}</div>
    </div>
    <div class="order-info grid grid-cols-1 mb-4">
      <div class="info-item">化妆备注：{{ note.dresserNote }}</div>
    </div>
    <el-divider />
    <div class="panel-title grid grid-cols-12 mb-6">
      <div class="col-start-1 col-end-4">评价信息</div>
      <div class="evaluate-title-info grid grid-cols-3 col-end-13 col-span-4">
        <div>总评分：</div>
        <div>评分人：</div>
        <div>
          <el-button size="small" class="change-evaluate-btn" type="primary">修改评分</el-button>
        </div>
      </div>
    </div>
    <div class="order-info grid grid-cols-4 mb-4">
      <div class="info-item">评价标签：{{ recordInfo.streamInfo.orderNum }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from 'vue'
import { SPOT_TYPE } from '@/model/Enumerate'

import PhotoBox from '@/components/PhotoBox/index.vue'

export default defineComponent({
  name: 'EvaluateHistoryModule',
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

    const photoList = computed (() => {
      return props.recordInfo.photoList
    })

    const streamInfo = computed (() => {
      return props.recordInfo.streamInfo
    })

    const note = computed (() => {
      return props.recordInfo.streamInfo.note
    })

    return {
      onSelectPhoto,
      type,
      photoList,
      streamInfo,
      note
    }
  }
})
</script>

<style lang="less" scoped>
.evaluate-history-module {
  padding: 12px;
  margin-bottom: 12px;
  color: #333;
  background-color: #fafafa;
  border-radius: 10px;

  .order-info {
    font-size: 14px;
    word-break: break-all;
  }

  .evaluate-title-info {
    display: flex;

    .change-evaluate-btn {
      padding: 9px;
    }
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

