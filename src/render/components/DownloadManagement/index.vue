<template>
  <div class="download-management">
    <el-popover
      v-model:visible="showManage"
      popper-class="download-popover"
      placement="bottom"
      width="500"
      trigger="click"
    >
      <div class="down-list">
        <div class="title-row">
          <div class="down-panel-title">下载内容</div>
          <div class="down-panel-title">下载状态</div>
          <div class="down-panel-title">
            操作
            <el-button icon="el-icon-delete-solid" class="delete-btn" @click="clearAll" />
          </div>
        </div>
        <el-scrollbar wrap-class="down-scrollbar-wrapper">
          <transition-group name="down-complete" tag="div" mode="out-in">
            <div v-for="(downItem, uuid) in downList" :key="downItem.config.uuid" class="down-complete-item content-row">
              <DownListItem :uuid="uuid" :show-popver="showManage" :list-item="downItem" />
            </div>
            <div v-for="downItem in downloadList" :key="downItem.config.uuid + '-finish'" class="down-complete-item content-row">
              <DownListItem :uuid="downItem.config.uuid" :list-item="downItem" finished />
            </div>
            <div v-show="!noData" key="noData" class="no-data down-complete-item">
              暂无数据
            </div>
          </transition-group>
        </el-scrollbar>
        <div class="save-path">
          <span>{{ saveFolder }}</span>
          <i class="el-icon-setting" @click="changeSavePath" />
        </div>
      </div>
      <template #reference>
        <el-badge
          :max="9"
          :hidden="!showProgressingNum"
          :value="showProgressingNum"
          type="danger"
        >
          <el-button class="icon-button cursor-pointer" icon="iconfont iconxiazai" />
        </el-badge>
      </template>
    </el-popover>
  </div>
</template>

<script lang="ts">
import type { IDownItem } from '~/main/downModule'
import { computed, defineComponent, ref } from 'vue'
import { useStore } from '@/store/index'
import DownListItem from './components/DownListItem.vue'
import * as Setting from '@/indexDB/getSetting'
import ElectronDown from '@/utils/electronDown'

export default defineComponent({
  name: 'DownloadManagement',
  components: { DownListItem },
  setup () {
    const store = useStore()
    const showManage = ref(false)

    // 下载管理器单例
    const ElectronDownInstance = ElectronDown.getInstance()

    /** 队列信息 */
    const downList = ref<Record<string, IDownItem>>({})
    downList.value = ElectronDownInstance.downloadList

    // 完成下载队列
    const downloadList = computed(() => store.getters.downloadList)
    const noData = computed(() => {
      const listLength = Object.keys(downList.value).length + downloadList.value.length
      return Boolean(listLength)
    })
    // 正在下载数量
    const showProgressingNum = computed(() => Object.keys(downList.value).length)


    /** 保存路径 */
    const saveFolder = computed(() => store.getters.saveFolder)

    const clearAll = () => {
      ElectronDownInstance.clearAll()
      store.dispatch('downLoadedListStore/clearAllDownList')
    }

    const changeSavePath = async () => {
      if (!window.ElectronIpcRenderer) return
      const savePath = window.ElectronIpcRenderer.sendSync('change-savePath')[0]
      if (savePath) {
        await store.dispatch('settingStore/setSavePath', savePath)
        Setting.updateSavePath(savePath)
      }
    }

    return {
      showManage,
      showProgressingNum,
      clearAll, changeSavePath, saveFolder,
      downList, downloadList, noData
    }
  }
})
</script>

<style lang="less" scoped>
:deep(.down-scrollbar-wrapper) {
  max-height: 500px;
}

.down-list {
  position: relative;

  .title-row {
    position: relative;
    display: grid;
    grid-template-columns: 2fr 2fr 1fr;

    .down-panel-title {
      display: flex;
      align-items: center;
      padding: 10px 21px;
      font-size: 14px;
      font-weight: 500;
      line-height: 22px;
      color: #bbc1c8;
      background-color: #f5f7fb;

      .delete-btn {
        padding: 0;
        margin-left: 20px;
        cursor: pointer;
        background-color: transparent;
        border: none;
      }
    }
  }

  .no-data {
    height: 48px;
    padding: 0;
    margin-bottom: 0;
    line-height: 48px;
    color: #8e939a;
    text-align: center;
  }

  .save-path {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 7px;
    border-top: 1px solid @borderColor;

    & > span {
      font-size: 12px;
      color: @blue;
    }

    .el-icon-setting {
      cursor: pointer;

      &:hover {
        color: @blue;
      }
    }
  }
}
</style>

<style lang="less">
.download-popover {
  width: 600px;
  padding: 20px;
  border-radius: 16px !important;
}
</style>
