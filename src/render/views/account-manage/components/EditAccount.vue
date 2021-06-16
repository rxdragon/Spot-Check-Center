<template>
  <div class="edit-account">
    <teleport to="#fakeTitle">
      <div class="fake-title">{{ editType === EDIT_TYPE.EDIT ? '编辑' : '新增' }}账号</div>
    </teleport>
    <teleport to="#headerContent">
      <el-button type="primary" plain @click="closeEditPage">返回</el-button>
    </teleport>
    <!-- 编辑内容 -->
    <div class="module-panel mb-6">
      <el-row class="search-box -mb-5" :gutter="20">
        <el-col v-bind="{ ...colConfig }">
          <div class="search-item">
            <span>工号</span>
            <el-input
              v-model.trim="staffNum"
              :disabled="editType === EDIT_TYPE.EDIT"
              clearable
              placeholder="请输入内容"
            />
          </div>
        </el-col>
        <el-col v-bind="{ ...colConfig }">
          <div class="search-item">
            <span>伙伴姓名</span>
            <el-input
              v-model.trim="staffName"
              :disabled="editType === EDIT_TYPE.EDIT"
              clearable
              placeholder="请输入内容"
            />
          </div>
        </el-col>
        <el-col v-if="editType === EDIT_TYPE.ADD" v-bind="{ ...colConfig }">
          <div class="search-item">
            <el-button type="primary" @click="seachStaffData">查 询</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 用户信息 -->
    <div v-if="staffInfo" class="staff-info-module module-panel flex mb-6">
      <el-row class="w-full" :gutter="20">
        <el-col v-bind="{ ...colConfig }">
          <div class="info-grop">伙伴姓名/花名：{{ staffInfo.name }} / {{ staffInfo.nickName }}</div>
        </el-col>
        <el-col v-bind="{ ...colConfig }">
          <div class="info-grop">工号：{{ staffInfo.id }}</div>
        </el-col>
        <el-col v-bind="{ ...colConfig }">
          <div class="info-grop">岗位：{{ staffInfo.positionText }}</div>
        </el-col>
        <el-col v-bind="{ ...colConfig }">
          <div class="info-grop">部门：{{ staffInfo.departmentName }}</div>
        </el-col>
      </el-row>
    </div>

    <!-- 用户配置信息 -->
    <div v-if="staffInfo" class="staff-permissions-info">
      <el-tabs v-model="activeName">
        <el-tab-pane label="管辖范围配置" :name="ACTIVE_TYPE.BASE">
          <div class="module-panel base-module">
            <div class="base-row mb-5">
              <span class="base-title">身份</span>
              <RankSelect v-model="positionId" />
            </div>
            <div class="base-row mb-5">
              <span class="base-title">管辖伙伴</span>
              <StoreStaffSelect v-model="configStaffIds" />
            </div>
            <div class="base-row mb-5 items-start">
              <span class="base-title">管辖门店</span>
              <StorePanel v-model:to-data="selectStore" :default-checked-keys="defaultCheckedKeys" />
            </div>
            <div class="base-row mb-5">
              <span class="base-title" />
              <el-button type="primary" @click="nextStep">下一步</el-button>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="角色权限配置" :name="ACTIVE_TYPE.ROLE">
          <div class="module-panel">
            <div class="role-row mb-5">
              <span class="role-row-title">角色组名称</span>
              <RoleSelect v-model="activeRoleId" @change="onRoleChange" />
            </div>
            <div class="role-row mb-5 items-start">
              <span class="role-row-title">权限模块</span>
              <Jurisdiction v-model:hasPermission="permissionGather" :role-permission="rolePermissionArr" />
            </div>
            <div class="role-row mb-5">
              <el-button type="primary" @click="submitData">提 交</el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, toRefs } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store/index'

import RankSelect from '@SelectBox/RankSelect/index.vue'
import StorePanel from '@/components/StorePanel/index.vue'
import Jurisdiction from '@/components/Jurisdiction/index.vue'
import RoleSelect from '@SelectBox/RoleSelect/index.vue'
import StoreStaffSelect from '@SelectBox/StoreStaffSelect/index.vue'

import * as StaffApi from '@/api/staffApi'
import StaffModel from '@/model/StaffModel'
import { newMessage } from '~/render/utils/message'
/* eslint-disable no-unused-vars */
export enum EDIT_TYPE {
  EDIT = 'edit',
  ADD = 'add'
}

enum ACTIVE_TYPE {
  BASE = 'base',
  ROLE = 'role'
}

