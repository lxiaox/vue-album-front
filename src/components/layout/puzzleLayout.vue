<template>
  <div class="puzzle-wrapper">
    <div class="layout-name">拼图布局</div>
    <div class="puzzleBox clearfix" :class="layout">
      <div
        class="imageBox growIn"
        v-for="(item, index) in images"
        v-show="ifImageShow(index)"
        v-bind:key="`imageBoxKey${index}`"
      >
        <img :src="item.imageData">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "puzzleLayout",
  data() {
    return {
    };
  },
  props: ["images", "layout", "puzzleNumber"],
  methods: {
    ifImageShow: function ifImageShow(index) {
      if (index < this.puzzleNumber) {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.puzzleBox {
  position: relative;
  width: 75%;
  height: 450px;
  margin-left: auto; /*allImageBox居中*/
  margin-right: auto;
  margin-top: 29px;
  overflow: hidden;
  .imageBox {
    padding: 15px;
    text-align: center;
    overflow: hidden;
  }
}
.puzzle1 {
  .imageBox {
    margin-left: auto;
    margin-right: auto;
    width: 80%;
    height: 100%;
    overflow: hidden;
  }
}
.puzzle2 {
  .imageBox:nth-child(1) {
    position: absolute;
    left: 0;
    width: 50%;
    height: 100%;
  }
  .imageBox:nth-child(2) {
    position: absolute;
    left: 50%;
    width: 50%;
    height: 100%;
    text-align: center;
  }
}
.puzzle3 {
  .imageBox:nth-child(1) {
    float: left;
    width: 60%;
    height: 100%;
  }
  .imageBox:nth-child(2) {
    float: left;
    width: 40%;
    height: 50%;
  }
  .imageBox:nth-child(3) {
    float: left;
    width: 40%;
    height: 50%;
  }
}
.puzzle4 {
  .imageBox {
    float: left;
    width: 50%;
    height: 50%;
  }
}
.puzzle5 {
  .imageBox {
    position: absolute;
  }
  .imageBox:nth-child(1) {
    top: 0;
    left: 0;
    width: 66%;
    height: 60%;
  }
  .imageBox:nth-child(2) {
    top: 0;
    right: 0;
    width: 34%;
    height: 60%;
  }
  .imageBox:nth-child(3) {
    bottom: 0;
    right: 0;
    width: 34%;
    height: 40%;
  }
  .imageBox:nth-child(4) {
    bottom: 0;
    left: 33%;
    width: 33%;
    height: 40%;
  }
  .imageBox:nth-child(5) {
    bottom: 0;
    left: 0;
    width: 33%;
    height: 40%;
  }
}
.puzzle6 {
  .imageBox:nth-child(1) {
    float: left;
    width: 66%;
    height: 60%;
  }
  .imageBox:nth-child(2),
  .imageBox:nth-child(3) {
    float: right;
    width: 34%;
    height: 30%;
  }
  .imageBox:nth-child(4) {
    float: right;
    width: 34%;
    height: 40%;
  }
  .imageBox:nth-child(5),
  .imageBox:nth-child(6) {
    float: right;
    width: 33%;
    height: 40%;
  }
}
</style>


