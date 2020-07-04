const fs = require('fs')
const path = require('path')

function dateFormat (fmt = 'YYYY-mm-dd HH:MM:SS', date = new Date()) {
  let ret
  const opt = {
    'Y+': date.getFullYear().toString(), // 年
    'm+': (date.getMonth() + 1).toString(), // 月
    'd+': date.getDate().toString(), // 日
    'H+': date.getHours().toString(), // 时
    'M+': date.getMinutes().toString(), // 分
    'S+': date.getSeconds().toString() // 秒
  }
  for (const k in opt) {
    ret = new RegExp('(' + k + ')').exec(fmt)
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
    }
  }
  return fmt
}

function fsExistsSync (path) {
  try {
    fs.accessSync(path, fs.F_OK)
  } catch (e) {
    return false
  }
  return true
}

function createProjectDir (dir, num = 1) {
  if (!fsExistsSync(dir)) {
    fs.mkdirSync(dir)
    return dir
  } else {
    return createProjectDir(`${dir}_${num}`, num + 1)
  }
}

module.exports = {
  dateFormat,
  fsExistsSync,
  createProjectDir
}
