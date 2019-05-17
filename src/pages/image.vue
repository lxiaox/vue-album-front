<template>
  <div class="image-wrapper">
    <!-- <button @click="addImage">添加图片</button>
    <div v-for="(item, index) in images" :key="`image-images${index}`">
      <span>{{ item.imageName }}</span>
      <img :src="item.imageSrc" alt="图片">
    </div>-->
    <!-- 无照片显示 -->
    <div class="no-album-box" v-show="noImageShow">
      <span>相册空空如也~</span>
    </div>
  </div>
</template>
<script>
export default {
  // name:'Image',
  data() {
    return {
      images: [],
      noImageShow: false
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
    addImage() {
      this.$http
        .post("http://127.0.0.1:3000/addImage", {
          userName: localStorage.currentUser,
          albumName: this.$route.params.album,
          img: this.imgSrc
        })
        .then(() => {
          this.getImages();
        });
    }
  }
};
</script>

<style lang="less" scoped>
.image-wrapper {
  .no-album-box {
    width: 100%;
    text-align: center;
    font-size: 20px;
    padding-top: 100px;
    padding-bottom: 130px;
    text-decoration: underline;
  }
}
</style>

