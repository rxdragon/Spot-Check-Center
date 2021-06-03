<template>
  <div class="date-picker">
    <el-date-picker
      :type="type"
      :format="valueFormat"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :disabled-date="disabledDate"
      v-bind="$attrs"
    />
  </div>
</template>


<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DatePicker',
  props: {
    type: { type: String, default: 'daterange' },
    valueFormat: { type: String, default: 'YYYY-MM-DD' },
    shortcuts: { type: Boolean },
    future: { type: Boolean }
  },
  data () {
    const shortcutsData: Record<string, any>[] = []
    return {
      shortcutsData
    }
  },
  created () {
    // 快捷方式
    if (this.shortcuts) {
      this.shortcutsData = [{
        text: '最近一周',
        value: (() => {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
          return [start, end]
        })(),
      }, {
        text: '最近一个月',
        value: (() => {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
          return [start, end]
        })(),
      }, {
        text: '最近三个月',
        value: (() => {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
          return [start, end]
        })(),
      }]
    }
  },
  methods: {
    disabledDate (time: Date) {
      // 是否可以选后面的日子
      if (this.future) {
        return time.getTime() < Date.now()
      }
      return time.getTime() > Date.now()
    }
  }
})
</script>

<style lang="less">
.date-picker {
  .el-date-editor {
    .el-range-separator {
      flex-shrink: 0;
      width: max-content;
      padding: 0;
    }
  }

  .el-range-editor.el-input__inner {
    width: 300px;
  }
}
</style>
