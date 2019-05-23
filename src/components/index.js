// 发票
import ScanInvoice from '@/components/invoice/ScanInvoice'
import UploadPdf from '@/components/invoice/UploadPdf'
import InvoiceImg from '@/components/invoice/InvoiceImg'
// 布局
import puzzleLayout from '@/components/layout/puzzleLayout'
import waterfallLayout from '@/components/layout/waterfallLayout'
import barrelLayout from '@/components/layout/barrelLayout'
import roundLayout from '@/components/layout/roundLayout'
import ccordionLayout from '@/components/layout/ccordionLayout'
import squareLayout from '@/components/layout/squareLayout'
// 上传图片
import uploadImage from '@/components/uploadImage'
// 全屏浏览
import fullPageView from '@/components/fullPageView'

import Vue from 'vue'
Vue.component('scan-invoice',ScanInvoice)
Vue.component('upload-pdf',UploadPdf)
Vue.component('invoice-img',InvoiceImg)
Vue.component('puzzle-layout',puzzleLayout)
Vue.component('waterfall-layout',waterfallLayout)
Vue.component('barrel-layout',barrelLayout)
Vue.component('round-layout',roundLayout)
Vue.component('ccordion-layout',ccordionLayout)
Vue.component('square-layout',squareLayout)
Vue.component('upload-image',uploadImage)
Vue.component('full-page-view',fullPageView)