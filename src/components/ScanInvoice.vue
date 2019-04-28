<template>
    <div class="scanWrapper">
        <div class="listTitle">
            <div class="listBtn">1</div>
            <span class="listText">发票扫描</span>
        </div>
        <span class="description">连接扫描仪，扫描发票，可扫描多张</span>
        <button class="commonBtn" @click="scanInvoice">点击扫描</button>
        <span v-if="ifSanTipShow">{{ scanMsg }}</span>
    </div>
</template>

<script>
export default {
    name: 'scanInvoice',
    data () {
        return {
            scriptSrc: '',
            ifSanTipShow: false,
            scanMsg: '正在扫描中，请耐心等待...'
        }
    },
    props: ['etcToken'],
    methods: {
        scanInvoice: function scanInvoice () {
            this.ifSanTipShow = true
            this.scanMsg = '正在初始化扫描参数'
            this.$http.post(`${host.etcloudIvatApp}manage/scanInvoice/getScanInitParam`, {
                host: '192.168.51.34',
                scanType: '41',
                imgType: '0',
                dataSource: '1',
                scanSource: '2'
            },{
                headers: {'accessToken': this.etcToken}
            }).then((res) => {
                // 初始化扫描参数成功函数
                console.log('初始化扫描参数成功')
                this.scanMsg = '开在准备扫描'
                // 通过jsonp调用扫描仪
                // 定义hostUrl、查询参数
                const hostUrl = 'http://127.0.0.1:'
                let data= {
                    SID: res.data.value.SID,
                    SIDParam: res.data.value.SIDParam,
                    Config: res.data.value.Config,
                }
                //定义callback函数
                const _that = this
                window.success = function(json) {
                    if (json.retcode == '1') {
                        _that.$http.post(`${host.etcloudIvatApp}manage/scanInvoice/scanEndCallBack`, {
                            responseBody: json.ResponseStr,
                            scanType: '41',
                        },{
                            headers: {'accessToken': _that.etcToken}
                        }).then((res) => {
                            console.log(res)
                            if(res.data.value.remark) {
                                alert(res.data.value.remark)
                            }else{
                                alert(`本次共扫描${res.data.value.inputCount}张发票, ${res.data.value.sucessCount}张识别成功, 发票已存在`)
                            }
                        })
                    }
                }
                //url = hostUrl + port + 查询参数 + callback
                let url = `${hostUrl + res.data.value.port}/ScanFP?`
                for(let key in data){
                    url += `${key}=${data[key]}&`
                }
                url += `callback=success`
                //创建script并设置属性
                let script = document.createElement('script')
                script.src = url
                script.onload = function(e) {
                    console.log('Jsonp success')
                    e.currentTarget.remove()
                }
                script.onerror = function(e){
                    this.$Message.error('扫描仪未连接')
                    e.currentTarget.remove()
                }
                //添加script,发请求
                document.head.appendChild(script)
            },(err) => {
                // 初始化扫描参数成功函数
                this.$Message.error('扫描出错')
            }).finally(() => {
                this.ifSanTipShow = false
            })
        }

    }
}
</script>

<style lang="less" scoped>
.scanWrapper {
    .commonBtn {
        margin-left: 30px;
        margin-right: 20px;
    }
}

</style>

