<template>
  <div class="evaluate-configuration-components">
    <teleport to="#headerContent">
      <!-- 新款运用 -->
      <div class="switch-new-apply mr-4 text-sm leading-7">
        新款应用：
        <el-switch
          v-model="useNewProduct"
          active-color="#4669FB"
          active-text="开启"
          inactive-text="关闭"
          :disabled="useNewProductDisabled"
          @change="onUseNewProductChange"
        />
      </div>
      <!-- 添加列别 -->
      <el-popover
        v-model:visible="showAddCategoryDialog"
        placement="bottom-start"
        width="420"
        :offset="20"
        trigger="click"
      >
        <div class="grade-configuration-add-item-main">
          <span>类别名称:</span>
          <el-input
            v-model="newGradeClassName"
            v-noSpecialChar
            class="ml-10 w150"
            placeholder="请输入类别"
            maxlength="5"
          />
          <el-button type="info" class="ml-10" @click="showAddCategoryDialog = false">取 消</el-button>
          <el-button type="primary" @click="addGradeClass">确 定</el-button>
        </div>
        <template #reference>
          <el-button type="primary">添加类别</el-button>
        </template>
      </el-popover>
      <!-- 清空评分 -->
      <el-button type="danger" @click="showEmptyDiglog">清空评分</el-button>
    </teleport>
    
    <el-tabs v-model="activeName">
      <el-tab-pane v-for="gradeClass in tabList" :key="gradeClass.id" :name="gradeClass.stringId">
        <template #label>
          <span v-if="!gradeClass.isEdit">
            {{ gradeClass.name }}
            <span @click.stop="openEditGradeClassName(gradeClass)"><i class="el-icon-edit-outline" /></span>
          </span>
          <span v-else>
            <el-input
              ref="editCategoryInput"
              v-model="gradeClass.editName"
              v-noSpecialChar
              class="w150"
              placeholder="请输入类别"
              size="mini"
              maxlength="5"
              clearable
              @blur="editGradeClassName(gradeClass)"
              @keyup.enter="editGradeClassName(gradeClass)"
            />
          </span>
        </template>
        <GradeClassItem :grade-class-info="gradeClass" />
      </el-tab-pane>
    </el-tabs>

    <EmptyPeoplePool v-model="emptyDiglogShow" />
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, inject, ref, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store/index'

import GradeClassItem from './components/GradeClassItem.vue'
import EmptyPeoplePool from './components/EmptyPeoplePool.vue'
import * as GradeConfigurationApi from '@/api/gradeConfigurationApi'
import { ORGANIZATION_TYPE, SPOT_TYPE } from '@/model/Enumerate'
import { newMessage } from '@/utils/message'

