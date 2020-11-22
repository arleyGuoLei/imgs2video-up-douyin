# 壁纸图片自动生成演示视频

演示视频：`#潮图 #程序员 #自动化 以后一直更新壁纸潮图，开发了一套图片全自动生成视频程序，看看程序员的日常吧～  https://v.douyin.com/Jx8T3Wg/ 复制此链接，打开抖音搜索，直接观看视频`

[images/home-page.png - 首屏模板图](./images/home-page.png)

[images/img-page.png - 内容模板图](./images/img-page.png)

`project`目录下有一些生成好的例子，可以做参考 ~

掘金解析：[https://juejin.cn/post/6897484762982645767](https://juejin.cn/post/6897484762982645767)

## 前言

因为开发了一个“抖音”上用于下载视频里面提到的图片素材的小程序，为了不断**生产视频**，所以又开发了此视频生成工具。来一起品品吧 ~ 项目开源

### 例子

- 1. 首先需要找到几张壁纸图片，如下图(4张)：

![四张素材图片](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a68965e97d754315b13de754c3eb2555~tplv-k3u1fbpfcp-watermark.image)

- 2. 使用`sketch`大概设计两个模板文件，一个用于做视频首页，一个用于对图片素材进行封装。

sketch设计稿：

![sketch设计稿](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/07b7e21853ac4c6facc0abe29bf9b8b6~tplv-k3u1fbpfcp-watermark.image)

导出的**空白的模板素材**：

![空白的模板素材](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2425e474860040b29a587959fbd95c25~tplv-k3u1fbpfcp-watermark.image)

- 3. 运行代码脚本，进行生成 ~

![代码执行流程](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/20d25bca472e414dba58edf48847440c~tplv-k3u1fbpfcp-watermark.image)

- 4. 生成效果预览

生成的**图片**素材：

![生成的图片](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ab24f432e0254911b418939a7e1cd9c3~tplv-k3u1fbpfcp-watermark.image)

生成的带切换效果、BGM的**视频**：

![带切换效果的视频](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2155add6f639483d9c1fb6b89744bc21~tplv-k3u1fbpfcp-watermark.image)

### 开源地址

项目开源：[https://github.com/arleyGuoLei/imgs2video-up-douyin](https://github.com/arleyGuoLei/imgs2video-up-douyin)

## 技术解析

### 目录解析

```
├── README.md
├── fonts # 视频、图片字体素材
|  ├── chinese-pangMenZhengDao.ttf
|  └── wenyihei.ttf
├── images # 模板图片
|  ├── card.svg
|  ├── home-page-old-font.png
|  ├── home-page.png
|  ├── home-page_nodown.png
|  └── img-page.png
├── lib # 代码
|  ├── makeImgs.js # 生成图片
|  ├── makeVideo.js # 图片生成视频
|  └── utils.js # 工具函数
├── main.js # 入口主函数
├── package-lock.json
├── package.json
└── 壁纸视频.sketch # 设计稿
```

### main入口

```js
const path = require('path')
const fs = require('fs')
const rd = require('rd')
const exec = require('child_process').exec
const { genImages } = require('./lib/makeImgs') // 生成图片
const { genVideo } = require('./lib/makeVideo') // 生成视频
const { createProjectDir, dateFormat } = require('./lib/utils')

const dir = '粉色桌面壁纸'
const title = dir
const desc = '粉色桌布，清新治愈 ~'

//  -------------

const source = './files/'
const dist = './project/'

const fileList = []
rd.eachFileFilterSync(path.resolve(__dirname, `${source}${dir}/`), /\.(jpg|png|jpeg|bmp)$/, function (f, s) {
  fileList.push(f)
})

function copyImg (dir) {
  const copyToDir = '/source'
  fs.mkdirSync(`${dir}${copyToDir}`)
  fileList.forEach(from => {
    const to = dir + copyToDir + '/' + path.basename(from)
    fs.copyFileSync(from, `${to}`)
  })
}

// 主要看此函数流程 ~
async function main (title, desc, list, date = dateFormat('mm-dd')) {
  const dir = createProjectDir(path.resolve(__dirname, `${dist}${title}_${date}`)) // 1. 创建素材生成保存的目录
  const imgs = await genImages(title, desc, list, dir) // 2. 生成图片，返回图片路径
  const video = await genVideo(imgs, dir) // 3. 根据图片，生成转换为视频
  console.log('log => : main -> video', video)
  exec(`open ${dir}`) // 4. 打开生成好的目录
  copyImg(dir) // 5. 保存一下源文件素材
}

main(title, desc, fileList)

```

### genImages

根据模板和自己准备好的图片素材，生成`圆角`、`大小剪切`、`套上模板`后的图片素材。

使用`gm`进行图片后期自动处理 ↓

```js
const fs = require('fs')
const path = require('path')
const gm = require('gm') // 用到了gm
const { dateFormat } = require('./utils')

const HOME_PAGE = path.resolve(__dirname, './../images/home-page.png')
const IMAGE_PAGE = path.resolve(__dirname, './../images/img-page.png')
const CARD_SVG = path.resolve(__dirname, './../images/card.svg')
const SAVE_HOME_FILE_NAME = 'home_page_render.png'

// 封面图处理
function makeHomePage (number, title, desc, dir, date) {
  return new Promise((resolve, reject) => {
    const outPut = `${dir}/${SAVE_HOME_FILE_NAME}`
    gm(HOME_PAGE)
      .font(path.resolve(__dirname, './../fonts/chinese-pangMenZhengDao.ttf'))
      .fontSize(150)
      .fill('#FF7D26')
      .drawText(1104, 1272, `${number}张`)
      .drawText(0, 210, desc, 'Center')

      .fontSize(180)
      .fill('#FFFFFF')
      .drawText(0, -180, title.length <= 6 ? title.split('').join(' ') : title, 'Center')

      .fontSize(120)
      .fill('#000000')
      .drawText(0, 520, date, 'Center')

      .write(outPut, function (err) {
        if (!err) {
          console.log('up: 生成首页图片')
          resolve(outPut)
        } else { reject(err) }
      })
  })
}

// 后面的圆角图、大小处理
function makeCardImage (file, dir) {
  let _gm = gm(file)
  return new Promise((resolve, reject) => {
    // 获取尺寸
    _gm.size(function (err, size) {
      if (!err) {
        console.log('up: 获取图片尺寸')
        resolve({ isCrop: size.width / size.height <= 0.5625, width: size.width, height: size.height }) // true => 裁剪图片
      }
      reject(err)
    })
  }).then(({ isCrop, width, height }) => {
    // 裁剪、改变图片尺寸
    const pxWidth = 1688
    const originHeight = height / (width / 1688)
    _gm = _gm.resize(pxWidth)
    if (isCrop) {
      height = width / 0.5625 * (pxWidth / width)
      const y = (originHeight - height) / 2 + 168 // 上下平均高度裁剪 + 168
      // console.log('log => : makeCardImage -> y', y)
      _gm = _gm.crop(pxWidth, height, 0, y)
    }
    console.log('up: 裁剪缩放图片')
    return {
      width: pxWidth,
      height
    }
  }).then(({ width, height }) => {
    // 写出裁剪好的图片
    const fileName = file.substring(file.lastIndexOf('/') + 1, file.lastIndexOf('.'))
    const cropPath = `${dir}/tmp_${fileName}_${Math.floor(Math.random() * 100)}.png`
    return new Promise((resolve, reject) => {
      _gm.write(cropPath, function (err) {
        if (!err) {
          resolve({ cropPath, width, height, fileName })
        } else {
          reject(err)
        }
      })
    })
  }).then(({ cropPath, height, width, fileName }) => {
    // 图片转svg，生成圆角
    return new Promise((resolve, reject) => {
      fs.readFile(CARD_SVG, 'utf-8', function (err, data) {
        if (err) throw err
        const svg = data
          .replace(/{{icon_img}}/g, cropPath)
          .replace(/{{height}}/g, height)
          .replace(/{{width}}/g, width)
        const outputSVG = `${cropPath}._.svg`
        fs.writeFile(outputSVG, svg, function (err) {
          const pngPath = `${dir}/card_${fileName}.png`
          if (err) throw err
          gm(outputSVG)
            .write(pngPath, function (err) {
              if (!err) {
                console.log('up: 图片圆角化')
                fs.unlinkSync(outputSVG) // 删除outputSVG文件
                fs.unlinkSync(cropPath) // 删除文件
                resolve(pngPath)
              } else {
                reject(err)
              }
            })
        })
      })
    })
  })
}

// 将图片套进模板
async function makeImagePage (dir, list) {
  const files = []
  for (const [index, file] of Object.entries(list)) {
    const cardFile = await makeCardImage(file, dir)
    const outPut = `${dir}/img_page_render_${index * 1 + 1}.png`
    const oFile = await new Promise((resolve, reject) => {
      gm()
        .in('-page', '+0+0')
        .in(IMAGE_PAGE)
        .in('-page', '+236+600') // 填充图片的位置
        .in(cardFile)
        .mosaic()
        .write(outPut, function (err) {
          if (!err) {
            fs.unlinkSync(cardFile) // 删除cardFile文件
            console.log('up: 生成 => ', outPut)
            resolve(outPut)
          } else {
            reject(err)
          }
        })
    })
    files.push(oFile)
  }
  return files
}

async function main (title, desc, list = [], dir, date = dateFormat('mm-dd')) {
  const homePage = await makeHomePage(list.length, title, desc, dir, date)
  const imgPages = await makeImagePage(dir, list)
  return [
    homePage,
    ...imgPages
  ]
}

module.exports = {
  genImages: main
}

```

### genVideo

使用`videoshow`生成视频(ffmpeg上封装的) ~ 有了上面生成好的图片，接下来就是把图片拼接在一起，生成视频了。

```js
const videoshow = require('videoshow')

const videoOptions = {
  fps: 30,
  transition: true,
  transitionDuration: 0.2,
  videoBitrate: 3000,
  videoCodec: 'libx264',
  size: '720x?',
  aspect: '9:16',
  format: 'mp4',
  pixelFormat: 'yuv420p'
}

function main (images, dir) {
  const imgObj = images.map((img, index) => {
    return {
      path: img,
      loop: index === 0 ? 2 : 2.2,
      disableFadeIn: index === 0,
      disableFadeOut: index === images.length - 1
    }
  })
  return new Promise((resolve, reject) => {
    const outPutPath = `${dir}/render.mp4`
    videoshow(imgObj, videoOptions)
      .save(outPutPath)
      .on('start', function (command) {
        console.log('ffmpeg process started:', command)
      })
      .on('error', function (err, stdout, stderr) {
        console.error('Error:', err)
        console.error('ffmpeg stderr:', stderr)
        reject(err)
      })
      .on('end', function (output) {
        console.error('Video created in:', output)
        resolve(outPutPath)
      })
  })
}

module.exports = {
  genVideo: main
}

```

## 最后

大功告成 ~ 生成并不复杂，库的参数 和 调用函数等的坑较多 ~