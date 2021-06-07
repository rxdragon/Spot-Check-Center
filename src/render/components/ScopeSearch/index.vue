<template>
  <div class="scope-search" @mouseenter="handleMouseEnter" @mouseleave="componentData.showClose = false">
    <input
      v-model="componentData.startInput"
      v-numberOnly
      type="text"
      class="range-input"
      :min="0"
      :max="100"
      :placeholder="props.startPlaceholder"
      @change="handleChange"
    >
    <span class="range-separator">~</span>
    <input
      v-model="componentData.endInput"
      v-numberOnly
      type="text"
      class="range-input"
      :min="0"
      :max="100"
      :placeholder="props.endPlaceholder"
      @change="handleChange"
    >
    <i
      :class="[componentData.showClose ? '' + 'el-icon-circle-close' : '']"
      class="input__icon range__close-icon"
      @click="handleClickIcon"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from 'vue'
export default defineComponent({
  name: 'ScopeSearch',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    startPlaceholder: { type: String, default: '请输入' },
    endPlaceholder: { type: String, default: '请输入' },
    value: { type: Array, default: () => [] }
  },
  setup (props) {
    const componentData = reactive({
      showClose: false,
      startInput: '',
      endInput: ''
    })

    const valueIsEmpty = computed(() => {
      const val = props.value
      if (Array.isArray(val)) {
        for (let i = 0, len = val.length; i < len; i++) {
          if (val[i]) return false
        }
      } else {
        if (val) return false
      }
      return true
    })

    /** nxnn */
    const handleClickIcon = () => {
      if (componentData.showClose) {
        componentData.startInput = ''
        componentData.endInput = ''
        // emit('change', null)
      }
    }
    const handleMouseEnter = () => {
      if (!valueIsEmpty.value) {
        componentData.showClose = true
      }
    }

    /** sadasd */
    // TODO
    const handleChange = () => {
      // const data = [componentData.startInput || '', componentData.endInput || '']
      // emit('change', data)
    }

    return {
      props,
      componentData,
      valueIsEmpty,
      handleClickIcon,
      handleMouseEnter,
      handleChange
    }
  }
})
</script>

<style lang="less" scoped>
.scope-search {
  -webkit-appearance: none;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 40px;
  padding: 3px 10px;
  font-size: inherit;
  line-height: 40px;
  color: #606266;
  background-color: #fff;
  background-image: none;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  outline: 0;
  -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);

  .range-input {
    display: inline-block;
    width: 40%;
    height: 100%;
    padding: 0;
    -webkit-appearance: none;
    margin: 0;
    font-size: 14px;
    line-height: 1;
    -moz-appearance: none;
    color: #606266;
    appearance: none;
    text-align: center;
    border: none;
    outline: 0;

    &::placeholder {
      color: #c7cad1;
    }
  }

  .range-separator {
    flex-shrink: 0;
    width: 5%;
    line-height: 32px;
    color: #303133;
  }

  .el-icon-circle-close {
    cursor: pointer;
  }

  .range__close-icon {
    display: inline-block;
    float: right;
    width: 25px;
    font-size: 14px;
    line-height: 32px;
    color: #c0c4cc;
  }
}
</style>
