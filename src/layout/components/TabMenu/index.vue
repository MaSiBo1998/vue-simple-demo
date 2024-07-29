<template>
  <div class="nav-box">

    <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
      <div class="avatar-wrapper">
        <el-avatar size="small" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></el-avatar>
        <span class="usname">{{ username }}</span>
        <i class="el-icon-caret-bottom" />
      </div>
      <el-dropdown-menu slot="dropdown">
        <span style="display:block;height-line" @click="dialog = true">
          <el-dropdown-item>
            修改密码
          </el-dropdown-item>
        </span>
        <span style="display:block;" @click="open">
          <el-dropdown-item>
            退出登录
          </el-dropdown-item>
        </span>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog :visible.sync="dialog" :close-on-click-modal="false" :before-close="cancel" title="修改密码" append-to-body
      width="700px" @close="cancel">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="200px">
        <el-form-item label="旧密码" prop="oldPassWord">
          <el-input v-model="form.oldPassWord" type="password" auto-complete="on" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassWord">
          <el-input v-model="form.newPassWord" type="password" auto-complete="on" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="确认密码" prop="twoPassWord">
          <el-input v-model="form.twoPassWord" type="password" auto-complete="on" style="width: 370px;" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="cancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="doSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import store from '@/store'
import { updatePwd } from '@/api/login'
import { mapGetters } from 'vuex'
export default {
  name: "TabMenu",
  data() {
    const confirmPwd = (rule, value, callback) => {
      if (value) {
        if (this.form.newPassWord !== value) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      } else {
        callback(new Error('请再次输入密码'))
      }
    }
    return {
      activeIndex2: '2',
      loading: false,
      dialog: false,
      title: '修改密码',
      form: {
        oldPassWord: '',
        newPassWord: '',
        twoPassWord: ''
      },
      rules: {
        oldPassWord: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        newPassWord: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        twoPassWord: [
          { required: true, validator: confirmPwd, trigger: 'blur' }
        ]
      },
      username: ''
    }
  },
  computed: {

  },
  created() {
    this.username = Cookies.get('UserInfo') ? JSON.parse(Cookies.get('UserInfo')).username : '未知'
  },
  methods: {
    open() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.logout()
      })
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        Cookies.remove('UserInfo')
        location.reload()
      })
    },
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          updatePwd(this.form).then(res => {
            this.resetForm()
            this.$notify({
              title: '密码修改成功，请重新登录',
              type: 'success',
              duration: 1500
            })
            setTimeout(() => {
              store.dispatch('LogOut').then(() => {
                location.reload() // 为了重新实例化vue-router对象 避免bug
              })
            }, 1500)
          }).catch(err => {
            this.loading = false
            console.log(err)
          })
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = { pwdOld: '', pwdNew: '', confirmPwd: '' }
    }

  }
}
</script>

<style lang="scss" scoped>
.nav-box {
  height: 60px;
  position: fixed;
  left: 180px;
  top: 0;
  width: calc(100% - 180px);
  z-index: 999;
  background-color: #E4E7ED;
  border: none;
}



.avatar-container {
  position: absolute;
  top: 20px;
  right: 20px;

  .avatar-wrapper {
    display: flex;
    align-items: center;
    color: rgb(168, 176, 223);

    .usname {
      padding: 0 8px;
    }
  }

  .avatar-wrapper :hover {
    cursor: pointer;
  }
}

.el-menu-demo {
  padding: 0 20px;
}

.tab-item {
  text-align: center;
  width: 150px;

  .tab-item-title {
    width: 150px;
    height: 20px;
  }
}
</style>
