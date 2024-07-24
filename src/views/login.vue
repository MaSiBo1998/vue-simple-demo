<template>
  <div style="overflow-x: hidden;overflow-y: hidden;">
    <div id="login" style="overflow-x: hidden;overflow-y: hidden;">
      <div class="login" style="overflow-x: hidden;overflow-y: hidden;">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" label-position="left" label-width="0px"
          class="login-form">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="用户姓名"
              prefix-icon="el-icon-user">
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="登录密码"
              @keyup.enter.native="handleLogin" prefix-icon="el-icon-lock">
            </el-input>
          </el-form-item>
          <el-form-item style="width:100%;">
            <el-button :loading="loading" size="medium" type="primary" style="width:100%;"
              @click.native.prevent="handleLogin">
              <span v-if="!loading">登录</span>
              <span v-else>登录中...</span>
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  name: 'Login',
  // components: { Bg },
  data() {
    return {
      codeUrl: '',
      cookiePass: '',
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '用户名不能为空' }],
        password: [{ required: true, trigger: 'blur', message: '密码不能为空' }]
      },
      loading: false,
      redirect: undefined,
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    this.getCookie()
  },
  methods: {
    getCookie() {
      const username = Cookies.get('username')
      let password = Cookies.get('password')
      this.cookiePass = password === undefined ? '' : password
      password = password === undefined ? this.loginForm.password : password
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        const user = {
          username: this.loginForm.username,
          password: this.loginForm.password
        }
        if (valid) {
          this.loading = true
          this.$store.dispatch('Login', user).then((res) => {
            console.log(res)
            this.loading = false
            // Cookies.set(UserInfo, user, { expires: 7 })
            this.$router.push({ path: '/' })
          }).catch((err) => {
            console.log(err)
            this.loading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
#login {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #303133;
}

.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 380px;
  background-color: #909399;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.4);
  border-radius: 10px;
}

.title {
  margin: 0 auto 15px;
  text-align: center;
  color: #EBEEF5;

  img {
    width: 60px;
    height: 60px;
    border-radius: 10px;
    margin-right: 10px;
  }

  span {
    margin-top: 10px;
    display: block;
  }
}

.app-img {
  display: block;
  width: 27px;
  height: 27px;
}

.select-app {
  display: flex;
  align-content: center !important;
  ;

  .app-name {
    display: block;
    color: #8492a6;
    margin-left: 15px;
  }
}

/deep/.el-select-dropdown__item {
  padding: 10px 20px !important;
}

.login-form {
  position: relative;
  z-index: 999;
  border-radius: 6px;
  background: #E4E7ED;
  width: 355px;
  padding: 25px 25px 5px 25px;

  .el-input {
    height: 38px;

    input {
      height: 38px;
    }
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }

  .el-button--primary {
    color: #fff;
    background-color: #303133;
    border-color: #303133;

    opacity: 1;
  }

  .el-button--primary:hover {
    background-color: #8492a6;
    border-color: #8492a6;
    opacity: 1;
  }
}

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.login-code {
  width: 33%;
  display: inline-block;
  height: 38px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle
  }
}

/* 动画*/
@keyframes move1 {
  0% {
    left: -100%;
  }

  50%,
  100% {
    left: 100%;
  }
}

@keyframes move2 {
  0% {
    top: -100%;
  }

  50%,
  100% {
    top: 100%;
  }
}

@keyframes move3 {
  0% {
    right: -100%;
  }

  50%,
  100% {
    right: 100%;
  }
}

@keyframes move4 {
  0% {
    bottom: -100%;
  }

  50%,
  100% {
    bottom: 100%;
  }
}
</style>
