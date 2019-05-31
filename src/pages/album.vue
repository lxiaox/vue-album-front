<template>
  <div class="album-wrapper">
    <!-- 创建相册行 -->
    <div class="create-album-row">
      <button class="create-album" @click="addAlbum">
        <Icon type="ios-create-outline" size="24"/>
        创建相册
      </button>
    </div>
    <!-- 所有相册 -->
    <div class="album-box-wrapper clearfix">
      <div class="album-box" v-for="(item, index) in albums" :key="`template-albums${index}`">
        <div class="album-cover" @click="toAlbumView(item)">
          <img :src="item.cover" alt="相册封面">
        </div>
        <div class="album-msg clearfix">
          <div class="album-name">
            <span :title="item.albumName">{{ item.albumName }}</span>
          </div>
          <div class="album-image-counts">
            <span>{{ item.imageCounts }}</span>
            <br>
            <span>images</span>
          </div>
        </div>
        <!-- 下拉菜单 -->
        <Dropdown @on-click="handleDropDownClick($event, item)" class="drop-menu">
          <a href="javascript:void(0)">
            <Icon type="ios-arrow-down"></Icon>
          </a>
          <DropdownMenu class="drop-sub-menu" slot="list">
            <DropdownItem name="editAlbum">编辑相册</DropdownItem>
            <DropdownItem name="deleteAlbum">删除相册</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
    <!-- 删除提示 -->
    <Modal
      class="delete-top-box"
      v-model="modalDel"
      title="操作提示"
      width="400"
      :styles="{top: '240px'}"
      @on-ok="confirmDelete"
    >
      <p>删除后可在回收站内查看</p>
    </Modal>
    <!-- 无相册显示 -->
    <div class="nothing-msg" v-show="noAlbumShow">
      <i class="iconfont icon-kong"></i>
      <br>
      <span @click="addAlbum">还没有相册，去创建</span>
    </div>
    <!-- 新建/编辑相册框 -->
    <div class="add-album-box-wrapper" v-show="addAlbumShow">
      <div class="add-album-box">
        <div class="title clearfix">
          创建相册
          <Icon @click="cancelAddAlbum" class="close-icon" type="md-close" size="18"/>
        </div>
        <div class="content">
          <div class="row2">
            <label>相册名称</label>
            <input v-model="addAlbumName" type="text" placeholder="不超过10个字符">
          </div>
          <div class="row2">
            <label class="album-description">相册描述</label>
            <textarea v-model="addAlbumDescription"></textarea>
          </div>
          <div class="row2 row-cover" v-show="!isAddAlbum">
            <label>更换封面</label>
            <button class="upload-img-btn" @click="uploadImage">选择图片</button>
            <input
              class="upload-img-default"
              ref="inputImg"
              type="file"
              name="img"
              accept="image/*"
              @change="changePic"
            >
            <div v-show="coverPreviewShow" class="previewCoverWrapper">
              <img :src="newCoverSrc">
            </div>
          </div>
          <div class="row2">
            <label class="class-title">分类</label>
            <label
              v-for="(item, index) in albumClass"
              class="class-option"
              :key="`album-class${index}`"
            >
              <input
                v-model="addAlbumClassification"
                type="radio"
                name="classification"
                :value="item.value"
              >
              {{ item.name }}
            </label>
          </div>
        </div>
        <div class="foot-row">
          <button
            :disabled="btnDisalbed"
            :class="{'btn-disable': btnDisalbed}"
            class="primary"
            @click="editAlbum2"
            v-show="!isAddAlbum"
          >保存</button>
          <button
            :disabled="btnDisalbed"
            :class="{'btn-disable': btnDisalbed}"
            class="primary"
            @click="addAlbum2"
            v-show="isAddAlbum"
          >确定</button>
          <button @click="cancelAddAlbum">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      albums: [],
      addAlbumName: "",
      addAlbumDescription: "",
      noAlbumShow: false,
      addAlbumShow: false,
      isAddAlbum: true,
      albumClass: [
        { value: 1, name: "普通" },
        { value: 2, name: "风景" },
        { value: 3, name: "人物" },
        { value: 4, name: "美食" },
        { value: 5, name: "旅游" }
      ],
      addAlbumClassification: 1,
      newCoverSrc: "",
      coverPreviewShow: false,
      currentEditAlbum: {},
      currentDeleteAlbum: {},
      modalDel: false,
      btnDisalbed: false
    };
  },
  created() {
    this.getAlbums();
  },
  methods: {
    getAlbums() {
      this.$http
        .get("http://127.0.0.1:3000/getAlbums", {
          params: { userId: localStorage.currentUser }
        })
        .then(
          res => {
            if (res.status === 201) {
              this.albums = {};
              this.noAlbumShow = true;
            }
            if (res.status === 200) {
              this.albums = res.data;
              this.noAlbumShow = false;
            }
          },
          req => {
            this.$Message.error("系统出错,请稍后重试");
          }
        );
    },
    toAlbumView(item) {
      this.$router.push({ name: `home.albumView`, params: { album: item } });
      localStorage.viewAlbum = JSON.stringify(item);
    },
    addAlbum() {
      this.addAlbumShow = true;
      this.isAddAlbum = true;
      this.addAlbumName = "";
      this.addAlbumDescription = "";
      this.addAlbumClassification = 1;
    },
    addAlbum2() {
      if (!this.addAlbumName.trim()) {
        this.$Message.error("相册名称不能为空");
        return;
      }
      if (this.addAlbumName.length > 10) {
        this.$Message.error("相册名称过长");
        return;
      }
      this.btnDisalbed = true;
      this.$http
        .post("http://127.0.0.1:3000/addAlbum", {
          userId: localStorage.currentUser,
          albumName: this.addAlbumName,
          description: this.addAlbumDescription,
          classification: this.addAlbumClassification
        })
        .then(
          res => {
            this.cancelAddAlbum();
            this.getAlbums();
          },
          req => {
            this.$Message.error(req.response.data);
          }
        );
    },
    cancelAddAlbum() {
      this.addAlbumShow = false;
      this.coverPreviewShow = false;
      this.newCoverSrc = "";
      this.btnDisalbed = false;
    },
    handleDropDownClick($event, item) {
      if ($event === "editAlbum") this.editAlbum(item);
      if ($event === "deleteAlbum") this.deleteAlbum(item);
    },
    editAlbum(item) {
      this.addAlbumShow = true;
      this.isAddAlbum = false;
      this.addAlbumName = item.albumName;
      this.addAlbumDescription = item.description;
      this.addAlbumClassification = item.classification;
      this.currentEditAlbum = item;
    },
    uploadImage() {
      this.$refs.inputImg.click();
    },
    editAlbum2() {
      if (!this.addAlbumName.trim()) {
        this.$Message.error("相册名称不能为空");
        return;
      }
      if (this.addAlbumName.length > 10) {
        this.$Message.error("相册名称过长");
        return;
      }
      this.btnDisalbed = true;
      this.$http
        .post("http://127.0.0.1:3000/editAlbum", {
          userId: localStorage.currentUser,
          albumId: this.currentEditAlbum.albumId,
          albumName: this.addAlbumName,
          description: this.addAlbumDescription,
          classification: this.addAlbumClassification,
          cover: this.newCoverSrc
        })
        .then(
          res => {
            this.$Message.success("保存成功");
            this.cancelAddAlbum();
            this.getAlbums();
          },
          req => {
            this.$Message.error(req.response.data);
          }
        );
    },
    changePic: function changePic() {
      var reads = new FileReader();
      const _that = this;
      this.img = this.$refs.inputImg.files[0];
      reads.readAsDataURL(this.img);
      reads.onload = function() {
        _that.newCoverSrc = this.result;
        _that.coverPreviewShow = true;
      };
    },
    deleteAlbum(item) {
      this.modalDel = true;
      this.currentDeleteAlbum = item;
    },
    confirmDelete() {
      this.$http
        .post("http://127.0.0.1:3000/deleteAlbum", {
          albumId: this.currentDeleteAlbum.albumId
        })
        .then(
          res => {
            this.$Message.success("删除成功");
            this.getAlbums();
          },
          req => {
            this.$Message.error("系统出错");
          }
        );
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../assets/less/color.less");
.album-wrapper {
  width: 100%;
  .create-album-row {
    margin-bottom: 16px;
    padding-left: 20px;
    font-size: 14px;
    button.create-album {
      font-size: 16px;
    }
  }
  .album-box-wrapper {
    width: 100%;
    .album-box {
      border: 1px solid @demo-green;
      border-radius: 2px;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
      float: left;
      width: 27%;
      padding: 1px;
      margin: 30px 30px;
      position: relative;
      .album-cover {
        cursor: pointer;
        height: 160px;
        overflow: hidden;
        img {
          transition: transform 0.3s ease;
        }
        &:hover {
          img {
            transform: scale(1.3);
          }
        }
      }
      .album-msg {
        padding-top: 2px;
        .album-name {
          float: left;
          padding: 10px 8px 10px 30px;
          color: #2a394e;
          font-size: 22px;
          width: 74%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          &:hover {
            background: #fff;
          }
        }
        .album-image-counts {
          float: right;
          text-align: center;
          width: 26%;
          height: 100%;
          background: @demo-green;
          font-size: 14px;
          color: #fff;
          padding: 6px 0;
          border-radius: 2px;
        }
      }
      .drop-menu {
        display: none;
        position: absolute;
        top: 5px;
        right: 5px;
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
  .add-album-box-wrapper {
    z-index: 1000;
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.2);
    .add-album-box {
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
        padding: 30px 16px 4px 50px;
        .row2 {
          margin-bottom: 26px;
          label {
            padding-right: 20px;
          }
          .album-description {
            vertical-align: top;
          }
          textarea {
            width: 200px;
            height: 40px !important;
            padding: 3px;
          }
          input[type="text"] {
            padding: 3px;
          }
          input[type="radio"] {
            vertical-align: middle;
          }
        }
        .row2.row-cover {
          .upload-img-default {
            display: none;
          }
          .upload-img-btn {
          }
          .previewCoverWrapper {
            width: 200px;
            height: 100px;
            margin-top: 10px;
            margin-left: 70px;
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
}
</style>


