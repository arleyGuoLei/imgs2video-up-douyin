const videoshow = require('videoshow')

const videoOptions = {
  fps: 30,
  loop: 2.3,
  videoBitrate: 3000,
  videoCodec: 'libx264',
  size: '720x?',
  aspect: '9:16',
  autopad: '#000000',
  format: 'mp4',
  transition: true,
  transitionDuration: 0.3
}

function main (images) {
  videoshow(images, videoOptions)
    .save('video.mp4')
    .on('start', (command) => {
      console.log('ffmpeg process started:', command)
    })
    .on('error', (err, stdout, stderr) => {
      console.error('Error:', err)
      console.error('ffmpeg stderr:', stderr)
    })
    .on('end', (output) => {
      console.error('Video created in:', output)
    })
}

module.exports = {
  genVideo: main
}
