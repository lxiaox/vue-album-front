<template>
  <div class="container">
    <!-- 切换布局按钮 -->
    <Dropdown class="switch-layout" @on-click="handleSwitchLayout($event)">
      <button>
        布局切换
        <Icon type="ios-arrow-down"></Icon>
      </button>
      <DropdownMenu slot="list">
        <DropdownItem name="square">方形布局</DropdownItem>
        <DropdownItem name="waterfall">瀑布流布局</DropdownItem>
        <DropdownItem name="barrel">木桶布局</DropdownItem>
        <Dropdown placement="right-start">
          <DropdownItem name="puzzle">
            拼图布局
            <Icon type="ios-arrow-forward"></Icon>
          </DropdownItem>
          <DropdownMenu slot="list">
            <DropdownItem
              v-for="(item,index) in 6"
              :key="`drop-item-${index}`"
              :name="`puzzle${item}`"
            >{{ item }}张拼图</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <DropdownItem name="round">旋转木马布局</DropdownItem>
        <DropdownItem name="ccordion">手风琴布局</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <!-- layout -->
    <!-- puzzle有1-5 所以要传layout-->
    <puzzle-layout
      v-show="layout.slice(0,6)==='puzzle'"
      :images="[...images]"
      :layout="layout"
      :puzzleNumber="layout.slice(6,7)"
    ></puzzle-layout>
    <waterfall-layout v-if="layout==='waterfall'" :images="[...images]"></waterfall-layout>
    <barrel-layout v-show="layout==='barrel'" :images="[...images]"></barrel-layout>
    <round-layout v-if="layout==='round'" :images="[...images]"></round-layout>
    <ccordion-layout v-if="layout==='ccordion'" :images="[...images]"></ccordion-layout>
    <square-layout v-show="layout==='square'" :images="images"></square-layout>
    <!-- 无照片显示 -->
    <div class="nothing-msg" v-show="noImageShow">
      <i class="iconfont icon-kong"></i>
      <br>
      <span>暂无图片</span>
    </div>
    <!-- 返回按钮 -->
    <button class="to-back-button" v-show="!this.templateInMark" @click="toBackPage">返&nbsp;回</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      layout: "",
      ifPuzzleItemShow: false,
      images: [],
      noImageShow: false,
      templateInMark: false
    };
  },
  mounted() {
    if (this.$route.params.entryKind) {
      this.templateInMark = true;
      this.getImagesData();
    } else {
      this.getImages();
    }
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
              this.layout = "square";
            }
          },
          req => {
            this.$Message.error("系统出错,请稍后重试");
          }
        );
    },
    getImagesData() {
      this.$http
        .get("http://127.0.0.1:3000/getImagesData", {
          params: {
            userId: localStorage.currentUser
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
              this.layout = "square";
            }
          },
          req => {
            this.$Message.error("系统出错,请稍后重试");
          }
        );
    },
    toBackPage() {
      window.history.back();
    },
    handleSwitchLayout(e) {
      if (e === "puzzle") {
        return;
      }
      this.layout = e;
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  position: relative;
  .switch-layout {
    font-size: 14px;
    position: absolute;
    top: 5px;
    right: 35px;
    z-index: 10;
  }
  .to-back-button {
    position: absolute;
    top: 5px;
    right: 160px;
    font-size: 14px;
  }
}
</style>