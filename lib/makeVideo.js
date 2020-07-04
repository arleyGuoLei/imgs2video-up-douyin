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
