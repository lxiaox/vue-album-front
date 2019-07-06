<template>
  <div class="person-center-page">
    <!-- 头像 -->
    <div class="row avater-row clearfix">
      <div class="avater-content-box">
        <img :src="userAvater">
      </div>
      <button class="modify-avater" @click="changeAvater">更换头像</button>
      <input
        class="avater-input"
        type="file"
        ref="inputAvater"
        name="img"
        accept="image/*"
        @change="changeAvater2"
      >
    </div>
    <!-- 用户名 -->
    <div class="row name-row">
      <label>用户名</label>
      <input type="text" v-model="user.userName">
    </div>
    <div class="row password-modify-row">
      <label>修改密码</label>
      <input class="old-password" type="text" v-model="oldPassword" placeholder="旧密码">
      <input class="new-password" type="text" v-model="newPassword" placeholder="新密码，6~21，字母或数字">
    </div>
    <!-- 性别 -->
    <div class="row gender-row">
      <label class="gender-title">性别</label>
      <label class="gender-item">
        <input name="gender" v-model="user.gender" value="male" type="radio">男
      </label>
      <label class="gender-item">
        <input name="gender" v-model="user.gender" value="female" type="radio">女
      </label>
    </div>
    <!-- 保存/取消 -->
    <div class="row save-row">
      <button class="save-button" @click="saveUserData">保存更改</button>
      <button class="cancel-button" @click="cancel">取&nbsp;&nbsp;消</button>
    </div>
    <!-- 退出登录 -->
    <div class="row exit-row" @click="signOut">
      <button>退出登录</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {},
      userAvater: "static/images/github.png",
      oldPassword: "",
      newPassword: "",
      outflag: false
    };
  },
  mounted() {
    this.user = JSON.parse(localStorage.userData);
    if (this.user.avater) {
      this.userAvater = this.user.avater;
    }
  },
  methods: {
    changeAvater() {
      this.$refs.inputAvater.click();
    },
    changeAvater2() {
      const _that = this;
      let results = this.$refs.inputAvater.files[0];
      this.$refs.inputAvater.value = "";
      var reads = new FileReader();
      reads.readAsDataURL(results);
      reads.onload = function() {
        _that.userAvater = this.result;
        _that.user.avater = this.result;
      };
    },
    saveUserData() {
      this.user.userName = this.user.userName.trim()
      this.oldPasswordMd5 = this.$MD5(this.oldPassword);
      if (!this.user.userName) {
        this.$Message.error("用户名不能为空");
        return;
      }
      if (this.user.userName.length > 16) {
        this.$Message.error("用户名长度不能大于16");
        return;
      }
      if (this.oldPassword || this.newPassword) {
        let regExp = new RegExp(/^[\w]{6,21}$/);
        if (!this.oldPassword) {
          this.$Message.warning("请输入旧密码");
          return;
        } else if (!this.newPassword) {
          this.$Message.warning("请输入新密码");
          return;
        } else if (this.oldPasswordMd5 !== this.user.password) {
          this.$Message.error("旧密码错误");
          return;
        } else if (!regExp.test(this.newPassword)) {
          this.$Message.error("密码应由6~21位字母或数字组成");
          return;
        } else {
          this.outflag = true;
          this.user.newPassword = this.$MD5(this.newPassword);
        }
      }

      this.$http
        .post("http://127.0.0.1:3000/saveUserData", {
          user: this.user
        })
        .then(
          res => {
            if (this.outflag) {
              this.$Message.success("修改成功，请重新登录");
              this.signOut();
            } else {
              this.$Message.success("保存成功");
              this.$parent.getUserData();
            }
          },
          req => {
            this.$Message.error(req.response.data);
            console.log(req);
          }
        );
    },
    cancel() {
      window.history.back();
    },
    signOut() {
      // localStorage.currentUser = "";
      // localStorage.activeRouter = "";
      localStorage.clear()
      this.$router.push({ name: "sign_in" });
    }
  }
};
</script>

<style lang="less" scoped>
.person-center-page {
  padding: 20px 30px;
  div.row {
    font-size: 15px;
    padding: 20px;
    button {
      padding: 4px 12px;
      font-size: 14px;
      border-radius: 15px;
      border: 1px solid darkcyan;
      color: darkcyan;
    }
    input[type="text"] {
      padding: 5px 10px;
      background-color: #efefef;
      border: 1px solid #c8c8c8;
      font-size: 13px;
      border-radius: 3px;
    }
    &.avater-row {
      .avater-content-box {
        width: 100px;
        height: 100px;
        overflow: hidden;
        float: left;
        border-radius: 50%;
      }
      .modify-avater {
        margin-left: 50px;
        margin-top: 35px;
      }
      .avater-input {
        display: none;
      }
    }
    &.name-row {
      label {
        padding-right: 103px;
      }
    }
    &.password-modify-row {
      label {
        padding-right: 90px;
      }
      .old-password {
        margin-right: 30px;
      }
    }
    &.gender-row {
      .gender-title {
        padding-right: 120px;
      }
      .gender-item {
        padding-right: 30px;
        input[type="radio"] {
          margin-right: 4px;
        }
      }
    }
    &.save-row {
      .save-button {
        margin-right: 30px;
      }
    }
  }
}
</style>


