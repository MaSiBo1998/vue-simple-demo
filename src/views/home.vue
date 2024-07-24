<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div>
        <!-- 搜索 -->
        <el-row :gutter="20">
          <el-col :span="6">
            <el-select v-model="query.typeId" @change="crud.toQuery()" clearable size="small" filterable
              placeholder="请选择模板" class="filter-item" style="width: 100%">
              <el-option :value="item.id" v-for="item in uploadTypeList" :label="item.typeName" :key="item.id" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select v-model="query.uploadStatus" @change="crud.toQuery()" clearable size="small" filterable
              placeholder="请选择状态" class="filter-item" style="width: 100%">
              <el-option label="未处理" :value="0" />
              <el-option label="已处理" :value="1" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-date-picker v-model="query.uploadTime" type="daterange" value-format="yyyy-MM-dd" range-separator=":"
              size="small" class="date-item" style="width: 100%" start-placeholder="更新开始时间" end-placeholder="更新结束时间" />
          </el-col>
          <el-col :span="6">
            <rrOperation />
          </el-col>
        </el-row>
        <crudOperation :permission="permission" style="margin-top:20px">
          <template v-slot:left>
            <el-button class="filter-item" type="primary" size="mini" icon="el-icon-upload" @click="openShowUpload()">
              点击上传
            </el-button>
          </template>
        </crudOperation>
      </div>
    </div>
    <!-- 批量导入弹窗 -->
    <el-dialog append-to-body :close-on-click-modal="false" @close="colseUpload" :visible.sync="showUpload" title="上传文件"
      width="620px">
      <el-row type="flex" align="middle" style="margin-bottom: 20px">
        <el-col :span="6">
          <el-select v-model="uploadParam.typeId" @change="crud.toQuery()" clearable size="small" filterable
            placeholder="请选择模板" class="filter-item" style="width: 100%">
            <el-option :value="item.id" v-for="item in uploadTypeList" :label="item.typeName" :key="item.id" />
          </el-select>
        </el-col>
      </el-row>

      <el-row type="flex" align="middle">
        <el-col :span="6">
          <el-upload class="upload-demo" ref="uploadExcel" :action="uploadurl" accept=".xlsx,.xls" multiple :limit="1"
            :headers="{ 'authToken': token }" :auto-upload="false" :data="uploadParam" :before-upload="beforeUploadFile"
            :on-change="fileChange" :on-success="handleSuccess" :on-error="handleError" :file-list="fileList"
            :before-remove="handleRemove" :on-remove="handleRemove">
            <el-button size="small" type="primary" :disabled="alreadySelectFile">
              <span @click="uploadSpan">
                点击上传
              </span>
            </el-button>
          </el-upload>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="colseUpload">取消</el-button>
        <el-button type="primary" @click="submitUpload" :loading="uploadLoading">提交</el-button>
      </div>
    </el-dialog>
    <div class="table-box">
      <!--表格渲染-->
      <el-table ref="table" stripe :data="crud.data">
        <el-table-column prop="fileName" align="center" label="文件名" width="180">
        </el-table-column>
        <el-table-column prop="typeName" align="center" label="上传表格模板" width="180">
        </el-table-column>
        <el-table-column prop="uploadStatus" width="180px" align="center" label="状态">
          <template slot-scope="scope">
            {{ scope.row.uploadStatus == 1 ? '已处理' : '未处理' }}
          </template>
        </el-table-column>
        <el-table-column prop="uploadTime" align="center" label="上传时间" width="180">
        </el-table-column>
        <el-table-column prop="uploadBy" align="center" label="上传用户">
        </el-table-column>
        <el-table-column prop="finishTime" align="center" label="处理完成时间" width="180">
        </el-table-column>
        <el-table-column width="200px" align="center" label="操作">
          <template slot-scope="scope">
            <el-button class="search-button" :disabled="scope.row.uploadStatus !== 1" size="mini" type="success"
              icon="el-icon-search" @click="toDownload(scope.row)">下载</el-button>
            <el-popover placement="right" width="400" trigger="click" :loading="detailsLoading">
              <el-table :data="downloadLogsList">
                <el-table-column width="150" property="downloadBy" label="下载用户"></el-table-column>
                <el-table-column width="100" property="downloadTime" label="下载时间"></el-table-column>
              </el-table>
              <!-- <el-button slot="reference" class="search-button" size="mini" type="warning" icon="el-icon-search"
                @click="toGetDownloadLogs(scope.row)">查看</el-button> -->
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <!-- <pagination /> -->
    </div>
  </div>
