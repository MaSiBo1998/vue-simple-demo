
const objKeySort = obj => {
  obj = obj || {}
  // obj['appSecret'] = 'dy20170906OvertimeKey'
  if (!obj.clearFull) {
    obj = filterNull(obj)
  } else {
    delete obj['clearFull']
  }
  // obj = this.filterNull(obj)
  var newkey = Object.keys(obj).sort()
  for (let i = 0; i < newkey.length; i++) {
    if (Array.isArray(obj[newkey[i]])) {
      delete obj[newkey[i]]
    }
  }
  // console.log(obj)
  delete obj['appSecret']
  return obj
}
const filterNull = o => {
  for (var key in o) {
    if (o[key] === null || o[key] === undefined || o[key] === '') {
      delete o[key]
    }
    if (toType(o[key]) === 'string') {
      o[key] = o[key].trim()
    }
  }
  return o
}
const toType = obj => {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

export default objKeySort
