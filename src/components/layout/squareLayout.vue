<template>
    <div class="squareBox clearfix">
        <!-- 新增图片 -->
        <input class="addImgInputBtn" type="file" ref="inputImg" 
            name="img" accept="image/*" 
            @change="changePic">
        <div class="addImgBtn" @click="addImg">新增图片</div>
        <div class="uploadImgWrapper" v-if="ifUploadImgBoxShow">
            <div class="uploadImgContainer">
                <div class="confirmLabel">
                    <span>请确认是否上传该图片：</span>
                </div>
                <div class="uploadImgBox">
                    <img :src="previewSrc" alt="新增图片">
                </div>
                <div class="uploadBtn" @click="uploadImg">上传</div>
                <div class="cancleBtn" @click="cancelUpload">取消</div>
            </div>
        </div>
        <!-- 图片展示 -->
        <div class="allImages clearfix">
            <div class="imageBox shrinkIn" v-for="(item, index) in images" :key="`squareKey${index}`">
                <img :src="item.src" alt="" :title="message" @dblclick="fullpageView(index)">
            </div>
        </div>
        <!-- 全屏浏览 -->
        <div class="fullPageBox" v-if="ifFullpageView">
            <div class="bigImageBox">
                <img :src="images[bigImageIndex].src">
            </div>
            <a @click="slide('left')" class="prev"></a>
            <a @click="slide('right')" class="next"></a>
            <a @click="exitFullpage" class="close"></a>
            <a @click="autoPlay" class="play" v-show="!ifAutoPlay"></a>
            <a @click="stopPlay" class="pause"  v-show="ifAutoPlay"></a>
        </div>
    </div>
</template>

<script>
export default {
    name: 'square',
    data () {
        return {
            ifUploadImgBoxShow: false,
            localImages: [],
            previewSrc: '',
            message: '双击图片全屏浏览',
            ifFullpageView: false,
            bigImageIndex: 0,
            fadeInAble: true,
            ifAutoPlay: false,
            timer: '',
            hideMark: 0,
        }
    },
    props: ['images'],
    mounted () {
        document.addEventListener('visibilitychange',()=>{
            if(document.hidden){
                this.hideMark = 1
                window.clearInterval(this.timer)
            }else{
                if(this.hideMark === 0 || this.ifAutoPlay === false) return
                this.timer = window.setInterval(()=>{
                    this.slide('auto')
                }, 2000)
            }
        })
    },
    methods: {
        // 图片添加
        addImg () {
            this.$refs.inputImg.click()
        },
        uploadImg: function uploadImg() {
            let localImages1 = JSON.parse(localStorage.getItem('imgFiles'))
            if(localImages1) {
                this.localImages = localImages1
            }
            this.localImages.push({src: this.previewSrc})
            this.images.unshift({src: this.previewSrc})
            localStorage.setItem('imgFiles', JSON.stringify(this.localImages))
            this.cancelUpload()
        },
        cancelUpload () {
            this.ifUploadImgBoxShow = false
            document.documentElement.classList.remove('noscroll')
            this.$refs.inputImg.value = ''  //解决选择同一文件不能触发change事件问题
        },
        changePic: function changePic() {
            var reads = new FileReader()
            const _that = this
            this.img = this.$refs.inputImg.files[0]
            reads.readAsDataURL(this.img)
            reads.onload = function () {
                _that.previewSrc = this.result
            }
            this.ifUploadImgBoxShow = true
            document.documentElement.classList.add('noscroll')
        },
        // 全屏浏览
        fullpageView (i) {
            this.bigImageIndex = i
            this.ifFullpageView = true
            document.documentElement.classList.add('noscroll')
        },
        exitFullpage () {
            this.ifFullpageView = false
            document.documentElement.classList.remove('noscroll')
            this.stopPlay()
        },
        slide (direction) {
            if(direction === 'left') {
                this.stopPlay()
                this.bigImageIndex = this.bigImageIndex-1 >= 0 ? this.bigImageIndex-1 : this.images.length-1
            }
            if(direction === 'right') {
                this.stopPlay()
                this.bigImageIndex = this.bigImageIndex+1 < this.images.length ? this.bigImageIndex+1 : 0
            }
            if(direction === 'auto') {
                this.bigImageIndex = this.bigImageIndex+1 < this.images.length ? this.bigImageIndex+1 : 0
            }
        },
        autoPlay () {
            this.ifAutoPlay = true
            this.timer = window.setInterval(()=>{
                this.slide('auto')
            }, 2000)
        },
        stopPlay () {
            this.ifAutoPlay = false
            window.clearInterval(this.timer)
        }
    }
}
</script>

