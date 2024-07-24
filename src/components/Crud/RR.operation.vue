<!--搜索与重置-->
<template>
  <span class="btn">
    <el-button size="mini" type="warning" icon="el-icon-search" @click="crud.toQuery">搜索</el-button>
    <el-button v-if="crud.optShow.reset" size="mini" type="success" icon="el-icon-refresh-left"
      @click="crud.resetQuery()">重置</el-button>
    <el-link v-if="crud.optShow.fold" type="primary" @click="toggleOpenSearch">{{ openSearchTxt }}</el-link>
    <slot name="right" />
  </span>
</template>
<script>
import { crud } from '@crud/crud'
export default {
  mixins: [crud()],
  props: {
    itemClass: {
      type: String,
      required: false,
      default: ''
    }
  },
  data() {
    return {
      openSearchTxt: '收起'
    }
  },
  created() {
    if (!this.$store.state.app.toggleSearch) {
      this.crud.updateProp('openSearchToggle', true)
    }
    // alert(this.crud.props.openSearchToggle)
    // alert(this.crud.props.searchToggle)
    // if (!this.crud.props.openSearchToggle) {
    //   this.crud.updateProp('openSearchToggle', false)
    // } else {
    //   this.crud.updateProp('openSearchToggle', true)
    // }

    this.openSearchTxt = this.crud.props.openSearchToggle ? '收起' : '展开'
  },
  methods: {
    toggleOpenSearch() {
      this.crud.props.openSearchToggle = !this.crud.props.openSearchToggle
      // this.crud.updateProp('openSearchToggle', this.crud.props.openSearchToggle )
      // localStorage.setItem('foldSearch', this.crud.props.openSearchToggle)
      this.openSearchTxt = this.crud.props.openSearchToggle ? '收起' : '展开'
    }
  }
}
</script>

<style lang="scss" scoped>
.btn {
  float: right;
}

.search-button {
  background-color: #3fcbca;
  border-color: #3fcbca;
  color: #ffffff;
}

.reset-button {
  background-color: #c2d5ea;
  border-color: #c2d5ea;
  color: #000000;
}
</style>
