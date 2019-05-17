<template>
  <div class="template-wrapper">
    <div class="top-navbar">
      <div class="logo">
        <img src="static/images/logo1.png" alt="logo">
      </div>
      <div class="navs">
        <ul>
          <li :class="{'active': active==='home.album'}" @click="goHome">Home</li>
          <li :class="{'active': active==='home.image'}" @click="goImage">Image</li>
          <li :class="{'active': active==='$'}">Layout</li>
          <li :class="{'active': active==='$'}">Recent</li>
          <li :class="{'active': active==='$'}">Recycle</li>
          <li :class="{'active': active==='$'}">About</li>
        </ul>
      </div>
    </div>
    <div class="inner">
      <router-view/>
    </div>
    <hr>
    <footer>
      <div class="footer-inner">
        <div class="row1">
          <a href="javascript:void(0)" class="a-qq"></a>
          <a href="javascript:void(0)" class="a-weichat"></a>
          <a href="javascript:void(0)" class="a-github"></a>
        </div>
        <div class="row2">
          <span>&copy; 2019 | Graduation Project</span>
          <br>
          <span>Liu xiaoxiao 刘潇潇</span>
        </div>
      </div>
    </footer>
  </div>
</template>
<script>
export default {
  data() {
    return {
      active: "home.album"
    };
  },
  methods: {
    goHome() {
      this.$router.push({ name: "home.album" });
    },
    goImage() {
      this.$router.push({ name: "home.image", params: { album: 'all' } });
    }
  },
  watch: {
    $route(to) {
      console.log(to);
      this.active = to.name
    }
  }
};
</script>

<style lang="less">
.template-wrapper {
  .top-navbar {
    .logo {
      text-align: center;
      padding: 30px;
      img {
        width: auto;
        height: auto;
      }
    }
    .navs {
      // background: #57b0ad;
      background: #2a394e;
      padding: 20px 60px;
      display: flex;
      justify-content: center;
      margin-bottom: 60px;
      ul {
        display: flex;
        li {
          border-right: 2px solid white;
          color: #fff;
          font-size: 28px;
          font-weight: 400;
          padding-left: 30px;
          padding-right: 30px;
          transition: all 0.3s;
          cursor: pointer;
          &:last-child {
            border-right: none;
          }
          &:hover {
            background: #bad8e0;
          }
          &.active {
            color: #57b0ad;
          }
        }
      }
    }
  }
  .inner {
    width: 90%;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 30px;
    min-height: 70vh;
    // width: 990px;
    // border: 1px solid #57b0ad;
  }
  footer {
    width: 100%;
    padding: 38px;
    text-align: center;
    .footer-inner {
      display: inline-block;
      .row1 {
        a {
          display: inline-block;
          width: 41px;
          height: 41px;
          opacity: 0.8;
          transition: opacity 0.3s;
          &.a-qq {
            background: url(../../static/images/qq.png) center no-repeat;
            background-size: 40px 40px;
          }
          &.a-weichat {
            background: url(../../static/images/weichat.png) center no-repeat;
            background-size: 40px 40px;
          }
          &.a-github {
            background: url(../../static/images/github.png) center no-repeat;
            background-size: 40px 40px;
          }
          &:hover {
            opacity: 0.5;
          }
        }
      }
      .row2 {
        font-size: 14px;
      }
    }
  }
}
// #57b0ad
</style>


