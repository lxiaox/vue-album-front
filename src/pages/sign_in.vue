<template>
  <div class="wrapper">
    <div class="form">
      <div class="row">
        <label>用户名</label>
        <input type="text" v-model="userName">
      </div>
      <div class="row">
        <label for>密码</label>
        <input type="password" v-model="password">
      </div>
      <div class="row">
        <button @click="submit">登录</button>
        <button @click="signUp">注册</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      userName: '',
      password: ''
    };
  },
  methods: {
    submit() {
      let name = this.userName.trim();
      if (!this.userName || !name) {
        this.$Message.error('请填写用户名');
        return;
      }
      if (!this.password) {
        this.$Message.error('请填写密码');
        return;
      }
      this.$http
        .post('http://127.0.0.1:3000/sign_in', {
          userName: name,
          password: this.password
        })
        .then(
          res => {
            // this.$Message.success(res.data);
            this.$router.push({name:'home.album'})
            localStorage.currentUser = name
          },
          req => {
            this.$Message.error(req.response.data);
          }
        );
    },
    signUp(){
      this.$http
        .post('http://127.0.0.1:3000/sign_up', {
          userName: this.userName.trim(),
          password: this.password
        })
        .then(
          res => {
            this.$Message.success(res.data);
            this.$router.push({name:'sign_in'})
            // 记录用户名
          },
          req => {
            this.$Message.error(req.response.data);
          }
        );
    }
  }
};
</script>

<style lang="less" scoped>
.wrapper {
  border: 1px solid red;
  display: flex;
  justify-content: center;
  align-items: center;
  widows: 100vw;
  height: 100vh;
  div {
    .row {
      padding: 30px;
      label {
        width: 60px;
        display: inline-table;
      }
      button {
        width: 60px;
      }
    }
  }
}
</style>


