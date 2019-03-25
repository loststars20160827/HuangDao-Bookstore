<template>
  <div class="cart">
    <FirstHeader />
    <el-breadcrumb separator-class="el-icon-arrow-right" style="width:1200px;margin:10px auto;">
      <el-breadcrumb-item :to="{ path: '/bookstore/homepage' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>购物车</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- <div class="total_count">全部商品<span>{{total}}</span>件</div> -->
    <div v-if="dataLoaded">
      <div v-if="books.length">
        <ul class="cart_list_th clearfix">
          <li class="col01">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          </li>
          <li class="col02">商品名称</li>
          <li class="col03">商品价格</li>
          <li class="col04">数量</li>
          <li class="col05">小计</li>
          <li class="col06">操作</li>
        </ul>

        <ul class="cart_list_td clearfix" v-for="book in books" :key="book.id">
          <li class="col01">
            <el-checkbox v-model="book.checked" @change="handleCheckBookChange(book, book.checked)"></el-checkbox>
          </li>
          <li class="col02"><img :src="book.image"></li>
          <li class="col03">{{book.name}}</li>
          <li class="col05">
            <div class="original-price" :class="{'delete': book.discount !== '1.00' ? true : false}">￥ {{book.price}}</div>
            <div class="discount-price" v-if="book.discount !== '1.00'">￥ {{book.currentPrice}}</div>
          </li>
          <li class="col06">
            <div class="num_add">
              <el-input-number v-model="book.total" :min="1" :max="100" label="数量" size="mini" @change="bookTotalChange(book.id, book.total)"></el-input-number>
            </div>
          </li>
          <li class="col07" style="color:#409EFF;font-weight:bold;">￥ {{book.currentPrice * book.total}}</li>
          <li class="col08"><span @click="handleDelete(book)">删除</span></li>
        </ul>

        <ul class="settlements">
          <li class="col01">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          </li>
          <!-- <li class="col02">全选</li> -->
          <li class="col03">合计(不含运费)：<span>¥</span><em>{{totalMoney}}</em><br>已选商品<b>{{checkedBooks.length}}</b>件</li>
          <li class="col04 pointer"><span @click="handlePay">去结算</span></li>
        </ul>
      </div>
      <div class="empty-wrap" v-else>
        <img src="../images/empty-cart.png" alt="" class="empty-cart">
        <h2>您的购物车还是空的，赶紧行动吧!</h2>
      </div>
    </div>
    <div v-else class="loading-data">
      数据加载中...
    </div>
  </div>
</template>

<script>
import FirstHeader from '../components/FirstHeader'
import Vue from 'vue'

