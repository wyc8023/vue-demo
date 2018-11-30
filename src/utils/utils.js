let utils = {
  isFunction (fn) {
    return Object.prototype.toString.call(fn) === '[object Function]'
  },
  /**
  *@param {Object}|{Array} object 需要遍历处理的对象或数组
  *@param {Function} callback 遍历处理回调函数
  *@param {Array} args callback回调函数的附加参数
  */
  each (object, callback, args) {
    let name
    let i = 0
    let length = object.length
    let isObj = length === undefined || this.isFunction(object)
    if (args) {
      if (isObj) {
        for (name in object) {
          if (callback.apply(object[name], args) === false) {
            break
          }
        }
      } else {
        for (; i < length;) {
          if (callback.apply(object[i++], args) === false) {
            break
          }
        }
      }
    } else {
      if (isObj) {
        for (name in object) {
          if (callback.call(object[name], name, object[name]) === false) {
            break
          }
        }
      } else {
        for (let value = object[0]; i < length && callback.call(value, i, value) !== false; value = object[++i]) {
        }
      }
    }
    return object
  },
  // 获取location.href
  locationHost: function () {
    return window.location.href
  },
  /* 获取日期 */
  getTime: function (overplusTime) {
    var seconds = Math.floor(overplusTime / 1000)
    var minutes = Math.floor(seconds / 60)
    var hours = Math.floor(minutes / 60)
    var days = Math.floor(hours / 24)
    var CDay = days
    var CHour = hours % 24
    var CMinute = minutes % 60
    var CSecond = Math.floor(seconds % 60)
    CDay = (CDay.toFixed().length === 2 ? CDay : '0' + CDay)
    CHour = (CHour.toFixed().length === 2 ? CHour : '0' + CHour)
    CMinute = (CMinute.toFixed().length === 2 ? CMinute : '0' + CMinute)
    CSecond = (CSecond.toFixed().length === 2 ? CSecond : '0' + CSecond)
    return {
      days: CDay < 0 ? '00' : CDay,
      hours: CHour < 0 ? '00' : CHour,
      minutes: CMinute < 0 ? '00' : CMinute,
      seconds: CSecond < 0 ? '00' : CSecond
    }
  },
  /* 格式化日期 */
  formatDate: function (time) {
    time = new Date(time)
    var year = time.getFullYear()
    var month = time.getMonth() + 1
    var date = time.getDate()
    var hour = time.getHours()
    var minute = time.getMinutes() + ''
    if (minute.length === 1) {
      minute = '0' + minute
    }
    var second = time.getSeconds() + ''
    if (second.length === 1) {
      second = '0' + second
    }
    return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
  },

  timestampToTime: function (timestamp) {
    var date = new Date(timestamp)
    var y = date.getFullYear()
    var m = date.getMonth() + 1
    m = m < 10 ? ('0' + m) : m
    var d = date.getDate()
    d = d < 10 ? ('0' + d) : d
    var h = date.getHours()
    h = h < 10 ? ('0' + h) : h
    var minute = date.getMinutes()
    var second = date.getSeconds()
    minute = minute < 10 ? ('0' + minute) : minute
    second = second < 10 ? ('0' + second) : second
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
  },
  // 去除html代码
  stripTags: function (str) {
    if (typeof (str) === 'string') {
      str = str.replace(/<\/?[^>]*>/g, '') // 去除HTML tag
      str = str.replace(/[ | ]*\n/g, '\n') // 去除行尾空白
      str = str.replace(/&nbsp;/ig, '') // 去掉&nbsp;
    }
    return str
  },
  // 姓名校验
  isNameAvailable: function (name) {
    var myreg = /^[a-zA-Z\u4E00-\u9FA5]+$/
    if (!myreg.test(name)) {
      return true
    } else {
      return false
    }
  },
  // 手机号校验
  isPoneAvailable: function (phone) {
    var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
    if (!myreg.test(phone)) {
      return true
    } else {
      return false
    }
  },
  // 电话号码校验
  isTelAvailable: function (tel) {
    var myreg = /^(([0\\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/
    if (!myreg.test(tel)) {
      return true
    } else {
      return false
    }
  },
  // 邮箱校验
  isEmailAvailable: function (email) {
    var myreg = new RegExp('^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$')
    if (!myreg.test(email)) {
      return true
    } else {
      return false
    }
  },
  replaceForbid: function (str) {
    str = str.replace(/(^\s*)|(\s*$)/g, '')
    str = str.replace(/\\-\\-/g, '')
    str = str.replace(/\//g, '')
    str = str.replace(/\+/g, '')
    str = str.replace(/\\/g, '')
    str = str.replace(/\$/g, '')
    str = str.replace(/\^/g, '')
    str = str.replace(/\./g, '。')
    str = str.replace(/;/g, '；')
    str = str.replace(/</g, '')
    str = str.replace(/>/g, '')
    str = str.replace(/\\"/g, '“')
    str = str.replace(/\\=/g, '')
    str = str.replace(/\{/g, '(')
    str = str.replace(/\}/g, ')')
    return str
  },
  getQueryString (name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    var r = window.location.search.substr(1).match(reg)
    if (r != null) return unescape(r[2])
    return null
  },
  getUserAgent: function () {
    return navigator.userAgent
  },
  parseParam (param, key) {
    var paramStr = ''
    if (typeof param === 'string' || typeof param === 'number' || typeof param === 'boolean') {
      paramStr += '&' + key + '=' + encodeURIComponent(param)
    } else {
      this.each(param, (i) => {
        var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i)
        let nextParam = param[i]
        paramStr += '&' + this.parseParam(nextParam, k)
      })
    }
    return paramStr.substr(1)
  },
  phoneEncode (value) {
    var myreg = /^[1][1-9][0-9]{9}$/
    if (!myreg.test(value)) {
      return value
    } else {
      return value.substr(0, 3) + '****' + value.substr(7, 11)
    }
  },
  channel () {
    var channel = 'sitech_pc'
    var isAndroid = window.navigator.appVersion.match(/android/gi)
    var isIPhone = window.navigator.appVersion.match(/iphone/gi)
    var isIpad = window.navigator.appVersion.match(/ipad/gi)
    if (isAndroid || isIPhone || isIpad) {
      channel = 'sitech_m'
    }
    return channel
  },
  isAndroidApp () {
    return window.navigator.userAgent.toLocaleLowerCase().indexOf('sitech_android') > -1
  },
  isIOSApp () {
    return window.navigator.userAgent.toLocaleLowerCase().indexOf('sitech_ios') > -1
  },
  login (redirect) {
    window.location.href = '/user/login?redirect=' + redirect
  },
  toDecimal2 (x) {
    let f = parseFloat(x)
    if (isNaN(f)) {
      return false
    }
    f = Math.round(x * 100) / 100
    let s = f.toString()
    let rs = s.indexOf('.')
    if (rs < 0) {
      rs = s.length
      s += '.'
    }
    while (s.length <= rs + 2) {
      s += '0'
    }
    return s
  },
  cloudConfig: {
    platformId: 10011,
    appKey: '55e5f9517bcd69c592cf7f4da8fbf13e'
  }
}
export default utils
