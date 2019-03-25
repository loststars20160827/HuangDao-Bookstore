<template>
  <div class="hello">
    <div class="search_bar clearfix">
      <img src="../images/logo.png" class="logo fl" @click="toHomepage">
      <div class="sub_page_name fl" v-if="isCart">|&nbsp;&nbsp;&nbsp;&nbsp;购物车</div>
      <div class="search_con fr">
        <input type="text" class="input_text fl" name="" placeholder="搜索商品">
        <input type="button" class="input_btn fr" name="" value="搜索">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['isCart'],
  name: 'FirstHeader',
  data () {
    return {
      count: 0
    }
  },
  methods: {
    toCart () {
      this.$router.push('/bookstore/cart')
    },
    toHomepage () {
      this.$router.push('/bookstore/homepage')
    }
  }
}
</script>

<style scoped>
.search_bar{
  width:1200px;
  height:115px;
  margin:0 auto;
}
.logo{height:60px;margin:25px 0 0 40px;}
.sub_page_name{font-size:18px;color:#666;margin:50px 0 0 20px}
.search_con{width:616px;height:38px;border:1px solid #d4d4d4;margin:34px 0 0 124px;background:url(../images/icons.png) 10px -338px no-repeat;}
.search_con .input_text{width:470px;height:34px;border:0px;margin:2px 0 0 36px;outline:none;font-size:12px;color:#737272;font-family:'Microsoft Yahei'}
.search_con .input_btn{
width:100px;height:38px;background-color:#635a5a;border:0px;font-size:14px;color:#fff;font-family:'Microsoft Yahei';outline:none;cursor:pointer;
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
</style>
