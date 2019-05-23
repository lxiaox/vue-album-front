<template>
    <div class="invoiceContainer">
        <scan-invoice :etc-token="etcToken"></scan-invoice>
        <upload-pdf :etc-token="etcToken"></upload-pdf>
        <invoice-img :etc-token="etcToken"></invoice-img>
    </div>
</template>

<script>

export default {
    name: 'InvoicePage',
    data () {
        return {
            etcToken: '',
        }
    },
    created () {
        this.getToken()
    },
    methods: {
        getToken: function () {
            this.$http.post(`${host.etcloud}auth/login/loginFat`, {
                userName: 'hxy17',
                misi: 'q1'
            }).then((res) => {
                this.etcToken = res.data.value.accessToken.accessToken
                console.log('请求token成功')
            },(err)=>{
                console.log('请求token失败')
            })
        },
    }
 
}
</script>

<style lang="less" scoped>
.invoiceContainer{
    width: 80%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 30px;
    margin-bottom: 200px;
    padding-top: 20px;
    padding-left: 60px;
    overflow: hidden;
}
</style>