<style lang="less" scoped>
.squareBox {
    margin-top: 30px;
    padding-top: 60px;
    width: 100%;
    position: relative;
    .addImgInputBtn {
        display: none;
    }
    .addImgBtn {
        position: absolute;
        top: -10px;
        right: 88px;
        padding: 6px 14px;
        border-radius: 3px;
        border: 1px solid #e6686a;
        cursor: pointer;
        font-size: 14px;
        &:hover {
            box-shadow: 0 0px 15px rgba(0,0,0,0.25);
        }
    }
    .uploadImgWrapper {
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 12;
        background: rgba(0,0,0,.8);
        display: flex;
        justify-content: center;
        align-items: center;
        .uploadImgContainer {
            width: 52%;
            height: 72%;
            border-radius: 6px;
            background: #fff;
            padding-top: 30px;
            font-size: 16px;
            position: relative;
            .confirmLabel {
                padding-left: 50px;
            }
            .uploadImgBox {
                width: 500px;
                height: 300px;
                margin: 40px auto 0;
                img {
                    width: 100%;
                    height: 100%;
                    vertical-align: bottom;
                    object-fit: cover;
                    object-position: center;
                }
            }
            .uploadBtn, .cancleBtn {
                border: 1px solid #e6686a;
                position: absolute;
                top: 32px;
                width: 90px;
                height: 30px;
                text-align: center;
                line-height: 30px;
                border-radius: 3px;
                &:hover {
                    box-shadow: 0 0 15px rgba(0,0,0,.3);
                }
            }
            .uploadBtn {
                right: 200px;
            }
            .cancleBtn {
                right: 80px;
            }
        }
    }

    .allImages {
        width: 1140px;
        margin-left: auto;
        margin-right: auto;
        .imageBox {
            padding: 15px;
            width: 380px;
            height: 380px;
            overflow: hidden;
            float: left;
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                object-position: center;
                cursor: pointer;
            }
        }
    }
    
    .fullPageBox {
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 12;
        background: rgba(0,0,0,.6);
        .bigImageBox {
            position: absolute;
            left:50%;
            top:50%;
            transform:translate(-50%,-50%);
            width: 900px;
            height: 520px;
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                object-position: center;
            }
        }
        a{
            position: absolute;
            display: inline-block;
            width: 32px;
            height: 32px;
            text-decoration: none;
            opacity: 0.4;
            z-index: 10;
            top: 48%;
            transition: all .3s;
            opacity: 0.4;
        }
        a.prev {
            left: 30px;;
            background-image: url(../../../static/images/prev.png);
        }
        a.next {
            right: 30px;;
            background-image: url(../../../static/images/next.png);
        }
        a.close {
            top: 30px;
            right: 30px;
            background-image: url(../../../static/images/close.png);
        }
        a.play, a.pause {
            top: 30px;
            left: 30px;
            opacity: .8;
        }
        a.play {
            background-image: url(../../../static/images/play.png);
        }
        a.pause{
            background-image: url(../../../static/images/pause.png);
        }
        a:hover {
            opacity: 1;
        }
        a.prev:hover,
        a.next:hover,
        a.close:hover {
            transform: scale(1.1);
        }
    }
}
</style>


