 <template>
  <div class="detail">
    <FirstHeader :isCart = "false" />
    <Navigation/>

    <el-breadcrumb separator-class="el-icon-arrow-right" style="width:1200px;margin:10px auto;">
      <el-breadcrumb-item :to="{ path: '/bookstore/homepage' }">全部分类</el-breadcrumb-item>
      <el-breadcrumb-item>{{type}}</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="main_wrap clearfix" v-if="dataLoaded">
      <div class="r_wrap fr clearfix">
        <div class="sort_bar">
          <span :class="{'active': isDefault}"  @click="getBooksByDefault">默认</span>
          <span :class="{'active': isNewest}" @click="getBooksByNewest">最新</span>
          <span :class="{'active': isHotest}" @click="getBooksByHotest">最热</span>
        </div>
        <ul class="book_type_list clearfix">
          <li v-for="book in firstLine" :key="book.id">
            <img :src="book.image" @click="toBookDetail(book.id)">
            <!-- <div class="img" :style="{background: 'url(' + book.image + ')', backgrountSize: 'cover'}"></div> -->
            <h4 @click="toBookDetail(book.id)">{{book.name}}</h4>
            <div class="operate">
              <span :class="{'delete': book.discount !== '1.00' ? true : false, 'price': book.discount === 1 ? true : false}">￥ {{book.price}}</span>
              <span class="price"  v-if="book.discount !== '1.00'">￥ {{book.price * book.discount}}</span>
              <span class="add_book" title="加入购物车" @click="addToCart(id)"></span>
            </div>
          </li>
        </ul>
        <ul class="book_type_list clearfix">
          <li v-for="book in secondLine" :key="book.id">
            <img :src="book.image" @click="toBookDetail(book.id)">
            <!-- <div class="img" :style="{background: 'url(' + book.image + ')', backgrountSize: 'cover'}"></div> -->
            <h4 @click="toBookDetail(book.id)">{{book.name}}</h4>
            <div class="operate">
              <span :class="{'delete': book.discount !== '1.00' ? true : false, 'price': book.discount === 1 ? true : false}">￥ {{book.price}}</span>
              <span class="price"  v-if="book.discount !== '1.00'">￥ {{book.price * book.discount}}</span>
              <span class="add_book" title="加入购物车" @click="addToCart(id)"></span>
            </div>
          </li>
        </ul>
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="10"
          layout="total, prev, pager, next"
          :total="bookList.length"
          style="text-align:center;">
        </el-pagination>
      </div>
    </div>
    <div v-else class="loading-data">
      数据加载中...
    </div>
  </div>
</template>

<script>
import FirstHeader from '../components/FirstHeader'
import Navigation from '../components/Navigation'

export default {
  name: 'Detail',
  components: {
    FirstHeader,
    Navigation
  },
  data () {
    return {
      dataLoaded: false,
      type: '',
      isDefault: true,
      isNewest: false,
      isHotest: false,
      bookList: [],
      currentPage: 1,
      currentBookList: [],
      firstLine: [],
      secondLine: [],
      recommandation: [{
        id: 1,
        name: 'Python核心编程',
        image: require('../images/book/book001.jpg'),
        price: 3.90
      }, {
        id: 2,
        name: 'Python学习手册',
        image: require('../images/book/book001.jpg'),
        price: 16.80
      }]
    }
  },
  watch: {
    '$route' (to, from) {
      this.getType()
      this.getBooksBy('default')
    }
  },
  methods: {
    handleCurrentChange () {
      this.currentBookList = this.bookList.slice((this.currentPage - 1) * 10, (this.currentPage - 1) * 10 + 10)
      this.firstLine = this.currentBookList.slice(0, 5)
      this.secondLine = this.currentBookList.slice(5, 10)
    },
    toBookDetail (id) {
      this.$router.push(`/bookstore/detail/${id}`)
    },
    getBooksByDefault () {
      this.getBooksBy('default')
      this.isDefault = true
      this.isNewest = !this.isDefault
      this.isHotest = !this.isDefault
    },
    getBooksByNewest () {
      this.getBooksBy('newest')
      this.isNewest = true
      this.isDefault = !this.isNewest
      this.isHotest = !this.isNewest
    },
    getBooksByHotest () {
      this.getBooksBy('hotest')
      this.isHotest = true
      this.isDefault = !this.isHotest
      this.isNewest = !this.isHotest
    },
    getBooksBy (sort) {
      this.$axios.get(`/books/list/${this.$route.params.id}/${sort}/0`)
        .then(res => {
          this.bookList = res.data.books_li
          this.bookList.forEach(ele => {
            ele.image = this.handleImage(ele.image)
          })
          this.currentBookList = this.bookList.slice(0, 10)
          this.firstLine = this.currentBookList.slice(0, 5)
          this.secondLine = this.currentBookList.slice(5, 10)
          this.currentPage = 1
          this.dataLoaded = true
        })
        .catch(err => {
          console.log(err)
        })
    },
    getType () {
      switch (this.$route.params.id) {
        case '0':
          this.type = '编程'
          break
        case '1':
          this.type = '互联网'
          break
        case '2':
          this.type = 'Web'
          break
        case '3':
          this.type = '交互设计'
          break
        case '4':
          this.type = '经济'
          break
        default:
          this.type = '算法'
          break
      }
    },
    getData () {
      this.bookList = []
      this.getType()
      this.getBooksByDefault()
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
.loading-data{height:400px;line-height: 400px;text-align: center;font-size: 16px;}
.new_book{border:1px solid #ededed;border-top:2px solid #4277ad;padding-bottom:10px;}

.new_book h3{height:33px;line-height:33px;background-color:#fcfcfc;border-bottom:1px solid #ededed;font-size:14px;font-weight:normal;text-indent:10px;}

.new_book ul{width:160px;margin:0 auto;overflow:hidden;}
.new_book li{border-bottom:1px solid #ededed;margin-bottom:-1px;}
.new_book li img{display:block;width:150px;height:150px;margin:10px auto;}
.new_book li h4{width:160px;margin:0 auto;}
.new_book li h4 a{font-weight:normal;color:#666;display:block;width:160px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}
.price{font-size:14px;color:#da260e;margin:10px auto;}
.delete{text-decoration:line-through;color: #777;font-size:14px;margin:10px auto;}

.main_wrap{width:1200px;margin:0 auto;}
.l_wrap{width:200px;}
.r_wrap{width:1200px;}

.sort_bar{height:30px;background-color:#f0fdec}
.sort_bar span{display:block;height:30px;line-height:30px;padding:0 20px;float:left;color:#000;cursor: pointer;}
.sort_bar .active{background-color:#4277ad;color:#fff;}

.book_type_list{
margin:10px auto 0;
}

.book_type_list li{
width:240px;
float:left;
margin-bottom:10px
}

.book_type_list li img{height:160px;display:block;margin:10px auto;}
.book_type_list li .img{height:240px;}
.book_type_list li h4{width:160px;margin:0 auto;}
.book_type_list li h4 a{font-weight:normal;color:#666;display:block;width:160px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}
.operate{width:160px;margin:10px auto;position:relative;}
.book_type_list .operate .price{color:#da260e; font-size:14px;}
.book_type_list .operate .unit{color:#999;padding-left:5px;}
.book_type_list .operate .add_book{display:inline-block;width:15px;height:15px;background:url(../images/shop_cart.png);position:absolute;right:0;top:3px;}
</style>
