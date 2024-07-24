import { login, getInfo, logout } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    user: JSON.parse(sessionStorage.getItem('USER')) ? JSON.parse(sessionStorage.getItem('USER')) : {},
    roles: [],
    // 第一次加载菜单时用到
    loadMenus: false
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USER: (state, user) => {
      state.user = user
      sessionStorage.setItem('USER', JSON.stringify(user))
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_LOAD_MENUS: (state, loadMenus) => {
      state.loadMenus = loadMenus
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const rememberMe = false
      return new Promise((resolve, reject) => {
        login(userInfo.username, userInfo.password).then(res => {
          setToken(res.data.data, rememberMe)
          commit('SET_TOKEN', res.data.data)
          commit('SET_USER', { username: userInfo.username })
          resolve()
        }).catch(error => {
          console.log(error)
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(res => {
          console.log('获取用户信息', res)
          setUserInfo(res.user, commit)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    LogOut({ commit }) {
      return new Promise((resolve, reject) => {
        logout(getToken, user.state.user.id).then(res => {
          logOut(commit)
          resolve()
        }).catch(error => {
          logOut(commit)
          reject(error)
        })
      })
    },

    updateLoadMenus({ commit }) {
      return new Promise((resolve, reject) => {
        commit('SET_LOAD_MENUS', false)
      })
    }
  }
}

export const logOut = (commit) => {
  commit('SET_TOKEN', '')
  commit('SET_ROLES', [])
  sessionStorage.removeItem('USER')
  removeToken()
  location.reload()
}

export const setUserInfo = (res, commit) => {
  // 如果没有任何权限，则赋予一个默认的权限，避免请求死循环
  // if (res.roles.length === 0) {
  //   commit('SET_ROLES', ['ROLE_SYSTEM_DEFAULT'])
  // } else {
  //   commit('SET_ROLES', res.roles)
  // }
  commit('SET_USER', res)
}

export default user