</template>
<script>
import { parseTime, downloadFile } from '@/utils/index'
import { getToken } from '@/utils/auth'
import { root1 } from '@/utils/request'
import { getUploadTypeList, toDownload, toGetDownloadLogs } from '@/api/home/home.js'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import pagination from '@crud/Pagination'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
export default {
  name: "home",
  components: { crudOperation, rrOperation, pagination },
  mixins: [presenter(), header(), form({}), crud()],
  cruds() {
    return CRUD({
      title: '',
      url: '/getUploadExcelList',
      method: 'post',
    })
  },
  data() {
    return {
      dataList: [],
      uploadTypeList: [],
      downloadLogsList: [],
      desc: '',
      id: '',
      tag: '',
      showUpload: false,
      uploadParam: {
        typeId: ''
      },
      uploadurl: '',
      limitNum: 1,
      fileList: [],
      uploadLoading: false,
      upLoadMessage: "", // 上传完成提示语
      alreadySelectFile: false,//选择了文件之后的按钮的变化
      upLoadStatus: false,//选择了文件上传成功之后的状态
      showUploadSuccess: false,
      permission: {
        add: ['admin', 'orderShare:add'],
        edit: ['admin', 'orderShare:edit'],
        del: ['admin', 'orderShare:del']
      },
      detailsLoading: false,
      token: ''
    };
  },
  computed: {

  },
  created() {
    this.token = getToken()
    this.toGetUploadTypeList()
    this.uploadurl = root1 + '/uploadExcel'
    console.log(this.uploadurl)
  },
  methods: {
    toGetUploadTypeList() {
      getUploadTypeList().then(res => {
        console.log(res)
        this.uploadTypeList = res.data.data
      })
    },
    [CRUD.HOOK.beforeRefresh](crud) {
      if (this.query.uploadTime) {
        crud.query.uploadTimeStart = this.query.uploadTime[0];
        crud.query.uploadTimeEnd = this.query.uploadTime[1];
      } else {
        crud.query.uploadTimeStart = undefined;
        crud.query.uploadTimeEnd = undefined;
      }
    },
    uploadSpan(e) {
      if (this.alreadySelectFile) e.stopPropagation()
    },
    openShowUpload() {
      this.showUpload = true
      this.uploadParam.typeId = ''
    },
    // 下载记录
    toDownload(row) {
      let params = {
        id: row.id
      }
      window.open('http://8.135.239.113/' + row.finishPath)
    },
    // 打开详情
    toGetDownloadLogs(row) {
      let params = {
        id: row.id
      }
      this.detailsLoading = true
      toGetDownloadLogs(params).then(res => {
        this.downloadLogsList = res.data.data
        this.detailsLoading = false
      }).catch(err => {
        this.detailsLoading = false
      })
    },
    //关闭上传成功的弹窗
    colseUploadSuccess() {
      this.showUploadSuccess = false
      this.alreadySelectFile = false
    },
    beforeUploadFile(file) {
      let extension = file.name.substring(file.name.lastIndexOf(".") + 1); //获取上传文件的扩展名
      let size = file.size / 1024 / 1024; //设置上传文件的大小
      const isXLSX = file.name.split(".")[1] == "xlsx";
      const isXLS = file.name.split(".")[1] == "xls";
      if (!isXLSX && !isXLS) {
      }
      if (size >= 3) {
      }
    },
    fileChange(file, fileList) {
      this.alreadySelectFile = true
      let extension = file.name.substring(file.name.lastIndexOf(".") + 1); //获取上传文件的扩展名
      if (extension != "xlsx" && extension != "xls") {
        this.form.file = "";
        this.fileList = [];
        this.alreadySelectFile = false
        this.$message.error('选择文件格式有误,请重新选择');
        return;
      }
      this.form.file = file.raw;
      let size = file.size / 1024 / 1024; //设置上传文件的大小
      if (size >= 100) {
        this.$message.error('文件大小不能超过100M,请重新选择');
        this.form.file = "";
        this.fileList = [];
        return;
      }
    },
    handleSuccess(res, file, fileList) {
      this.upLoadStatus = res.flag;
      this.upLoadMessage = res.data;
      console.log(res)
      if (res.code === 0) {
        this.$message.success("上传成功");
        this.colseUpload()
        this.crud.refresh()
      } else {
        this.$message.error(res.msg);
        this.uploadLoading = false;
      }

    },
    handleError(err, file, fileList) {
      this.uploadLoading = false;
      this.$message.error("上传失败");
    },
    handleRemove(file, fileList) {
      this.form.file = "";
    },
    submitUpload() {
      let self = this;
      self.uploadLoading = true;
      if (self.form.file == "") {
        self.$message.error("上传文件为空,请重新选择!");
        self.uploadLoading = false;
        return;
      }
      if (self.uploadParam.typeId == "") {
        self.$message.error("模板不能为空,请重新选择!");
        self.uploadLoading = false;
        return;
      }
      self.$refs.uploadExcel.submit();
    },
    colseUpload() {
      // 关闭上传弹框
      this.form.file = "";
      this.fileList = [];
      this.showUpload = false;
      this.uploadLoading = false;
      this.alreadySelectFile = false
    },
    extensionSuccessBtnFn() {
      this.showUploadSuccess = false;
      this.showUpload = true;
    },
    toReset() {
      this.desc = '',
        this.id = '',
        this.tag = ''
      this.dataList = dataList
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.head-container {}

.table-box {
  margin-top: 20px;
  padding: 20px;
  background-color: #FFF;
  box-shadow: 5px;
}

/deep/.el-table th.el-table__cell.is-leaf,
.el-table td.el-table__cell {
  border-bottom: 2px solid #23b7e5;
}


.btn {
  float: right;
}


.reset-button {
  background-color: #c2d5ea;
  border-color: #c2d5ea;
  color: #000000;
}
</style>
