<template>
  <div class="account-config">
    <teleport to="#headerContent">
      <transition name="el-fade-in-linear" mode="out-in">
        <el-button v-if="!editPageShow" type="primary" @click="showEditPage(EDIT_TYPE.ADD)">新增账号</el-button>
      </transition>
    </teleport>
    <transition name="el-fade-in-linear" mode="out-in">
      <div v-if="!editPageShow" class="staff-list">
        <!-- 搜索列表 -->
        <div class="module-panel">
          <el-row class="search-box -mb-5" :gutter="20">
            <el-col v-bind="{ ...colConfig }">
              <div class="search-item">
                <span>工号</span>
                <el-input v-model.trim="staffNum" clearable placeholder="请输入内容" />
              </div>
            </el-col>
            <el-col v-bind="{ ...colConfig }">
              <div class="search-item">
                <span>伙伴姓名</span>
                <el-input v-model.trim="staffName" clearable placeholder="请输入内容" />
              </div>
            </el-col>
            <el-col v-bind="{ ...colConfig }">
              <div class="search-item">
                <span>角色组</span>
                <RoleSelect v-model="roleId" clearable />
              </div>
            </el-col>
            <el-col v-bind="{ ...colConfig }">
              <div class="search-item">
                <el-button type="primary" @click="seachData(1)">查 询</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
        <!-- 列表 -->
        <div class="module-panel mt-6">
          <el-table :data="tableData" style="width: 100%;">
            <el-table-column prop="id" label="工号" />
            <el-table-column prop="name" label="伙伴姓名">
              <template #default="{ row }">
                {{ row.name }}（{{ row.nickName }}）
              </template>
            </el-table-column>
            <el-table-column prop="positionText" label="岗位" />
            <el-table-column prop="rolesName" label="角色组" />
            <el-table-column prop="availableCN" label="状态" />
            <el-table-column label="操作">
              <template #default="{ row }">
                <el-popconfirm
                  v-if="row.available"
                  confirm-button-type="danger"
                  :title="`您确认禁用${row.name}(${row.nickName})的账号么`"
                  @confirm="onSureDisableStaff(row)"
                >
                  <template #reference>
                    <el-button type="danger" size="mini">禁用</el-button>
                  </template>
                </el-popconfirm>
                <el-popconfirm
                  v-else
                  confirm-button-type="success"
                  :title="`您确认启用${row.name}(${row.nickName})的账号么`"
                  @confirm="onActiveStaff(row)"
                >
                  <template #reference>
                    <el-button type="success" size="mini">启用</el-button>
                  </template>
                </el-popconfirm>

                <el-button type="primary" size="mini" @click="showEditPage(EDIT_TYPE.EDIT, row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
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
      </div>
      <EditAccount
        v-else
        v-model="editPageShow"
        :edit-type="editType"
        :edit-staff-id="editStaffId"
        @updateInfo="onStaffInfoUpdate"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store/index'

import RoleSelect from '@SelectBox/RoleSelect/index.vue'
import * as StaffApi from '@/api/staffApi'
import StaffModel from '@/model/StaffModel'
import EditAccount, { EDIT_TYPE } from './components/EditAccount.vue'


export default defineComponent({
  name: 'AccountConfig',
  components: { RoleSelect, EditAccount },
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
  setup () {
    const store = useStore()
    const route = useRoute()


    const staffNum = ref('')
    const staffName = ref('')
    const roleId = ref<number | string>('')
    const tableData = ref<StaffModel[]>([])
    const pager = reactive({
      page: 1,
      pageSize: 10,
      total: 10
    })
    
    // 搜索伙伴列表
    const seachData = async (page?: number) => {
      pager.page = page ? page : pager.page

      try {
        store.dispatch('settingStore/showLoading', route.name)
        const req: StaffApi.IGetStaffListParams = {
          page: pager.page,
          pageSize: pager.pageSize
        }
        if (staffNum.value) req.staffId = staffNum.value
        if (staffName.value) req.staffName = staffName.value
        if (roleId.value) req.roleId = roleId.value

        const res = await StaffApi.getStaffList(req)
        tableData.value = res.list
        pager.total = res.total
      } finally {
        store.dispatch('settingStore/hiddenLoading', route.name)
      }
    }
    seachData()

    const handlePage = () => {
      seachData()
    }

    /** 监听编辑完成 */
    const onStaffInfoUpdate = (editType: EDIT_TYPE) => {
      if (editType === EDIT_TYPE.ADD) {
        seachData(1)
      } else {
        seachData()
      }
    }


    /** 禁用账号 */
    const onSureDisableStaff = async (staffInfo: StaffModel) => {
      try {
        store.dispatch('settingStore/showLoading', route.name)
        const req = { staffId: staffInfo.id }
        await StaffApi.disableStaff(req)
        staffInfo.available = false
        staffInfo.availableCN = '禁用'
      } finally {
        store.dispatch('settingStore/hiddenLoading', route.name)
      }
    }


    /** 启用账号 */
    const onActiveStaff = async (staffInfo: StaffModel) => {
      try {
        store.dispatch('settingStore/showLoading', route.name)
        const req = { staffId: staffInfo.id }
        await StaffApi.enableStaff(req)
        staffInfo.available = true
        staffInfo.availableCN = '启用'
      } finally {
        store.dispatch('settingStore/hiddenLoading', route.name)
      }
    }


    /** 编辑账号 */
    const editPageShow = ref(false)
    const editType = ref(EDIT_TYPE.ADD)
    const editStaffId = ref<number | string>('')
    const showEditPage = (type: EDIT_TYPE, staffInfo?: StaffModel) => {
      editPageShow.value = true
      editType.value = type

      if (type === EDIT_TYPE.EDIT && staffInfo) {
        editStaffId.value = staffInfo.id
      }
    }

    return {
      staffName, staffNum, roleId, tableData,
      pager, seachData, handlePage, onStaffInfoUpdate,
      onSureDisableStaff, onActiveStaff,
      showEditPage, editPageShow,
      editType, EDIT_TYPE, editStaffId
    }
  }
})
</script>
