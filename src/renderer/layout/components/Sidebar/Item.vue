<script lang="ts">
import { h, defineComponent } from 'vue'

export default defineComponent({
  name: 'Item',
  functional: true,
  props: {
    icon: { type: String, default: '' },
    title: { type: String, default: '' }
  },
  render () {
    const vnodes = []

    if (this.icon) {
      vnodes.push(h('i', { class: this.icon }, ''))
    }

    if (this.title) {
      vnodes.push(h('span', { slot: 'title' }, this.title))
    }
    return vnodes
  }
})
</script>
