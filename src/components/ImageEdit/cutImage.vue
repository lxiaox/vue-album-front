<template>
  <div class="cut-image-page">
    <div class="model" v-show="model">
      <div class="model-show" @click="model = false">
        <img :src="modelSrc" alt @click="model = false">
      </div>
    </div>
    <vueCropper
      class="cut-wrapper"
      ref="cropper"
      :img="imageData"
      :outputSize="option.outputSize"
      :outputType="option.outputType"
      :canScale="option.canScale"
      :canMove="option.canMove"
      :autoCrop="option.autoCrop"
      :mode="option.mode"
    ></vueCropper>

    <div class="save-button-wrapper clearfix">
      <button @click="startCut" v-show="!isCutting">开始裁剪</button>
      <button @click="stopCut" v-show="isCutting">结束裁剪</button>
      <button @click="rotateLeft">向左旋转</button>
      <button @click="rotateRight">向右旋转</button>
      <button @click="previewCut">预览</button>
      <button @click="saveAtLocation">保存至本地</button>
      <button @click="cancelCutImage">取消</button>
      <a v-show="false" :href="downImg" download="图片裁剪.png" ref="downloadDom"></a>
    </div>
  </div>
</template>
 
<script>
export default {
  data() {
    return {
      imageData: "",
      model: false,
      modelSrc: "",
      isCutting: false,
      option: {
        outputSize: 0.8,
        outputtype: "png",
        canScale: false,
        canMove: false,
        autoCrop: false,
        mode: "contain"
      },
      downImg: "#",
    };
  },
  props: ["cuttingImage"],
  mounted() {
    this.imageData = this.cuttingImage.imageData;
  },
  methods: {
    cancelCutImage() {
      this.$emit("exit-cut-image");
    },
    startCut() {
      this.isCutting = true;
      this.$refs.cropper.startCrop();
    },
    stopCut() {
      this.isCutting = false;
      this.$refs.cropper.stopCrop();
    },
    getCutData() {
      this.$refs.cropper.getCropData();
    },
    previewCut() {
      this.$refs.cropper.getCropData(data => {
        this.model = true;
        this.modelSrc = data;
      });
    },
    saveAtLocation() {
      this.$refs.cropper.getCropData(data => {
        this.downImg = data;
        if (window.navigator.msSaveBlob) {
          var blobObject = new Blob([data]);
          window.navigator.msSaveBlob(blobObject, "demo.png");
        } else {
          this.$nextTick(() => {
            this.$refs.downloadDom.click();
          });
        }
      });
    },
    rotateRight() {
      this.$refs.cropper.rotateRight();
    },
    rotateLeft() {
      this.$refs.cropper.rotateLeft();
    }
  }
};
</script>
 
<style lang="less" scoped>
.cut-image-page {
  z-index: 100;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.8);
  .model {
    position: fixed;
    z-index: 10;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.8);
    .model-show {
      width: 99%;
      height: 90%;
      margin-top: 2%;
      overflow: hidden;
      img {
        object-fit: contain;
      }
    }
  }
  .cut-wrapper {
    position: absolute;
    top: 5%;
    left: 5%;
    width: 80%;
    height: 90%;
    overflow: hidden;
    background: none;
  }
  .save-button-wrapper {
    width: 120px;
    position: absolute;
    top: 5%;
    right: 4%;
    button {
      float: left;
      width: 120px;
      margin-bottom: 20px;
      font-size: 14px;
      background: #fff;
      &:hover {
        transform: scale(1.1);
      }
    }
  }
}
</style>