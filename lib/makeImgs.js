const fs = require('fs')
const path = require('path')
const gm = require('gm')
const { dateFormat } = require('./utils')

const HOME_PAGE = path.resolve(__dirname, './../images/home-page.png')
const IMAGE_PAGE = path.resolve(__dirname, './../images/img-page.png')
const CARD_SVG = path.resolve(__dirname, './../images/card.svg')
const SAVE_HOME_FILE_NAME = 'home_page_render.png'

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
    _gm = _gm.resize(pxWidth)
    if (isCrop) {
      height = width / 0.5625 * (pxWidth / width)
      _gm = _gm.crop(pxWidth, height)
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
