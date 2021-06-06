<template>
  <div class="product-select">
    <el-cascader
      v-bind="$attrs"
      :options="options"
      :props="deafultProps"
      :disabled="loading"
      collapse-tags
      placeholder="请选择产品"
      filterable
      clearable
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
import { defineComponent, inject, reactive, ref } from 'vue'
import * as ProductClassificationApi from '@/api/productClassificationApi'

export default defineComponent({
  name: 'ProductSelect',
  props: {
    showPicProduct: { type: Boolean },
    himoProduct: { type: Boolean },
    familyProduct: { type: Boolean }
  },
  setup (props) {
    const type = inject('type', '')

    /** 组件基本属性 */
    const deafultProps = reactive({
      multiple: true,
      emitPath: false
    })


    /** 获取全部产品 */
    const options = ref([])
    const loading = ref(true)
    async function getAllProduct () {
      const req = {
        rootId: 0,
        withProduct: true,
        showPicProduct: props.showPicProduct,
        himoProduct: props.himoProduct,
        familyProduct: props.familyProduct
      }
      const list = await ProductClassificationApi.getClassificationProductTree(req)
      options.value = list
      loading.value = false
    }
    getAllProduct()


    return {
      props,
      deafultProps,
      type,
      loading, options
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
