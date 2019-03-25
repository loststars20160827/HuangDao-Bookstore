<template>
  <div class="hello">
    <FirstHeader :isCart = "false" />

    <div class="navbar_con">
      <div class="navbar">
        <h1 class="fl">全部商品分类</h1>
        <!-- <ul class="navlist fl">
          <li><a href="">首页</a></li>
          <li class="interval">|</li>
          <li><a href="">移动端书城</a></li>
          <li class="interval">|</li>
          <li><a href="">秒杀</a></li>
        </ul> -->
      </div>
    </div>

    <div class="center_con clearfix">
      <ul class="subnav fl">
        <li><div class="programming" @click="goTo('编程')">编程</div></li>
        <li><div class="internet" @click="goTo('互联网')">互联网</div></li>
        <li><div class="web" @click="goTo('Web')">Web</div></li>
        <li><div class="hci" @click="goTo('交互设计')">交互设计</div></li>
        <li><div class="economics" @click="goTo('经济')">经济</div></li>
        <li><div class="alg" @click="goTo('算法')">算法</div></li>
      </ul>
      <div class="slide fl">
        <el-carousel height="270px">
          <el-carousel-item v-for="item in banners" :key="item">
            <img :src="item" alt="" style="width: 760px; height: 270px;">
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="adv fl">
        <a href="#"><img src="../images/adv01.jpg" style="width: 240px; height: 135px;"></a>
        <a href="#"><img src="../images/adv02.jpg" style="width: 240px; height: 135px;"></a>
      </div>
    </div>

    <div class="list_model" v-for="category in books" :key="category.name">
      <div class="list_title clearfix">
        <h3 class="fl" :id="category.name">{{category.name}}</h3>
        <h3 class="fl" style="margin-left:5px">|</h3>
        <a href="#" class="book_more fr" @click="toBookList(category.id)">查看更多 ></a>
      </div>

      <div class="book_con clearfix">
        <div class="book_banner fl"><img :src="category.banner"></div>
        <ul class="book_list fl">
          <li v-for="item in category.book" :key="item.index" @click="toBookDetail(item.id)" class="pointer">
            <h4>{{item.name}}</h4>
            <img :src="item.image">
            <div class="price">¥ {{item.price}}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import FirstHeader from '../components/FirstHeader'

export default {
  name: 'Homepage',
  components: {
    FirstHeader
  },
  data () {
    return {
      banners: [require('../images/slide.jpg'), require('../images/slide02.jpg'), require('../images/slide03.jpg'), require('../images/slide04.jpg')],
      books: [{
        id: 0,
        name: '编程',
        banner: require('../images/banner01.jpg'),
        book: []
      }, {
        id: 1,
        name: '互联网',
        banner: require('../images/banner02.jpg'),
        book: []
      }, {
        id: 2,
        name: 'Web',
        banner: require('../images/banner03.jpg'),
        book: []
      }, {
        id: 3,
        name: '交互设计',
        banner: require('../images/banner04.jpg'),
        book: []
      }, {
        id: 4,
        name: '经济',
        banner: require('../images/banner05.jpg'),
        book: []
      }, {
        id: 5,
        name: '算法',
        banner: require('../images/banner06.jpg'),
        book: []
      }]
    }
  },
  methods: {
    goTo (id) {
      document.querySelector('#' + id).scrollIntoView(true)
    },
    toBookList (id) {
      this.$router.push(`/bookstore/booklist/${id}`)
    },
    toBookDetail (id) {
      this.$router.push(`/bookstore/detail/${id}`)
    },
    getData () {
      this.books.forEach(ele => {
        this.$axios.get(`/books/list/${ele.id}/default/1`)
          .then(res => {
            ele.book = res.data.books_li
            ele.book.forEach(item => {
              let url = item.image.substring(8)
              item.image = 'https://images.weserv.nl/?url=' + url
            })
          })
          .catch(err => {
            console.log(err)
          })
      })
    }
  },
  created () {
    this.books.forEach(ele => {
      ele.book = []
    })
    this.getData()
  }
}
</script>

<style scoped>
.search_bar{
  width:1200px;
  height:115px;
  margin:0 auto;
}
.logo{width:150px;height:59px;margin:29px 0 0 17px;}
.search_con{width:616px;height:38px;border:1px solid #409EFF;margin:34px 0 0 124px;background:url(../images/icons.png) 10px -338px no-repeat;}
.search_con .input_text{width:470px;height:34px;border:0px;margin:2px 0 0 36px;outline:none;font-size:12px;color:#737272;font-family:'Microsoft Yahei'}
.search_con .input_btn{
width:100px;height:38px;background-color:#f2f2f2;border:0px;font-size:14px;color:#635a5a;font-family:'Microsoft Yahei';outline:none;cursor:pointer;
}
.guest_cart{
width:200px;height:40px;margin-top:34px;
}

.guest_cart .cart_name{
width:158px;height:38px;line-height:38px;border:1px solid #dddddd;display:block;background:url(../images/icons.png) 13px -300px no-repeat;font-size:14px;color:#409EFF;text-indent:56px;
}

.guest_cart .book_count{
width:40px;height:40px;text-align:center;line-height:40px;font-size:18px;
font-weight:bold;color:#fff;background-color:#409EFF;
}

.navbar_con{height:40px;border-bottom:2px solid #d4d4d4;}
.navbar{width:1200px;margin:0 auto;}
.navbar h1{width:200px;height:40px;line-height:40px;text-align: center;font-size:14px;color:#635a5a;background-color:#f2f2f2}

.navlist{margin-left:34px;}
.navlist li{height:40px;float:left;line-height:40px;}
.navlist li a{color:#666;font-size:14px}
.navlist li a:hover{color:#409EFF}
.navlist .interval{margin:0 15px;}

.center_con{width:1200px;height:270px;margin:0 auto;}
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

.adv{width:240px;height:270px; overflow:hidden; background-color:gold;}
.adv a{display:block;float:left;}

.list_model{width:1200px;height:340px;margin:15px auto 0;}
.list_title{height:40px;border-bottom:2px solid #d4d4d4;}
.list_title h3{height:40px;line-height:40px;font-size:16px;color:#635a5a;font-weight:bold;}

.book_more{height:20px;margin-top:15px;color:#666}

.book_con{height:300px;}
.book_banner{width:200px;height:300px;}
.book_banner img{width:200px;height:300px;}

.book_list{width:1000px;height:299px;border-bottom:1px solid #ededed}
.book_list li{height:299px;width:249px;border-right:1px solid #ededed;float:left}
.book_list li:hover{width:248px;height:297px;border:1px solid #409EFF;}
.book_list li:hover img{opacity:0.8}

.book_list li h4{width:200px;height:50px;margin:20px auto 0;text-align:center;font-size:14px;color:#666;font-weight:normal;line-height:24px;}
.book_list li:hover h4{color:#409EFF}

.book_list li img{display:block;height:180px;margin:0 auto;}
.book_list li .price{text-align:center;font-size:20px;color:#c40000;margin-top:5px;}

.slide{width:760px;height:270px;position:relative;overflow:hidden;}
</style>
