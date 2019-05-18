<template>
  <div class="image-wrapper">
    <button @click="addImageBoxShow">添加图片</button>
    <!-- 添加图片框 -->
    <div class="add-image-wrapper" v-show="ifAddImageBoxShow">
      <div class="add-image-box">
        <div class="title clearfix">
          上传图片
          <Icon @click="cancel()" class="close-icon" type="md-close" size="18"/>
        </div>
        <div class="content">
          <div
            class="image-preview"
            v-for="(item, index) in selectedImages"
            :key="`image-pre-key${index}`"
          >
            <div class="upload-progress-wrapper" v-show="item.ifUploadProgressShow">
              <span>正在上传: {{ item.progress }}</span>
            </div>
            <img :src="item.data" alt="图片预览">
            <Icon
              size="24"
              class="delete-icon"
              type="ios-trash-outline"
              @click.native="handleRemove(index)"
            ></Icon>
          </div>
          <input
            class="addImgInputBtn"
            multiple
            type="file"
            ref="inputImg"
            name="img"
            accept="image/*"
            @change="changePic"
          >
          <div :title="msg" class="camera-wrapper" @click="selectImage">
            <Icon type="ios-camera" size="60"></Icon>
          </div>
        </div>
        <div class="foot-row">
          <Button class="foot-btn" type="primary" @click="uploadImages" :loading="loading">
            <Icon type="ios-cloud-upload" size="22"/>&nbsp;开始上传
          </Button>
          <Button class="foot-btn" @click="cancel">取消</Button>
        </div>
      </div>
    </div>
    <!-- 图片展示
    <div class="allImages clearfix">
      <div class="imageBox shrinkIn" v-for="(item, index) in images" :key="`square-image-Key${index}`">
        <img :src="item.src" alt :title="message" @dblclick="fullpageView(index)">
      </div>
    </div>-->
    <!-- 无照片显示 -->
    <div class="no-album-box" v-show="noImageShow">
      <i class="iconfont icon-kong"></i>
    </div>

    <!-- 全屏浏览
    <div class="fullPageBox" v-if="ifFullpageView">
      <div class="bigImageBox">
        <img :src="images[bigImageIndex].src">
      </div>
      <a @click="slide('left')" class="prev"></a>
      <a @click="slide('right')" class="next"></a>
      <a @click="exitFullpage" class="close"></a>
      <a @click="autoPlay" class="play" v-show="!ifAutoPlay"></a>
      <a @click="stopPlay" class="pause" v-show="ifAutoPlay"></a>
    </div>-->
  </div>
