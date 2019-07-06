<template>
  <div class="full-page-wrapper clearfix">
    <!-- 全屏浏览 -->
    <div class="full-page-box">
      <div class="big-image-box">
        <img v-if="!images[bigImageIndex].isVideo" :src="images[bigImageIndex].imageData">
        <video v-if="images[bigImageIndex].isVideo" controls>
          <source :src="images[bigImageIndex].imageData">
        </video>
      </div>
      <a @click="slide('left')" class="prev"></a>
      <a @click="slide('right')" class="next"></a>
      <a @click="exitFullpage" class="close"></a>
      <a @click="autoPlay" class="play" v-show="!ifAutoPlay"></a>
      <a @click="stopPlay" class="pause" v-show="ifAutoPlay"></a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      bigImageIndex: 0,
      ifAutoPlay: false,
      timer: "",
      hideMark: 0
    };
  },
  props: ["images", "fullImageIndex"],
  mounted() {
    this.bigImageIndex = this.fullImageIndex;
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.hideMark = 1;
        window.clearInterval(this.timer);
      } else {
        if (this.hideMark === 0 || this.ifAutoPlay === false) return;
        this.timer = window.setInterval(() => {
          this.slide("auto");
        }, 2000);
      }
    });
    this.listenKey();
  },
  methods: {
    // 键盘事件
    listenKey() {
      const _this = this;
      document.onkeydown = function(e) {
        if (e && e.keyCode == 27) {
          _this.exitFullpage();
        }
        if (e && (e.keyCode === 37 || e.keyCode === 38)) {
          _this.slide("left");
        }
        if (e && (e.keyCode === 39 || e.keyCode === 40)) {
          _this.slide("right");
        }
        if (e && e.keyCode === 32) {
          if (_this.ifAutoPlay) {
            _this.stopPlay();
          } else {
            _this.autoPlay();
          }
        }
      };
    },
    // 退出全屏浏览
    exitFullpage() {
      this.$emit("exit-full-page");
      this.stopPlay();
    },
    // 切换图片
    slide(direction) {
      if (direction === "left") {
        this.stopPlay();
        this.bigImageIndex =
          this.bigImageIndex - 1 >= 0
            ? this.bigImageIndex - 1
            : this.images.length - 1;
      }
      if (direction === "right") {
        this.stopPlay();
        this.bigImageIndex =
          this.bigImageIndex + 1 < this.images.length
            ? this.bigImageIndex + 1
            : 0;
      }
      if (direction === "auto") {
        this.bigImageIndex =
          this.bigImageIndex + 1 < this.images.length
            ? this.bigImageIndex + 1
            : 0;
      }
    },
    // 自动播放
    autoPlay() {
      this.ifAutoPlay = true;
      this.timer = window.setInterval(() => {
        this.slide("auto");
      }, 2000);
    },
    // 停止自动播放
    stopPlay() {
      this.ifAutoPlay = false;
      window.clearInterval(this.timer);
    }
  }
};
</script>

<style lang="less" scoped>
.full-page-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 12;
  .full-page-box {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    .big-image-box {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 900px;
      height: 520px;
      overflow: hidden;
      img {
        object-fit: contain;
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
      top: 48%;
      transition: all 0.3s;
      opacity: 0.4;
    }
    a.prev {
      left: 30px;
      background-image: url(../../static/images/prev.png);
    }
    a.next {
      right: 30px;
      background-image: url(../../static/images/next.png);
    }
    a.close {
      top: 30px;
      right: 30px;
      background-image: url(../../static/images/close.png);
    }
    a.play,
    a.pause {
      top: 30px;
      left: 30px;
      opacity: 0.8;
    }
    a.play {
      background-image: url(../../static/images/play.png);
    }
    a.pause {
      background-image: url(../../static/images/pause.png);
    }
    a:hover {
      opacity: 1;
    }
    a.prev:hover,
    a.next:hover,
    a.close:hover {
      transform: scale(1.1);
    }
  }
}
</style>


