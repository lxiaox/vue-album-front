<template>
  <div class="ccordion-wrapper">
    <div class="layout-name">手风琴布局</div>
    <div class="ccordionBox">
      <ul class="allImages">
        <li
          class="imageBox"
          :class="{fadeIn:fadeInAble}"
          v-for="(item, index) in newImages"
          :key="`ccordionKey${index}`"
          v-show="index<5"
          ref="li"
        >
          <img :src="item.imageData">
        </li>
      </ul>
      <a @click="slide('left')" class="prev"></a>
      <a @click="slide('right')" class="next"></a>
    </div>
  </div>
</template>

<script>
export default {
  name: "ccordionLayout",
  data() {
    return {
      newImages: [],
      fadeInAble: true
    };
  },
  props: ["images"],
  created() {
    this.newImages = this.images;
  },
  mounted() {
    this.$refs.li.forEach(item => {
      item.addEventListener("animationend", () => {
        this.fadeInAble = false;
      });
    });
  },
  methods: {
    slide(direction) {
      this.fadeInAble = true;
      if (direction === "left") {
        let item = this.newImages.pop();
        this.newImages.unshift(item);
      }
      if (direction === "right") {
        let item = this.newImages.shift();
        this.newImages.push(item);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.ccordionBox {
  position: relative;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
  overflow: hidden;
  ul.allImages {
    width: 90%;
    height: 400px;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    justify-content: space-around;
    align-items: center;
    li.imageBox {
      width: 180px;
      height: 75%;
      padding: 15px;
      transition: all 0.3s;
    }
    li:hover {
      width: 422px;
      height: 90%;
      flex-shrink: 0;
    }
  }
  a {
    position: absolute;
    display: inline-block;
    width: 32px;
    height: 32px;
    text-decoration: none;
    opacity: 0.4;
    z-index: 10;
    top: 180px;
  }
  a.prev {
    left: 0;
    background-image: url(../../../static/images/prev.png);
  }
  a.next {
    right: 0;
    background-image: url(../../../static/images/next.png);
  }
  a:hover {
    opacity: 0.6;
  }
}
</style>
