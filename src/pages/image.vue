<template>
  <div class="image-wrapper">
    <div class="uploads-wrapper">
      <div class="upload clearfix" v-for="(item, index) in imagesTree" :key="`upload-key${index}`">
        <span>日期:{{ item.uploadDate }}</span>
        <br>
        <span>相册:{{ item.albumName }}</span>
        <br>
        <div
          style="width: 100px;height: 100px;float: left;margin-right: 10px;"
          class="upload-images"
          v-for="(img,i) in item.imagesArr"
          :key="`upload-image-key${i}`"
        >
          <img :src="img.imageData">
        </div>
      </div>
    </div>
    <!-- 无照片显示 -->
    <div class="nothing-msg" v-show="noImageShow">
      <i class="iconfont icon-kong"></i>
    </div>
    <div class="loading-msg">
      <span v-show="loading">正在加载中</span>
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
      queryAmount: 2,
      loading: true
    };
  },
  mounted() {
    const _this = this;
    for (let i = 0; i < 2; i++) {
      this.getImagesTree(this.queryCount++);
    }
    document.onscroll = function() {
      if (
        document.documentElement.scrollTop +
          document.documentElement.clientHeight >=
        document.documentElement.scrollHeight
      ) {
        if (_this.loading) _this.getImagesTree(_this.queryCount++);
      }
    };
  },
  methods: {
    getImagesTree(count) {
      this.$http
        .get("http://127.0.0.1:3000/getImagesTree", {
          params: {
            userId: localStorage.currentUser,
            queryCount: count,
            queryAmount: this.queryAmount
          }
        })
        .then(
          res => {
            if (res.status === 201) {
              if (this.queryCoun === 1) {
                this.noImageShow = true;
                this.imagesTree = [];
              }
              this.loading = false;
            }
            if (res.status === 200) {
              this.noImageShow = false;
              this.imagesTree = this.imagesTree.concat(res.data);
            }
            console.log(this.imagesTree);
          },
          req => {
            this.$Message.error("系统出错");
          }
        );
    }
  }
};
</script>

<style lang="less">
@import url("../assets/less/color.less");
.image-wrapper {
}
</style>


