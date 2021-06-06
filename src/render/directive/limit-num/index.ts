
function getMinMaxNumer (dom: any) {
  const min = Number(dom.min)
  const max = Number(dom.max)
  if (!dom.value) return false
  if (min && dom.value < min) {
    dom.value = min
    return true
  }
  if (max && dom.value > max) {
    dom.value = max
    return true
  }
  return false
}

export default {
  beforeUpdate: function (el:any) {
    el.addEventListener('keyup', () => {
      const reg = /^[0-9]*$/g
      const reg2 = /[0-9]+/g
      const has = !reg.test(el.value)
      if (el.__vue__) {
        el.__vue__.isComposing = false
      }
      if (has) {
        const regArr = reg2.exec(el.value)
        const trueText = regArr ? regArr[0] : ''
        el.value = trueText
        getMinMaxNumer(el)
        el.dispatchEvent(new Event('input'))
      } else {
        if (getMinMaxNumer(el)) {
          el.dispatchEvent(new Event('input'))
        }
      }
    })
  }
}

