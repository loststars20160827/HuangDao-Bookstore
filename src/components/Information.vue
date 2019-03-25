<template>
  <div class="information">
    <div v-if="dataLoaded">
      <div class="info_con clearfix">
        <div class="common_title2 fl">基本信息</div>
        <el-button type="text" class="fl">保存</el-button>
        <el-form ref="form" :model="form" label-width="80px" label-position="left" class="clearfix">
          <el-form-item label="用户名" style="width: 500px;">
            <el-input v-model="form.username" size="medium"></el-input>
          </el-form-item>
          <el-form-item label="默认地址" style="width: 500px;">
            <span v-if="form.address === ' （ 收） '" >暂无地址</span>
            <span v-else>{{form.address}}</span>
          </el-form-item>
        </el-form>
      </div>

      <h3 class="common_title2">最近浏览</h3>
      <div class="has_view_list">
        <ul class="book_type_list clearfix" v-if="books.length > 0">
          <li v-for="book in books" :key="book.id" @click="toBookDetail(book.id)">
            <img :src="book.image">
            <h4>{{book.name}}</h4>
              <div class="operate">
                <span class="prize">￥{{book.currentPrice}}</span>
              </div>
          </li>
        </ul>
        <div class="empty-book-list" v-else>暂无浏览记录</div>
      </div>
    </div>
    <div v-else class="loading-data">
      数据加载中...
    </div>
  </div>
</template>

<script>
export default {
  name: 'Information',
  data () {
    return {
      dataLoaded: false,
      form: {
        username: '',
        address: ''
      },
      books: []
    }
  },
  methods: {
    toBookDetail (id) {
      this.$router.push(`/bookstore/detail/${id}`)
    },
    getData () {
      this.$axios.get('/users/info/')
        .then(res => {
          let addr = res.data.addr
          this.form.username = this.$store.state.username
          this.form.address = `${addr.recipient_addr} （${addr.recipient_name} 收） ${addr.recipient_phone}`

          this.books = res.data.books_li
          this.books.forEach(ele => {
            ele.image = this.handleImage(ele.image)
            let price = ele.price * ele.discount
            ele.currentPrice = price.toFixed(2)
          })
          this.dataLoaded = true
        })
        .catch(err => {
          if (err.response.status === 400) {
            this.$store.commit('setUrl', '/bookstore/userpage/information')
            this.$router.push('/login')
          }
        })
    },
    handleImage (val) {
      let url = val.substring(8)
      return 'https://images.weserv.nl/?url=' + url
    }
  },
  created () {
    this.getData()
  }
}
</script>

<style scoped>

.common_title2{height:20px;line-height:20px;font-size:16px;margin:10px 0;width:470px;font-weight: 500;}

.book_type_list{margin:10px auto 0;}
.book_type_list li{width:196px;float:left;margin-bottom:10px}

.book_type_list li img{height:160px;display:block;margin:10px auto;}
.book_type_list li h4{width:160px;margin:0 auto;}
.book_type_list li h4 a{font-weight:normal;color:#666;display:block;width:160px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}
.operate{width:160px;margin:10px auto;position:relative;}
.book_type_list .operate .prize{color:#409EFF; font-size:14px;}
.book_type_list .operate .unit{color:#999;padding-left:5px;}
.book_type_list .operate .add_book{display:inline-block;width:15px;height:15px;background:url(../images/shop_cart.png);position:absolute;right:0;top:3px;}

.empty-book-list{height:200px;line-height: 200px;text-align: center;font-size: 14px;}
</style>
