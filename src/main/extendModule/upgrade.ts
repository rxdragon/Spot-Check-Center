import { startNewVersionWindow } from "../window/newVersion"


export default class Upgrade {
  isStart: boolean
  checkTime: number
  checkInterval: NodeJS.Timeout | null

  constructor () {
    this.isStart = false
    this.checkTime = 20 * 1000
    this.checkInterval = null
  }

  startUpgradeCheck () {
    if (global.launcher && !this.isStart) {
      this.isStart = true
      this.startCheck()
    }
  }
  
  startCheck () {
    this.checkInterval = setInterval(this.check, this.checkTime)
  }

  async check () {
    try {
      if (await global.launcher.checkHasNewVersion()) {
        if (this.checkInterval) {
          clearInterval(this.checkInterval)
        }

        // 显示启动页面
        await startNewVersionWindow()
      }
    } catch (e) {
      console.error(e)
      // ignore
    }
  }
}
