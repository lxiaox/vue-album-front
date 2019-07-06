import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'
import App from './App'
import router from './router'
import './components/index.js'
import iView from 'iview/dist/iview.js'
import 'iview/dist/styles/iview.css'
import './assets/less/index.less'
import './assets/iconfont/iconfont.css'
import MD5 from 'js-md5'

Vue.use(iView)

Vue.use(Router)
Vue.prototype.$http = axios
Vue.prototype.$MD5 = MD5
Vue.config.productionTip = false

import VueCropper from 'vue-cropper'
Vue.use(VueCropper)

/* eslint-disable no-new */
new Vue({
  el: '#root',
  data() {
    return {
    }
  },
  router,
  render: h => h(App)
})
