import axios from '@/plugins/axios'

interface IProductSelect {
  label: string
  value: string | number
}

interface IFilterRetouchStandardData {
  value: string
  label: string
  children: IProductSelect[]
}

/**
 * @description 过滤修图信息
 * @param {*} data 
 * @returns 
 */
function filterRetouchStandard (data:any) {
  let createData: IFilterRetouchStandardData[] = [
    {
      value: 'blue',
      label: '蓝标',
      children: []
    }, {
      value: 'master',
      label: '大师',
      children: []
    }, {
      value: 'kids',
      label: 'kids',
      children: []
    }, {
      value: 'mainto',
      label: '缦图',
      children: []
    }
  ]
  data.forEach((productItem: any) => {
    // eslint-disable-next-line max-len
    const findType: IFilterRetouchStandardData | undefined = createData.find((typeItem: IFilterRetouchStandardData) => {
      return typeItem.value === productItem.retouch_standard
    })
    if (findType) {
      findType.children.push({
        label: productItem.name,
        value: productItem.id
      })
    }
  })
  createData = createData.filter((item: IFilterRetouchStandardData) => item.children.length)
  return createData
}


interface ProductParams {
  rootId: number
  withProduct: boolean
  showPicProduct: boolean
  himoProduct: boolean
}

/**
 * @description 获取分类产品树
 * @param {*} params 
 * @returns 
 */
export async function getClassificationProductTree (params:ProductParams) {
  const res: any = await axios({
    url: '/project_cloud/common/getProductCategoryTree',
    method: 'GET',
    params
  })

  const createData = res.map((parentItem: any)=> {
    const children = _.get(parentItem, 'children') || []
    const children1Data = children.map((childrenItem: any) => {
      const productList = childrenItem.products || []
      const filterProductList = filterRetouchStandard(productList)

      const childrenData = {
        label: childrenItem.name,
        value: `c-${childrenItem.id}`,
        parentId: `c-${childrenItem.parent_id}`,
        children: filterProductList,
        productCount: productList.length
      }
      return childrenData
    })
    const filterEmtpyProduct = children1Data.filter((item: any) => item.children.length)

    const parentData = {
      label: parentItem.name,
      value: `p-${parentItem.id}`,
      parentId: `p-${parentItem.parent_id}`,
      children: filterEmtpyProduct
    }
    return parentData
  })
  let filterEmtpyClass = createData.filter((item: any) => item.children.length)
  // 过滤修修兽类型
  if (!params.showPicProduct) {
    filterEmtpyClass = filterEmtpyClass.filter((item: any) => item.label !== '修修兽')
  }
  if (!params.himoProduct) {
    filterEmtpyClass = filterEmtpyClass.filter((item: any) => item.label !== '海马体')
  }
  return Object.freeze(filterEmtpyClass)
}
