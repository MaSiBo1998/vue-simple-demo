<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-row :gutter="20">
          <el-col :span="6">
            <el-select v-model="query.isDelete" @change="crud.toQuery()" clearable size="small" filterable
              placeholder="请选择用户状态" class="filter-item" style="width: 100%">
              <el-option label="正常" :value="0" />
              <el-option label="已删除" :value="-1" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-date-picker v-model="query.updateTime" type="daterange" value-format="yyyy-MM-dd" range-separator=":"
              size="small" class="date-item" style="width: 100%" start-placeholder="更新开始时间" end-placeholder="更新结束时间" />
          </el-col>
          <el-col :span="12">
            <rrOperation />
          </el-col>
        </el-row>
      </div>
      <crudOperation :isHaveAdd="true" style="margin-top:20px">
      </crudOperation>
    </div>
    <!--表格渲染-->
    <div class="table-box">
      <el-table ref="table" border v-loading="crud.loading" max-height="600" stripe lazy :data="crud.data">
        <el-table-column prop="userName" align="center" label="登录账户">
        </el-table-column>
        <el-table-column prop="passWord" align="center" label="登录密码">
        </el-table-column>
        <!-- 状态 -->
        <el-table-column prop="isDelete" label="用户状态" align="center">
          <template slot-scope="scope">
            <el-switch disabled v-model="scope.row.isDelete" active-color="#13ce66" inactive-color="#ff4949"
              :active-value="0" :inactive-value="-1" @click.native="changeStatus(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" align="center" label="更新时间">
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button class="filter-item" size="mini" type="success" icon="el-icon-key"
              :disabled="scope.row.userName == 'admin'" @click="toOpenEdit(scope.row)">
              编辑密码
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--表单渲染 :rules="rules"-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU"
      :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="590px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="登录账户" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入登录账户" style="width: 350px" />
        </el-form-item>
        <el-form-item label="登录密码" prop="passWord">
          <el-input v-model="form.passWord" placeholder="请输入登录密码" style="width: 350px" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </el-dialog>
    <el-dialog append-to-body :close-on-click-modal="false" :visible.sync="editPasswordDialog" title="修改用户密码"
      width="590px">
      <el-form ref="form" :model="userInfo" :rules="rules" size="small" label-width="80px">
        <el-form-item label="登录账号" prop="userName">
          <el-input v-model="userInfo.userName" disabled style="width:350px" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassWord">
          <el-input v-model="userInfo.newPassWord" placeholder="请输入新密码" style="width: 350px" />
        </el-form-item>
        <el-form-item label="确认密码" prop="twoPassWord">
          <el-input v-model="userInfo.twoPassWord" placeholder="请输入确认密码" style="width: 350px" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="editPasswordDialog = false">取消</el-button>
        <el-button :loading="editPasswordLoading" type="primary" @click="editPasswordSubmit()">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import crudUser, { rePassw, changeStatus } from '@/api/userManagement/user'
import { mapState } from "vuex";
import CRUD, { presenter, header, form, crud } from "@crud/crud";
import pagination from "@crud/Pagination";
import rrOperation from "@crud/RR.operation";
import crudOperation from "@crud/CRUD.operation";
import udOperation from "@crud/UD.operation";
const defaultForm = {
  userName: null,
  passWord: null
};
export default {
  name: "",
  components: { crudOperation, rrOperation, pagination, udOperation },
  cruds() {
    return CRUD({
      url: "/getUserList",
      method: "post",
      crudMethod: { ...crudUser },
      idField: 'userId'
    });
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    return {
      rules: {
        userName: [
          { required: true, message: "请输入登录账户", trigger: "blur" },
          {
            min: 2,
            max: 100,
            message: "长度在 2 到 100 个字符",
            trigger: "blur",
          },
        ],
        passWord: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          {
            min: 2,
            max: 100,
            message: "长度在 2 到 100 个字符",
            trigger: "blur",
          },
        ],
        newPassWord: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          {
            min: 2,
            max: 100,
            message: "长度在 2 到 100 个字符",
            trigger: "blur",
          },
        ],
        twoPassWord: [
          { required: true, message: "请输入确认密码", trigger: "blur" },
          {
            min: 2,
            max: 100,
            message: "长度在 2 到 100 个字符",
            trigger: "blur",
          },
        ],
      },
      editPasswordDialog: false,
      editPasswordLoading: false,
      userInfo: {}
    };
  },
  computed: {

  },
  created() {
  },
  methods: {
    // 改变状态
    changeStatus(row) {
      if (row.userName == 'admin') {
        this.$message({
          duration: 2000,
          message: 'admin用户不能更改',
          type: 'warning'
        });
        return
      }
      let msg = ''
      let isDelete = ''
      if (row.isDelete === 0) {
        msg = '确定要禁用该用户么?'
        isDelete = -1
      } else {
        msg = '确定要启用该用户么?'
        isDelete = 0
      }
      this.$confirm(msg, '请再次确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          id: row.id,
          isDelete: isDelete
        }
        changeStatus(params).then(res => {
          if (res.data.code == 0) {
            this.$message({
              duration: 2000,
              message: res.data.data,
              type: 'success'
            });
            this.crud.refresh()
          } else {
            this.$message({
              duration: 2000,
              message: res.data.msg,
              type: 'error'
            });
          }
        })
      })
    },
    toOpenEdit(data) {
      this.userInfo = data
      this.editPasswordDialog = true
    },
    editPasswordSubmit() {
      let params = {
        id: this.userInfo.id,
        newPassWord: this.userInfo.newPassWord,
        twoPassWord: this.userInfo.twoPassWord,
      }
      this.editPasswordLoading = true
      rePassw(params).then(res => {
        this.editPasswordLoading = false
        if (res.data.code == 0) {
          this.editPasswordDialog = false
          this.$message({
            duration: 2000,
            message: res.data.data,
            type: 'success'
          });
          this.crud.refresh()
        } else {
          this.$message({
            duration: 2000,
            message: res.data.msg,
            type: 'error'
          });
        }
      }).catch(err => {
        this.editPasswordLoading = false
      })
    }
    ,
    [CRUD.HOOK.beforeReset](crud) {

    },
    [CRUD.HOOK.beforeRefresh](crud) {
      if (this.query.updateTime) {
        crud.query.updateTimeStart = this.query.updateTime[0];
        crud.query.updateTimeEnd = this.query.updateTime[1];
      } else {
        crud.query.updateTimeStart = undefined;
        crud.query.updateTimeEnd = undefined;
      }
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.table-box {
  padding: 20px 0;
  background-color: #FFF;
  box-shadow: 5px;
}

.el-switch.is-disabled {
  opacity: 1;
}

/deep/.el-switch.is-disabled .el-switch__core,
.el-switch.is-disabled .el-switch__label {
  cursor: pointer;
}

/deep/.el-table th.el-table__cell.is-leaf,
.el-table td.el-table__cell {
  border-bottom: 2px solid #67C23A;
}
</style>

