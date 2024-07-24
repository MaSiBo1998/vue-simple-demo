<!--分页-->
<template>
  <div class="pageBox">
    <el-pagination
      background
      :page-size.sync="page.size"
      :total="page.total"
      :current-page.sync="page.page"
      :page-sizes="[10, 30, 50, 100, 300, 500, 1000, 2000, 3000]"
      style="margin-top: 8px;"
      :layout="layout"
      @size-change="crud.sizeChangeHandler($event)"
      @current-change="crud.pageChangeHandler"
    />
  </div>
</template>

<script>
import { pagination } from '@crud/crud'
export default {
  mixins: [pagination()],
  props:{
    layout:{
      type:String,
      default : "total, sizes, prev, pager, next"
    }
  }
}
</script>
<style lang="scss" scoped>
.pageBox{
  text-align: right;
  margin-top: 20px;
}
/deep/.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #23b7e5;
}
</style>
