<template>
  <div class="edit-role">
    <teleport to="#fakeTitle">
      <div class="fake-title">{{ editType === EDIT_TYPE.EDIT ? '编辑' : '新增' }}角色组</div>
    </teleport>
    <teleport to="#headerContent">
      <el-button type="primary" plain @click="closeEditPage">返回</el-button>
    </teleport>

    <div class="module-panel">
      <div class="role-row">
        <div class="row-title">角色组名称</div>
        <div class="row-content">
          <el-input v-model="roleTitle" placeholder="请输入角色组名称" />
        </div>
      </div>
      <div class="role-row items-start">
        <div class="row-title">权限模块</div>
        <div class="row-content">
          <Jurisdiction v-model:hasPermission="rolePermissionArr" />
        </div>
      </div>
      <div class="role-row">
        <div class="row-title" />
        <el-button type="primary" @click="saveRoleInfo">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, toRefs } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store/index'
import Jurisdiction from '@/components/Jurisdiction/index.vue'
import { newMessage } from '@/utils/message'
import * as StaffApi from '@/api/staffApi'

/* eslint-disable no-unused-vars */
export enum EDIT_TYPE {
  EDIT = 'edit',
  ADD = 'add'
}

export default defineComponent({
  name: 'EditRole',
  components: { Jurisdiction },
  props: {
    modelValue: { type: Boolean, required: true },
    editType: { type: String as PropType<EDIT_TYPE>, required: true },
    editRoleId: { type: [String, Number], default: '' }
  },
  emits: ['update:modelValue', 'updateInfo'],
  setup (props, { emit }) {
    const store = useStore()
    const route = useRoute()

    /** 返回上一层 */
    const closeEditPage = () => {
      emit('update:modelValue', false)
    }

    const { editType, editRoleId } = toRefs(props)
    /** 添加角色 */
    const roleTitle = ref('')
    const rolePermissionArr = ref<number[]>([])

    /** 编辑角色 */
    // 获取角色信息
    const getRoleInfo = async () => {
      try {
        store.dispatch('settingStore/showLoading', route.name)
        const req = {
          roleId: editRoleId.value,
          additionInfo: false
        }
        const data = await StaffApi.getRoleInfo(req)
        rolePermissionArr.value = data.permissions.map((item: any) => item.permission_id)
        roleTitle.value = data.title
      } finally {
        store.dispatch('settingStore/hiddenLoading', route.name)
      }
    }
    if (editType.value === EDIT_TYPE.EDIT) {
      getRoleInfo()
    }


    /** 保存角色信息 */
    const saveRoleInfo = async () => {
      if (!roleTitle.value) return newMessage.warning('请填写角色组名称')
      if (!rolePermissionArr.value.length) return newMessage.warning('请填写角色组名称')

      try {
        store.dispatch('settingStore/showLoading', route.name)
        const bsaeReq = {
          title: roleTitle.value,
          permissionIds: rolePermissionArr.value
        }
        if (editType.value === EDIT_TYPE.ADD) {
          await StaffApi.addRole(bsaeReq)
        } else {
          const req = {
            roleId: editRoleId.value,
            ...bsaeReq
          }
          await StaffApi.editRole(req)
        }
        closeEditPage()
        const updateInfoData = editType.value === EDIT_TYPE.ADD ? EDIT_TYPE.ADD : EDIT_TYPE.EDIT
        emit('updateInfo', updateInfoData)
      } finally {
        store.dispatch('settingStore/hiddenLoading', route.name)
      }
    }

    return {
      EDIT_TYPE,
      closeEditPage,
      roleTitle, rolePermissionArr, saveRoleInfo
    }
  }
})
</script>

<style lang="less" scoped>
.fake-title {
  background-color: #f0f2f5;
}

.role-row {
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  .row-title {
    flex-shrink: 0;
    width: 90px;
    font-size: 14px;
    color: #303133;
  }
}
</style>
