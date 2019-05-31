<template>
  <div class="sign-in-wrapper">
    <div class="logo">Album</div>
    <div class="loginBox">
      <h5>登&nbsp;&nbsp;录</h5>
      <div prop="userName" class="row">
        <label for>用户名</label>
        <input type="text" v-model="userName" placeholder="请输入用户名">
      </div>
      <div prop="password" class="row">
        <label for>密码</label>
        <input type="password" v-model="password" placeholder="请输入密码">
      </div>
      <div prop="password" class="row">
        <label for>确认密码</label>
        <input type="password" v-model="passwordConfirmation" placeholder="请输入密码">
      </div>
      <div class="row">
        <button class="sign-up-btn" @click="signUp">注册</button>
      </div>
      <div class="row1">
        <a @click="toSignIn">已有账号，去登录>></a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HeadNav",
  data() {
    return {
      userName: "",
      password: "",
      passwordConfirmation: ""
    };
  },
  methods: {
    toSignIn() {
      this.$router.push({ name: "sign_in" });
    },
    signUp() {
      let regExp = new RegExp(/^[a-zA-Z0-9]{3,21}$/); //(/^[\w]{3,21}$/)
      this.userName = this.userName.trim();
      if (!this.userName) {
        this.$Message.error("用户名不能为空");
        return;
      }
      if (!this.password) {
        this.$Message.error("密码不能为空");
        return;
      }
      if (!this.passwordConfirmation) {
        this.$Message.error("确认密码不能为空");
        return;
      }
      if (!regExp.test(this.password)) {
        this.$Message.error("密码应由3至21位字母或数字组成");
        return;
      }
      if (this.password !== this.passwordConfirmation) {
        this.$Message.error("两次密码不匹配");
        return;
      }
      this.$http
        .post("http://127.0.0.1:3000/signUp", {
          userName: this.userName,
          password: this.$MD5(this.password)
        })
        .then(
          res => {
            this.$Message.success(res.data);
            this.$router.push({ name: "sign_in" });
          },
          err => {
            this.$Message.error("系统出错，请稍后重试");
            console.log(err);
          }
        );
    }
  }
};
</script>

<style lang="less" scoped>
@import url('../assets/less/color.less');
.sign-in-wrapper {
  .logo {
    position: fixed;
    top: 40px;
    left: 40px;
    color: @demo-green;
    font-size: 50px;
    font-weight: 600;
  }
  & .loginBox {
    background: #fff;
    margin-top: 100px;
    width: 400px;
    padding: 50px;
    margin-left: auto;
    margin-right: auto;
    border: 1px solid #ddd;
    border-radius: 3px;
    h5 {
      color: @demo-green;
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 30px;
      text-align: center;
    }
    .row {
      padding-bottom: 30px;
      label {
        width: 50px;
        height: 36px;
        line-height: 36px;
        text-align: right;
        display: inline-block;
        margin-right: 20px;
        white-space: nowrap;
        font-size: 14px;
        &::before {
          content: "*";
          color: red;
          display: inline;
        }
      }
      input {
        width: calc(100% - 78px);
        height: 50px;
        padding: 4px 12px;
        border: 1px solid #c8c8c8;
        border-radius: 3px;
        vertical-align: middle;
        color: #000;
        font-size: 14px;
      }
      .sign-up-btn {
        width: 100%;
        font-size: 18px;
        padding: 9px 18px;
        color: #fff;
        background: #42c02e;
        border: 1px solid #42c02e;
        outline: 0;
        border-radius: 3px;
        &:hover {
          background: #3db922;
          border-color: #3db922;
        }
      }
    }
    .row1 {
      width: 100%;
      text-align: right;
      a {
        text-decoration: underline;
        font-size: 14px;
        color: #515a6e;
        &:hover {
          color: #ea6f5a;
        }
      }
    }
  }
}
</style>