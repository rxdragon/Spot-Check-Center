<template>
  <div class="role-select">
    <el-select v-bind="$attrs" placeholder="请选择角色组">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        :disabled="isLoading"
      />
    </el-select>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import * as StaffApi from '@/api/staffApi'

export default defineComponent({
  name: 'RoleSelect',
  setup () {
    const options = ref<StaffApi.ISelectType[]>([])
    const isLoading = ref(true)

    /** 获取全部权限 */
    const getRoleList = async () => {
      try {
        options.value = await StaffApi.getAllRole()
      } finally {
        isLoading.value = false
      }
    }
    getRoleList()

    return {
      isLoading,
      options
    }
  },
})
</script>
