import Vue from 'vue'
import Router from 'vue-router'
import InvoicePage from '@/components/InvoicePage'
import ImageShow from '@/components/ImageShow'
import signIn from '../pages/signIn.vue'
import signUp from '../pages/signUp.vue'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/sign_in',
    name: 'signIn',
    component: signIn
  }, {
    path: '/sign_up',
    name: 'signUp',
    component: signUp
  }]
})
