<template>
    <div class="container">
        <div class="listTitle">
            <div class="listBtn">3</div>
            <span class="listText">查询发票影像</span>
        </div>
        <!-- 查询条件设置 -->
        <label>请输入发票代码:</label>
        <input type="text" v-model="invoiceInfo.invoiceCode">
        <br>
        <label>请输入发票号码:</label>
        <input type="text" v-model="invoiceInfo.invoiceNumber">
        <br>
        <label>或选择发票号码:</label>
        <select v-model="invoiceInfo.invoiceNumber">
            <option disabled value="">请选择</option>
            <option v-for="item in defaultInvoiceNumber" :key="`selectInvoiceNumber${item}`">{{item}}</option>
        </select>
        <br>
        <button class="commonBtn" @click="getInvoice">查询发票影像</button>
        <span v-if="ifSearchTipShow">{{ searchMsg }}</span>
        <!-- 发票影像展示 -->
        <div class="showPdf" v-show="!ifNoImg">
            <span>发票图像展示:</span>
            <br>
            <embed :src="invoiceImgSrc" type="" alt="获取失败">
            <img src="static/images/no-img.png" alt="" v-show="ifNoImg">
        </div>
    </div>
</template>

<script>
export default {
    name: 'uploadPdf',
    data () {
        return {
            invoiceInfo: {
                invoiceCode: '044031700111',//044031700111
                invoiceNumber: '19797031'//42084952//42084944//19797031
            },
            defaultInvoiceNumber: ['19550364','19736367','19797031','19811208','19829685','19836222','39807422','40619929','42084944','42084952'],
            invoiceImgSrc: '../images/no-img.png',
            ifNoImg: true,
            ifSearchTipShow: false,
            searchMsg: '正在查询发票影像信息，请耐心等待...'
        }
    },
    props: ['etcToken'],
    methods: {
        getInvoice: function getInvoice () {
            this.ifSearchTipShow = true
            let _url = `${host.etcloudIvatApp}manage/ivatInputInvoice/getIvatFiles`
            let query = `invoiceCode=${encodeURI(this.invoiceInfo.invoiceCode)}&invoiceNumber=${encodeURI(this.invoiceInfo.invoiceNumber)}`
            let url = `${_url}?${query}`
            this.$http.get(url, {headers: {'accessToken': this.etcToken}})
                .then((res) => {
                    console.log(res)
                    if(res.data.value.length > 0){
                        console.log('获取发票影像成功')
                        this.invoiceImgSrc = res.data.value[0].storageKey
                        this.ifNoImg = false
                        console.log(this.ifNoImg)
                    }
                    else{
                        this.$Message.warning('该发票影像信息不存在')
                        this.invoiceImgSrc = ''
                        this.ifNoImg = true
                    }
                },(err) => {
                    this.$Message.error('查询出错')
                })
                .finally( () => {
                    this.ifSearchTipShow = false
                })
        }
    }
}
</script>

<style lang="less" scoped>
.container{
    input,select {
        margin: 10px 0;
    }
    label {
        margin-left: 30px;  
    }
    .commonBtn {
        margin-top: 10px;
        margin-left: 30px;
        margin-right: 20px;
    }
}
</style>
