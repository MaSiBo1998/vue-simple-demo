import Vue from 'vue'
import Element from 'element-ui'
import VCharts from 'v-charts'
Vue.use(VCharts)
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
import App from './App'
import store from './store'
import router from './router/routers'
import './router/index' // permission control
// Vue.prototype.$router = router
Vue.use(Element, {
  size: 'small'
})

Vue.config.productionTip = false
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
