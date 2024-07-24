import { request1 } from '@/utils/request'

// 申请状态
export function reWriteGetParams() {
  return request1({
    url: '/verifyCodeAndRegister/getQueryParam',
    method: 'get'
  })
}
