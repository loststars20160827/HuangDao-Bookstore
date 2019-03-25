<template>
  <div id="app">
    <router-view/>
    <Footer></Footer>
  </div>
</template>

<script>
import Footer from './components/Footer'

export default {
  name: 'App',
  components: {
    Footer
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
em{
  font-style: normal;
}
html,body,#app{
  height:100%;
  margin: 0;
  padding: 0;
  font-size: 12px;
}
ul,ol,p,h1,h2,h3,h4,h5,h6,dl,dd,select,input,textarea,form{margin:0;padding:0}
a{text-decoration:none;}
.fl{float:left}
.fr{float:right}
ul,ol{list-style:none;}
.clearfix:before,.clearfix:after{content:"";display:table}
.clearfix:after{clear:both;}
.clearfix{zoom:1}
.pointer{cursor: pointer;}

.loading-data{height:400px;line-height: 400px;text-align: center;font-size: 16px;}
</style>
