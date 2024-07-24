<template>
  <div>
    <div class="left-tab">
      <div class="name"> VN </div>
      <el-menu router :default-active="$router.path" class="el-menu-demo" mode="vertical" background-color="#545c64"
        text-color="#fff" active-text-color="#ffd04b">
        <el-menu-item index="/home">
          <template slot="title">
            <i class="el-icon-s-home"></i>
            <span>首页</span>
          </template>
        </el-menu-item>
        <el-menu-item index="/userManagement" v-if="username == 'admin'">
          <template slot="title">
            <i class="el-icon-service"></i>
            <span>用户管理</span>
          </template>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="content">
      <TabMenu></TabMenu>
      <app-main />
    </div>

  </div>
</template>

<script>
import { AppMain } from "./components";
import TabMenu from './components/TabMenu/index.vue'
import Cookies from "js-cookie";
export default {
  name: "Layout",
  components: {
    AppMain,
    TabMenu
  },
  data() {
    return {
      timer: null,
      tokenFlag: false,
      tokenCookies: Cookies.get("BBF-ADMIN-TOEKN"),
      username: ''
    };
  },
  created() {
    this.username = sessionStorage.getItem('USER') ? JSON.parse(sessionStorage.getItem('USER')).username : '未知'
  },
  mounted() {
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
.content {
  padding-top: 60px;
  height: calc(100vh - 60px);
  padding-left: 180px;
  width: calc(100% - 180px);
}

.left-tab {
  position: fixed;
  left: 0;
  top: 0;
  width: 180px;
  height: 100%;
  z-index: 999;
  background-color: #545c64;
  border: none;

  .name {
    font-size: 32px;
    line-height: 60px;
    color: #ffd04b;
    width: 180px;
    text-align: center;
  }

  .el-menu {
    height: 100%;
    width: 180px;
  }
}
</style>
