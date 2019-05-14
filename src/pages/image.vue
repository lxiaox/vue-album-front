<template>
  <div class="wrapper">
    <button @click="addImage">添加图片</button>
    <div v-for="(item, index) in images" :key="`image-images${index}`">
      <span>{{ item.imageName }}</span>
      <img :src="item.imageSrc" alt="图片">
    </div>
  </div>
</template>
<script>
export default {
  // name:'Image',
  data(){
    return{
      images: [],
    }
  },
  mounted(){
    this.getImages()
  },
  methods: {
    getImages(){
      this.$http.get('http://127.0.0.1:3000/getImages',{
        params:{userName: localStorage.currentUser, albumName:this.$route.params.album}
      }).then((res)=>{
        this.images = res.data
      })
    },
    addImage(){
      this.$http.post('http://127.0.0.1:3000/addImage',{
        userName: localStorage.currentUser,
        albumName: this.$route.params.album,
        img: this.imgSrc
      }).then(()=>{
        this.getImages()
      })
    }
  }
}
</script>
