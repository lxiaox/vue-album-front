<template>
    <div class="uploadWrapper">
        <div class="listTitle">
            <div class="listBtn">2</div>
            <span class="listText">PDF发票上传</span>
        </div>
        <form enctype="multipart/form-data">
            <input type="file" ref="inputPdf" name="pdf" accept="application/pdf" @change="changePdf">
        </form>
        <span class="description">上传发票文件，仅限PDF类型，单张上传</span><br>
        <button class="commonBtn" @click="selectPdf" ref="selectPdf">选择文件上传</button>
        <span class="uploadTip" v-if="ifUploadTipShow">{{ uploadMsg }}</span>
        <!-- Alert  -->
        <!-- <Alert banner type="success">Notice: notification contents...</Alert> -->
        <!-- <Alert banner closable type="success">Notice: notification contents...</Alert>   -->
    </div>
</template>

<script>
export default {
    name: 'uploadPdf',
    data () {
        return {
            pdf: {},
            ifNoImg: false,
            uploadMsg: '文件上传中，请耐心等待...',
            ifUploadTipShow: false
        }
    },
    props: ['etcToken'],
    methods: {
        selectPdf () {
            this.$refs.inputPdf.click()
        },
        changePdf (e) {
            this.pdf = this.$refs.inputPdf.files[0]
            this.uploadPdf()
        },
        uploadPdf () {
            let formData = new FormData()
            formData.append('file', this.pdf)
            // console.log(formData.getAll('file'))
            // 提示信息
            this.ifUploadTipShow = true
            // 禁用上传pdf按钮
            this.$refs.selectPdf.disabled = true
            this.$refs.selectPdf.classList.add('notAllowed')
            this.$http.post(`${host.etcloudIvatAppZuul}manage/scanInvoice/uploadPdf`, formData, {
                headers: {'accessToken': this.etcToken, 'Content-Type': 'multipart/form-data'}
            })
            .then((res) => {
                // console.log('pdf上传成功')
                console.log(res.data.value.remark)
                this.$Message.success('pdf上传成功')
                // console.log(res.data.value.remark)
            },(err) => {
                this.$Message.error('pdf上传失败')
            })
            .finally(() => {
                // 去掉提示信息 还原上传pdf按钮
                this.ifUploadTipShow = false
                this.$refs.selectPdf.disabled = false
                this.$refs.selectPdf.classList.remove('notAllowed')
                // 清除input中文件，文件不变时触发change事件
                this.$refs.inputPdf.value = ''
            })
        }
    }
}
</script>

<style lang="less" scoped>
.uploadWrapper{
    margin-top: 40px;
    margin-bottom: 40px;
    form {
        display: none;
    }
    .commonBtn {
        margin-left: 30px;
        margin-right: 20px;
    }
    .commonBtn.notAllowed{
        cursor: not-allowed;
    }
}
</style>
