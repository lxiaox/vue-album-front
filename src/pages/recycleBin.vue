<template>
  <div class="recycle-bin-page">
    <!-- 相册站 -->
    <div class="bin-wrapper album-bin-wrapper" v-show="deletedAlbumsShow">
      <!-- 操作菜单行 -->
      <div class="title-row">
        <span class="bin-name-span">相册回收站</span>
        <Checkbox
          :indeterminate="someAlbumsFlag"
          :value="allAlbumsFlag"
          @click.prevent.native="handleCheckAllAlbums"
        >全选相册</Checkbox>
        <button class="re-add" @click="reAddAlbums">还原</button>
        <button @click="clearAlbums">删除</button>
      </div>
      <!-- 相册 -->
      <div class="AI-wrapper clearfix">
        <CheckboxGroup v-model="checkedAlbums" @on-change="checkedAlbumsChange">
          <div
            class="AI-box"
            v-for="(item, index) in deletedAlbums"
            :key="`deleted-album-${index}`"
          >
            <!-- 选择框 -->
            <Checkbox class="AI-checkbox" :label="item.albumId">
              <!-- 封面 -->
              <div class="AI-image">
                <img :src="item.cover">
              </div>
              <!-- 名称 -->
              <div class="AI-name">{{ item.albumName }}</div>
            </Checkbox>
          </div>
        </CheckboxGroup>
      </div>
    </div>
    <hr>
    <!-- 照片站 -->
    <div class="bin-wrapper image-bin-wrapper" v-show="deletedImagesShow">
      <!-- 操作菜单行 -->
      <div class="title-row">
        <span class="bin-name-span">照片回收站</span>
        <Checkbox
          :indeterminate="someImagesFlag"
          :value="allImagesFlag"
          @click.prevent.native="handleCheckAllImages"
        >全选照片</Checkbox>
        <button class="re-add" @click="reAddImages">还原</button>
        <button @click="clearImages">删除</button>
      </div>
      <!-- 照片 -->
      <div class="AI-wrapper clearfix">
        <CheckboxGroup v-model="checkedImages" @on-change="checkedImagesChange">
          <div
            class="AI-box"
            v-for="(item, index) in deletedImages"
            :key="`deleted-image-${index}`"
          >
            <label>
              <!-- 选择框 -->
              <Checkbox class="AI-checkbox" :label="item.imageId">
                <!-- 照片 -->
                <div class="AI-image">
                  <img :src="item.imageData">
                </div>
                <!-- 名称 -->
                <div class="AI-name">{{ item.imageName }}</div>
              </Checkbox>
            </label>
          </div>
        </CheckboxGroup>
      </div>
    </div>
    <!-- 选择相册 -->
    <div class="select-album-wrapper" v-show="selectAlbumShow">
      <div class="select-album-box">
        <div class="select-album-title">
          选择相册
          <Icon @click="cancelSelectAlbum" class="close-icon" type="md-close" size="18"/>
        </div>
        <div class="select-album-content">
          <div class="no-album-content" v-show="noAlbumTipShow">
            <span @click="goAlbumPage">还没有相册，去创建</span>
          </div>
          <div class="have-album-content" v-show="!noAlbumTipShow">
            <label>保存到：</label>
            <Select v-model="selectAlbumId" style="width:200px">
              <Option
                v-for="(item,index) in albumsList"
                :value="item.value"
                :key="`selecet-album-save-${index}`"
              >{{ item.label }}</Option>
            </Select>
          </div>
        </div>
        <div class="select-album-foot">
          <button class="primary" @click="reAddImages2">确定</button>
          <button @click="cancelSelectAlbum">取消</button>
        </div>
      </div>
    </div>
    <!-- 回收站空显示 -->
    <div class="nothing-msg" v-show="!deletedAlbumsShow && !deletedImagesShow">
      <i class="iconfont icon-kong"></i>
      <br>
      <span>回收站为空</span>
    </div>
    <!-- 正在加载遮罩 -->
    <div class="loading-wrapper" v-show="ifLoadingShow1 || ifLoadingShow2">
      <div class="loading-box">
        <img src="static/images/loading.gif">
      </div>
    </div>
    <!-- 清空回收站 -->
    <button @click="clearBin" class="clear-bin">
      清空回收站
      <Icon type="ios-trash-outline" size="19"/>
    </button>
    <!-- 删除提示 -->
    <Modal
      class="clear-top-box"
      v-model="modalClear"
      title="操作提示"
      width="400"
      :styles="{top: '240px'}"
      @on-ok="confirmClearBin"
    >
      <p>确认清空回收站所有相册及照片?</p>
    </Modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      deletedAlbums: [],
      deletedAlbumsShow: true,
      deletedImages: [],
      deletedImagesShow: true,
      // 多选album
      allAlbumsFlag: false,
      someAlbumsFlag: false,
      checkedAlbums: [],
      allAlbumsId: [],
      checkedAlbumsLength: 0,
      reAddAlbumsCount: 0,
      // 多选image
      allImagesFlag: false, //全选标识
      someImagesFlag: false, // 选部分标识
      checkedImages: [],
      allImagesId: [],
      checkedImagesLength: 0, 
      reAddImagesCount: 0, // 操作计数
      // 选择相册
      selectAlbumShow: false,
      noAlbumTipShow: false,
      selectAlbumId: "",
      albums: {},
      albumsList: [],
      // 加载动画
      ifLoadingShow1: false,
      ifLoadingShow2: false,
      // 清空
      modalClear: false
    };
  },
  mounted() {
    this.getDeletedAlbums();
    this.getDeletedImages();
    this.getAlbums();
  },
  methods: {
    // 初始化
    getDeletedAlbums() {
      return new Promise(resolve => {
        this.$http
          .get("http://127.0.0.1:3000/getDeletedAlbums", {
            params: { userId: localStorage.currentUser }
          })
          .then(
            res => {
              if (res.status === 201) {
                this.deletedAlbumsShow = false;
                this.deletedAlbums = [];
                this.allAlbumsId = [];
              }
              if (res.status === 200) {
                this.deletedAlbumsShow = true;
                this.deletedAlbums = res.data;
                this.allAlbumsId = [];
                this.deletedAlbums.forEach(item => {
                  this.allAlbumsId.push(item.albumId);
                });
              }
              resolve();
            },
            req => {
              this.$Message.error("系统出错,请稍后重试");
              resolve();
            }
          );
      });
    },
    getDeletedImages() {
      return new Promise(resolve => {
        this.$http
          .get("http://127.0.0.1:3000/getDeletedImages", {
            params: { userId: localStorage.currentUser }
          })
          .then(
            res => {
              if (res.status === 201) {
                this.deletedImagesShow = false;
                this.deletedImages = [];
                this.allImagesId = [];
              }
              if (res.status === 200) {
                this.deletedImagesShow = true;
                this.deletedImages = res.data;
                this.allImagesId = [];
                this.deletedImages.forEach(item => {
                  this.allImagesId.push(item.imageId);
                });
              }
              resolve();
            },
            req => {
              this.$Message.error("系统出错,请稍后重试");
              resolve();
            }
          );
      });
    },
    // 全选
    handleCheckAllAlbums() {
      if (this.someAlbumsFlag) {
        this.allAlbumsFlag = false;
      } else {
        this.allAlbumsFlag = !this.allAlbumsFlag;
      }
      this.someAlbumsFlag = false;

      if (this.allAlbumsFlag) {
        this.checkedAlbums = this.allAlbumsId;
      } else {
        this.checkedAlbums = [];
      }
    },
    handleCheckAllImages() {
      if (this.someImagesFlag) {
        this.allImagesFlag = false;
      } else {
        this.allImagesFlag = !this.allImagesFlag;
      }
      this.someImagesFlag = false;

      if (this.allImagesFlag) {
        this.checkedImages = this.allImagesId;
      } else {
        this.checkedImages = [];
      }
    },
    // 单选
    checkedAlbumsChange(data) {
      if (data.length === this.allAlbumsId.length) {
        this.someAlbumsFlag = false;
        this.allAlbumsFlag = true;
      } else if (data.length > 0) {
        this.someAlbumsFlag = true;
        this.allAlbumsFlag = false;
      } else {
        this.someAlbumsFlag = false;
        this.allAlbumsFlag = false;
      }
    },
    checkedImagesChange(data) {
      if (data.length === this.allImagesId.length) {
        this.someImagesFlag = false;
        this.allImagesFlag = true;
      } else if (data.length > 0) {
        this.someImagesFlag = true;
        this.allImagesFlag = false;
      } else {
        this.someImagesFlag = false;
        this.allImagesFlag = false;
      }
    },

    // 还原相册
    reAddAlbums() {
      if (this.checkedAlbums.length === 0) {
        this.$Message.warning("请先选择要还原的相册");
        return;
      }
      this.checkedAlbums.forEach(albumId => {
        this.reAddAlbum(albumId);
      });
      this.checkedAlbumsLength = this.checkedAlbums.length;
      this.checkedAlbums = [];
      this.ifLoadingShow = true;
      this.someAlbumsFlag = false;
      this.allAlbumsFlag = false;
    },
    reAddAlbum(albumId) {
      this.$http
        .post("http://127.0.0.1:3000/reAddAlbum", {
          albumId: albumId
        })
        .then(
          res => {
            this.reAddAlbumsCount = this.reAddAlbumsCount + 1;
            if (this.reAddAlbumsCount === this.checkedAlbumsLength) {
              this.getDeletedAlbums().then(() => {
                this.ifLoadingShow = false;
              });
              this.reAddImagesCount = 0;
              this.$Message.success("还原相册完成");
            }
          },
          req => {
            this.$Message.error("系统出错");
          }
        );
    },

    // 还原照片
    reAddImages() {
      if (this.checkedImages.length === 0) {
        this.$Message.warning("请先选择要还原的照片");
        return;
      }
      this.selectAlbumShow = true;
    },
    cancelSelectAlbum() {
      this.selectAlbumShow = false;
    },
    getAlbums() {
      this.$http
        .get("http://127.0.0.1:3000/getAlbums", {
          params: { userId: localStorage.currentUser }
        })
        .then(
          res => {
            if (res.status === 201) {
              this.albums = {};
              this.noAlbumTipShow = true;
            }
            if (res.status === 200) {
              this.albums = res.data;
              this.albums.forEach(item => {
                this.albumsList.push({
                  value: item.albumId,
                  label: item.albumName
                });
              });
              this.noAlbumTipShow = false;
            }
          },
          req => {
            this.$Message.error("系统出错,请稍后重试");
          }
        );
    },
    reAddImages2() {
      if (!this.selectAlbumId) {
        this.$Message.warning("请先选择相册");
        return;
      }
      this.checkedImages.forEach(imageId => {
        this.reAddImage(imageId);
      });
      this.checkedImagesLength = this.checkedImages.length;
      this.checkedImages = [];
      this.ifLoadingShow = true;
      this.someImagesFlag = false;
      this.allImagesFlag = false;
    },
    reAddImage(imageId) {
      this.$http
        .post("http://127.0.0.1:3000/reAddImage", {
          imageId: imageId,
          albumId: this.selectAlbumId
        })
        .then(
          res => {
            this.reAddImagesCount = this.reAddImagesCount + 1;
            if (this.reAddImagesCount === this.checkedImagesLength) {
              this.getDeletedImages().then(() => {
                this.ifLoadingShow = false;
              });
              this.reAddImagesCount = 0;
              this.$Message.success("还原照片完成");
            }
          },
          req => {
            this.$Message.error("系统出错");
          }
        );
    },
    goAlbumPage() {
      this.$router.push({ name: "home.album" });
    },

    // 清除相册
    clearAlbums() {
      if (this.checkedAlbums.length === 0) {
        this.$Message.warning("请先选择要删除的相册");
        return;
      }
      this.checkedAlbums.forEach(albumId => {
        this.clearAlbum(albumId);
      });
      this.checkedAlbumsLength = this.checkedAlbums.length;
      this.checkedAlbums = [];
      this.ifLoadingShow1 = true;
      this.someAlbumsFlag = false;
      this.allAlbumsFlag = false;
    },
    clearAlbum(albumId) {
      this.$http
        .post("http://127.0.0.1:3000/clearAlbum", {
          albumId: albumId
        })
        .then(
          res => {
            this.reAddAlbumsCount = this.reAddAlbumsCount + 1;
            if (this.reAddAlbumsCount === this.checkedAlbumsLength) {
              this.getDeletedAlbums().then(() => {
                this.ifLoadingShow1 = false;
              });
              this.reAddImagesCount = 0;
              this.$Message.success("删除相册完成");
            }
          },
          req => {
            this.$Message.error("系统出错");
          }
        );
    },
    // 清除照片
    clearImages() {
      if (this.checkedImages.length === 0) {
        this.$Message.warning("请先选择要删除的照片");
        return;
      }
      this.checkedImages.forEach(imageId => {
        this.clearImage(imageId);
      });
      this.checkedImagesLength = this.checkedImages.length;
      this.checkedImages = [];
      this.ifLoadingShow2 = true;
      this.someImagesFlag = false;
      this.allImagesFlag = false;
    },
    clearImage(imageId) {
      this.$http
        .post("http://127.0.0.1:3000/clearImage", {
          imageId: imageId
        })
        .then(
          res => {
            this.reAddImagesCount = this.reAddImagesCount + 1;
            if (this.reAddImagesCount === this.checkedImagesLength) {
              this.getDeletedImages().then(() => {
                this.ifLoadingShow2 = false;
              });
              this.reAddImagesCount = 0;
              this.$Message.success("删除照片完成");
            }
          },
          req => {
            this.$Message.error("系统出错");
          }
        );
    },

    // 清空
    clearBin() {
      this.modalClear = true;
    },
    confirmClearBin() {
      this.checkedAlbums = this.allAlbumsId
      this.checkedImages = this.allImagesId
      if (this.checkedAlbums.length > 0) {
        this.clearAlbums();
      }
      if (this.checkedImages.length > 0) {
        this.clearImages();
      }
    }
  }
};
</script>

