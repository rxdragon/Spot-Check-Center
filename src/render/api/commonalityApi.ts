import axios from '@/plugins/axios'

/**
 * @description 获取七牛云接口
 * @param {*} params
 */
export async function getSignature () {
  const res = await axios({
    url: '/project_cloud/photoManager/getUploadToken',
    method: 'GET'
  })
  const createData = {
    token: res
  }
  return createData
}

/**
 * @description 获取门店小伙伴级联树
 */
interface IGetStoreStaffTreeParams {
  needDelete?: boolean
}
interface IStaffItem {
  label: string
  value: idType
}
export interface ICascaderSelect {
  label: string
  value: idType
  children: IStaffItem[]
}
export async function getStoreStaffTree (params: IGetStoreStaffTreeParams) {
  // TODO: cf 优化，将数据存储在sesssion内
  const res: any = await axios({
    url: '/project_photo_quality/common/getStoreStaffTree',
    method: 'GET',
    params
  })
  const createData: ICascaderSelect[] = res.map((storeItem: any) => {
    const storeChildren: ICascaderSelect[] = storeItem.children.map((staffItem: any) => {
      return {
        label: staffItem.name,
        value: staffItem.id,
      }
    })
    const storeData = {
      label: storeItem.name,
      value: storeItem.id,
      children: storeChildren
    }
    return storeData
  })
  return createData
}

/**
 * @description 获取职位分类下的伙伴
 * @param params 
 * @returns 
 */
export async function getPositionStaffs () {
  // TODO: cf 优化，将数据存储在sesssion内
  const res: any = await axios({
    url: '/project_photo_quality/common/getPositionStaffs',
    method: 'GET',
  })

  const createData: ICascaderSelect[] = res.map((storeItem: any) => {
    const storeChildren: ICascaderSelect[] = storeItem.children.map((staffItem: any) => {
      return {
        label: staffItem.name,
        value: staffItem.id,
      }
    })
    const storeData = {
      label: storeItem.name,
      value: storeItem.id,
      children: storeChildren
    }
    return storeData
  })
  return createData
}
