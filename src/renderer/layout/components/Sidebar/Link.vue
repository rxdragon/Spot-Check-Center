<template>
  <!-- eslint-disable vue/require-component-is -->
  <a
    v-if="isExternalLink"
    rel="noopener"
    :href="to"
    target="_blank"
  >
    <slot />
  </a>
  <router-link v-else :to="to">
    <slot />
  </router-link>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue'
import { isExternal } from '@/utils/validate'

export default defineComponent({
  props: {
    to: { type: String, required: true }
  },
  setup (props) {
    const { to } = toRefs(props)
    const isExternalLink = computed(() => {
      const url = to.value
      return isExternal(url)
    })
    return { isExternalLink }
  }
})
</script>
