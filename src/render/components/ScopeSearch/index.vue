<template>
  <div class="scope-search" @mouseenter="handleMouseEnter" @mouseleave="showClose = false">
    <input
      v-model="startInput"
      v-numberOnly
      type="text"
      class="range-input"
      :min="0"
      :max="100"
      :placeholder="startPlaceholder"
      @change="handleChange"
    >
    <span class="range-separator">~</span>
    <input
      v-model="endInput"
      v-numberOnly
      type="text"
      class="range-input"
      :min="0"
      :max="100"
      :placeholder="endPlaceholder"
      @change="handleChange"
    >
    <i
      :class="{
        'el-icon-circle-close': showClose
      }"
      class="input__icon range__close-icon"
      @click="handleClickIcon"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRefs } from 'vue'
export default defineComponent({
  name: 'ScopeSearch',
  props: {
    startPlaceholder: { type: String, default: '请输入' },
    endPlaceholder: { type: String, default: '请输入' },
    modelValue: { type: Array, default: () => [] }
  },
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    const startInput = ref('')
    const endInput = ref('')
    const showClose = ref(false)

    const { modelValue } = toRefs(props)

    /** 初始化范围值 */
    if (Array.isArray(modelValue.value)) {
      startInput.value = modelValue.value[0]
      endInput.value = modelValue.value[1]
    }

    // 是否是空数组或者空字段
    const valueIsEmpty = computed(() => {
      const val = props.modelValue
      if (Array.isArray(val)) {
        for (let i = 0, len = val.length; i < len; i++) {
          if (val[i]) return false
        }
      } else {
        if (val) return false
      }
      return true
    })

    const handleClickIcon = () => {
      if (showClose.value) {
        startInput.value = ''
        endInput.value = ''
        emit('update:modelValue', undefined)
      }
    }

    const handleMouseEnter = () => {
      if (!valueIsEmpty.value) {
        showClose.value = true
      }
    }

    const startNum = computed(() => startInput.value ? Number(startInput.value) : '')
    const endNum = computed(() => endInput.value ? Number(endInput.value) : '')

    const handleChange = () => {
      if (!startInput.value) startInput.value = '0'
      if (!endInput.value) endInput.value = '100'
      if (startNum.value > endNum.value) endInput.value = startInput.value
      const data = [startNum.value, endNum.value]
      emit('update:modelValue', data)
    }

    return {
      valueIsEmpty,
      startInput, endInput, showClose,
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
