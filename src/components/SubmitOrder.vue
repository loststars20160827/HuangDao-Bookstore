<template>
  <div class="submit-order">
    <FirstHeader :isCart = "false" />
    <h3 class="common_title">确认收货地址</h3>

    <div class="common_list_con clearfix">
      <dl>
        <dt>寄送到：</dt>
        <dd><input type="radio" name="" checked="">{{addr}}</dd>
      </dl>
      <a href="" class="edit_site">编辑收货地址</a>
    </div>

    <h3 class="common_title">支付方式</h3>
    <div class="common_list_con clearfix">
      <div class="pay_style_con clearfix">
        <!-- <input type="radio" name="pay_style" checked>
        <label class="weixin">微信支付</label> -->
        <input type="radio" name="pay_style" checked>
        <label class="zhifubao"></label>
        <!-- <input type="radio" name="pay_style">
        <label class="bank">银行卡支付</label> -->
        <!-- <el-radio-group v-model="payType">
          <el-radio :label="'weichat'"><label class="weixin">微信支付</label></el-radio>
          <el-radio :label="'3'"><label class="zhifubao"></label></el-radio>
          <el-radio :label="'bank'"><label class="bank">银行卡支付</label></el-radio>
        </el-radio-group> -->
      </div>
    </div>

    <h3 class="common_title">商品列表</h3>
    <div class="common_list_con clearfix">
      <ul class="book_list_th clearfix">
        <li class="col01">商品名称</li>
        <li class="col03">商品价格</li>
        <li class="col04">数量</li>
        <li class="col05">小计</li>
      </ul>
      <ul class="book_list_td clearfix" v-for="book in books" :key="book.id">
        <li class="col01">{{books.indexOf(book) + 1}}</li>
        <li class="col02"><img :src="book.image"></li>
        <li class="col03">{{book.name}}</li>
        <li class="col05">
          <div class="original-price" :class="{'delete': book.discount !== '1.00' ? true : false}">￥ {{book.price}}</div>
          <div class="discount-price" v-if="book.discount !== '1.00'">￥ {{book.currentPrice}}</div>
        </li>
        <li class="col06">{{book.total}}</li>
        <li class="col07">￥ {{book.currentPrice * book.total}}</li>
      </ul>
    </div>

    <h3 class="common_title">总金额结算</h3>
    <div class="common_list_con clearfix">
      <div class="settle_con">
        <div class="total_book_count">共<em>{{totalCount}}</em>件商品，总金额<b>￥ {{totalPrice}}</b></div>
        <div class="transit">运费：<b>￥ {{transitPrice}}</b></div>
        <div class="total_pay">实付款：<b>￥ {{totalPay}}</b></div>
      </div>
    </div>
    <div class="order_submit clearfix">
      <div @click="handleSubmitOrder">提交订单</div>
    </div>
  </div>
</template>

<script>
import FirstHeader from '../components/FirstHeader'

