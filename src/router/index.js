import Vue from 'vue'
import Router from 'vue-router'
import {signIn,signUp,template,album,image} from '@/pages'
Vue.use(Router)

export default new Router({
  routes: [{
    path: '/sign_up',
    name: 'sign_up',
    component: signUp
  }, {
    path: '/sign_in',
    name: 'sign_in',
    component: signIn
  }, {
    path: '/',
    name: 'home',
    redirect: '/sign_in'
  }, {
    path: '/home',
    name: 'home',
    component: template,
    redirect: '/home/album',
    children: [{
      path: 'album',
      name: 'home.album',
      component: album
    },{
      path: 'image/:album',
      name: 'home.image',
      component: image
    }]
  }]
})
