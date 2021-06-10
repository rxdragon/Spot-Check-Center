
<template>
  <!-- TODO lj -->
  <el-dialog
    v-model="visible"
    title="我要申诉"
    width="500"
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
      <el-col v-for="item in tagInfo.tags" :key="item.id" :span="8">
        <el-checkbox>{{ item.name }}</el-checkbox>
      </el-col>
    </el-row>
    <el-row class="mb-2">
      <el-col class="font-bold" :span="24">
        填写申诉原因(必填)
      </el-col>
    </el-row>
    <el-row class="mb-2">
      <el-col class="font-bold" :span="24">
        <el-input
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
        <el-button @click="switchPop">
          <p class="w-20">取消</p>
        </el-button>
        <el-button type="primary">
          <p class="w-20">提交申诉</p>
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
  props: {
    dialogVisible: { type: Boolean, default: false },
    appealTagInfo: { type: String, default: '' }
  },
  setup (props, { emit }) {
    const visible = computed(() => {
      return props.dialogVisible
    })

    const tagInfo = computed(() => {
      return JSON.parse(props.appealTagInfo)
    })

    const switchPop = () => {
      emit('switchAppealPop')
    }

    return {
      visible,
      tagInfo,
      switchPop,
    }
  }
})
</script>
