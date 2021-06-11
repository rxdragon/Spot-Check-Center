<template>
  <div class="edit-account">
    <teleport to="#fakeTitle">
      <div class="fake-title">{{ editType === EDIT_TYPE.EDIT ? '编辑' : '新增' }}账号</div>
    </teleport>
    <el-button @click="closeEditPage">关闭</el-button>
    编辑账号{{ editStaffId }}
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
  name: 'EditAccount',
  props: {
    modelValue: { type: Boolean, required: true },
    editType: { type: String as PropType<EDIT_TYPE>, required: true },
    editStaffId: { type: String as PropType<string | number>, default: '' }
  },
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    const closeEditPage = () => {
      emit('update:modelValue', false)
    }

    return {
      closeEditPage,
      EDIT_TYPE
    }
  }
})
</script>

<style lang="less" scoped>
.fake-title {
  background-color: #f0f2f5;
}
</style>
