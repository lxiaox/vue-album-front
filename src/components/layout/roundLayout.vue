<template>
  <div class="roundBox">
    <div class="layout-name">旋转木马布局</div>
    <ul class="allImages">
      <li
        class="imageBox rotateIn"
        :class="getClassObject(index)"
        v-for="(item, index) in newImages"
        :key="`roundKey${index}`"
        :ref="`li`"
      >
        <img :src="item.imageData">
      </li>
    </ul>
    <a @click="slide('left')" class="prev"></a>
    <a @click="slide('right')" class="next"></a>
  </div>
</template>

<script>
export default {
  name: "roundLayout",
  data() {
    return {
      newImages: [],
      positionIndex: 0,
      positionElement: [0,1,2,3,4]
    }
  },
  props: ["images"],
  created() {
    this.newImages = this.images;
  },
  methods: {
    getClassObject  (index) {
      return {
        'position0': index === this.positionElement[0],
        'position1': index === this.positionElement[1],
        'position2': index === this.positionElement[2],
        'position3': index === this.positionElement[3],
        'position4': index === this.positionElement[4],
        'position5': index !== this.positionElement[0] 
                      && index !== this.positionElement[1] 
                      && index !== this.positionElement[2] 
                      && index !== this.positionElement[3]
                      && index !== this.positionElement[4]
      }
    },
    slide(direction) {
      if (direction === "right") {
        this.positionIndex = this.positionIndex-1 >= 0 ? this.positionIndex-1 : this.newImages.length-1
      }
      if (direction === "left") {
        this.positionIndex = this.positionIndex+1 < this.newImages.length ? this.positionIndex+1 : 0
      }
      this.setPositionElement()
    },
    setPositionElement () {
      for(let i=0; i<5; i++) {
        this.positionElement[i] = this.positionIndex + i
        let n = this.positionElement[i] - this.newImages.length
        if(n >= 0) {
          this.positionElement[i] = n
        }
        this.$set(this.positionElement, i, this.positionElement[i])
      }
    }
  } 
};
</script>

<style lang="less" scoped>
.roundBox {
  position: relative;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  overflow: hidden;
  ul.allImages {
    position: relative;
    width: 72%;
    height: 500px;
    margin-top: 20px;
    margin-left: auto;
    margin-right: auto;
    li.imageBox {
      position: absolute;
      transition: all 1s;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
        vertical-align: bottom;
      }
    }
    li.imageBox.position0,
    li.imageBox.position4, 
    li.imageBox.position5 {
      top: 5%;
      width: 276px;
      height: 160px;
      z-index: 0;
      opacity: 0.5;
    }
    li.imageBox.position0 {
      left: 4%;
    }
    li.imageBox.position5,
    li.imageBox.position4 {
      left: 62%;
    }
    li.imageBox.position5 {
      opacity: 0;
    }
    li.imageBox.position1,
    li.imageBox.position3 {
      top: 20%;
      width: 364px;
      height: 228px;
      z-index: 1;
      opacity: 0.7;
    }
    li.imageBox.position1 {
      left: 0;
    }
    li.imageBox.position3 {
      left: 55%;
    }
    li.imageBox.position2 {
      width: 552px;
      height: 308px;
      top: 30%;
      left: 16%;
      z-index: 2;
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
  }
  a.prev {
    left: 40px;
    top: 220px;
    background-image: url(../../../static/images/prev.png);
  }
  a.next {
    right: 40px;
    top: 220px;
    background-image: url(../../../static/images/next.png);
  }
  a:hover {
    opacity: 0.6;
  }
}
</style>
