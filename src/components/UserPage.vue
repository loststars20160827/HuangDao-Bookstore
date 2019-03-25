<template>
  <div class="user-page">
    <FirstHeader :isCart="false" />
    <el-breadcrumb separator-class="el-icon-arrow-right" style="width:1200px;margin:10px auto;">
      <el-breadcrumb-item :to="{ path: '/bookstore/homepage' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户中心</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="fl menu-wrap">
        <el-menu
          class="menu fl"
          :default-active="$route.path"
          router>
          <el-menu-item index="/bookstore/userpage/information">
            <i class="el-icon-menu"></i>
            <span slot="title">个人信息</span>
          </el-menu-item>
          <el-menu-item index="/bookstore/userpage/orders">
            <i class="el-icon-document"></i>
            <span slot="title">全部订单</span>
          </el-menu-item>
          <el-menu-item index="/bookstore/userpage/address">
            <i class="el-icon-setting"></i>
            <span slot="title">收货地址</span>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="fl view">
        <router-view/>
      </div>
    </div>
  </div>
</template>

<script>
import FirstHeader from '../components/FirstHeader'
import Information from '../components/Information'
import Address from '../components/Address'
import Orders from '../components/Orders'

export default {
  name: 'UserPage',
  components: {
    FirstHeader,
    Information,
    Address,
    Orders
  },
  data () {
    return {

    }
  }
}
</script>

<style scoped>
.user-page{min-height:680px;width: 1200px;margin: 0 auto;}
.menu-wrap{height:400px;width:200px;}
.menu{width: 200px;}
.view{width:980px;height: 500px;margin-left: 20px;}
</style>
