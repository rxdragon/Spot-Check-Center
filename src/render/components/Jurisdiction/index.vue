<template>
  <div v-loading="loading" class="jurisdiction">
    <div
      v-for="(moduleItem, moduleIndex) in jurisdictionList"
      :key="moduleIndex"
      class="module-box"
    >
      <div class="module-header">
        <el-checkbox
          v-model="moduleItem.setAll"
          :disabled="moduleItem.isRole"
          :indeterminate="moduleItem.isIndeterminate"
          @change="checkModulePermission(moduleItem)"
        >
          {{ moduleItem.name }}
        </el-checkbox>
      </div>
      <div v-for="(menuItem, menuIndex) in moduleItem.menu" :key="menuIndex" class="menu-box">
        <div class="menu-header">
          <el-checkbox
            v-model="menuItem.setAll"
            :disabled="menuItem.isRole"
            :indeterminate="menuItem.isIndeterminate"
            @change="checkMenuAllPermission(menuItem, moduleItem)"
          >
            {{ menuItem.name }}
          </el-checkbox>
        </div>
        <!-- 菜单盒子 -->
        <el-checkbox-group v-model="menuItem.checkPermission" class="permission-box" @change="handlePermission(menuItem, moduleItem)">
          <el-checkbox
            v-for="(permissionItem, permissionIndex) in menuItem.permission"
            :key="permissionIndex"
            :label="permissionItem.id"
            :disabled="permissionItem.isRole"
            class="permission-name"
          >
            {{ permissionItem.title }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, watch } from 'vue'
import * as StaffApi from '@/api/staffApi'

