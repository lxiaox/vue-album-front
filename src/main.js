import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'
import App from './App'
import router from './router'
import './components/index.js'
// import {Icon,Message} from 'iview'
import iView from 'iview/dist/iview.js'
import 'iview/dist/styles/iview.css'
import './assets/less/index.less'
import './assets/iconfont/iconfont.css'

Vue.use(iView)
// Vue.component('Icon', Icon)
// Vue.prototype.$Message = Message

Vue.use(Router)
Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#root',
  data(){
    return {
    }
  },
  router,
  render: h => h(App)
})
