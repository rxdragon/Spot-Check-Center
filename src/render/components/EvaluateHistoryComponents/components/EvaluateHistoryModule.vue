<template>
  <div class="evaluate-history-module">
    <!-- 照片信息 -->
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
          <div v-if="photoItem.auditSpotModel" class="audio-ino">
            AI审核结果：
            <span
              v-if="type === SPOT_TYPE.MAKEUP"
              :class="photoItem.auditSpotModel.makeupDegreeType === 'normal' ? 'text-blue-600' : 'text-red-500'"
            >
              {{ photoItem.auditSpotModel.makeupDegree }}
            </span>
            <span
              v-if="type === SPOT_TYPE.PHOTOGRAPHY"
              :class="photoItem.auditSpotModel.photographyDegreeType === 'normal' ? 'text-blue-600' : 'text-red-500'"
            >
              {{ photoItem.auditSpotModel.photographyDegree }}
            </span>
          </div>
        </template>
      </PhotoBox>
    </div>
    <el-divider />
    <!-- 订单信息 -->
    <div class="panel-title mb-6">订单信息</div>
    <!-- 订单以及门店信息 -->
    <div class="order-info grid grid-cols-5 mb-4">
      <div class="info-item">订单号：{{ streamInfo.orderNum }}</div>
      <div class="info-item">产品名称：{{ streamInfo.productName }}</div>
      <div class="info-item">照片张数：{{ recordInfo.photoCount }}</div>
      <div class="info-item">
        门店类型：{{ streamInfo.storeTypeCN }}
        <div class="standard-icon">
          <div :class="`iconmap-standard-${streamInfo.storeType}`" />
        </div>
      </div>
      <div class="info-item">门店：{{ streamInfo.storeName }}</div>
    </div>
    <!-- 化妆师信息 -->
    <div class="order-info grid grid-cols-5 mb-4">
      <div class="info-item">
        {{ type === SPOT_TYPE.MAKEUP ? '化妆师' : '摄影师' }}：{{ streamInfo.dresserInfo.name || '-' }}
        <!-- TODO: cf 新增新人标记 -->
        <el-tag type="warning" size="small">新人</el-tag>
      </div>
      <div class="info-item">
        {{ type === SPOT_TYPE.MAKEUP ? '化妆督导' : '摄影督导' }}：{{ streamInfo.dresserInfo.supervisorName || '-' }}
      </div>
      <div class="info-item">
        {{ type === SPOT_TYPE.MAKEUP ? '化妆专家' : '摄影专家' }}：{{ streamInfo.dresserInfo.expertsName || '-' }}
      </div>
    </div>
    <!-- 备注信息 -->
    <div class="order-info grid grid-cols-1 mb-4">
      <div class="info-item">订单备注：{{ streamInfo.note.orderNote }}</div>
    </div>
    <div class="order-info grid grid-cols-1 mb-4">
      <div class="info-item">摄影备注：{{ streamInfo.note.photographyNote }}</div>
    </div>
    <div class="order-info grid grid-cols-1 mb-4">
      <div class="info-item">化妆备注：{{ streamInfo.note.dresserNote }}</div>
    </div>
    <el-divider />
    <!-- 评价信息 -->
    <div class="panel-title mb-4">
      <div class="col-start-1 col-end-4">评价信息</div>
      <div class="flex items-center panel-slot">
        <div class="mr-4">总评分：{{ tagInfo.totalScore }}</div>
        <el-tag v-if="tagInfo.isReEvaluate" type="warning" size="small">已修改</el-tag>

        <div class="mr-4">评分人：{{ tagInfo.raterName }}</div>
        <div>
          <el-button
            size="small"
            class="change-evaluate-btn"
            type="primary"
            @click="onEvaluatePhoto"
          >
            修改评分
          </el-button>
        </div>
      </div>
    </div>
    <div class="order-info">
      <div class="info-item flex">
        <div class="info-title flex-none">评价标签：</div>
        <div class="info-content">
          <el-tag
            v-for="tagItem in tagInfo.tags"
            :key="tagItem.id"
            class="text-center"
            :class="['type-tag', tagItem.type]"
            size="medium"
          >
            {{ tagItem.name }}
          </el-tag>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, PropType } from 'vue'

import type PoolRecordModel from '@/model/PoolRecordModel'
import type StreamOrderModel from '@/model/StreamOrderModel'
import type PoolPhotoModel from '@/model/PoolPhotoModel'
import type EvaluateTagsModel from '@/model/EvaluateTagsModel'

import { SPOT_TYPE } from '@/model/Enumerate'
import PhotoBox from '@/components/PhotoBox/index.vue'

export default defineComponent({
  name: 'EvaluateHistoryModule',
  components: { PhotoBox },
  props: {
    recordInfo: { type: Object as PropType<PoolRecordModel>, required: true }
  },
  emits: ['previewPhoto', 'evaluatePhoto'],
  setup (props, { emit }) {
    const type = inject('type') as SPOT_TYPE
   
    /** 照片预览 */
    const onSelectPhoto = (photoIndex: string | number | symbol) => {
      const photoData = props.recordInfo.photoList?.map((photoItem: any, index: number) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { ...orderInfo } = props.recordInfo.streamInfo
        return {
          title: `第${index + 1}张图`,
          ...photoItem.auditSpotModel,
          orderInfo
        }
      })
      const data = {
        photoData,
        photoIndex
      }
      emit('previewPhoto', data)
    }

    /** 修改评分 */
    const onEvaluatePhoto = () => {
      const poolItemId = props.recordInfo.id

      const data = {
        poolItemId,
        photoIndex: 0
      }
      emit('evaluatePhoto', data)
    }

    // 照片列表
    const photoList = computed(() => props.recordInfo.photoList as PoolPhotoModel[])
    // 订单流水信息
    const streamInfo = computed(() => props.recordInfo.streamInfo as StreamOrderModel)
    // 标价信息
    const tagInfo = computed(() => props.recordInfo.tagInfo as EvaluateTagsModel)
    
    return {
      onSelectPhoto,
      onEvaluatePhoto,
      type, SPOT_TYPE,
      photoList,
      streamInfo,
      tagInfo
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

  .type-tag {
    margin-right: 10px;
    margin-bottom: 10px;

    &.plant {
      color: #38bc7f;
      background-color: #ecf7f2;
      border-color: #7fd9af;
    }

    &.pull {
      color: #ff3974;
      background-color: #fff0f0;
      border-color: #f99ab7;
    }

    &.middle,
    &.small {
      color: #ff8f00;
      background-color: #fff7ed;
      border-color: #ffce90;
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

