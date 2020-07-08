const path = require('path')
const rd = require('rd')
const { genImages } = require('./lib/makeImgs')
const { genVideo } = require('./lib/makeVideo')
const { createProjectDir, dateFormat } = require('./lib/utils')

const dir = '7-8小姐姐'

const fileList = []
rd.eachFileFilterSync(path.resolve(__dirname, `./files/${dir}/`), /\.(jpg|png|jpeg|bmp)$/, function (f, s) {
  fileList.push(f)
})

async function main (title, desc, list, date = dateFormat('mm-dd')) {
  const dir = createProjectDir(path.resolve(__dirname, `./project/${title}_${date}`))
  const imgs = await genImages(title, desc, list, dir)
  const video = await genVideo(imgs, dir)
  console.log('log => : main -> video', video)
}

main('未来的女朋友', '每张都是写真!存着不香吗？', fileList)
