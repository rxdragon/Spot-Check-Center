<template>
  <div class="photo-list-map overflow-x-auto overscroll-x-contain">
    <div
      v-for="(photoItem, listIndex) in photoList"
      :key="listIndex"
      class="photo-list-item p-1 mr-4"
      :class="photoIndex === listIndex && 'active'"
      @click="activePhotoItem(listIndex)"
    >
      <el-image :src="photoItem.src">
        <template #error>
          <div class="image-slot">
            <i class="el-icon-picture-outline" />
            <div class="error-desc">加载失败</div>
          </div>
        </template>
      </el-image>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'PhotoListMap',
  props: {
    photoList: { type: Array as PropType<any[]>, required: true },
    photoIndex: { type: Number, required: true }
  },
  emits: ['update:photoIndex'],
  setup (props, { emit }) {
    /**
     * @description 获取选中id
     */
    const activePhotoItem = (selectIndex: number) => {
      if (props.photoIndex === selectIndex) return
      emit('update:photoIndex', selectIndex)
    }

    return {
      activePhotoItem
    }
  }
})
</script>

<style lang="less" scoped>
.photo-list-map {
  width: 100%;
  white-space: nowrap;

  .photo-list-item {
    display: inline-block;
    cursor: pointer;
    border: 2px solid transparent;
    border-radius: 4px;
    transform: all 0.3s;

    &.active {
      border-color: @primaryColor;
    }

    .el-image {
      display: block;
      max-width: 120px;
      max-height: 120px;
      overflow: hidden;
      border-radius: 4px;

      :deep(.el-image__inner) {
        width: auto;
        max-width: 120px;
        height: auto;
        max-height: 120px;
      }

      .image-slot {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 120px;
        height: 120px;
        font-size: 40px;
        color: #909399;
        background: #f5f7fa;

        .error-desc {
          margin-top: 10px;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
