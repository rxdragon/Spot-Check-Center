/* eslint-disable no-console */
import express from 'express'
import fs from 'fs'
import path from 'path'
import net from 'net'
import request from 'request'
import { v4 as uuidv4 } from 'uuid'

const exp = express()
const userDir = global.userDir
const imageCachePath = path.join(userDir, 'imageCache')

const MaxFileCount = 200
const clearCacheTime = 60 * 60 * 1000
const isProduction = !global.config['microApi'] && !global.isDevelopment
const cloudPhotoHost = isProduction ? 'cloud.cdn-qn.hzmantu.com/upload/' : 'cloud-dev.cdn-qn.hzmantu.com/upload_dev/'
console.log(cloudPhotoHost, 'cloudPhotoHost')
global.localServePort = 3000


createImageCacheDir()
clearCache()

setInterval(() => {
  clearCache()
}, clearCacheTime)

exp.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  res.header('Access-Control-Allow-Methods', '*')
  res.header('Content-Type', 'application/json;charset=utf-8')
  next()
})

exp.get('/image/*', (req, res, next) => {
  const imageName = path.basename(req.originalUrl)
  const onlineImageUrl = req.originalUrl.replace('/image/', '') // 网络请求地址
  const imageLocalPath = path.join(imageCachePath, imageName) // 本地
  const imageOnlinePath = 'https://' + path.join(cloudPhotoHost, onlineImageUrl)
  // 是否有本地图片
  if (!hasImageCache(imageLocalPath)) {
    downloadFile(imageOnlinePath, imageName, res)
  } else {
    res.download(imageLocalPath)
  }
})

/**
 * @description 流式写入照片
 * @param {*} url
 * @param {*} savePath
 * @param {*} callback
 */
function downloadFile (url: string, imageName: string, res: any) {
  const uuid = uuidv4()
  const temporarySaveName = uuid + '.download'
  const temporarySavePath = path.join(imageCachePath, temporarySaveName)
  const imageLocalPath = path.join(imageCachePath, imageName)
  const writeStream = fs.createWriteStream(temporarySavePath)
  const httpStream = request(url)
  httpStream
    .on('end', () => {
      if (hasImageCache(imageLocalPath)) {
        fs.unlinkSync(temporarySavePath)
      } else {
        fs.rename(temporarySavePath, imageLocalPath, async (err) => {
          if (err) throw err
        })
      }
    })
    .on('error', () => {
      fs.unlinkSync(temporarySavePath)
    })
  httpStream.pipe(writeStream)
  httpStream.pipe(res)
}

/**
 * @description 清除大于文件数量缓存
 */
function clearCache () {
  fs.readdir(imageCachePath, (err, data) => {
    if (err) throw err
    const fileLength = data.length
    if (fileLength > MaxFileCount) {
      data.sort((a, b) => {
        const filePatha = path.join(imageCachePath, a)
        const filePathb = path.join(imageCachePath, b)
        const fileStatCreateTimea = fs.statSync(filePatha).ctimeMs
        const fileStatCreateTimeb = fs.statSync(filePathb).ctimeMs
        return fileStatCreateTimeb - fileStatCreateTimea
      })
      const willDeleteFile = data.slice(MaxFileCount / 2)
      willDeleteFile.forEach(fileName => {
        const deleteFilePath = path.join(imageCachePath, fileName)
        fs.unlinkSync(deleteFilePath)
      })
    }
  })
}

/**
 * @description 创建图片缓存文件夹
 */
function createImageCacheDir () {
  const hasImageCacheDir = fs.existsSync(imageCachePath)
  if (hasImageCacheDir) return
  if (!userDir) return
  fs.mkdir(imageCachePath, { recursive: true }, (err) => {
    if (err) throw err
  })
}

/**
 * @description 判断是否存在图片
 * @param imagePath 
 * @returns 
 */
function hasImageCache (imagePath: string) {
  return fs.existsSync(imagePath)
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
function portIsOccupied (port: number, cb: (err: any, serverPort?: number) => void){
  const server = net.createServer().listen(port)
  server.on('listening',()=>{
    console.log(`the server is running on port ${port}`)
    server.close()
    cb(null, port)
    console.log('port', port)
  })

  server.on('error', (err: any)=> {
    if (err.code === 'EADDRINUSE') {
      portIsOccupied(port + 1, cb)
      console.log(`this port ${port} is occupied.try another.`)
    } else {
      cb(err)
    }
  })

}

portIsOccupied(3000, (err: any, serverPort?: number) => {
  if (!err && serverPort) {
    exp.listen(serverPort, () => {
      global.localServePort = serverPort
      console.log(`link contont localServePort:${serverPort}`)
    })
  }
})