export default {
  name: 'Cart',
  components: {
    FirstHeader
  },
  computed: {
    total () {
      return this.books.length
    },
    totalMoney () {
      var money = 0
      for (var i = 0; i < this.checkedBooks.length; i++) {
        let book = this.checkedBooks[i]
        money += book.currentPrice * book.total
      }
      return money
    }
  },
  data () {
    return {
      dataLoaded: false,
      books: [{id: 1, name: 'Python', image: require('../images/book02.jpg'), price: 100, discount: 1, total: 1}],
      checkAll: false,
      checkedBooks: [],
      bookOptions: [],
      isIndeterminate: false,
      data: {}
    }
  },
  methods: {
    handleDelete (book) {
      this.$confirm('确认要删除该书籍吗', '删除书籍', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$axios.delete('/cart/delete/', {
            data: {
              books_id: book.id
            }
          })
            .then(res => {
              switch (res.data) {
                case 1:
                  this.$message({
                    message: '数据不完整',
                    type: 'error'
                  })
                  break
                case 2:
                  this.$message({
                    message: '商品不存在',
                    type: 'error'
                  })
                  break
                default:
                  this.$message({
                    message: '删除成功',
                    type: 'success'
                  })
                  this.books.splice(this.books.indexOf(book), 1)
              }
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {
          this.$message({
            message: '已取消删除',
            type: 'info'
          })
        })
    },
    handleCheckAllChange (val) {
      if (val === true) {
        this.books.forEach(ele => {
          ele.checked = true
        })
      } else {
        this.books.forEach(ele => {
          ele.checked = false
        })
      }
      this.checkedBooks = val ? this.bookOptions : []
      this.isIndeterminate = false
    },
    handleCheckBookChange (book, val) {
      if (val === true) {
        this.checkedBooks.push(book)
      } else {
        let index = this.checkedBooks.indexOf(book)
        this.checkedBooks.splice(index, 1)
      }
      let checkedCount = this.checkedBooks.length
      this.checkAll = checkedCount === this.bookOptions.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.bookOptions.length
    },
    handlePay () {
      let books = []
      this.checkedBooks.forEach(ele => {
        books.push(ele.id)
      })
      this.$axios({
        method: 'POST',
        url: '/order/place/',
        data: {
          books_ids: books
        }
      })
        .then(res => {
          this.$store.commit('setOrder', res.data)
          this.$router.push('/bookstore/submitorder')
        })
        .catch(err => {
          console.log(err)
        })
    },
    getData () {
      this.$axios.get('/cart/')
        .then(res => {
          if (res.status === 204) {
            this.dataLoaded = true
            this.books = []
          } else {
            this.books = res.data.books_li
            var index = 0
            this.books.forEach(ele => {
              ele.image = this.handleImage(ele.image)
              Vue.set(ele, 'total', res.data.counts[index++])
              let price = ele.price * ele.discount
              ele.currentPrice = price.toFixed(2)
            })
            this.bookOptions = this.books
            this.dataLoaded = true
          }
        })
        .catch(err => {
          if (err.response.status === 400) {
            this.$store.commit('setUrl', '/bookstore/cart')
            this.$router.push('/login')
          }
        })
    },
    handleImage (val) {
      let url = val.substring(8)
      return 'https://images.weserv.nl/?url=' + url
    },
    bookTotalChange (id, total) {
      this.$axios({
        method: 'PUT',
        url: '/cart/update/',
        data: {
          books_id: id,
          books_count: total
        }
      })
        .then(res => {
          switch (res.data) {
            case 1:
              this.$message({
                message: '商品不存在',
                type: 'error'
              })
              break
            case 2:
              this.$message({
                message: '商品库存不足',
                type: 'error'
              })
              break
            default:
              break
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  mounted () {
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
.logo{width:160px;height:53px;margin:29px 0 0 17px;}
.search_con{width:616px;height:38px;border:1px solid #409EFF;margin:34px 0 0 124px;background:url(../images/icons.png) 10px -338px no-repeat;}
.search_con .input_text{width:470px;height:34px;border:0px;margin:2px 0 0 36px;outline:none;font-size:12px;color:#737272;font-family:'Microsoft Yahei'}
.search_con .input_btn{
width:100px;height:38px;background-color:#409EFF;border:0px;font-size:14px;color:#fff;font-family:'Microsoft Yahei';outline:none;cursor:pointer;
}
.sub_page_name{font-size:18px;color:#666;margin:50px 0 0 20px}

.total_count{width:1200px;margin:0 auto;height:40px;line-height:40px;font-size:14px;}
.total_count span{font-size:16px;color:#ff4200;margin:0 5px;}
.cart_list_th{width:1198px;border:1px solid #ddd;background-color:#f2f2f2;margin:0 auto;}
.cart_list_th li{height:40px;line-height:40px;float:left;text-align:center;}
.cart_list_th .col01{width:6%;}
.cart_list_th .col02{width:40%;}
.cart_list_th .col03{width:12%;}
.cart_list_th .col04{width:15%;}
.cart_list_th .col05{width:15%;}
.cart_list_th .col06{width:12%;}

.cart_list_td{width:1198px;border:1px solid #ddd;background-color:#fff;margin:0 auto;margin-top:-1px;}
.cart_list_td li{height:120px;line-height:120px;float:left;text-align:center;}

.cart_list_td .col01{width:6%;}
.cart_list_td .col02{width:10%;}
.cart_list_td .col03{width:30%;}
.cart_list_td .col05{width:12%;}
.cart_list_td .col06{width:15%;}
.cart_list_td .col07{width:15%;}
.cart_list_td .col08{width:12%;}

.cart_list_td .col02 img{height:100px;border:1px solid #ddd;display:block;margin:10px auto 0;}
.cart_list_td .col03{height:120px;text-align:left;line-height:120px;}
.cart_list_td .col08 span{color:#666}
.cart_list_td .col08 span:hover{color:#409EFF;cursor: pointer;}

.cart_list_td .col06 .num_add{margin: 0 auto;}

.settlements{width:1198px;height:78px;border:1px solid #ddd;background-color:#f2f2f2;margin:-1px auto 0;}
.settlements li{line-height:78px;float:left;}
.settlements .col01{width:6%;text-align:center}
/* .settlements .col02{width:12%;} */
.settlements .col03{width:78%; height:48px; line-height:28px;text-align:right;margin-top:10px;}
.settlements .col03 span{color:#409EFF;padding-right:5px}
.settlements .col03 em{color:#409EFF;font-size:22px;font-weight:bold;}
.settlements .col03 span{color:#409EFF;}
.settlements .col03 b{color:#409EFF;font-size:14px;padding:0 5px;}

.settlements .col04{width:14%;text-align:center;float:right;}
.settlements .col04 span{display:block;height:78px;background-color:#635a5a;text-align:center;line-height:78px;color:#fff;font-size:24px}

.original-price{height:60px;line-height: 120px;}
.delete{text-decoration:line-through;color:#777;}
.discount-price{color:#409EFF;font-weight: bold;height:60px;line-height: 40px;}

.empty-wrap{height:350px;width:100%;text-align: center;}
.empty-cart{width:300px;}
</style>
