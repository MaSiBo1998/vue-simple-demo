<template>
  <div class="crud-opts">
    <span class="crud-opts-left">
      <!--左侧插槽-->
      <!-- {{ permission }} -->
      <slot name="left" />
      <el-button v-if="isHaveAdd" class="filter-item" size="mini" type="primary" icon="el-icon-plus" @click="crud.toAdd">
        新增
      </el-button>
      <slot name="right" />
    </span>
    <!-- <el-button-group class="crud-opts-right">
      <el-button
        size="mini"
        plain
        type="info"
        icon="el-icon-search"
        @click="toggleSearch()"
      />
      <el-button
        size="mini"
        icon="el-icon-refresh"
        @click="crud.refresh()"
      />
    </el-button-group> -->
  </div>
</template>
<script>
import CRUD, { crud } from '@crud/crud'
export default {
  mixins: [crud()],
  props: {
    permission: {
      type: Object,
      default: () => { return {} }
    },
    isHaveAdd: {
      type: Boolean,
      default: () => { return false }
    }
  },
  data() {
    return {
      allColumnsSelected: true,
      allColumnsSelectedIndeterminate: false
    }
  },
  created() {
    this.crud.updateProp('searchToggle', true)
  },
  methods: {
    toDelete(datas) {
      this.$confirm(`确认删除选中的${datas.length}条数据?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.crud.delAllLoading = true
        this.crud.doDelete(datas)
      }).catch(() => {
      })
    },
    handleCheckAllChange(val) {
      if (val === false) {
        this.allColumnsSelected = true
        return
      }
      this.crud.props.tableColumns.forEach(column => {
        if (!column.visible) {
          column.visible = true
          this.updateColumnVisible(column)
        }
      })
      this.allColumnsSelected = val
      this.allColumnsSelectedIndeterminate = false
    },
    handleCheckedTableColumnsChange(item) {
      let totalCount = 0
      let selectedCount = 0
      this.crud.props.tableColumns.forEach(column => {
        ++totalCount
        selectedCount += column.visible ? 1 : 0
      })
      if (selectedCount === 0) {
        this.crud.notify('请至少选择一列', CRUD.NOTIFICATION_TYPE.WARNING)
        this.$nextTick(function () {
          item.visible = true
        })
        return
      }
      this.allColumnsSelected = selectedCount === totalCount
      this.allColumnsSelectedIndeterminate = selectedCount !== totalCount && selectedCount !== 0
      this.updateColumnVisible(item)
    },
    updateColumnVisible(item) {
      const table = this.crud.props.table
      const vm = table.$children.find(e => e.prop === item.property)
      const columnConfig = vm.columnConfig
      if (item.visible) {
        let columnIndex = -1
        // 找出合适的插入点
        table.store.states.columns.find(e => {
          columnIndex++
          return e.__index !== undefined && e.__index > columnConfig.__index
        })
        vm.owner.store.commit('insertColumn', columnConfig, columnIndex, null)
      } else {
        vm.owner.store.commit('removeColumn', columnConfig, null)
      }
    },
    toggleSearch() {
      this.crud.props.searchToggle = !this.crud.props.searchToggle
      this.$store.dispatch('app/setToggleSearch', this.crud.props.searchToggle)
    }
  }
}
</script>

<style>
.crud-opts {
  padding: 4px 0;
  display: -webkit-flex;
  display: flex;
  align-items: center;
}

.crud-opts .crud-opts-right {
  margin-left: auto;
}
</style>
