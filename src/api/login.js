import { request } from '@/utils/request'
// import objKeySort from './config'
// import qs from 'qs'

export function login(username, password) {
  return request({
    url: '/login',
    method: 'post',
    data: { userName: username, passWord: password }
  })
}
export function logout(data) {
  return request({
    url: '/logout',
    method: 'post',
    data
  })
}
export function updatePwd(data) {
  return request({
    url: '/updateMyPwd',
    method: 'post',
    data
  })
}
export function getInfo() {
  return request({
    url: '/front/jcl/getUserInfo',
    method: 'post',
    data: {}
  })
}
export function testToken(token) {
  return request({
    url: '/front/jcl/checkToken',
    method: 'post',
    data: {}
  })
}
