<template>
  <div class="product-select">
    <el-cascader
      :options="componentData.options"
      :props="propsValue"
      collapse-tags
      v-bind="$attrs"
      :popper-append-to-body="false"
      placeholder="请选择产品"
      filterable
      clearable
      :disabled="!componentData.loadingDown"
    >
      <template #default="{ node, data }">
        <span>{{ data.label }}</span>
        <span v-if="!node.isLeaf && !data.productCount"> ({{ data.children.length }}) </span>
        <span v-if="data.productCount"> ({{ data.productCount }}) </span>
      </template>
    </el-cascader>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, reactive, computed } from 'vue'
import * as ProductClassificationApi from '@/api/productClassificationApi'

export default defineComponent({
  name: 'ProductSelect',
  props: {
    showPicProduct: { type: Boolean, default: true },
    himoProduct: { type: Boolean, default: true }
  },
  setup (props) {
    const type = inject('type')
    const deafultProps = reactive({
      multiple: true,
      emitPath: false
    })
    const componentData = reactive({
      options: [],
      loadingDown: false
    })
    const propsValue = computed(() => Object.assign({}, deafultProps, props))

    getAllProduct()

    /**
    * @description 获取全部产品
    */
    async function getAllProduct () {
      const req = {
        rootId: 0,
        withProduct: true,
        showPicProduct: props.showPicProduct,
        himoProduct: props.himoProduct
      }
      const list: any = await ProductClassificationApi.getClassificationProductTree(req)
      componentData.options = list
      componentData.loadingDown = true
    }
    
    return {
      props,deafultProps,componentData,type,propsValue
    }
  },
})


</script>

<style lang="less">
.product-select {
  width: 100%;

  .el-cascader {
    .el-cascader__tags input {
      font-size: 14px;
    }
  }
}
</style>
