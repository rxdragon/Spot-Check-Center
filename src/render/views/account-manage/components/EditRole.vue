<template>
  <div class="edit-role">
    <teleport to="#fakeTitle">
      <div class="fake-title">{{ editType === EDIT_TYPE.EDIT ? '编辑' : '新增' }}账号</div>
    </teleport>
    <teleport to="#headerContent">
      <el-button type="primary" plain @click="closeEditPage">返回</el-button>
    </teleport>

    编辑角色组 {{ editRoleId }}
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
/* eslint-disable no-unused-vars */
export enum EDIT_TYPE {
  EDIT = 'edit',
  ADD = 'add'
}

export default defineComponent({
  name: 'EditRole',
  props: {
    modelValue: { type: Boolean, required: true },
    editType: { type: String as PropType<EDIT_TYPE>, required: true },
    editRoleId: { type: [String, Number], default: '' }
  },
  emits: ['update:modelValue'],
  setup (props, { emit }) {

    /** 返回上一层 */
    const closeEditPage = () => {
      emit('update:modelValue', false)
    }

    return {
      EDIT_TYPE,
      closeEditPage
    }
  }
})
</script>

<style lang="less" scoped>
.fake-title {
  background-color: #f0f2f5;
}
</style>
