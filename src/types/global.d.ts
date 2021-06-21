declare namespace NodeJS {
    import BrowserWindow = Electron.BrowserWindow

    interface configType {
        configUrl?: string
        microApi?: string
    }

    interface Global {
        launcherVersion: string
        launcher: any
        isDevelopment: boolean
        isServer: boolean
        isInSingleMode: boolean
        isTest: boolean
        env: string
        currentVersion: string
        successInit: boolean
        userDir: string
        emit: EventEmitter
        staticDir: string
        launcherStaticDir: string
        config: configType | Record<string, string>
        hasLocalConfig: boolean
        localServePort: number
    }

    interface process {
        env: {
            VUE_APP_BASE_API: string
            VUE_APP_LOGIN_API: string
            VUE_APP_DOMAIN: string
            VUE_APP_COMPRESS_DOMAIN: string
        }
    }
}

declare const __static: string