export default {
  name: 'SubmitOrder',
  components: {
    FirstHeader
  },
  data () {
    return {
      payType: '1',
      books: [],
      addr: '',
      transitPrice: 0,
      totalPrice: 0,
      totalPay: 0,
      totalCount: 0
    }
  },
  computed: {
    order () {
      return this.$store.state.order
    }
  },
  methods: {
    handleSubmitOrder () {
      this.$confirm('确认要提交订单吗', '提交订单', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$axios({
            method: 'POST',
            url: '/order/commit/',
            data: {
              addr_id: this.order.addr.id,
              pay_method: 3,
              books_ids: this.order.books_ids
            }
          })
            .then(res => {
              if (res.data.res === 6) {
                this.$axios({
                  method: 'POST',
                  url: '/order/pay/',
                  data: {
                    order_id: res.data.order_id
                  }
                })
                  .then(res => {
                    window.location.href = res.data.pay_url
                  })
                  .catch(err => {
                    console.log(err)
                  })
              } else {
                this.$message({
                  message: '提交失败，请重试',
                  type: 'error'
                })
              }
            })
        })
        .catch(() => {
          this.$message({
            message: '已取消提交',
            type: 'info'
          })
        })
    },
    getData () {
      let data = this.order
      this.addr = `${data.addr.recipient_addr} （${data.addr.recipient_name} 收） ${data.addr.recipient_phone}`
      this.books = data.books_li
      var index = 0
      let count = data.books_count
      this.books.forEach(ele => {
        ele.image = this.handleImage(ele.image)
        ele.total = count[index++]
        let price = ele.price * ele.discount
        ele.currentPrice = price.toFixed(2)
      })
      this.transitPrice = data.transit_price
      this.totalPrice = data.total_price
      this.totalPay = data.total_pay
      this.totalCount = data.total_count
    },
    handleImage (val) {
      let url = val.substring(8)
      return 'https://images.weserv.nl/?url=' + url
    }
  },
  created () {
    this.getData()
  },
  beforeRouteLeave (to, from, next) {
    console.log(from)
    this.$store.commit('setOrder', {})
    next()
  }
}
</script>

<style scoped>
.common_title{width:1200px;margin:20px auto 0;font-size:14px;}

.common_list_con{width:1200px;border:1px solid #dddddd;border-top:2px solid #d4d4d4;margin:10px auto 0;background-color:#fff;position:relative;}

.common_list_con dl{margin:20px;}
.common_list_con dt{font-size:14px;font-weight:bold;margin-bottom:10px}
.common_list_con dd input{vertical-align:bottom;margin-right:10px}

.edit_site{position:absolute; right:20px;top:30px;width:100px;height:30px;background-color:#635a5a;text-align:center;line-height:30px;color:#fff}

.pay_style_con{margin:20px;}
.pay_style_con input{float:left;margin:14px 7px 0 0;}
.pay_style_con label{float:left;background-color:#fff;padding:10px 10px 10px 40px;margin-right:25px}

.pay_style_con .cash{background:url(../images/pay_icons.png) 8px top no-repeat #fff;}
.pay_style_con .weixin{background:url(../images/pay_icons.png) 6px -36px no-repeat #fff;}

.pay_style_con .zhifubao{background:url(../images/pay_icons.png) 12px -72px no-repeat #fff;width:50px;height:16px}

.pay_style_con .bank{background:url(../images/pay_icons.png) 6px -108px no-repeat #fff;}

.book_list_th{height:40px;border-bottom:1px solid #ccc}
.book_list_th li{float:left;line-height:40px;text-align:center;}
.book_list_th .col01{width:45%}
.book_list_th .col03{width:25%}
.book_list_th .col04{width:15%}
.book_list_th .col05{width:15%}

.book_list_td{height:80px;border-bottom:1px solid #eeeded}
.book_list_td li{float:left;line-height:80px;text-align:center;}
.book_list_td .col01{width:4%}
.book_list_td .col02{width:6%}
.book_list_td .col03{width:35%}
.book_list_td .col05{width:25%}
.book_list_td .col06{width:15%}
.book_list_td .col07{width:15%}

.book_list_td .col02{text-align:right}
.book_list_td .col02 img{height:63px;border:1px solid #ddd;display:block;margin:7px 0;float:right;}
.book_list_td .col03{text-align:left;text-indent:20px}

.original-price{height: 40px;line-height: 80px;}
.discount-price{height: 40px;line-height: 40px;color: #409EFF;}
.delete{text-decoration: line-through;color: #777;}

.settle_con{margin:10px}
.total_book_count,.transit,.total_pay{line-height:24px;text-align:right}
.total_book_count em,.total_book_count b,.transit b,.total_pay b{font-size:14px;color:#409EFF;padding:0 5px;}

.order_submit{width:1200px;margin:20px auto;}
.order_submit div{width:160px;height:40px;line-height:40px;text-align:center;background-color:#635a5a;color:#fff;font-size:16px;display:block;float:right;cursor: pointer;}
</style>