export default defineComponent({
  name: 'EditAccount',
  components: { RankSelect, StorePanel, Jurisdiction, RoleSelect, StoreStaffSelect },
  props: {
    modelValue: { type: Boolean, required: true },
    editType: { type: String as PropType<EDIT_TYPE>, required: true },
    editStaffId: { type: [String, Number], default: '' }
  },
  data () {
    return {
      colConfig: {
        span: 24,
        xl: 6,
        lg: 6,
        md: 10,
        sm: 10,
        xs: 24
      }
    }
  },
  emits: ['update:modelValue', 'updateInfo'],
  setup (props, { emit }) {
    const store = useStore()
    const route = useRoute()

    
    /** 关闭编辑窗口 */
    const closeEditPage = () => {
      emit('update:modelValue', false)
    }

    /** 角色组相关 */
    const activeRoleId = ref()
    const rolePermissionArr = ref<number[]>([])
    const getRoleInfo = async (id: number) => {
      const req = {
        roleId: id,
        additionInfo: false
      }
      const data = await StaffApi.getRoleInfo(req)
      rolePermissionArr.value = data.permissions.map((item: any) => item.permission_id)
    }

    /** 权限相关 */
    const staffPermission = ref<number[]>([])
    const permissionGather = ref<number[]>([])
    // 重置权限
    const resetPermission = () => {
      const permissionSet = new Set([...staffPermission.value, ...rolePermissionArr.value])
      permissionGather.value = [...permissionSet]
    }
    // 监听角色组变化
    const onRoleChange = async () => {
      try {
        store.dispatch('settingStore/showLoading', route.name)
        staffPermission.value = []
        await getRoleInfo(activeRoleId.value)
        resetPermission()
      } finally {
        store.dispatch('settingStore/hiddenLoading', route.name)
      }
    }


    /** 搜索用户信息 */
    const staffNum = ref<string | number>()
    const staffName = ref('')
    const staffInfo = ref<StaffModel>()
    const positionId = ref<idType>()
    const administerStaffIds = ref<number[]>([])

    const seachStaffData = async () => {
      try {
        store.dispatch('settingStore/showLoading', route.name)
        if (!staffNum.value && !staffNum.value) return newMessage.warning('请输入搜索信息')
        const req: StaffApi.IGetStaffInfoParams = {}
        if (staffNum.value) req.staffId = staffNum.value
        if (staffName.value) req.staffName = staffName.value
        staffInfo.value = await StaffApi.getStaffInfo(req)
        
        // 权限相关信息
        positionId.value = staffInfo.value.positionId
        activeRoleId.value = staffInfo.value.rolesId
        staffPermission.value = staffInfo.value.permissions.map(item => item.id)
        // todo:cf 添加门店相关信息

        await getRoleInfo(activeRoleId.value)
        resetPermission()
      } finally {
        store.dispatch('settingStore/hiddenLoading', route.name)
      }
    }

    // 编辑用户信息触发
    const { editType, editStaffId } = toRefs(props)
    if (editType.value === EDIT_TYPE.EDIT) {
      staffNum.value = editStaffId.value
      seachStaffData()
    }

    /** 用户权限相关 */
    const activeName = ref(ACTIVE_TYPE.BASE)
    const selectStore = ref([])
    const configStaffIds = ref<idType[]>([])
    const defaultCheckedKeys = ref([]) // 默认选中门店

    /** 提交用户信息 */
    const submitData = async () => {
      if (!staffNum.value) return newMessage.warning('缺少用户id')
      if (!positionId.value) return newMessage.warning('请选择身份')

      try {
        store.dispatch('settingStore/showLoading', route.name)
        const req: StaffApi.IEditStaffParams = {
          staffId: staffNum.value,
          roleId: activeRoleId.value,
          positionId: positionId.value
        }
        if (selectStore.value.length) req.configStoreIds = selectStore.value
        if (configStaffIds.value.length) req.configStaffIds = selectStore.value
        if (permissionGather.value.length) req.permissionIds = permissionGather.value

        if (editType.value === EDIT_TYPE.EDIT) {
          await StaffApi.editStaff(req)
        } else {
          await StaffApi.addStaff(req)
        }
        closeEditPage()
        const updateInfoData = editType.value === EDIT_TYPE.ADD ? EDIT_TYPE.ADD : EDIT_TYPE.EDIT
        emit('updateInfo', updateInfoData)
      } finally {
        store.dispatch('settingStore/hiddenLoading', route.name)
      }
    }

    /** 下一步 */
    const validateParams = () => {
      try {
        if (!staffNum.value) throw new Error('请填写工号')
        if (!positionId.value) throw new Error('请选择身份')
        return true
      } catch (error) {
        newMessage.warning(error.message)
        return false
      }
    }
    const nextStep = () => {
      if (!validateParams()) return
      activeName.value = ACTIVE_TYPE.ROLE
    }

    return {
      closeEditPage,
      EDIT_TYPE, ACTIVE_TYPE,
      staffNum, staffName, seachStaffData, staffInfo,
      activeName,
      positionId, selectStore, defaultCheckedKeys, administerStaffIds, configStaffIds,
      nextStep,
      permissionGather, rolePermissionArr, activeRoleId, onRoleChange,
      submitData
    }
  }
})
</script>

<style lang="less" scoped>
.fake-title {
  background-color: #f0f2f5;
}

.staff-permissions-info {
  .base-module {
    .base-row {
      display: flex;
      align-items: center;
      padding-left: 40px;

      .base-title {
        flex-shrink: 0;
        width: 56px;
        margin-right: 12px;
        font-size: 14px;
        color: #303133;
      }

      .store-panel {
        width: 800px;
      }
    }
  }

  .role-row {
    display: flex;
    align-items: center;
    padding-left: 40px;

    .role-row-title {
      flex-shrink: 0;
      width: 70px;
      margin-right: 12px;
      font-size: 14px;
      color: #303133;
    }
  }
}
</style>