export default defineComponent({
  name: 'Jurisdiction',
  props: {
    hasPermission: { type: Array, default: () => [] }, // 含有权限
    rolePermission: { type: Array, default: () => [] } // 角色权限
  },
  emits: ['update:hasPermission'],
  setup (props, { emit }) {
    const { rolePermission, hasPermission } = toRefs(props)
    const loading = ref(false)
    const firstShow = ref(true)
    const jurisdictionList = ref<StaffApi.IModuleItem[]>([])

    /** 初始化接口信息 */
    const initializeData = () => {
      jurisdictionList.value.forEach(moduleItem => {
        moduleItem.checkMenu = []
        moduleItem.menu.forEach(menuItem => {
          menuItem.checkPermission = []
          menuItem.permission.forEach(permissionItem => {
            // 如果有权限 放进菜单的选择权限中 初始化角色
            permissionItem.isRole = false
            menuItem.isRole = false
            moduleItem.isRole = false
            if (rolePermission.value.includes(+permissionItem.id)) {
              permissionItem.isRole = true
              menuItem.isRole = true
              moduleItem.isRole = true
            }
            if (rolePermission.value.includes(+permissionItem.id)) {
              menuItem.checkPermission.push(permissionItem.id)
            }
          })
          menuItem.setAll = menuItem.checkPermission.length === menuItem.permission.length
          menuItem.isIndeterminate = Boolean(menuItem.checkPermission.length && !menuItem.setAll)
          if (menuItem.setAll) {
            moduleItem.checkMenu.push(menuItem)
          }
        })
        moduleItem.setAll = moduleItem.checkMenu.length === moduleItem.menu.length
        moduleItem.isIndeterminate = Boolean(moduleItem.checkMenu.length && !moduleItem.setAll)
      })
      loading.value = false
    }

    // 权限变化重置
    watch(
      hasPermission,
      () => {
        if (firstShow.value && jurisdictionList.value.length) {
          initializeData()
        }
      }
    )

    /** 获取全部权限 */
    const getJurisdictionList = async () => {
      const data = await StaffApi.getJurisdictionList()
      jurisdictionList.value = JSON.parse(JSON.stringify(data))
      if (firstShow.value) { initializeData() }
    }
    getJurisdictionList()

    /** 更新父级权限 */
    const updateParent = () => {
      let updateData: number[] = []
      jurisdictionList.value.forEach(moduleItem => {
        moduleItem.menu.forEach(menuItem => {
          updateData = [...updateData, ...menuItem.checkPermission]
        })
      })
      firstShow.value = false
      emit('update:hasPermission', updateData)
    }


    /** 选中权限信息 */
    const handlePermission = (menuItem: StaffApi.IMenuItem, moduleItem: StaffApi.IModuleItem) => {
      const checkedCount = menuItem.checkPermission.length
      menuItem.setAll = checkedCount === menuItem.permission.length
      menuItem.isIndeterminate = checkedCount > 0 && checkedCount < menuItem.permission.length
      if (menuItem.setAll) {
        moduleItem.checkMenu.push(menuItem)
      } else {
        for (const index in moduleItem.checkMenu) {
          if (+menuItem.id === +moduleItem.checkMenu[index].id) {
            moduleItem.checkMenu.splice(Number(index), 1)
          }
        }
      }
      moduleItem.setAll = moduleItem.checkMenu.length === moduleItem.menu.length
      if (moduleItem.setAll) {
        moduleItem.isIndeterminate = false
      } else {
        moduleItem.isIndeterminate = moduleItem.menu.some(item => item.isIndeterminate !== item.setAll)
      }
      updateParent()
    }

    /** 选中菜单对应权限 */
    const checkMenuAllPermission = (menuItem: StaffApi.IMenuItem, moduleItem: StaffApi.IModuleItem) => {
      if (menuItem.setAll) {
        moduleItem.checkMenu.push(menuItem)
      } else {
        for (const index in moduleItem.checkMenu) {
          if (menuItem.id === moduleItem.checkMenu[index].id) {
            moduleItem.checkMenu.splice(Number(index), 1)
          }
        }
      }
      const selectPermission = menuItem.permission.map(item => item.id)
      menuItem.checkPermission = menuItem.setAll ? selectPermission : []
      menuItem.isIndeterminate = false
      moduleItem.setAll = moduleItem.checkMenu.length === moduleItem.menu.length
      if (moduleItem.setAll) {
        moduleItem.isIndeterminate = false
      } else {
        moduleItem.isIndeterminate = moduleItem.menu.some(item => item.isIndeterminate !== item.setAll)
      }
      updateParent()
    }

    /** 选择模块全部权限 */
    const checkModulePermission = (moduleItem: StaffApi.IModuleItem) => {
      if (moduleItem.setAll) {
        for (const skillObj of moduleItem.menu) {
          skillObj.setAll = true
          skillObj.isIndeterminate = false
          skillObj.checkPermission = skillObj.permission.map(item => item.id)
        }
        moduleItem.checkMenu = [...moduleItem.menu]
      } else {
        for (const skillObj of moduleItem.menu) {
          skillObj.setAll = false
          skillObj.checkPermission = []
        }
        moduleItem.checkMenu = []
      }
      moduleItem.isIndeterminate = false
      updateParent()
    }

    return {
      loading, firstShow,
      jurisdictionList,
      initializeData, updateParent,
      handlePermission, checkMenuAllPermission, checkModulePermission
    }
  },
})
</script>

<style lang="less" scoped>
.jurisdiction {
  width: calc(100% - 100px);
  min-height: 100px;

  .module-box {
    .module-header {
      width: 100%;
      padding: 10px;
      background-color: #eee;
    }

    .menu-box {
      display: grid;
      grid-template-columns: 200px 4fr;
      grid-column-gap: 1px;
      align-items: center;
      background-color: #333;
      border-bottom: 1px solid #333;

      .menu-header {
        display: flex;
        height: 100%;
        padding: 10px;
        background-color: #fff;
      }

      .permission-box {
        display: flex;
        flex-wrap: wrap;
        height: 100%;
        background-color: #fff;

        .permission-name {
          padding: 10px;
          margin-right: 10px;

          .el-checkbox__input {
            margin: 4px;
            vertical-align: top;
          }

          .el-checkbox__label {
            width: 100%;
            white-space: normal;
          }
        }
      }
    }
  }
}
</style>
