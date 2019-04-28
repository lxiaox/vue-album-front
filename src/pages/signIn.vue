<template>
  <div class="wrapper">
    <div class="sign-in">
      <a href="/">
        <span class="logoText">EIS</span>
      </a>
      <nav>
        <ul>
          <li class="active">我的首页</li>
          <li>展示模板</li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeadNav',
  data () {
    return {}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
*{
  margin: 0;padding: 0;box-sizing: border-box;
}
a{
  text-decoration: none;
}
.clerafix::after{
  content: '';
  display: block;
  clear: both;
}
.headnav{
  background-color: #2B2B2B;
  padding: 0 0;

}
.headnav> .headnavInner{
  display: flex;
  align-items: center;
  height: 65px;
}
.logoText{
  color: #fff;
  font-size: 28px;
  margin: 0 50px;
}
nav{
  font-size: 16px;
}
nav> ul{
  color: #ccc;
  list-style-type: none;
  height: 100%;
}
nav> ul> li{
  display: inline-block;
  margin-right: 30px;
}
nav> ul> li.active{
  color: #fff;
}
nav> ul> li.active::after{
  content: '';
  display: block;
  width: 100%;
  height: 3px;
  background-color: #42b983;
}
</style>