<style lang="less" scoped>
.recycle-bin-page {
  padding: 0 20px;
  font-size: 14px;
  position: relative;
  .bin-wrapper {
    button {
      padding: 3px 5px;
      border-radius: 3px;
      &.re-add {
        margin-right: 20px;
        margin-left: 10px;
      }
    }
    &.album-bin-wrapper {
      margin-bottom: 10px;
    }
    &.image-bin-wrapper {
      margin-top: 30px;
    }
    .title-row {
      padding: 10px;
      margin-bottom: 30px;
      border-left: 5px solid rgba(0, 139, 139, 0.9);
      border-radius: 2px;

      .bin-name-span {
        font-size: 18px;
        padding-right: 30px;
      }
    }
    .AI-wrapper {
      .AI-box {
        float: left;
        width: calc(25% - 40px);
        position: relative;
        margin: 0 20px 30px 20px;
        border: 0.5px solid darkcyan;
        /deep/ .AI-checkbox {
          margin-right: 0 !important;
          vertical-align: bottom;
        }
        /deep/ .ivu-checkbox {
          position: absolute;
          top: 5px;
          left: 5px;
        }
        .AI-image {
          width: 100%;
          height: 150px;
        }
        .AI-name {
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          padding: 8px 10px;
          font-size: 13px;
        }
      }
    }
  }
  .select-album-wrapper {
    z-index: 1000;
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.2);
    .select-album-box {
      border: 1px solid #999;
      box-shadow: 0 0 5px #535658;
      border-radius: 5px;
      padding: 1px;
      background: #fff;
      position: absolute;
      top: 30%;
      left: 50%;
      transform: translateX(-50%);
      .select-album-title {
        width: 330px;
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
      .select-album-content {
        padding: 30px;
        .no-album-content {
          text-align: center;
          span {
            cursor: pointer;
            &:hover {
              color: darkcyan;
            }
          }
        }
      }
      .select-album-foot {
        width: 330px;
        padding: 10px;
        background: #f3f3f3;
        text-align: right;
        button {
          font-size: 12px;
          height: 24px;
          line-height: 24px;
          padding: 0 16px;
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
  .loading-wrapper {
    z-index: 1000;
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.2);
    .loading-box {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%);
      width: 25px;
      height: 25px;
    }
  }
  .clear-bin {
    position: absolute;
    top: 5px;
    right: 10px;
  }
}
</style>


