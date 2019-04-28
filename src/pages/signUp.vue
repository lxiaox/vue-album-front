<template>
  <div class="wrapper">
    <div class="sign-up">
      <div class="row">
        <label>用&nbsp;户&nbsp;名</label>
        <input type="text" name="email" v-model="userName">
        <span class="error">{{ msg1 }}</span>
      </div>
      <div class="row">
        <label>密&nbsp;&nbsp;&nbsp;码</label>
        <input type="password" name="password" v-model="password">
        <span class="error">{{ msg2 }}</span>
      </div>
      <div class="row">
        <label>确认密码</label>
        <input type="password" name="password_confirmation" v-model="passwordConfirmation">
        <span class="error">{{ msg3 }}</span>
      </div>
      <div class="row">
        <div class="submit" @click="signUp">注册</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userName: '',
      password: '',
      passwordConfirmation: '',
      msg1: '',
      msg2: '',
      msg3: '',
    };
  },
  methods: {
    signUp () {
      this.msg1 = ''
      this.msg2 = ''
      this.msg3 = ''
      if(!this.userName) {
        this.msg1 = '用户名不能为空'
        return
      }
      if(this.userName.indexOf(' ') >= 0) {
        this.msg1 = '用户名中不能含有空格'
        return
      }
      if(!this.password){
        this.msg2 = '密码不能为空'
        return
      }
      if(this.password.indexOf(' ') >= 0){
        this.msg2 = '密码中不能含有空格'
        return
      }
      if(!this.passwordConfirmation){
        this.msg3 = '请再次确认密码'
        return
      }
      if(this.password !== this.passwordConfirmation){
        this.msg3 = '两次密码不一致'
        return
      }
      let user = {userName: this.userName, password: this.password}
      this.$http.post(`${host.album}sign_up`, user, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        console.log(res)
        this.$Message.success('注册成功，跳转登录页面')
      }, (req)=>{
        console.log(req.response)
        console.log(req.responseJSON)
        this.$Message.error(req.response.data)
      })
    }
  }
};
</script>

<style lang="less" scoped>
.wrapper {
  width: 100vw;
  height: 100vh;
  background: url('../../static/images/6.jpg') no-repeat center fixed;
  background-size: cover;
  font-size: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  .sign-up {
    border-radius: 3px;
    margin-top: 40px;
    .row {
      padding: 20px;
      label {
        width: 80px;
        display: inline-block;
      }
      input {
        border-radius: 3px;
        background: rgba(200,200,200,0.8);
      }
      span {
        display: inline-block;
        width: 140px;
        font-size: 14px;
        color: red;
      }
    }
  }
  .submit {
    border: 1px solid;
    border-radius: 3px;
    padding: 10px 140px;
    display: inline-block;
    margin-top: 10px;
    &:hover {
      box-shadow: 0px 3px 10px rgba(89, 96, 99, 0.61);
    }
  }
}
</style>



