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
          <el-table-column prop="date" label="角色组名称" />
          <el-table-column prop="name" label="操作人" />
          <el-table-column prop="address" label="操作">
            <template #default="{ row }">
              <el-button size="mini" type="primary" @click="editRole(row)">
                编辑
              </el-button>
              <el-popconfirm confirm-button-type="danger" :title="`您确认删除${row.name}角色组么`" @confirm="onSureDeleteRole(row)">
                <template #reference>
                  <el-button type="danger" size="mini">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <EditRole
        v-else
        v-model="editPageShow"
        :edit-type="editType"
        :edit-role-id="editRoleId"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import EditRole, { EDIT_TYPE } from './components/EditRole.vue'

export default defineComponent({
  name: 'RoleConfig',
  components: { EditRole },
  setup () {
    const tableData = ref([{
      date: '2016-05-02',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1518 弄'
    }, {
      date: '2016-05-04',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1517 弄'
    }, {
      date: '2016-05-01',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1519 弄'
    }, {
      date: '2016-05-03',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1516 弄'
    }])

    const onSureDeleteRole = (roleInfo: any) => {
      console.warn(roleInfo)
    }

    const editPageShow = ref(false)
    const editType = ref(EDIT_TYPE.ADD)
    const editRoleId = ref<number>()

    // 添加权限
    const addNewRole = () => {
      editType.value = EDIT_TYPE.ADD
      editPageShow.value = true
    }
    const editRole = (roleInfo: any) => {
      editRoleId.value = roleInfo.id
      editType.value = EDIT_TYPE.ADD
      editPageShow.value = true
    }

    return {
      editPageShow,
      tableData,
      onSureDeleteRole,
      editRoleId, editType,
      addNewRole, editRole
    }
  }
})
</script>