export default defineComponent({
  name: 'EvaluateConfigurationComponents',
  components: { GradeClassItem, EmptyPeoplePool },
  setup () {
    const vm = getCurrentInstance()
    const store = useStore()
    const route = useRoute()
    const type = inject('type') as SPOT_TYPE
    const organizationType = inject('organizationType') as ORGANIZATION_TYPE

    /** 获取全部标签数据 */
    const tabList = ref<GradeConfigurationApi.interactionGradeLabelModel[]>([])
    const activeName = ref('')
    const getScoreConfigByEdit = async () => {
      try {
        store.dispatch('settingStore/showLoading', route.name)
        const req = {
          type,
          organizationType
        }
        const res = await GradeConfigurationApi.getScoreConfigByEdit(req)
        tabList.value = res
        const firstId = _.get(res[0], 'stringId') || ''
        if (firstId) activeName.value = firstId
      } finally {
        store.dispatch('settingStore/hiddenLoading', route.name)
      }
    }
    getScoreConfigByEdit()

    /** 编辑评分类别名字 */
    // 展示编辑窗口
    const openEditGradeClassName = async (gradeClass: GradeConfigurationApi.interactionGradeLabelModel) => {
      gradeClass.isEdit = true
      await nextTick()
      if (vm?.refs['editCategoryInput']) {
        (vm?.refs['editCategoryInput'] as any).focus()
      }
    }
    // 切换窗口全部编辑为空
    const cancelEditSwitchTab = () => {
      tabList.value.forEach(gradeClassItem => gradeClassItem.isEdit = false)
    }
    // 编辑名称
    const editGradeClassName = async (gradeClass: GradeConfigurationApi.interactionGradeLabelModel) => {
      if (!gradeClass.editName) {
        newMessage.warning('请填写正确的评分类型。')
        gradeClass.isEdit = false
        return
      }
      // 名字没有改变，算作取消
      if (gradeClass.editName === gradeClass.name) {
        gradeClass.isEdit = false
        return
      }
      if (tabList.value.some(gradeClassItem => gradeClassItem.name === gradeClass.editName)) {
        newMessage.warning('存在相同的评分类别。')
        return
      }

      try {
        store.dispatch('settingStore/showLoading', route.name)
        const req = {
          name: gradeClass.editName,
          id: gradeClass.id,
          type,
          organizationType
        }
        await GradeConfigurationApi.editScoreTypeName(req)
        gradeClass.name = gradeClass.editName
        cancelEditSwitchTab()
      } finally {
        store.dispatch('settingStore/hiddenLoading', route.name)
      }
    }

    /** 新增评分类别 */
    const showAddCategoryDialog = ref(false)
    const newGradeClassName = ref('')
    // 添加类别
    const addGradeClass = async () => {
      const hasSameGradeName = tabList.value.some(gradeClassItem => gradeClassItem.name === newGradeClassName.value)
      if (hasSameGradeName) return newMessage.warning('存在相同的评分类别')
      if (!newGradeClassName.value) return newMessage.warning('请填写正确的类别名称')
      const req = { name: newGradeClassName.value, type, organizationType }
      try {
        store.dispatch('settingStore/showLoading', route.name)
        await GradeConfigurationApi.addScoreType(req)
        newMessage.success('评分类别创建成功')
        await getScoreConfigByEdit()
        showAddCategoryDialog.value = false
        newGradeClassName.value = ''
      } finally {
        store.dispatch('settingStore/hiddenLoading', route.name)
      }
    }

    /** 清空评分 */
    const emptyDiglogShow = ref(false)
    const showEmptyDiglog = () => {
      emptyDiglogShow.value = true
    }

    /** 新款应用 */
    const useNewProduct = ref(false)
    const useNewProductDisabled = ref(false)
    const useNewProductLoading = ref(false)
    const getUserInfoData = async () => {
      try {
        useNewProductLoading.value = true
        const req = {
          type,
          organizationType
        }
        const res = await GradeConfigurationApi.getScoreGeneralConfig(req)
        useNewProduct.value = res
        useNewProductDisabled.value = false
      } catch {
        useNewProductDisabled.value = true
      } finally {
        useNewProductLoading.value = false
      }
    }
    getUserInfoData()

    // 监听新款应用
    const onUseNewProductChange = async () => {
      try {
        const req = {
          state: useNewProduct.value,
          type,
          organizationType
        }
        const res = await GradeConfigurationApi.setNewConfig(req)
        if (!res) {
          useNewProduct.value = !useNewProduct.value
        }
      } catch {
        useNewProduct.value = !useNewProduct.value
      }
    }

    return {
      tabList, activeName, editGradeClassName, openEditGradeClassName,
      showAddCategoryDialog, newGradeClassName, addGradeClass,
      showEmptyDiglog, emptyDiglogShow,
      useNewProduct, onUseNewProductChange, useNewProductDisabled, useNewProductLoading
    }
  }
})
</script>

<style lang="less" scoped>
.el-tabs {
  :deep(.el-tabs__content) {
    overflow: inherit;
  }
}

.tab-pane-module {
  padding: 20px 16px 20px 16px;
  background-color: #fff;
}
</style>

<style lang="less">
.grade-configuration-add-item-main {
  display: flex;
  align-items: center;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .ml-10 {
    margin-left: 10px;
  }

  .w150 {
    width: 150px;
  }

  .switch-new-apply {
    font-size: 12px;
    color: red;
  }
}

.empty-dialog {
  .empty-title {
    margin-right: 12px;
  }

  .all-empty-warning {
    margin-left: 12px;
  }
}
</style>
