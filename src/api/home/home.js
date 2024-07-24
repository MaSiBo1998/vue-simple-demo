import { request } from '@/utils/request'
export function add(data) {
  return request({
    url: '/add/user',
    method: 'post',
    data
  })
}

export function del(ids) {
  console.log(ids)
  const idsStr = ids.toString()
  return request({
    url: '/del/user',
    method: 'post',
    data: {
      userId: idsStr
    }
  })
}

export function edit(data) {
  return request({
    url: '/update/user',
    method: 'post',
    data
  })
}
export function getUploadTypeList(data) {
  return request({
    url: '/getUploadTypeList',
    method: 'post',
    data
  })
}
export function toDownload(data) {
  return request({
    url: '/downloadExcel',
    method: 'post',
    data
  })
}
export function toGetDownloadLogs(data) {
  return request({
    url: '/getDownloadLogs',
    method: 'post',
    data
  })
}

export default { add, edit, del }
