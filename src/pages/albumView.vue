<!-- 只点击相册进入 -->
<template>
  <div class="image-wrapper">
    <!-- 顶行相册信息、添加图片 -->
    <div class="top-row clearfix">
      <div class="album-cover">
        <img :src="viewAlbum.cover">
      </div>
      <span class="album-name">{{ viewAlbum.albumName }}</span>
      <span class="album-count">{{ viewAlbum.imageCounts }}张</span>
      <button class="add-image-button" @click="addImageBoxShow">
        <Icon type="ios-camera-outline" size="24"/>上传图片
      </button>
      <button class="to-layout-show-button" @click="toLayoutShow">
        <Icon type="ios-images-outline" size="22"/>
        布局展示
      </button>
      <button class="to-back-button" @click="toBackPage">返&nbsp;回</button>
    </div>
    <!-- 上传图片组件 -->
    <upload-image v-show="ifAddImageBoxShow" v-on:hide-upload-box="addImageHide"></upload-image>
    <!-- 全屏浏览组件 -->
    <full-page-view
      v-if="ifFullpageView"
      v-on:exit-full-page="fullpageViewHide"
      :images="images"
      :fullImageIndex="fullImageIndex"
    ></full-page-view>
    <!-- 图片展示 -->
    <div class="all-images clearfix">
      <div class="image-wrapper" v-for="(item, index) in images" :key="`square-image-Key${index}`">
        <!-- 照片图 -->
        <div class="image-box">
          <img :src="item.imageData" :title="dbclickMsg" @dblclick="fullpageViewShow(index)">
        </div>
        <!-- 照片名称 -->
        <div class="image-name-box" :title="item.imageName">{{ item.imageName }}</div>
        <!-- 下拉菜单 -->
        <Dropdown @on-click="handleDropDownClick($event, item)" class="drop-menu">
          <a href="javascript:void(0)">
            <Icon type="ios-arrow-down"></Icon>
          </a>
          <DropdownMenu class="drop-sub-menu" slot="list">
            <DropdownItem name="editImage">编辑照片信息</DropdownItem>
            <DropdownItem name="setAsCover">设置为封面</DropdownItem>
            <DropdownItem name="deleteImage">删除</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
    <!-- 编辑照片框 -->
    <div class="edit-image-wrapper" v-show="ifEditImageShow">
      <div class="edit-image-box">
        <div class="title clearfix">
          编辑照片信息
          <Icon @click="cancelEditImage" class="close-icon" type="md-close" size="18"/>
        </div>
        <div class="content">
          <div class="edit-image-name row">
            <label>照片名称</label>
            <input type="text" v-model="currentEditImage.imageName" placeholder="照片名称不超过30个字符">
          </div>
          <div class="edit-image-description row">
            <label>照片描述</label>
            <textarea v-model="currentEditImage.description" placeholder="照片描述"></textarea>
          </div>
          <div class="edit-image-filmingLocation row">
            <label>拍摄地点</label>
            <input type="text" v-model="currentEditImage.filmingLocation" placeholder="拍摄地点">
          </div>
        </div>
        <div class="foot-row">
          <button
            :disabled="btnDisalbed"
            :class="{'btn-disable': btnDisalbed}"
            class="primary"
            @click="editImage2"
          >保存</button>
          <button @click="cancelEditImage">取消</button>
        </div>
      </div>
    </div>
    <!-- 无照片显示 -->
    <div class="nothing-msg" v-show="noImageShow">
      <i class="iconfont icon-kong"></i>
      <br>
      <span @click="addImageBoxShow">还没有图片，去添加</span>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      images: [],
      imageSrc: "static/images/image.png",
      noImageShow: false,
      ifAddImageBoxShow: false,
      dbclickMsg: "双击图片全屏浏览",
      ifFullpageView: false,
      fullImageIndex: 0,
      viewAlbum: {},
      ifEditImageShow: false,
      currentEditImage: {},
      btnDisalbed: false
    };
  },
  created() {
    this.getImages();
    this.viewAlbum = JSON.parse(localStorage.viewAlbum);
  },
  methods: {
    getImages() {
      this.$http
        .get("http://127.0.0.1:3000/getImages", {
          params: {
            userId: localStorage.currentUser,
            albumId: JSON.parse(localStorage.viewAlbum).albumId
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
    getAlbum() {
      this.$http
        .get("http://127.0.0.1:3000/getAlbum", {
          params: {
            albumId: JSON.parse(localStorage.viewAlbum).albumId
          }
        })
        .then(
          res => {
            let newAlbum = res.data;
            this.viewAlbum = newAlbum;
            localStorage.viewAlbum = JSON.stringify(newAlbum);
          },
          req => {
            this.$Message.error("系统出错,请稍后重试");
          }
        );
    },
    addImageBoxShow() {
      this.ifAddImageBoxShow = true;
    },
    addImageHide() {
      this.getImages();
      this.getAlbum();
      this.ifAddImageBoxShow = false;
    },
    fullpageViewShow(index) {
      this.ifFullpageView = true;
      this.fullImageIndex = index;
      document.documentElement.classList.add("noscroll");
    },
    fullpageViewHide() {
      this.ifFullpageView = false;
      document.documentElement.classList.remove("noscroll");
    },
    handleDropDownClick($event, item) {
      if ($event === "editImage") this.editImage(item);
      if ($event === "setAsCover") this.setAsCover(item);
      if ($event === "deleteImage") this.deleteImage(item);
    },
    editImage(item) {
      this.ifEditImageShow = true;
      this.currentEditImage = JSON.parse(JSON.stringify(item));
    },
    editImage2() {
      if (this.currentEditImage.imageName.length > 30) {
        this.$Message.error("照片名称不能超过30个字符");
        return;
      }
      this.btnDisalbed = true;
      this.$http
        .post("http://127.0.0.1:3000/editImageMessage", {
          image: this.currentEditImage
        })
        .then(
          res => {
            this.$Message.success("编辑照片信息成功");
            this.cancelEditImage();
            this.getImages();
          },
          req => {
            this.$Message.error("系统出错");
          }
        );
    },
    cancelEditImage() {
      this.ifEditImageShow = false;
      this.btnDisalbed = false;
    },
    setAsCover(item) {
      this.$http
        .post("http://127.0.0.1:3000/setImageAsCover", {
          imageSrc: item.imageSrc,
          albumId: this.viewAlbum.albumId
        })
        .then(
          res => {
            this.$Message.success("设置成功");
            this.getAlbum();
          },
          req => {
            this.$Message.error("系统出错");
          }
        );
    },
    deleteImage(item) {
      this.$http
        .post("http://127.0.0.1:3000/deleteImage", {
          imageId: item.imageId,
          albumId: this.viewAlbum.albumId
        })
        .then(
          res => {
            this.$Message.success("删除成功");
            this.getImages();
            this.getAlbum();
          },
          req => {
            this.$Message.error("系统出错");
          }
        );
    },
    toLayoutShow() {
      this.$router.push({ name: "home.layoutShow" });
    },
    toBackPage() {
      window.history.back();
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../assets/less/color.less");
.image-wrapper {
  .top-row {
    // border: 1px solid;
    padding-left: 20px;
    position: relative;
    .album-cover {
      width: 80px;
      height: 80px;
      border: 4px solid #fff;
      display: inline-block;
      box-shadow: @box-shadow;
    }
    span {
      display: inline-block;
      vertical-align: top;
      padding: 5px 10px 0 10px;
      &.album-name {
        font-size: 22px;
        color: #000;
        text-shadow: 2px 2px #bbb;
      }
      &.album-count {
        font-size: 14px;
        color: #666;
        position: absolute;
        top: 48px;
        left: 104px;
      }
    }
    .add-image-button {
      position: absolute;
      top: 40px;
      left: 190px;
      font-size: 16px;
    }
    .to-layout-show-button {
      position: absolute;
      top: 40px;
      left: 340px;
      font-size: 16px;
    }
    .to-back-button {
      position: absolute;
      top: 40px;
      left: 490px;
      font-size: 16px;
    }
  }
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
  .all-images {
    width: 100%;
    padding-top: 40px;
    .image-wrapper {
      padding: 15px 15px 0 15px;
      width: 20%;
      margin-bottom: 40px;
      position: relative;
      float: left;
      margin-left: 24px;
      margin-right: 20px;
      box-shadow: @image-box-shadow;
      .image-box {
        height: 170px;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          cursor: pointer;
        }
      }
      .image-name-box {
        width: 100%;
        padding: 6px;
        text-align: center;
        font-size: 16px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .drop-menu {
        display: none;
        position: absolute;
        top: 18px;
        right: 18px;
        a {
          display: inline-block;
          border: 1px solid #666;
          background: #fff;
          font-size: 24px;
          line-height: 20px;
          border-radius: 3px;
        }
        /deep/ .ivu-select-dropdown {
          margin-left: -50px !important;
          .drop-sub-menu {
            min-width: 70px;
          }
        }
      }

      &:hover {
        .drop-menu {
          display: block;
        }
      }
    }
  }
  .edit-image-wrapper {
    z-index: 1000;
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.2);
    .edit-image-box {
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
        width: 456px;
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
          margin-right: 5px;
        }
      }
      .content {
        padding: 30px 16px 10px 38px;
        .row {
          label {
            padding-right: 20px;
          }
          input {
            width: 300px;
            font-size: 12px;
            padding: 8px 8px;
            border-radius: 3px;
            margin-bottom: 20px;
            border: 1px solid #e2e2e2;
          }
          &.edit-image-description {
            label {
              vertical-align: top;
            }
            textarea {
              padding: 8px;
              width: 300px;
              height: 80px;
              margin-bottom: 20px;
            }
          }
        }
      }
      .foot-row {
        width: 456px;
        padding: 10px;
        background: #f3f3f3;
        text-align: right;
        button {
          font-size: 12px;
          padding: 5px 20px;
          border-radius: 2px;
          cursor: pointer;
          &.btn-disable {
            cursor: not-allowed;
          }
          &.primary {
            border: 1px solid #4c92c8;
            background: #56bdf4;
            color: white;
            margin-right: 16px;
          }
          &:last-child {
            background: #fafafa;
            border: 1px solid #b4b4b4;
          }
        }
      }
    }
  }
}
</style>

