<template>
  <div class="detail">
    <FirstHeader :isCart = "false" />
    <Navigation/>

    <el-breadcrumb separator-class="el-icon-arrow-right" style="width:1200px;margin:10px auto;">
      <el-breadcrumb-item :to="{ path: '/bookstore/homepage' }">全部分类</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: `/bookstore/booklist/${bookDetail.type_id}` }">{{bookDetail.type}}</el-breadcrumb-item>
      <el-breadcrumb-item>商品详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div v-if="dataLoaded">
      <div class="book_detail_con clearfix">
        <div class="book_detail_pic fl">
          <img :src="bookDetail.image">
        </div>
        <div class="book_detail_list fr">
          <h3>{{bookDetail.name}}</h3>
          <p>{{bookDetail.desc}}</p>
          <div class="price_bar">
            <!-- <span class="show-price">¥<em>{{bookDetail.price}}</em></span> -->
            <div class="show-price" :class="{'delete': bookDetail.discount !== 1.00 ? true : false}">￥ {{bookDetail.price}}</div>
            <span v-if="bookDetail.discount !== 1.00">折扣：{{bookDetail.discount}}</span>
            <div class="discount-price" v-if="bookDetail.discount !== 1.00">￥ {{bookDetail.currentPrice}}</div>
          </div>
          <div class="book_num clearfix">
            <div v-if="bookDetail.stock > 0">
              <div class="num_name fl">数 量：</div>
              <el-input-number v-model="count" :min="1" :max="100" label="数量"></el-input-number>
            </div>
            <div v-else style="height:52px;line-height:52px;font-size:16px;font-weight:bold;color:#555">该商品库存为0，预计补货时间为：{{suppleTime}}</div>
          </div>
          <div class="total">总价：<em>{{totalPrice}}</em></div>
          <div class="operate_btn">
            <div class="buy_btn" @click="handleBuy" v-if="bookDetail.stock > 0">立即购买</div>
            <div class="add_cart" @click="handleAddInCart" v-if="bookDetail.stock > 0">加入购物车</div>
          </div>
        </div>
      </div>
      <div class="main_wrap clearfix">
        <div class="l_wrap fl clearfix">
          <div class="new_book">
            <h3>新品推荐</h3>
            <ul>
              <li v-for="item in recommandation" :key="item.id">
                <img :src="item.image" @click="toBookDetail(item.id)">
                <h4 @click="toBookDetail(item.id)">{{item.name}}</h4>
                <div class="price">￥{{item.price}}</div>
              </li>
            </ul>
          </div>
        </div>
        <el-tabs type="card" class="r_wrap fr clearfix">
          <el-tab-pane label="商品介绍">
            <span>商品详情：</span>
            <p style="width:100%">{{bookDetail.detail}}</p>
            <span style="padding-bottom: 5px;border-bottom: 2px solid #f89;display:inline-block;">pie</span>
          </el-tab-pane>
          <el-tab-pane label="评论">
            <div class="comment-input">
              <el-input v-model="comment" placeholder="评论" type="textarea" :rows="2"></el-input>
              <!-- <el-button @click="handleSubmitComment" size="small" class="fr" style="margin-top:10px;" type="primary" plain>提交</el-button> -->
              <button @click="handleSubmitComment" class="fr submit-comment-btn">提交</button>
            </div>
            <div v-for="comment in comments" :key="comment.id" class="comment-display">
              <div style="font-weight:bold;color:#333;font-size:16px;height:40px;">
                <div style="display:inline-block;height:32px;" class="fl"><img  src="../images/user.png" alt=""></div>
                <div style="display:inline-block;height:32px;line-height:32px;margin-left:10px;" class="fl">{{comment.user_name}}</div>
              </div>
              <div style="color:#6f6e6e;margin-top: 5px;">{{comment.create_time}}</div>
              <p style="color:#000;font-size:14px;">{{comment.content}}</p>
            </div>
          </el-tab-pane>
        </el-tabs>
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
  computed: {
    totalPrice () {
      let price = parseFloat(this.count) * this.bookDetail.currentPrice
      return price.toFixed(2)
    }
  },
  data () {
    return {
      dataLoaded: false,
      comments: [],
      comment: '',
      bookDetail: {
        type: 'Python',
        name: '计算机程序设计艺术',
        introduction: '《计算机程序设计艺术》系列是公认的计算机科学领域经典之作，深入阐述了程序设计理论，对计算机领域的发展有着极为深远的影响。本书是该系列的第 1 卷，讲解基本算法，其中包含了其他各卷都需用到的基本内容。本卷从基本概念开始，然后讲述信息结构，并辅以大量的习题及答案。',
        price: 100,
        image: require('../images/book_detail.jpg'),
        detail: '《计算机程序设计艺术》系列是公认的计算机科学领域经典之作，深入阐述了程序设计理论，对计算机领域的发展有着极为深远的影响。本书是该系列的第 1 卷，讲解基本算法，其中包含了其他各卷都需用到的基本内容。本卷从基本概念开始，然后讲述信息结构，并辅以大量的习题及答案。'
      },
      count: 1,
      suppleTime: '',
      recommandation: []
    }
  },
  watch: {
    '$route' (to, from) {
      this.getData()
    }
  },
  methods: {
    toBookDetail (id) {
      this.$router.push(`/bookstore/detail/${id}`)
    },
    handleBuy () {
      this.$axios({
        method: 'POST',
        url: '/order/place/',
        data: {
          books_ids: [this.bookDetail.id],
          count: this.count
        }
      })
        .then(res => {
          this.$store.commit('setOrder', res.data)
          this.$router.push('/bookstore/submitorder')
        })
        .catch(err => {
          if (err.response.status === 400) {
            this.$store.commit('setUrl', `/bookstore/detail/${this.bookDetail.id}`)
            this.$router.push('/login')
          }
        })
    },
    handleAddInCart () {
      this.$axios({
        method: 'POST',
        url: '/cart/add/',
        data: {
          books_id: this.bookDetail.id,
          books_count: this.count
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
              this.$message({
                message: '已加入购物车',
                type: 'success'
              })
              break
          }
        })
        .catch(err => {
          if (err.response.status === 400) {
            this.$store.commit('setUrl', `/bookstore/detail/${this.bookDetail.id}`)
            this.$router.push('/login')
          }
        })
    },
    handleSubmitComment () {
      this.$axios({
        method: 'POST',
        url: `/comment/show/${this.bookDetail.id}`,
        data: {
          content: this.comment
        }
      })
        .then(res => {
          let date = (new Date()).toISOString()
          this.comments.push({
            content: this.comment,
            user_name: this.$store.state.username,
            create_time: date.substring(0, 10) + ' ' + date.substring(11, 19)
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    getData () {
      this.suppleTime = new Date()
      this.suppleTime = this.suppleTime.toLocaleDateString()
      this.$axios.get(`/books/detail/${this.$route.params.id}`)
        .then(res => {
          if (res.status === 200) {
            this.bookDetail = res.data.book
            this.bookDetail.image = this.handleImage(this.bookDetail.image)
            let price = this.bookDetail.price * this.bookDetail.discount
            this.bookDetail.currentPrice = price.toFixed(2)
            this.bookDetail.discount = parseFloat(this.bookDetail.discount)
            switch (this.bookDetail.type_id) {
              case 0:
                this.bookDetail.type = '编程'
                break
              case 1:
                this.bookDetail.type = '互联网'
                break
              case 2:
                this.bookDetail.type = 'Web'
                break
              case 3:
                this.bookDetail.type = '交互设计'
                break
              case 4:
                this.bookDetail.type = '经济'
                break
              case 5:
                this.bookDetail.type = '算法'
                break
            }
            this.recommandation = res.data.new_books
            this.recommandation.forEach(ele => {
              ele.image = this.handleImage(ele.image)
            })
            this.$axios.get(`/comment/show/${this.bookDetail.id}`)
              .then(res => {
                this.comments = res.data.comments
                this.comments.forEach(ele => {
                  ele.create_time = ele.create_time.substring(0, 10) + ' ' + ele.create_time.substring(11, 19)
                })
              })
              .catch(err => {
                console.log(err)
              })
            this.dataLoaded = true
          }
        })
    },
    handleImage (val) {
      let url = val.substring(8)
      return 'https://images.weserv.nl/?url=' + url
    }
  },
  created () {
    this.bookDetail = {}
    this.recommandation = []
    this.getData()
  }
}
</script>

<style scoped>
.book_detail_con{width:1198px;height:398px;border:1px solid #ededed;margin:0 auto 20px;}

.book_detail_pic{width:350px;height:350px;margin:24px 0 0 24px;}
.book_detail_pic img{height: 100%;}
.book_detail_list{width:730px;height:350px;margin:24px 24px 0 0;}

.book_detail_list h3{font-size:24px;line-height:24px;color:#666;font-weight:normal;}
.book_detail_list p{color:#666;line-height:40px;}
.price_bar{height:72px;background-color:#f2f2f2;line-height:72px;width:370px;}
.price_bar .show-price{font-size:20px;color:#635a5a;padding-left:20px;display:inline-block}
.price_bar .show-price em{font-style:normal;font-size:36px;padding-left:10px}
.price_bar span{margin-left:5px;color:#777}
.original-price{height:40px;line-height: 80px;}
.delete{text-decoration:line-through;color:#777;font-size: 16px;}
.discount-price{display:inline-block;color:#409EFF;font-weight: bold;height:40px;line-height: 30px;font-size: 20px;margin-left:30px; }
.price_bar .show_unit{padding-left:150px}

.book_num{height:52px;margin-top:19px;}
.book_num .num_name{width:70px;height:52px;line-height:52px;}
.book_num .num_add{width:75px;height:50px;border:1px solid #dddddd}
.book_num .num_add input{width:49px;height:50px;text-align:center;line-height:50px;border:0px;outline:none;font-size:14px;color:#666}
.book_num .num_add .add,.book_num .num_add .minus{width:25px;line-height:25px;text-align:center;border-left:1px solid #ddd;border-bottom:1px solid #ddd;color:#666;font-size:14px}
.book_num .num_add .minus{border-bottom:0px}

.total{height:35px;line-height:35px;margin-top:25px;}
.total em{font-style:normal;color:#409EFF;font-size:18px}

.operate_btn{height:40px;margin-top:35px;font-size:0;position:relative;}
.operate_btn .buy_btn,.operate_btn .add_cart{display:inline-block;width:178px;height:38px;border:1px solid #635a5a;font-size:14px;color:#635a5a;line-height:38px;text-align:center;background-color:#f2f2f2;}
.operate_btn .add_cart{background-color:#635a5a;color:#fff;margin-left:10px;position:relative;}

.add_jump{width:20px;height:20px;background-color:#c40000;position:absolute;left:268px;top:10px;border-radius:50%;z-index:9;display:none;}

.detail_tab{height:35px;border-bottom:1px solid #4277ad}

.detail_tab li{height:34px;line-height:34px;padding:0 30px;font-size:14px;color:#333333;float:left;border:1px solid #e8e8e8;border-bottom:0px;cursor:pointer;background-color:#faf8f8}

.detail_tab li.active{border-top:2px solid #4277ad;position:relative;background-color:#fff;border-left:1px solid #4277ad;border-right:1px solid #4277ad;top:-1px;height:35px;}

.r_wrap span{margin-top:10px;font-size:16px;color:#000;}
.r_wrap p{line-height:24px;margin-top:5px;}

.new_book{border:1px solid #ededed;border-top:2px solid #635a5a;padding-bottom:10px;}

.new_book h3{height:33px;line-height:33px;background-color:#fcfcfc;border-bottom:1px solid #ededed;font-size:14px;font-weight:normal;text-indent:10px;}

.new_book ul{width:160px;margin:0 auto;overflow:hidden;}
.new_book li{border-bottom:1px solid #ededed;margin-bottom:-1px;}
.new_book li img{display:block;height:150px;margin:10px auto;}
.new_book li h4{width:160px;margin:0 auto;}
.new_book li h4 a{font-weight:normal;color:#666;display:block;width:160px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}
.new_book li .price{font-size:14px;color:#da260e;margin:10px auto;}

.main_wrap{width:1200px;margin:0 auto;}
.l_wrap{width:200px;}
.r_wrap{width:980px;}

.comment-input{margin:20px 0;height: 100px;}
.comment-display{margin-top:20px;padding:10px 20px;border-bottom: 1px #e8e8e8 solid;}
.submit-comment-btn{margin-top:10px;background-color:#635a5a;height:40px;width:70px;color:#fff;font-size:14px;}
</style>
