import moment from 'moment'
/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'undefined' || time === null || time === 'null') {
    return ''
  } else if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str) {
  // returns the byte length of an utf8 string
  let s = str.length
  for (var i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i)
    if (code > 0x7f && code <= 0x7ff) s++
    else if (code > 0x7ff && code <= 0xffff) s += 2
    if (code >= 0xDC00 && code <= 0xDFFF) i--
  }
  return s
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr))
}

/**
 * @returns {string}
 */
export function createUniqueString() {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + Math.random()) * 65536) + ''
  return (+(randomNum + timestamp)).toString(32)
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

// 替换邮箱字符
export function regEmail(email) {
  if (String(email).indexOf('@') > 0) {
    const str = email.split('@')
    let _s = ''
    if (str[0].length > 3) {
      for (var i = 0; i < str[0].length - 3; i++) {
        _s += '*'
      }
    }
    var new_email = str[0].substr(0, 3) + _s + '@' + str[1]
  }
  return new_email
}

// 替换手机字符
export function regMobile(mobile) {
  if (mobile.length > 7) {
    var new_mobile = mobile.substr(0, 3) + '****' + mobile.substr(7)
  }
  return new_mobile
}

// 下载文件
export function downloadFile(obj, name, suffix) {
  const url = window.URL.createObjectURL(new Blob([obj]))
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  // const fileName = parseTime(new Date()) + '-' + name + '.' + suffix
  const fileName = name
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 *
 * @param {*} number 要格式化的数字
 * @param {*} decimals 保留几位小数
 * @param {*} dec_point 小数点符号
 * @param {*} thousands_sep 千分位符号
 */
export function numberFormat(number, decimals, dec_point, thousands_sep) {
  number = (number + '').replace(/[^0-9+-Ee.]/g, '')
  var n = !isFinite(+number) ? 0 : +number
  var prec = !isFinite(+decimals) ? 2 : Math.abs(decimals)
  var sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep
  var dec = (typeof dec_point === 'undefined') ? '.' : dec_point
  var s = ''
  var toFixedFix = function(n, prec) {
    var k = Math.pow(10, prec)
    return '' + Math.ceil(n * k) / k
  }

  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
  var re = /(-?\d+)(\d{3})/
  while (re.test(s[0])) {
    s[0] = s[0].replace(re, '$1' + sep + '$2')
  }

  if ((s[1] || '').length < prec) {
    s[1] = s[1] || ''
    s[1] += new Array(prec - s[1].length + 1).join('0')
  }
  return s.join(dec)
}

export function decimalFormat(number) {
  // console.log(parseFloat(number))
  var f_x = parseFloat(number)
  if (isNaN(f_x)) {
    return 0
  }
  var f_x2 = Math.round(f_x * 100) / 100
  // console.log('haha', f_x)
  var s_x = f_x2.toString()
  var pos_decimal = s_x.indexOf('.')
  if (pos_decimal < 0) {
    pos_decimal = s_x.length
    s_x += '.'
  }
  while (s_x.length <= pos_decimal + 2) {
    s_x += '0'
  }
  return s_x
}

export const pickerOptions = {
  shortcuts: [{
    text: '今天',
    onClick(picker) {
      const end = new Date()
      const start = new Date()
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '昨天',
    onClick(picker) {
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24)
      picker.$emit('pick', [start, start])
    }
  }, {
    text: '上周',
    onClick(picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * (6 + start.getDay()))
      end.setTime(end.getTime() - 3600 * 1000 * 24 * (start.getDay() + 1))
      picker.$emit('pick', [start, end])
    }
  }, /* {
    text: '上个月',
    onClick(picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * (utils.getDayInMonth(start.getMonth(), start.getFullYear()) + start.getDate() - 1))
      end.setTime(end.getTime() - 3600 * 1000 * 24 * end.getDate())
      picker.$emit('pick', [start, end])
    }
  },*/ {
    text: '最近一周',
    onClick(picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近一个月',
    onClick(picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      picker.$emit('pick', [start, end])
    }
  }]
}

export const dataOption = {
  getCurrDays: () => {
    const date = []
    date.push(moment().format('YYYY-MM-DD'))
    date.push(moment().format('YYYY-MM-DD'))
    // 获取当天的开始结束时间，精确到时分秒
    // moment().startOf('days').format('YYYY-MM-DD HH:mm:ss')
    // moment().endOf('days').format('YYYY-MM-DD HH:mm:ss')
    return { text: '今天', date }
  },

  getYesterday: () => {
    const date = []
    date.push(moment().subtract('days', 1).format('YYYY-MM-DD'))
    date.push(moment().subtract('days', 1).format('YYYY-MM-DD'))
    // 获取昨天的开始结束时间，精确到时分秒
    // moment().subtract('days',1).startOf('days').format('YYYY-MM-DD HH:mm:ss')
    // moment().subtract('days',1).endOf('days').format('YYYY-MM-DD HH:mm:ss')
    return { text: '昨天', date }
  },

  // 获取最近七天的开始结束时间
  getLast7Days: () => {
    const date = []
    // 不包含当天
    date.push(moment().subtract('days', 7).format('YYYY-MM-DD'))
    date.push(moment().subtract('days', 1).format('YYYY-MM-DD'))
    // 包含当天
    // date.push(moment().subtract('days',6).format('YYYY-MM-DD'))
    // date.push(moment().format('YYYY-MM-DD'))
    return { text: '最近七天', date }
  },

  // 获取最近30天的开始结束时间
  getLast30Days: () => {
    const date = []
    date.push(moment().subtract('days', 30).format('YYYY-MM-DD'))
    date.push(moment().subtract('days', 1).format('YYYY-MM-DD'))
    return { text: '最近30天', date }
  },
  // 获取当前周的开始结束时间，周日到周六
  getCurrWeekDays: () => {
    const date = []
    // let start = moment().startOf('week').format('YYYY-MM-DD')
    // let end = moment().endOf('week').format('YYYY-MM-DD')
    const weekOfday = parseInt(moment().format('d')) // 计算今天是这周第几天 周日为一周中的第一天
    const start = moment().subtract(weekOfday - 1, 'days').format('YYYY-MM-DD') // 周一日期
    const end = moment().add(7 - weekOfday, 'days').format('YYYY-MM-DD') // 周日日期
    date.push(start)
    date.push(end)
    return { text: '本周', date }
  },
  // 获取上一周的开始结束时间
  getLastWeekDays: () => {
    const date = []
    const weekOfDay = parseInt(moment().format('E'))// 计算今天是这周第几天
    const start = moment().subtract(weekOfDay + 7 * 1 - 1, 'days').format('YYYY-MM-DD')// 周一日期
    const end = moment().subtract(weekOfDay + 7 * (1 - 1), 'days').format('YYYY-MM-DD')// 周日日期
    // 周日到周六
    // let start = moment().week(moment().week() - 1).startOf('week').format('YYYY-MM-DD')
    // let end = moment().week(moment().week() - 1).endOf('week').format('YYYY-MM-DD')
    date.push(start)
    date.push(end)
    return { text: '上周', date }
  },
  // 获取下一周的开始结束时间，周日到周六
  getNextWeekDays: () => {
    const date = []
    const start = moment().week(moment().week() + 1).startOf('week').format('YYYY-MM-DD')
    const end = moment().week(moment().week() + 1).endOf('week').format('YYYY-MM-DD')
    date.push(start)
    date.push(end)
    return date
  },
  // 获取当前月的开始结束时间
  getCurrMonthDays: () => {
    const date = []
    const start = moment().startOf('month').format('YYYY-MM-DD')
    const end = moment().endOf('month').format('YYYY-MM-DD')
    date.push(start)
    date.push(end)
    return { text: '本月', date }
  },
  // 获取上一月的开始结束时间
  getLastMonthDays: () => {
    const date = []
    const start = moment().month(moment().month() - 1).startOf('month').format('YYYY-MM-DD')
    const end = moment().month(moment().month() - 1).endOf('month').format('YYYY-MM-DD')
    date.push(start)
    date.push(end)
    return { text: '上月', date }
  },
  // 当前季度
  getCurrQuarter: () => {
    const date = []
    const start = moment().startOf('quarter').format('YYYY-MM-DD')
    const end = moment().endOf('quarter').format('YYYY-MM-DD')
    date.push(start)
    date.push(end)
    return { text: '当前季度', date }
  },
  // 上个季度
  getLastQuarter: () => {
    const date = []
    const start = moment().quarter(moment().quarter() - 1).startOf('quarter').format('YYYY-MM-DD')
    const end = moment().quarter(moment().quarter() - 1).endOf('quarter').format('YYYY-MM-DD')
    date.push(start)
    date.push(end)
    return { text: '上个季度', date }
  }
}

export const dateData = {
  today: dataOption.getCurrDays(), // 今日
  yesterday: dataOption.getYesterday(), // 昨日
  last7Days: dataOption.getLast7Days(), // 近7日
  last30Days: dataOption.getLast30Days(), // 近30天
  currWeekDays: dataOption.getCurrWeekDays(), // 本周
  lastWeekDays: dataOption.getLastWeekDays() // 上周
}
