/**
 * @description 下载器单例模式
 */
export default class ElectronDown {
  private static instance: ElectronDown

  waitDownloadList: any[] // 待下载队列
  downingLoadList: any[] // 正在下载队列
  downloadList: Record<string, any> // 全部队列信息

  private constructor () {
    this.waitDownloadList = []
    this.downingLoadList = []
    this.downloadList = {}
  }

  // 获取实例
  public static getInstance (): ElectronDown {
    if (!ElectronDown.instance) {
      ElectronDown.instance = new ElectronDown()
    }
    return ElectronDown.instance
  }
}
