<template>
  <div class="wrapper">
    <div class="row">
      <label for>相册名</label>
      <input type="text" v-model="addAlbumName">
    </div>
    <button @click="addAlbum">新建相册</button>
    <!-- <button @click="addImg">addImg</button> -->
    <div v-for="(item, index) in albums" :key="`template-albums${index}`">
      <span>{{item.albumName}}</span>
      <br>
      <div @click="goImage(item.albumName)">
        <img :src="item.cover" alt="相册封面">
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Template",
  data() {
    return {
      albums: [],
      addAlbumName: '',
      addAlbumCover: ''
    };
  },
  mounted() {
    this.getAlbums();
  },
  methods: {
    getAlbums() {
      this.$http
        .get("http://127.0.0.1:3000/getAlbums", {
          params: { userName: localStorage.currentUser }
        })
        .then(
          res => {
            this.albums = res.data;
            console.log(this.albums)
          },
          req => {}
        );
    },
    goImage(albumName) {
      this.$router.push({ name: "home.image", params: { album: albumName } });
    },
    addAlbum() {
      this.$http.post("http://127.0.0.1:3000/addAlbum", {
        userName: localStorage.currentUser,
        albumName: this.addAlbumName,
        cover: this.addAlbumCover
      }).then(res=>{
        this.getAlbums()
      })
    }
  }
};
</script>

