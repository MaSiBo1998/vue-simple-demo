import router from './routers'
import NProgress from 'nprogress' // progress bar
import { getToken } from '@/utils/auth' // getToken from cookie
import 'nprogress/nprogress.css'// progress bar style
// import { MessageBox } from 'element-ui'
NProgress.configure({ showSpinner: false })// NProgress Configuration
/* 路由异常错误处理，尝试解析一个异步组件时发生错误，重新渲染目标页面 /Loading chunk (\d)+ failed/g */
const whiteList = ['/login']// no redirect whitelist
router.beforeEach((to, from, next) => {
  // + ' - ' + Config.title

  NProgress.start()
  if (getToken()) {
    // 已登录且要跳转的页面是登录页
    next()
    NProgress.done()
  } else {
    console.log(whiteList.indexOf(to.path) !== -1)
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})
router.onError((error) => {
  const pattern = new RegExp('Loading chunk (\d)+ failed', 'g')
  const isChunkLoadFailed = error.message.match(pattern)
  const targetPath = router.history.pending.fullPath
  console.log(targetPath)
  if (isChunkLoadFailed) {
    router.replace(targetPath)
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
