<template>
  <div class="empty-people-pool">
    <el-dialog
      ref="emptyDig"
      center
      v-bind="$attrs"
      title="清空评分内容"
      custom-class="empty-dialog"
      width="35%"
    >
      <div class="flex items-center">
        <span class="empty-title">选择清空对象:</span>
        <ScorerSelect v-model="emptyPeople" />
        <span v-if="!emptyPeople.length" class="all-empty-warning">默认清空全部人员评分</span>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeDig">取 消</el-button>
          <el-button type="primary" @click="emptyCheckPool">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store/index'

import ScorerSelect from '@SelectBox/ScorerSelect/index.vue'
import * as GradeConfigurationApi from '@/api/gradeConfigurationApi'
import { ORGANIZATION_TYPE, SPOT_TYPE } from '@/model/Enumerate'
import { newMessage } from '~/render/utils/message'

export default defineComponent({
  name: 'EmptyPeoplePool',
  components: { ScorerSelect },
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    const store = useStore()
    const route = useRoute()
    const type = inject('type') as SPOT_TYPE
    const organizationType = inject('organizationType') as ORGANIZATION_TYPE

    /** 关闭窗口 */
    const emptyDig = ref(null)
    const closeDig = () => {
      emit('update:modelValue', false)
    }

    /** 清空评分人 */
    const emptyPeople = ref<number[]>([])
    const emptyCheckPool = async () => {
      try {
        store.dispatch('settingStore/showLoading', route.name)
        const req: GradeConfigurationApi.IEmptyCheckPoolByStaffIdParams = {
          type,
          organizationType
        }
        if (emptyPeople.value.length) req.staffIds = emptyPeople.value
        const res = await GradeConfigurationApi.emptyCheckPoolByStaffId(req)
        res ? newMessage.success('清除成功') : newMessage.error('清除失败')
        emptyPeople.value = []
        closeDig()
      } finally {
        store.dispatch('settingStore/hiddenLoading', route.name)
      }
    }

    return {
      emptyDig,
      closeDig,
      emptyPeople, emptyCheckPool
    }
  }
})
</script>

<style lang="less">
.empty-dialog {
  .el-dialog__body {
    padding: 10px 25px 10px;
  }

  .empty-title {
    margin-right: 12px;
  }

  .all-empty-warning {
    margin-left: 12px;
  }
}
</style>