</template>
<script>
export default {
  // name:'Image',
  data() {
    return {
      images: [],
      noImageShow: false,
      ifAddImageBoxShow: false,
      selectedImages: [],
      loading: false,
      msg: "选择图片上传"
    };
  },
  mounted() {
    this.getImages();
  },
  methods: {
    getImages() {
      this.$http
        .get("http://127.0.0.1:3000/getImages", {
          params: {
            userId: localStorage.currentUser,
            albumId: this.$route.params.album
          }
        })
        .then(
          res => {
            if (res.status === 201) {
              this.images = {};
              this.noImageShow = true;
            }
            if (res.status === 200) {
              this.images = res.data;
              this.noImageShow = false;
            }
          },
          req => {
            this.$Message.error("系统出错,请稍后重试");
          }
        );
    },
    addImageBoxShow() {
      this.ifAddImageBoxShow = true;
    },
    selectImage() {
      this.$refs.inputImg.click();
    },
    changePic() {
      const _that = this;
      let results = this.$refs.inputImg.files;
      Object.keys(results).forEach(key => {
        var reads = new FileReader();
        reads.readAsDataURL(results[key]);
        reads.onload = function() {
          _that.selectedImages.push({
            data: this.result,
            ifUploadProgressShow: false,
            progress: "0%"
          });
        };
      });
    },
    handleRemove(index) {
      this.selectedImages.splice(index, 1);
    },
    uploadImages() {
      if (this.selectedImages.length > 20) {
        this.$Message.error("最多只能选择20张图片");
        return;
      }
      this.loading = true
      this.selectedImages.forEach((item, index) => {
        item.ifUploadProgressShow = true;
      });
      console.log(this.selectedImages);
      let uploadData = this.selectedImages;
      this.uploadDataFn(this.selectedImages[0]);
    },
    cancel() {
      this.ifAddImageBoxShow = false;
      this.selectedImages = [];
      this.loading = false
    },
    uploadDataFn(item) {
      var config = {
        onUploadProgress: progressEvent => {
          var complete =
            (((progressEvent.loaded / progressEvent.total) * 100) | 0) + "%";
          item.progress = complete;
        }
      };
      this.$http
        .post(
          "http://127.0.0.1:3000/addImage",
          {
            userId: localStorage.userId,
            album: this.$route.params.album,
            image: item.data
          },
          config
        )
        .then(
          res => {
            let i = this.selectedImages.indexOf(item);
            this.selectedImages.splice(i, 1);
            if (this.selectedImages.length === 0) {
              setTimeout(() => {
                this.$Message.success("图片上传完成!");
                this.cancel();
              }, 2000);
            } else {
              this.uploadDataFn(this.selectedImages[0]);
            }
          },
          req => {
            this.$Message.error("服务器忙,请稍后再试");
          }
        );
    }
  }
};
</script>

<style lang="less" scoped>
.image-wrapper {
  .add-image-wrapper {
    z-index: 1000;
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.2);
    .add-image-box {
      border: 1px solid #999;
      box-shadow: 0 0 5px #535658;
      border-radius: 5px;
      padding: 1px;
      background: #fff;
      position: absolute;
      top: 75px;
      left: 50%;
      transform: translateX(-50%);
      .title {
        width: 1205px;
        color: #4c4c4c;
        font-size: 12px;
        font-weight: 700;
        padding-left: 10px;
        line-height: 32px;
        height: 32px;
        background: #f3f3f3;
        border-bottom: 1px solid #ccc;
        .close-icon {
          float: right;
          margin-top: 5px;
          margin-right: 15px;
        }
      }
      .content {
        height: 350px;
        padding: 16px;
        display: flex;
        justify-content: left;
        flex-wrap: wrap;
        .addImgInputBtn {
          display: none;
        }
        .image-preview {
          width: 100px;
          height: 100px;
          margin-right: 16px;
          margin-bottom: 16px;
          position: relative;
          .upload-progress-wrapper {
            width: 100%;
            height: 100%;
            position: absolute;
            background: rgba(250, 250, 250, 0.5);
            color: #111;
            span {
              position: absolute;
              left: 2px;
              bottom: 2px;
            }
          }
          .delete-icon {
            display: none;
            position: absolute;
            top: 1px;
            right: 1px;
            background: rgba(250, 250, 250);
            color: red;
            border-radius: 1px;
          }
          &:hover {
            background: rgba(0, 0, 0, 0.6);
            .delete-icon {
              display: inline-block;
            }
          }
        }
        .camera-wrapper {
          border: 2px dashed #ccc;
          text-align: center;
          padding: 20px 22px 20px 18px;
          height: 100px;
          width: 100px;
          display: inline-block;
          cursor: pointer;
        }
      }
      .foot-row {
        width: 1205px;
        padding: 10px;
        background: #f3f3f3;
        text-align: right;
        /deep/ .foot-btn {
          font-size: 14px;
          margin-right: 16px;
        }
      }
    }
  }
  .no-album-box {
    width: 100%;
    text-align: center;
    font-size: 20px;
    padding-top: 100px;
    padding-bottom: 130px;
    text-decoration: underline;
    .icon-kong {
      font-size: 100px;
    }
  }
}
</style>

