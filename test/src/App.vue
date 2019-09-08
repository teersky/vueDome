<template>
  <div id="app">
    <p>
      <router-link to="/">机房</router-link>
      <router-link to="/map">地图</router-link>  
      <router-link to="/robote">机器人</router-link>
    </p> 
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: url(https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=4099564307,1137352932&fm=26&gp=0.jpg) no-repeat center / 100% 100%;
}
</style>
