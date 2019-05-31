<template>
  <div class="squareBox clearfix">
    <!-- 图片展示 -->
    <div class="layout-name">方形布局</div>
    <div class="allImages clearfix">
      <div class="imageBox shrinkIn" v-for="(item, index) in images" :key="`squareKey${index}`">
        <img :src="item.imageData" alt :title="item.imageName" @dblclick="fullpageView(index)">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "square",
  data() {
    return {};
  },
  props: ["images"]
};
</script>

<style lang="less" scoped>
.squareBox {
  width: 100%;
  position: relative;
  
  .allImages {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    .imageBox {
      padding: 30px;
      width: 33%;
      height: 330px;
      overflow: hidden;
      float: left;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
        cursor: pointer;
      }
    }
  }
}
</style>


