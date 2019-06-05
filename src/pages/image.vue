<template>
  <div class="image-page-wrapper">
    <!-- 上传记录 -->
    <div class="uploads-wrapper">
      <div
        class="upload-item clearfix"
        v-for="(item, index) in imagesTree"
        :key="`upload-key${index}`"
      >
        <!-- 上传信息 -->
        <div class="upload-msg">
          <span>{{ item.uploadDate }}</span>
          <span>上传至相册:</span>
          <span class="album-name" @click="toAlbumView(item.albumId)">&lt; {{ item.albumName }} &gt;</span>
        </div>
        <!-- 上传照片 -->
        <div class="upload-images-wrapper clearfix">
          <div
            @click="fullPageView(item.imagesArr, i)"
            class="upload-image"
            v-for="(img,i) in item.imagesArr"
            :key="`upload-image-key${i}`"
            :title="clickMsg"
          >
            <img :src="img.imageData">
          </div>
        </div>
        <!-- 删除按钮 -->
        <div class="upload-delete">
          <span class="delete-btn" @click="deleteUpload(item)">删除</span>
          <!-- <span>(包括照片)</span> -->
        </div>
      </div>
    </div>
    <!-- 无照片显示 -->
    <div class="nothing-msg" v-show="noImageShow">
      <i class="iconfont icon-kong"></i>
    </div>
    <!-- 全屏浏览组件 -->
    <full-page-view
      v-if="ifFullpageView"
      v-on:exit-full-page="fullpageViewHide"
      :images="fullPageImages"
      :fullImageIndex="fullImageIndex"
    ></full-page-view>
    <!-- 加载状态提示 -->
    <div class="loading-msg">
      <span v-show="loading">正在加载中...</span>
      <span v-show="!loading">已经全部加载</span>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      imagesTree: [],
      noImageShow: false,
      queryCount: 0,
      queryAmount: 3,
      loading: true,
      repeatLoading: true,
      fullPageImages: [],
      ifFullpageView: false,
      fullImageIndex: 0,
      clickMsg: "点击查看大图"
    };
  },
  mounted() {
    const _this = this;
    if (_this.loading) {
      this.getUploadsTree(this.queryCount++);
    }
    setTimeout(() => {
      document.onscroll = function() {
        if (!_this.repeatLoading) return;
        if (
          document.documentElement.scrollTop +
            document.documentElement.clientHeight >=
          document.documentElement.scrollHeight - 1
        ) {
          if (_this.loading) _this.getUploadsTree(_this.queryCount++);
        }
      };
    }, 1000);
  },
  methods: {
    getUploadsTree(count) {
      this.repeatLoading = false;
      this.$http
        .get("http://127.0.0.1:3000/getUploadsTree", {
          params: {
            userId: localStorage.currentUser,
            queryCount: count,
            queryAmount: this.queryAmount
          }
        })
        .then(
          res => {
            this.repeatLoading = true;
            if (res.status === 201) {
              if (this.queryCount === 1) {
                this.noImageShow = true;
                this.imagesTree = [];
              }
              this.loading = false;
            }
            if (res.status === 200) {
              this.noImageShow = false;
              this.imagesTree = this.imagesTree.concat(res.data);
            }
          },
          req => {
            this.$Message.error("系统出错");
          }
        );
    },
    toAlbumView(albumId) {
      this.setViewAlbum(albumId).then(value => {
        this.$router.push({ name: "home.albumView" });
      });
    },
    setViewAlbum(albumId) {
      return new Promise((resolve, reject) => {
        this.$http
          .get("http://127.0.0.1:3000/getAlbum", {
            params: {
              albumId: albumId
            }
          })
          .then(
            res => {
              localStorage.viewAlbum = JSON.stringify(res.data);
              resolve();
            },
            req => {
              this.$Message.error("系统出错");
              reject();
            }
          );
      });
    },
    fullPageView(images, i) {
      this.fullPageImages = images;
      this.fullImageIndex = i;
      this.ifFullpageView = true;
    },
    fullpageViewHide() {
      this.ifFullpageView = false;
    },
    deleteUpload(uploadItem) {
      this.$http
        .post("http://127.0.0.1:3000/deleteUpload", {
          uploadId: uploadItem.uploadId
        })
        .then(
          res => {
            this.$Message.success("删除上传记录成功");
            let index = this.imagesTree.indexOf(uploadItem);
            this.imagesTree.splice(index, 1);
          },
          req => {
            this.$Message.error("系统出错，请稍后重试");
          }
        );
    }
  }
};
</script>

<style lang="less">
@import url("../assets/less/color.less");
.image-page-wrapper {
  padding-top: 20px;
  padding-left: 30px;
  .uploads-wrapper {
    .upload-item {
      margin-bottom: 25px;
      .upload-msg {
        font-size: 15px;
        .album-name {
          color: darkcyan;
          cursor: pointer;
          font-size: 16px;
        }
      }
      .upload-images-wrapper {
        margin-top: 10px;
        margin-left: 50px;
        .upload-image {
          float: left;
          width: 200px;
          height: 150px;
          cursor: pointer;
          margin-right: 10px;
          margin-bottom: 10px;
        }
      }
      .upload-delete {
        padding: 5px 0 5px 50px;
        font-size: 12px;
        .delete-btn {
          cursor: pointer;
          color: rgb(224, 84, 84);
        }
      }
    }
  }
  .loading-msg {
    text-align: center;
  }
}
</style>


