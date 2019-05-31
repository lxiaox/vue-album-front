<template>
  <div class="waterfall-wrapper">
    <div class="layout-name">瀑布流布局</div>
    <div class="waterfallBox clearfix">
      <ul class="waterfallColumn" ref="column1">
        <li class="imageBox growIn" v-for="(item, index) in column1" :key="`column1Key${index}`">
          <img :src="item.imageData" alt>
        </li>
      </ul>
      <ul class="waterfallColumn" ref="column2">
        <li class="imageBox growIn" v-for="(item, index) in column2" :key="`column2Key${index}`">
          <img :src="item.imageData" alt>
        </li>
      </ul>
      <ul class="waterfallColumn" ref="column3">
        <li class="imageBox growIn" v-for="(item, index) in column3" :key="`column3Key${index}`">
          <img :src="item.imageData">
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "waterfallLayout",
  data() {
    return {
      column1: [],
      column2: [],
      column3: []
    };
  },
  props: ["images"],
  mounted() {
    // 数组浅拷贝 imageShow.images为空,改为深拷贝, 改为imageShow传进来[...images]
    this.updateWaterfall(this.images);
  },
  methods: {
    updateWaterfall(addImages) {
      const column1Height = this.$refs.column1.clientHeight;
      const column2Height = this.$refs.column2.clientHeight;
      const column3Height = this.$refs.column3.clientHeight;
      let item = addImages.shift();
      if (item === undefined) {
        return;
      }
      let min =
        column1Height <= column2Height
          ? column1Height <= column3Height
            ? 1
            : 3
          : column2Height <= column3Height
          ? 2
          : 3;
      switch (min) {
        case 1:
          this.column1.push(item);
          break;
        case 2:
          this.column2.push(item);
          break;
        case 3:
          this.column3.push(item);
          break;
      }
      this.$nextTick(function() {
        this.updateWaterfall(addImages);
      });
    }
  }
};
</script>

<style lang="less" scoped>
.waterfallBox {
  margin-top: 20px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  ul.waterfallColumn {
    float: left;
    width: 32%;
    li.imageBox {
      width: 100%;
      padding: 15px;
      img {
        width: 100%;
      }
    }
  }
}
</style>


