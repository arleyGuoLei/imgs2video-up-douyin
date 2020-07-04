const path = require('path')
const { genImages } = require('./lib/makeImgs')
const { genVideo } = require('./lib/makeVideo')
const { createProjectDir, dateFormat } = require('./lib/utils')

const fileList = [
  // path.resolve(__dirname, './i/1.png'),
  // path.resolve(__dirname, './i/2.png'),
  // path.resolve(__dirname, './i/img_1.jpg'),
  // path.resolve(__dirname, './i/img_2.jpg'),
  // path.resolve(__dirname, './i/img_5.jpg'),
  // path.resolve(__dirname, './i/img_3.jpg'),
]

async function main (title, desc, list, date = dateFormat('mm-dd')) {
  const dir = createProjectDir(path.resolve(__dirname, `./project/${title}_${date}`))
  const imgs = await genImages(title, desc, list, dir)
  const video = await genVideo(imgs, dir)
  console.log('log => : main -> video', video)
}

main('壁纸视频生成', '很牛逼有没有', fileList)
