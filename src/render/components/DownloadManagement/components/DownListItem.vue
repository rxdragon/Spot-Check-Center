<template>
  <div class="down-list-item">
    <div class="panel-content filename">
      <div class="file-icon">
        <img :src="listItem.iconSrc" alt="">
      </div>
      <span class="file-name">{{ listItem.fileName }}</span>
    </div>
    <div v-if="hasFile" class="panel-content">
      <div v-if="state === 'completed'" class="down-completed">
        <i class="el-icon-download">{{ stateCN }}</i>
      </div>
      <div v-if="state === 'interrupted'" class="down-interrupted">
        <i class="el-icon-warning-outline">下载中断</i>
      </div>
      <div v-if="state === 'progressing'" class="down-progressing">
        <el-progress
          :show-text="false"
          :text-inside="true"
          :stroke-width="8"
          :percentage="progressNum"
        />
        <div class="description">{{ listItem.process.speed }}</div>
      </div>
      <div v-if="state === 'waitdown'" class="down-completed">
        <i class="el-icon-warning-outline">等待下载</i>
      </div>
      <div v-if="state === 'cancelled'" class="down-cancelled">
        <i class="el-icon-download">下载取消</i>
      </div>
    </div>
    <div v-else class="panel-content">
      <div class="down-cancelled">
        <i class="el-icon-download">文件已丢失</i>
      </div>
    </div>
    <div class="panel-content handle-button">
      <!-- 暂停 -->
      <el-button
        v-if="state === 'progressing' && !listItem.isUserPause"
        size="mini"
        class="down-icon-button"
        icon="el-icon-video-pause"
        @click="pauseItem"
      />
      <!-- 回复 -->
      <el-button
        v-if="canResume"
        size="mini"
        class="down-icon-button"
        icon="el-icon-video-play"
        @click="resumeDownItem"
      />
      <!-- 查看本地文件 -->
      <el-button
        v-if="state === 'completed' && hasFile"
        size="mini"
        class="down-icon-button"
        icon="el-icon-search"
        @click="downOpenFileFolder"
      />
      <!-- 取消 -->
      <el-button
        v-if="state === 'progressing'"
        size="mini"
        class="down-icon-button"
        icon="el-icon-delete"
        @click="cancelItem"
      />
      <!-- 删除记录 -->
      <el-button
        v-if="state !== 'progressing'"
        size="mini"
        class="down-icon-button"
        icon="el-icon-delete"
        @click="deleteDownItem"
      />
    </div>
  </div>
</template>

<script lang="ts">
import type { IDownItem } from '~/main/downModule'
import { computed, defineComponent, ref, toRefs, PropType } from 'vue'
import { useStore } from '@/store/index'

import { openFileFolder } from '@/utils/electronOpenFile'
import { DOWN_STATE, downStateToCN } from '~/main/downModule/downModuleEnum'

import ElectronDown from '@/utils/electronDown'

export default defineComponent({
  name: 'DownListItem',
  props: {
    listItem: { type: Object as PropType<IDownItem>, required: true },
    uuid: { type: String, required: true },
    finished: { type: Boolean },
    showPopver: { type: Boolean }
  },
  setup (props) {
    const store = useStore()

    const { listItem, finished, showPopver, uuid } = toRefs(props)
    // 下载管理器单例
    const ElectronDownInstance = ElectronDown.getInstance()

    /** 下载状态 */
    const state = computed(() => {
      if (!finished.value && listItem.value.status === DOWN_STATE.COMPLETED && showPopver.value) {
        ElectronDownInstance.transferToVuexList(uuid.value)
      }
      return listItem.value.status
    })
    const stateCN = computed(() => downStateToCN[state.value])

    /** 是否存在文件 */
    const hasFile = ref(true)
    const downOpenFileFolder = () => {
      hasFile.value = openFileFolder(listItem.value.savePath)
    }

    /** 进度百分比 */
    const progressNum = computed(() => {
      const progressValue = _.get(listItem.value, 'process.progress')
      if (!progressValue) return 0
      return parseInt(progressValue)
    })

    /** 删除下载文件 */
    const deleteDownItem = () => {
      if (finished.value) {
        store.dispatch('downLoadedListStore/delDownloadItem', { uuid: uuid.value })
      } else {
        ElectronDownInstance.deleteItem(uuid.value)
      }
    }

    /** 重新下载 */
    const canResume = computed(() => listItem.value.canResume)
    const resumeDownItem = () => {
      ElectronDownInstance.resume(uuid.value)
    }
    /** 暂停下载文件 */
    const pauseItem = () => {
      ElectronDownInstance.pause(uuid.value)
    }
    /** 取消下载 */
    const cancelItem = () => {
      ElectronDownInstance.cancel(uuid.value)
    }

    return {
      hasFile,
      downOpenFileFolder,
      state, stateCN, DOWN_STATE,
      progressNum, canResume,
      deleteDownItem, resumeDownItem, pauseItem, cancelItem
    }
  }
})
</script>

<style lang="less" scoped>
.down-list-item {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr;

  &:hover {
    background-color: #f5f7fb;
  }

  .panel-content {
    padding: 10px 21px;
    font-size: 14px;
    font-weight: 500;
    line-height: 22px;
    color: #8e939a;

    .down-completed {
      i::before {
        color: @blue;
      }

      time {
        margin-left: 10px;
        color: #bac0c7;
      }
    }
  }

  .filename {
    display: flex;
    align-items: center;
    width: 220px;
    color: #848991;

    .file-icon {
      width: 20px;
      margin-right: 8px;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .file-name {
      width: calc(100% - 20px);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .handle-button {
    width: auto;
    padding: 10px 0;
    text-align: center;
  }
}
</style>
