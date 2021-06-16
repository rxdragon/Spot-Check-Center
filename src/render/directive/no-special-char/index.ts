
export default {
  beforeMount: function (el: any) {
    el.addEventListener('input', (event: any) => {
      let reg
      if (event.isComposing) {
        reg = /[`~!@¥#$%^&*()_\-+=<>?:"{}|,./;\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/g
      } else {
        reg = /[\s`~!@¥#$%^&*()_\-+=<>?:"{}|,./;\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/g
      }

      const val = event.target.value
      const has = reg.test(val)
      if (has) {
        const trueText = val.replace(reg, '')
        el.children[0].value = trueText
        el.children[0].dispatchEvent(new Event('input'))
      }
    })
  }
}
