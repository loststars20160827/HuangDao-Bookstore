<template>
  <div class="orders">
    <div v-if="dataLoaded">
      <h3 class="common_title2">全部订单</h3>
      <div  v-if="orders.length">
        <div v-for="order in currentOrders" :key="order.id">
          <ul class="order_list_th w978 clearfix">
            <li class="col01">{{order.create_time}}</li>
            <li class="col02">订单号：{{order.order_id}}</li>
            <li class="col03" @click="handleCancelOrder(order)">取消订单</li>
          </ul>
          <table class="order_list_table w980">
            <tbody>
              <tr>
                <td width="55%">
                  <ul class="order_book_list clearfix" v-for="book in order.books" :key="book.id">
                    <li class="col01"><img :src="book.image"></li>
                    <li class="col02">{{book.name}}</li>
                    <li class="col03">
                      <div class="original-price" :class="{'delete': book.discount !== 1.00 ? true : false}">￥ {{book.price}}</div>
                      <div class="discount-price" v-if="book.discount !== 1.00">￥ {{book.currentPrice}}</div>
                    </li>
                    <li class="col04">{{book.total}}</li>
                  </ul>
                </td>
                <td width="15%">￥ {{order.total_price}}</td>
                <td width="15%">{{order.status}}</td>
                <td width="15%">
                  <div class="oper_btn" v-if="order.status === '待付款'" @click="toPay(order.order_id)">去付款</div>
                  <div v-if="order.status === '待发货'"></div>
                  <div class="oper_btn" v-if="order.status === '已发货'">查看物流</div>
                  <div v-if="order.status === '已完成'">已完成</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="2"
          layout="total, prev, pager, next"
          :total="orders.length"
          style="text-align:center;margin-top:20px;">
        </el-pagination>
      </div>
      <div v-else style="text-align:center">
        <img src="../images/no-order.png" alt="">
        <h3>还没有订单呢，快去逛逛吧</h3>
      </div>
    </div>
    <div v-else class="loading-data">
      数据加载中...
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  name: 'Orders',
  data () {
    return {
      dataLoaded: false,
      orders: [],
      currentPage: 1,
      currentOrders: []
    }
  },
  methods: {
    toPay (id) {
      this.$axios({
        method: 'POST',
        url: '/order/pay/',
        data: {
          order_id: id
        }
      })
        .then(res => {
          window.location.href = res.data.pay_url
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleCurrentChange () {
      this.currentOrders = this.orders.slice((this.currentPage - 1) * 2, (this.currentPage - 1) * 2 + 2)
    },
    handleImage (val) {
      let url = val.substring(8)
      return 'https://images.weserv.nl/?url=' + url
    },
    handleCancelOrder (order) {
      this.$confirm('确认要取消订单吗', '取消订单', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$axios.delete(`/order/cancel/${order.order_id}`)
            .then(res => {
              if (res.status === 200) {
                this.$message({
                  message: '成功取消订单',
                  type: 'success'
                })
                this.orders.splice(this.orders.indexOf(order), 1)
              } else {
                this.$message({
                  message: '取消失败，请重试',
                  type: 'error'
                })
              }
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {
          this.$message({
            message: '已取消取消订单',
            type: 'info'
          })
        })
    },
    getData () {
      this.currentOrders = this.orders.slice(0, 2)
      this.$axios.get('/order/all/')
        .then(res => {
          this.orders = res.data.order_infos
          if (this.orders.length === 0) {
            this.dataLoaded = true
          } else {
            this.orders.forEach(ele => {
              switch (ele.status) {
                case 1:
                  ele.status = '待付款'
                  break
                case 2:
                  ele.status = '待发货'
                  break
                case 3:
                  ele.status = '已发货'
                  break
                default:
                  ele.status = '已完成'
                  break
              }
              let books = []
              this.$axios.get(`/order/all/${ele.order_id}/books`)
                .then(res => {
                  res.data.order_books.forEach(item => {
                    let book = item.books
                    book.image = this.handleImage(book.image)
                    book.count = item.count
                    let price = book.price * book.discount
                    book.currentPrice = price.toFixed(2)
                    books.push(book)
                  })
                  Vue.set(ele, 'books', books)
                })
                .catch(err => {
                  console.log(err)
                })
              this.currentOrders = this.orders.slice(0, 2)
              this.dataLoaded = true
            })
          }
        })
        .catch(err => {
          if (err.response.status === 400) {
            this.$store.commit('setUrl', '/bookstore/userpage/orders')
            this.$router.push('/login')
          }
        })
    }
  },
  created () {
    this.getData()
  }
}
</script>

<style scoped>
.common_title2{height:20px;line-height:20px;font-size:16px;margin:10px 0;width:270px;font-weight: 500;}
.order_list_th{width:978px;border:1px solid #ddd;background-color:#f2f2f2;margin:20px auto 0;}
.order_list_th li{float:left;height:30px;line-height:30px}
.order_list_th .col01{width:20%;margin-left:20px}
.order_list_th .col02{width:20%}
.order_list_th .col03{width:55%;text-align:end;}
.order_list_th .col03:hover{color:#409EFF;}

.order_list_table{
width:980px;
border-collapse:collapse;
border-spacing:0px;
border:1px solid #ddd;
margin:-1px auto 0;
}

.order_list_table td{
border:1px solid #d4d4d4;
text-align:center;
}

.order_book_list{border-bottom:1px solid #ddd;margin-bottom:-2px;}
.order_book_list li{float:left; height:80px;line-height:80px;}
.order_book_list .col01{width:20%}
.order_book_list .col01 img{height:60px;border:1px solid #ddd;margin:10px auto;}
.order_book_list .col02{width:50%;text-align:left;}
.order_book_list .col02 em{color:#999;margin-left:10px}
.order_book_list .col03{width:10%}
.order_book_list .col04{width:20%}
.oper_btn{display:inline-block;background:#635a5a;color:#fff;padding:5px 10px}

.original-price{height:40px;line-height: 80px;}
.delete{text-decoration:line-through;color:#777;}
.discount-price{color:#409EFF;font-weight: bold;height:40px;line-height: 30px;}
</style>
