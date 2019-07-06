<template>
  <div class="filter-image-page">
    <div class="image-box">
      <img id="filter-img" :src="imageData" :style="{filter: filterStr}">
    </div>
    <div class="option-box">
      <div class="row" v-for="(value,key) in property" :key="`filter-property-${key}`">
        <label class="clearfix">
          <span>{{value.label}}</span>
          <Slider
            class="slider"
            :min="value.min"
            :max="value.max"
            v-model="value.value"
            :step="value.step"
          ></Slider>
          <span>{{value.value}}</span>
        </label>
      </div>
      <div class="button-box">
        <button @click="reset">重置</button>
        <button @click="downImg">保存至本地</button>
        <button @click="cancelFilterImage">取消</button>
      </div>
    </div>
  </div>
</template>
 
<script>
import screenshot from "image-screenshot";
import { download } from "image-screenshot";
export default {
  data() {
    return {
      imageData: "",
      property: {
        brightness: {
          label: "亮度",
          min: 0,
          max: 2,
          value: 1,
          initialValue: 1,
          step: 0.1
        },
        blur: {
          label: "模糊度",
          min: 0,
          max: 6,
          value: 0,
          initialValue: 0,
          step: 0.1
        },
        contrast: {
          label: "对比度",
          min: 0,
          max: 3,
          value: 1,
          initialValue: 1,
          step: 0.1
        },
        grayscale: {
          label: "灰度",
          min: 0,
          max: 1,
          value: 0,
          initialValue: 0,
          step: 0.1
        },
        opacity: {
          label: "透明度",
          min: 0,
          max: 1,
          value: 1,
          initialValue: 1,
          step: 0.1
        },
        saturate: {
          label: "饱和度",
          min: 0,
          max: 10,
          value: 1,
          initialValue: 1,
          step: 0.1
        }
      }
    };
  },
  computed: {
    filterStr: function() {
      return (
        `brightness(${this.property.brightness.value}) ` +
        `blur(${this.property.blur.value}px)` +
        `contrast(${this.property.contrast.value})` +
        `grayscale(${this.property.grayscale.value})` +
        `opacity(${this.property.opacity.value})` +
        `saturate(${this.property.saturate.value})`
      );
    }
  },
  props: ["filteringImage"],
  mounted() {
    this.imageData = this.filteringImage.imageData;
  },
  methods: {
    cancelFilterImage() {
      this.$emit("exit-filter-image");
    },
    reset() {
      Object.keys(this.property).forEach(key => {
        this.property[key].value = this.property[key].initialValue;
      });
    },
    downImg() {
      const img = document.getElementById("filter-img");
      screenshot(img).then(data => {
        download(data, "图片调整.png");
      });
    }
  }
};
</script>
 
<style lang="less" scoped>
.filter-image-page {
  z-index: 100;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.8);
  .image-box {
    position: absolute;
    top: 5%;
    left: 2%;
    width: 60%;
    height: 90%;
    img {
      object-fit: contain;
    }
  }
  .option-box {
    position: absolute;
    top: 0;
    right: 0;
    padding: 15px;
    width: 36%;
    height: 100%;
    font-size: 16px;
    color: white;
    .row {
      label {
        padding: 10px;
        span {
          display: inline-block;
          width: 70px;
          margin-right: 20px;
        }
        .slider {
          width: 200px;
          display: inline-block;
          vertical-align: middle;
          margin-right: 15px;
          /deep/ .ivu-slider-bar {
            background: darkcyan;
          }
          /deep/ .ivu-slider-button {
            border-color: darkcyan;
            &:hover {
              border-color: darkcyan;
            }
          }
          /deep/ .ivu-input-number {
            border-color: darkcyan;
            &:hover {
              border-color: darkcyan;
            }
          }
          /deep/ .ivu-slider-button-wrap {
            top: -7px;
          }
        }
      }
    }
    .button-box {
      margin-top: 30px;
      button {
        padding: 5px 10px;
        margin: 20px;
        &:hover {
          transform: scale(1.1);
        }
      }
    }
  }
}
</style>