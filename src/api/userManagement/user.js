import { request } from '@/utils/request'
// import objKeySort from './config'
// import qs from 'qs'

export function getDepartmentSelect(data) {
  return request({
    url: '/getDepartmentBySelect',
    method: 'post',
    data
  })
}
export function add(data) {
  return request({
    url: '/addAccount',
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

export function rePassw(data) {
  return request({
    url: '/updateUserPwd',
    method: 'post',
    data
  })
}
export function changeStatus(data) {
  return request({
    url: '/updateStatus',
    method: 'post',
    data
  })
}

export default { add, edit, del }
