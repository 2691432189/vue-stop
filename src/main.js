import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/fonts/iconfont.css'
import ZkTable from 'vue-table-with-tree-grid'

// 引入全局样式
import './assets/css/global.css'

// 导入axios包
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios
// 请求拦截向请求头中添加token验证信息
axios.interceptors.request.use(fig => {
  fig.headers.Authorization = window.sessionStorage.getItem('token')
  return fig
})

// 引入vue-table-with-tree-grid表格插件
Vue.component('table-tree', ZkTable)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
