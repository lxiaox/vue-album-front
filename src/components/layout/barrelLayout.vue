<template>
  <div class="barrel-wrapper">
    <div class="layout-name">木桶布局</div>
    <div class="barrelBox fadeIn">
      <img :src="item.imageData" alt v-for="(item, index) in images" :key="`barrelImage${index}`">
    </div>
  </div>
</template>

<script>
export default {
  name: "barrelLayout",
  data() {
    return {};
  },
  props: ["images"]
};
</script>

<style lang="less" scoped>
.barrel-wrapper {
  .barrelBox {
    width: 100%;
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    img {
      width: auto;
      height: 180px;
      padding: 15px;
      flex-grow: 1;
      object-fit: cover;
      object-position: center;
    }

    &::after {
      display: block;
      content: "";
      flex-grow: 20;
    }
  }
}
</style>