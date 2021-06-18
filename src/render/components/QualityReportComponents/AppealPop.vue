
<template>
  <!-- TODO lj -->
  <el-dialog
    v-bind="$attrs"
    title="我要申诉"
    width="500px"
    :show-close="false"
    :center="true"
  >
    <el-row class="mb-2">
      <el-col class="font-bold" :span="24">
        分数：{{ tagInfo.totalScore }}
      </el-col>
    </el-row>
    <el-row class="mb-2">
      <el-col class="font-bold" :span="24">
        勾选需要申诉的标签
      </el-col>
    </el-row>
    <el-row class="mb-2">
      <el-checkbox-group v-model="appealContent">
        <el-col v-for="item in tagInfo.tags" :key="item.id" :span="8">
          <el-checkbox :label="item.name">{{ item.name }}</el-checkbox>
        </el-col>
      </el-checkbox-group>
    </el-row>
    <el-row class="mb-2">
      <el-col class="font-bold" :span="24">
        填写申诉原因(必填)
      </el-col>
    </el-row>
    <el-row class="mb-2">
      <el-col class="font-bold" :span="24">
        <el-input
          v-model="appealNote"
          type="textarea"
          placeholder="最多200个字符"
          maxlength="200"
          show-word-limit
          rows="4"
          resize="none"
        />
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24"><div class="grid-content bg-purple-dark" /></el-col>
    </el-row>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">
          <p class="w-20">取消</p>
        </el-button>
        <el-button type="primary" @click="submitAppeal">
          <p class="w-20">提交申诉</p>
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, computed, ref, inject } from 'vue'
import * as AppealApi from '@/api/appealApi'
import { newMessage } from '@/utils/message'
import { useRoute } from 'vue-router'
import { useStore } from '@/store/index'
import { ORGANIZATION_TYPE } from '@/model/Enumerate'

export default defineComponent({
  name: 'AppealPop',
  props: {
    appealInfo: { type: String, default: '' }
  },
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    const store = useStore()
    const route = useRoute()
    const organizationType = inject('organizationType') as ORGANIZATION_TYPE

    const tagInfo = computed(() => {
      return JSON.parse(props.appealInfo)
    })

    const closeDialog = () => {
      emit('update:modelValue', false)
    }

    /**
     * 申诉表单相关
    */
    const appealNote = ref('')
    const appealContent = ref([])

    /**
     * @description 提交申诉
    */
    const submitAppeal = async () => {
      if (appealContent.value.length === 0 || appealNote.value === '') return newMessage.warning('请完善申诉信息')
      const req = {
        serviceType: '',
        serviceId: tagInfo.value.id,
        appealContent: appealContent.value,
        note: appealNote.value,
      }
      try {
        store.dispatch('settingStore/showLoading', route.name)
        await AppealApi.createAppeal(req, organizationType)
        newMessage.success('申诉成功')
        closeDialog()
      } finally {
        store.dispatch('settingStore/hiddenLoading', route.name)
      }
    }

    return {
      tagInfo,
      appealNote,
      appealContent,
      closeDialog,
      submitAppeal
    }
  }
})
</script>
