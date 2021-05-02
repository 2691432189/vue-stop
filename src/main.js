import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/fonts/iconfont.css'
import ZkTable from 'vue-table-with-tree-grid'
// 引入富文本编辑器及其样式
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css'
// 引入全局样式
import './assets/css/global.css'
// 导入axios包
import axios from 'axios' // for bubble theme

// 全局注册富文本编辑器组件
Vue.use(VueQuillEditor)

Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 请求拦截向请求头中添加token验证信息
axios.interceptors.request.use(fig => {
  fig.headers.Authorization = window.sessionStorage.getItem('token')
  return fig
})

// 时间格式处理
Vue.prototype.$filter = timestamp => {
  function format (number) {
    return number.toString().padStart(2, '0')
  }
  const date = new Date(Number.parseInt(timestamp, 10))
  const YYYY = date.getFullYear()
  const MM = date.getMonth() + 1
  const DD = date.getDate()
  return `${YYYY}-${format(MM)}-${format(DD)}`
}

// 引入vue-table-with-tree-grid表格插件
Vue.component('table-tree', ZkTable)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
