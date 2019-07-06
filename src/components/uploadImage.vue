<template>
  <!-- 添加图片框 -->
  <div class="add-image-wrapper">
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
          <img v-if="!item.isVideo" :src="item.data" alt="图片预览">
          <video v-if="item.isVideo" controls>
            <source :src="item.data">
          </video>
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
          accept="image/*, video/*"
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
</template>

<script>
export default {
  data() {
    return {
      selectedImages: [],
      loading: false,
      msg: "选择图片上传",
      uploadBatch: ""
    };
  },
  methods: {
    selectImage() {
      this.$refs.inputImg.click();
    },
    changePic() {
      const _that = this;
      let results = [...this.$refs.inputImg.files];
      this.$refs.inputImg.value = "";
      results.forEach(item => {
        let isVideo = false;
        if (item.type.slice(0, 5) === "video") {
          isVideo = true;
        }
        var reads = new FileReader();
        reads.readAsDataURL(item);
        reads.onload = function() {
          console.log(this.result)
          _that.selectedImages.push({
            isVideo: isVideo,
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
      if (this.selectedImages.length === 0) {
        this.$Message.error("请先选择图片");
        return;
      }
      if (this.selectedImages.length > 20) {
        this.$Message.error("最多只能选择20张图片");
        return;
      }
      this.loading = true;
      this.selectedImages.forEach((item, index) => {
        item.ifUploadProgressShow = true;
      });
      this.getUploadId().then(success => {
        this.uploadDataFn(this.selectedImages[0]);
      });
    },
    getUploadId() {
      return new Promise((resolve, reject) => {
        this.$http
          .get("http://127.0.0.1:3000/addUpload", {
            params: {
              userId: localStorage.currentUser,
              albumId: JSON.parse(localStorage.viewAlbum).albumId,
              uploadCounts: this.selectedImages.length
            }
          })
          .then(
            res => {
              this.uploadBatch = res.data;
              resolve();
            },
            req => {
              this.uploadBatch = "";
              console.log("未获取到批次号");
              reject();
            }
          );
      });
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
            userId: localStorage.currentUser,
            albumId: JSON.parse(localStorage.viewAlbum).albumId,
            image: item.data,
            uploadId: this.uploadBatch,
            isVideo: item.isVideo
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
              }, 300);
            } else {
              this.uploadDataFn(this.selectedImages[0]);
            }
          },
          req => {
            this.$Message.error("服务器忙,请稍后再试");
          }
        );
    },
    cancel() {
      this.selectedImages = [];
      this.$refs.inputImg.value = "";
      this.uploadBatch = "";
      this.loading = false;
      this.$emit("hide-upload-box");
    }
  }
};
</script>

<style lang="less" scoped>
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
        margin-top: 7px;
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
        overflow: hidden;
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
</style>

