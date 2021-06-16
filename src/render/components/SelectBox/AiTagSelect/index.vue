<template>
  <div class="aiTag-select">
    <el-select v-bind="$attrs" placeholder="请选择Ai标签">
      <el-option
        v-for="(optionItem, optionIndex) in options"
        :key="optionIndex"
        :label="optionItem.label"
        :value="optionItem.value"
      />
    </el-select>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'

export default defineComponent({
  name: 'AiTagSelect',
  setup () {
    
    const options = reactive([{
      label: '全部',
      value: 0
    }, {
      label: '正常',
      value: 'normal'
    }, {
      label: '异常',
      value: 'abnormal'
    }, {
      label: 'AI拒绝审核',
      value: 'AiRefuse'
    }])
    
    return {
      options
    }
  },
})


</script>

<style lang="less">
.aiTag-select {
  width: 100%;
}
</style>
