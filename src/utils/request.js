import axios from 'axios'
import objKeySort from '../api/config'
import { Notification } from 'element-ui'
export const root1 = 'http://8.135.239.113:8081'
import store from '../store'
import { getToken, removeToken } from '@/utils/auth'
export function request({ method, url, data, resType }) {
  return axios({
    method: method,
    baseURL: root1,
    headers: {
      'authToken': getToken(),
      'content-type': 'application/json;'
    },
    url: url,
    data: method === 'post' ? objKeySort(data) : null,
    params: method === 'get' ? objKeySort(data) : null,
    responseType: 'json'
  })
}
axios.interceptors.response.use(
  response => {
    // 接口请求路径
    // const url = response.config.url
    console.log(response)
    const code = response.data.code
    if (response.config.responseType == 'blob') {
      return response
    }
    if (code === 0) {
      return response
    } else if (code == 300) {
      removeToken()
      location.reload()
      return Promise.reject('error')
    } else {
      Notification.error({
        title: response.data.msg
      })
      return Promise.reject('error')
    }
  },
  error => {
    if (error.toString().indexOf('403') != -1) {
      store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
      Notification.error({
        title: '登录过期',
        duration: 2000
      })
      return
    }
  }
)
