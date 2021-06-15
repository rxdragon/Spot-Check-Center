<template>
  <div class="role-config">
    <teleport to="#headerContent">
      <transition name="el-fade-in-linear" mode="out-in">
        <el-button v-if="!editPageShow" type="primary" @click="addNewRole">新增角色组</el-button>
      </transition>
    </teleport>
    <!-- 主要内容 -->
    <transition name="el-fade-in-linear" mode="out-in">
      <div v-if="!editPageShow" class="module-panel">
        <el-table :data="tableData" style="width: 100%;">
          <el-table-column prop="roleTitle" label="角色组名称" />
          <el-table-column prop="founderName" label="操作人" />
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button size="mini" type="primary" @click="editRole(row)">
                编辑
              </el-button>
              <el-popconfirm confirm-button-type="danger" :title="`您确认删除${row.roleTitle}角色组么`" @confirm="onSureDeleteRole(row)">
                <template #reference>
                  <el-button type="danger" size="mini">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="page-box">
          <el-pagination
            v-model:current-page="pager.page"
            :hide-on-single-page="true"
            :page-size="pager.pageSize"
            layout="prev, pager, next"
            :total="pager.total"
            @current-change="handlePage"
          />
        </div>
      </div>
      <EditRole
        v-else
        v-model="editPageShow"
        :edit-type="editType"
        :edit-role-id="editRoleId"
        @updateInfo="onRoleInfoUpdate"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store/index'

import EditRole, { EDIT_TYPE } from './components/EditRole.vue'
import * as StaffApi from '@/api/staffApi'

export default defineComponent({
  name: 'RoleConfig',
  components: { EditRole },
  setup () {
    const route = useRoute()
    const store = useStore()

    const editPageShow = ref(false)
    const editType = ref(EDIT_TYPE.ADD)
    const editRoleId = ref<number>()

    const pager = reactive({
      page: 1,
      pageSize: 10,
      total: 10
    })
    const tableData = ref<StaffApi.roleItem[]>([])

    // 获取角色列表
    const getRoleListByPage = async (page?: number) => {
      try {
        pager.page = page ? page : pager.page
        store.dispatch('settingStore/showLoading', route.name)
        const req = {
          page: pager.page,
          pageSize: pager.pageSize
        }
        const res = await StaffApi.getRoleListByPage(req)
        tableData.value = res.list
        pager.total = res.totle
      } finally {
        store.dispatch('settingStore/hiddenLoading', route.name)
      }
    }
    getRoleListByPage(1)

    const handlePage = () => {
      getRoleListByPage()
    }

    // 监听当编辑完成后
    const onRoleInfoUpdate = (editType: EDIT_TYPE) => {
      if (editType === EDIT_TYPE.ADD) {
        getRoleListByPage(1)
      } else {
        handlePage()
      }
    }

    /** 删除角色组 */
    const onSureDeleteRole = async (roleInfo: StaffApi.roleItem) => {
      try {
        store.dispatch('settingStore/showLoading', route.name)
        const req = {
          roleId: roleInfo.roleId
        }
        await StaffApi.delRole(req)
        if (tableData.value.length === 1 && pager.page > 1) {
          pager.page--
        }
        handlePage()
      } finally {
        store.dispatch('settingStore/hiddenLoading', route.name)
      }
    }

    // 添加权限
    const addNewRole = () => {
      editRoleId.value = undefined
      editType.value = EDIT_TYPE.ADD
      editPageShow.value = true
    }
    // 编辑权限
    const editRole = (roleInfo: any) => {
      editRoleId.value = roleInfo.roleId
      editType.value = EDIT_TYPE.EDIT
      editPageShow.value = true
    }

    return {
      editPageShow,
      tableData,
      onSureDeleteRole,
      editRoleId, editType,
      addNewRole, editRole,
      pager, getRoleListByPage, handlePage, onRoleInfoUpdate
    }
  }
})
</script>
