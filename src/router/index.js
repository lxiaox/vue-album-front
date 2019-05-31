import Vue from 'vue'
import Router from 'vue-router'
import { signIn, signUp, template, album, albumView, image, layoutShow } from '@/pages'
import { invoicePage } from '@/components/invoice/InvoicePage'
Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    redirect: '/sign_in'
  }, {
    path: '/sign_up',
    name: 'sign_up',
    component: signUp
  }, {
    path: '/sign_in',
    name: 'sign_in',
    component: signIn
  }, {
    path: '/home',
    name: 'home',
    component: template,
    redirect: '/home/album',
    children: [{
      path: 'album',
      name: 'home.album',
      component: album
    }, {
      path: 'albumView/:album',
      name: 'home.albumView',
      component: albumView
    }, {
      path: 'image',
      name: 'home.image',
      component: image
    }, {
      path: 'layoutShow',
      name: 'home.layoutShow',
      component: layoutShow
    }]
  }]
})
