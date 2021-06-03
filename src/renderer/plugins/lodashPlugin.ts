import get from 'lodash/get'
import sortBy from 'lodash/sortBy'

export function setupLodashPlugin (): void {
  window._ = { get, sortBy }
}
