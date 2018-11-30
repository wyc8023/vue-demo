/**
 * MIT license
 */
var cookie = {
  get: function (name) {
    var arr = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)(;|$)'))
    if (arr != null) return (decodeURIComponent(arr[2]))
    return ''
  },
  set: function (name, value, hours, domain = '.sitechdev.com') {
    var cdata = name + '=' + encodeURIComponent(value)
    if (hours) {
      var d = new Date()
      d.setHours(d.getHours() + hours)
      cdata += '; expires=' + d.toGMTString()
    }
    if (!domain) {
      let host = window.location.host
      let secondary = host.split('.')[0]
      domain = host.replace(secondary + '.', '')
    }
    cdata += (domain ? ('; domain=' + domain) : '') + ';path=/'
    document.cookie = cdata
  },
  remove: function (name, domain = '.sitechdev.com') {
    var exp = new Date()
    exp.setTime(exp.getTime() - 1)
    document.cookie = name + '=;' + (domain ? 'domain=' + domain + ';' : '') + 'expires=' + exp.toGMTString() + ';path=/'
  },
  clear: function (domain) {
    var arr = document.cookie.match(new RegExp('([^ ;][^;]*)(?=(=[^;]*)(;|$))', 'gi'))
    for (var i in arr) {
      cookie.remove(arr[i], domain)
    }
  },
  getFromServer (name, stringCookie) {
    let strCookie = new RegExp('' + name + '[^;]+').exec(stringCookie)
    strCookie = strCookie ? strCookie[0] : strCookie
    return unescape(strCookie ? strCookie.toString().replace(/^[^=]+./, '') : '')
  }
}
export default cookie
