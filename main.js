const path = require('path')
const { genImages } = require('./lib/makeImgs')
const { genVideo } = require('./lib/makeVideo')

async function main (title, desc, list) {
  const imgs = await genImages(title, desc, list)
  console.log('log => : main -> imgs', imgs)
  genVideo(imgs)
}

const fileList = [
  // path.resolve(__dirname, './i/1.png'),
  // path.resolve(__dirname, './i/2.png'),
  // path.resolve(__dirname, './i/img_1.jpg'),
  // path.resolve(__dirname, './i/img_2.jpg'),
  // path.resolve(__dirname, './i/img_5.jpg'),
  // path.resolve(__dirname, './i/img_3.jpg'),
  '/Users/arley/Coding/nodejs/imgs2video-up-douyin/project/壁纸视频生成_07-04/home_page_render.png',
  '/Users/arley/Coding/nodejs/imgs2video-up-douyin/project/壁纸视频生成_07-04/img_page_render_1.png',
  '/Users/arley/Coding/nodejs/imgs2video-up-douyin/project/壁纸视频生成_07-04/img_page_render_2.png',
  '/Users/arley/Coding/nodejs/imgs2video-up-douyin/project/壁纸视频生成_07-04/img_page_render_3.png',
  '/Users/arley/Coding/nodejs/imgs2video-up-douyin/project/壁纸视频生成_07-04/img_page_render_4.png',
  '/Users/arley/Coding/nodejs/imgs2video-up-douyin/project/壁纸视频生成_07-04/img_page_render_5.png',
  '/Users/arley/Coding/nodejs/imgs2video-up-douyin/project/壁纸视频生成_07-04/img_page_render_6.png'

]
main('壁纸视频生成', '很牛逼有没有', fileList)
