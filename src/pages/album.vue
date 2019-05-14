<template>
  <div class="album-wrapper">
    <div class="row1">
      <button @click="addAlbum">创建相册</button>
    </div>
    <div class="album-box-wrapper clearfix">
      <div class="album-box" v-for="(item, index) in albums" :key="`template-albums${index}`">
        <div class="album-cover" @click="goImage(item.albumName)">
          <img :src="item.cover" alt="相册封面">
        </div>
        <div class="album-msg clearfix">
          <div class="album-name">
            <span>{{ item.albumName }}</span>
          </div>
          <div class="album-image-counts">
            <span>{{ item.imageCounts }}</span>
            <br>
            <span>images</span>
          </div>
        </div>
        <!-- 下拉菜单 -->
        <Dropdown class="drop-menu">
          <a href="javascript:void(0)">
            <Icon type="ios-arrow-down"></Icon>
          </a>
          <DropdownMenu class="drop-sub-menu" slot="list">
            <DropdownItem>编辑相册</DropdownItem>
            <DropdownItem>删除相册</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
    <div class="no-album-box" v-show="noAlbumShow">
      <span>还没有相册，快去创建吧~</span>
    </div>
    <div class="add-album-box-wrapper" v-show="addAlbumShow">
      <div class="add-album-box">
        <div class="title">创建相册</div>
        <div class="content">
          <div class="row2">
            <label>相册名称</label>
            <input v-model="addAlbumName" type="text">
          </div>
          <div class="row2">
            <label class="album-description">相册描述</label>
            <textarea v-model="addAlbumDescription"></textarea>
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
          <button @click="addAlbum2">确定</button>
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
      addAlbumClassification: "1"
    };
  },
  mounted() {
    this.getAlbums();
  },
  methods: {
    getAlbums() {
      this.$http
        .get("http://127.0.0.1:3000/getAlbums", {
          params: { userName: localStorage.currentUser }
        })
        .then(
          res => {
            this.albums = res.data;
          },
          req => {
            this.noAlbumShow = true;
          }
        );
    },
    goImage(albumName) {
      this.$router.push({ name: "home.image", params: { album: albumName } });
    },
    addAlbum() {
      this.addAlbumShow = true;
    },
    addAlbum2() {
      if (!this.addAlbumName.trim()) {
        this.$Message.error("相册名称不能为空");
        return;
      }
      this.$http
        .post("http://127.0.0.1:3000/addAlbum", {
          userName: localStorage.currentUser,
          albumName: this.addAlbumName,
          description: this.addAlbumDescription,
          classification: this.addAlbumClassification
        })
        .then(
          res => {
            this.getAlbums();
            this.cancelAddAlbum();
            this.getAlbums()
          },
          req => {
            this.$Message.error(req.response.data);
          }
        );
    },
    cancelAddAlbum() {
      this.addAlbumShow = false;
    }
  }
};
</script>

<style lang="less" scoped>
.album-wrapper {
  width: 100%;
  .row1 {
    margin-bottom: 16px;
    padding-left: 20px;
    font-size: 14px;
    button {
      padding: 7px 14px;
      background: #57b0ad;
      // background: #ea6f5a;
      border: none;
      outline: none;
      transition: all 0.3s;
      color: #fff;
      &:hover {
        box-shadow: 0 0 5px 1px rgba(45, 159, 166, 0.8);
      }
    }
  }
  .album-box-wrapper {
    width: 100%;
    .album-box {
      // border: 2px solid #57b0ad;
      border: 2px solid #ea6f5a;
      float: left;
      width: 30.666%;
      padding: 1px;
      margin: 20px 15px;
      position: relative;
      .album-cover {
        cursor: pointer;
        height: 180px;
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
        // background: 1px solid #57b0ad;
        // cursor: pointer;
        .album-name {
          float: left;
          padding: 8px 0 8px 30px;
          color: #2a394e;
          font-size: 24px;
          width: 80%;
          // background: #57b0ad;
          // border: 1px solid #57b0ad;
          &:hover {
            background: #fff;
          }
        }
        .album-image-counts {
          float: right;
          text-align: center;
          width: 20%;
          height: 100%;
          background: #76bebb;
          font-size: 14px;
          color: #fff;
          padding: 6px 0;
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
  .no-album-box {
    width: 100%;
    text-align: center;
    font-size: 20px;
    padding-top: 100px;
    padding-bottom: 130px;
    text-decoration: underline;
  }
  .add-album-box-wrapper {
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
      top: 105px;
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
          }
          input[type="radio"] {
            vertical-align: middle;
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
          &:first-child {
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


