<template>
  <div class="top-bar">
    <div class="wrap">
      <div class="slogan fl">
        欢迎来到荒岛书店
      </div>
      <div class="fr operation">
        <div class="topBar-info fl" v-if="isLogin">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              欢迎您：<span class="username">{{username}}</span><i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="userpage">个人中心</el-dropdown-item>
              <el-dropdown-item command="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="topBar-btn fl" v-else>
          <span class="cursor" @click="toLogin">登录</span>
          <span class="item">|</span>
          <span class="cursor" @click="toRegister">注册</span>
        </div>
        <div class="topBar-link fl">
          <span class="item">|</span>
          <span class="cursor" @click="toCart">购物车</span>
          <span class="item">|</span>
          <span class="cursor" @click="toOrder">我的订单</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TopBar',
  data () {
    return {
      isLogin: false,
      username: ''
    }
  },
  watch: {
    loginState () {
      return this.isLogin
    }
  },
  methods: {
    toLogin () {
      this.$router.push('/login')
    },
    toRegister () {
      this.$router.push('/register')
    },
    toUserpage () {
      this.$router.push('/bookstore/userpage/information')
    },
    toCart () {
      this.$router.push('/bookstore/cart')
    },
    toOrder () {
      this.$router.push('/bookstore/userpage/orders')
    },
    handleCommand (command) {
      if (command === 'userpage') {
        this.toUserpage()
      } else {
        this.handleLogout()
      }
    },
    handleLogout () {
      this.$axios.post('/users/logout/')
        .then(res => {
          if (!this.$store.state.remember) {
            this.$store.commit('setUsername', '')
            this.$store.commit('setPassword', '')
          }
          this.isLogin = false
          window.location.reload()
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created () {
    if (this.$store.state.username !== '') {
      this.isLogin = true
      this.username = this.$store.state.username
    } else {
      this.isLogin = false
    }
  }
}
</script>

<style scoped>
.top-bar{
  height: 30px;
  background-color: #f7f7f7;
  line-height: 30px;
  font-size: 12px;
}
.wrap{
  width: 1200px;
  margin: 0 auto;
}
.slogan{
  width: 100px;
}
.fl{
  float: left;
}
.fr{
  float: right;
}
.cursor{
  cursor: pointer;
}
.item{
  margin:0 10px;
}
.cursor:hover{
  color: #409EFF;
}
.username{
  color: #409EFF;
}
</style>
