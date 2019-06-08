<template>
  <div class="template-wrapper">
    <!-- 侧边栏菜单 -->
    <div class="side-navbar">
      <div class="side-inner">
        <!-- 头像/用户名 -->
        <div class="avater-wrapper">
          <div class="avater-box">
            <img :src="userAvater">
          </div>
          <div class="user-name">{{ user.userName }}</div>
        </div>
        <!-- 菜单 -->
        <div class="navs">
          <ul>
            <li :class="{'active': active==='home.album'}" @click="toHome">
              <Icon type="md-images" size="22"/>&nbsp;&nbsp;&nbsp;相册
            </li>
            <li :class="{'active': active==='home.image'}" @click="toImage">
              <Icon type="ios-image" size="22"/>&nbsp;&nbsp;&nbsp;照片
            </li>
            <li :class="{'active': active==='home.layoutShow'}" @click="toLayoutShow">
              <Icon type="ios-apps" size="22"/>&nbsp;&nbsp;&nbsp;布局展示
            </li>
            <li :class="{'active': active==='home.recycleBin'}" @click="toRecycleBin">
              <Icon type="ios-trash" size="22"/>&nbsp;&nbsp;&nbsp;回收站
            </li>
            <li :class="{'active': active==='home.personalCenter'}" @click="toPersonalCenter">
              <Icon type="ios-person" size="22"/>&nbsp;&nbsp;&nbsp;个人中心
            </li>
            <li @click="ifMoreShow=!ifMoreShow">
              <Icon type="md-more" size="22"/>&nbsp;&nbsp;&nbsp;更多
              <Icon class="more-arrow" type="ios-arrow-forward" v-show="!ifMoreShow" />
              <Icon class="more-arrow" type="ios-arrow-down" v-show="ifMoreShow" />
            </li>
            <li :class="{'active': active==='home.ivoicePage'}" 
            class="more-sub-nav" v-show="ifMoreShow" @click="toInvoicePage">
              e 税云相关
            </li>
            <li class="more-sub-nav sign-out-nav" v-show="ifMoreShow" @click="signOut">
              退出登录 <Icon type="ios-log-out" size="18" />
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 内容 -->
    <div id="template-content" class="template-content">
      <div class="content-inner">
        <router-view/>
      </div>
      <hr>
      <!-- 底部信息 -->
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
  </div>
</template>
<script>
export default {
  data() {
    return {
      active: "home.album",
      user: {},
      userAvater: "static/images/github.png",
      ifMoreShow: false
    };
  },
  mounted() {
    if (!localStorage.currentUser) {
      this.$Message.error("用户未登录，请先登录");
      localStorage.activeRouter = "";
      this.$router.push({ name: "sign_in" });
      return;
    }
    if (localStorage.activeRouter) {
      this.active = localStorage.activeRouter;
    }
    this.getUserData();
  },
  methods: {
    getUserData() {
      this.$http
        .get("http://127.0.0.1:3000/getUserData", {
          params: {
            userId: localStorage.currentUser
          }
        })
        .then(
          res => {
            this.user = res.data;
            if (this.user.avater) {
              this.userAvater = res.data.avater;
            }
            localStorage.userData = JSON.stringify(this.user);
          },
          req => {
            this.$Message.error("系统出错");
          }
        );
    },
    toHome() {
      this.$router.push({ name: "home.album" });
    },
    toImage() {
      this.$router.push({ name: "home.image" });
    },
    toLayoutShow() {
      this.$router.push({ name: "home.layoutShow", params: { entryKind: 1 } });
    },
    toRecycleBin() {
      this.$router.push({ name: "home.recycleBin" });
    },
    toPersonalCenter() {
      this.$router.push({ name: "home.personalCenter" });
    },
    toInvoicePage() {
      this.$router.push({ name: "home.invoicePage" });
    },
    signOut() {
      localStorage.clear()
      this.$router.push({ name: "sign_in" });
    }
  },
  watch: {
    $route(to) {
      this.active = to.name;
      localStorage.activeRouter = to.name;
    }
  }
};
</script>

<style lang="less">
@import url("../assets/less/color.less");
.template-wrapper {
  .side-navbar {
    float: left;
    width: 18%;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    overflow: hidden;
    .side-inner {
      color: white;
      height: 100vh;
      background: #393d49;
      position: absolute;
      top: 0;
      left: 0;
      right: -17px;
      overflow-x: hidden;
      overflow-y: scroll;
      .avater-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding-top: 45px;
        padding-bottom: 20px;
        .avater-box {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          overflow: hidden;
          margin-bottom: 15px;
        }
        .user-name {
          font-size: 14px;
        }
      }
      .navs {
        ul {
          li {
            color: white;
            font-size: 14px;
            // font-weight: 300;
            transition: all 0.3s;
            padding: 16px;
            cursor: pointer;
            &:last-child {
              border-right: none;
            }
            &.active,
            &:hover {
              background: @demo-green;
            }
            .more-arrow{
              margin-left: 5px;
            }
            &.more-sub-nav {
              padding-left: 40px;
              font-size: 13px;
            }
            &.sign-out-nav{
              margin-bottom: 20px;
            }
          }
        }
      }
    }
  }
  .template-content {
    float: right;
    width: 82%;
    padding: 30px 20px 10px 20px;
    .content-inner {
      min-height: 88vh;
      width: 100%;
      margin-bottom: 30px;
    }
  }
  footer {
    width: 100%;
    padding-top: 20px;
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


