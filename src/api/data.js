// import request from '@/utils/request'
import { request } from '@/utils/request'

export function initData(url, params, method = 'post') {
  const s = url.split('/')
  // let api
  if (s[0] === 'api2') {
    // const url = url.replace(s[0], '')
    return request({
      url: url.replace(s[0], ''),
      method,
      data: params
    })
  } else if (s[0] === 'api3') {
    return request({
      url: url.replace(s[0], ''),
      method,
      data: params
    })
  } else {
    return request({
      url,
      method,
      data: params
    })
  }
}
// front/putin/pointDataToExcel
export function download(url, data, exportType, dayOrMonth) {
  return request({
    url,
    method: 'post',
    data,
    resType: 'blob'
  })
}

