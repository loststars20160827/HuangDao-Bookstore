<template>
  <div class="hello">
    <div class="navbar_con">
      <div class="navbar clearfix">
        <div class="subnav_con fl">
          <h1>全部商品分类</h1>
          <span></span>
          <ul class="subnav">
            <li><div class="programming" @click="toBookList(0)">编程</div></li>
            <li><div class="internet" @click="toBookList(1)">互联网</div></li>
            <li><div class="web" @click="toBookList(2)">Web</div></li>
            <li><div class="hci" @click="toBookList(3)">交互设计</div></li>
            <li><div class="economics" @click="toBookList(4)">经济</div></li>
            <li><div class="alg" @click="toBookList(5)">算法</div></li>
          </ul>
        </div>
        <!-- <ul class="navlist fl">
          <li><a href="">首页</a></li>
          <li class="interval">|</li>
          <li><a href="">移动端书城</a></li>
          <li class="interval">|</li>
          <li><a href="">秒杀</a></li>
        </ul> -->
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Navigation',
  data () {
    return {
    }
  },
  methods: {
    toBookList (id) {
      this.$router.push(`/bookstore/booklist/${id}`)
    }
  }
}
</script>

<style scoped>
.navbar_con{height:40px;border-bottom:2px solid #d4d4d4;}
.navbar{width:1200px;margin:0 auto;}
.navbar h1{width:200px;height:40px;line-height:40px;text-align: center;font-size:14px;color:#635a5a;background-color:#f2f2f2;}

.navbar .subnav_con{width:200px;height:40px;position:relative;cursor:pointer;}

.navbar .subnav_con h1{position:absolute;left:0;top:0;text-align:left;text-indent:40px}
.navbar .subnav_con span{display:block;width:16px;height:16px;background:url(../images/down.png) no-repeat;position:absolute;right:27px;top:12px;transition:all 300ms ease-in;
}

.navbar .subnav_con:hover span{transform:rotateZ(180deg)}

.navbar .subnav_con .subnav{position:absolute;left:0;top:40px;display:none;border-top:2px solid #d4d4d4;}
.navbar .subnav_con:hover .subnav{display:block;}

.navlist{margin-left:34px;}
.navlist li{height:40px;float:left;line-height:40px;}
.navlist li a{color:#666;font-size:14px}
.navlist li a:hover{color:#409EFF}
.navlist .interval{margin:0 15px;}

.subnav{width:198px;height:270px;border-left:1px solid #eee;border-right:1px solid #eee;}
.subnav li{height:44px;border-bottom:1px solid #eee;background:url(../images/icons.png) 178px -257px no-repeat #fff;}

.subnav li div{display:block;height:44px;line-height:44px;text-indent:71px;font-size:14px;color:#333}
.subnav li div:hover{color:#409EFF}

.subnav li .programming{background:url(../images/icons.png) 28px 0px no-repeat;}
.subnav li .internet{background:url(../images/icons.png) 28px -43px no-repeat;}
.subnav li .web{background:url(../images/icons.png) 28px -86px no-repeat;}
.subnav li .hci{background:url(../images/icons.png) 28px -132px no-repeat;}
.subnav li .economics{background:url(../images/icons.png) 28px -174px no-repeat;}
.subnav li .alg{background:url(../images/icons.png) 28px -220px no-repeat;}
</style>
