<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive>
        <router-view />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;
}

// .fixed-header+.app-main {
//   padding-top: 50px;
// }
</style>

