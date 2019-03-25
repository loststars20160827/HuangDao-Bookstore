<template>
  <div class="address">
    <div v-if="dataLoaded">
      <div class="" style="height:40px;">
        <div class="common_title2 fl">收货地址</div>
        <div class="more fr pointer" @click="manageAddress">管理地址 ></div>
        <el-dialog title="收货地址" :visible.sync="showAllAddress" width="800px">
          <el-table :data="allAddress">
            <el-table-column property="recipient_name" label="收件人" width="100"></el-table-column>
            <el-table-column property="recipient_phone" label="联系电话" width="150"></el-table-column>
            <el-table-column property="recipient_addr" label="地址" width="350"></el-table-column>
            <el-table-column property="recipient_default" label="操作" width="60">
              <template slot-scope="scope">
                <el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
            <el-table-column property="recipient_default" label="  " width="140">
              <template slot-scope="scope">
                <el-button @click="handleDefault(scope.row)" type="text" size="small" v-if="!scope.row.is_default">设为默认</el-button>
                <el-button type="primary" size="small" v-else>默认地址</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- <div v-else style="height:100px;line-height:100px;text-align:center">暂无收货地址</div> -->
        </el-dialog>
      </div>
      <div class="site_con">
        <dl>
          <dt>默认地址：</dt>
          <dd>{{defaultAddress}}</dd>
        </dl>
      </div>

      <h3 class="common_title2">编辑地址</h3>
      <div class="site_con">
        <form>
          <div class="form_group">
            <label>收件人：</label>
            <input type="text" name="" v-model="name">
          </div>
          <div class="form_group form_group2">
            <label>详细地址：</label>
            <textarea class="site_area" v-model="address"></textarea>
          </div>
          <div class="form_group">
            <label>邮编：</label>
            <input type="text" name="" v-model="zipCode">
          </div>
          <div class="form_group">
            <label>手机：</label>
            <input type="text" name="" v-model="phone">
          </div>
          <button class="info_submit" @click="submitAddressHandler">添加</button>
        </form>
      </div>
    </div>
    <div v-else class="loading-data">
      数据加载中...
    </div>
  </div>
</template>

<script>
export default {
  name: 'Address',
  data () {
    return {
      dataLoaded: false,
      name: '',
      address: '',
      zipCode: '',
      phone: '',
      defaultAddress: '',
      showAllAddress: false,
      allAddress: []
    }
  },
  methods: {
    submitAddressHandler () {
      this.$confirm('确认提交地址吗', '提交地址', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$axios({
            method: 'POST',
            url: '/users/address/',
            data: {
              username: this.name,
              addr: this.address,
              zip_code: this.zipCode,
              phone: this.phone
            }
          })
            .then(res => {
              if (res.status === 201) {
                if (this.defaultAddress === '') {
                  this.defaultAddress = `${this.address} （${this.name} 收） ${this.phone}`
                }
                this.name = ''
                this.address = ''
                this.zipCode = ''
                this.phone = ''
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
              }
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch()
    },
    getData () {
      this.$axios.get('/users/address')
        .then(res => {
          this.allAddress = res.data.addrs
          this.allAddress.forEach(ele => {
            if (ele.is_default) {
              this.defaultAddress = `${ele.recipient_addr} （${ele.recipient_name} 收） ${ele.recipient_phone}`
            }
          })
          this.dataLoaded = true
        })
        .catch(err => {
          if (err.response.status === 400) {
            this.$store.commit('setUrl', '/bookstore/userpage/address')
            this.$router.push('/login')
          }
        })
    },
    manageAddress () {
      this.$axios.get('/users/address')
        .then(res => {
          this.allAddress = res.data.addrs
        })
        .catch(err => {
          console.log(err)
        })
      this.showAllAddress = true
    }
  },
  created () {
    this.getData()
  }
}
</script>

<style scoped>
.more{height:16px;line-height:16px;font-size:14px;margin:12px 10px;color: #555;}
.more:hover{color:#409EFF}
.common_title2{height:20px;line-height:20px;font-size:16px;margin:10px 0;width:270px;font-weight: 500;}
.site_con{
background-color:#f9f9f9;
padding:10px 0;
margin-bottom:20px;
}

.site_con dt{
font-size:14px;
line-height:30px;
text-indent:30px;
font-weight:bold;
}

.site_con dd{
font-size:14px;
line-height:30px;
text-indent:30px;
}

.site_con .form_group{
height:40px;
line-height:40px;
margin-top:10px;
}

.site_con .form_group label{
width:100px;
float:left;
text-align:right;
font-size:14px;
height:40px;
line-height:40px;
}

.site_con .form_group input{
width:300px;
height:25px;
border:1px solid #ddd;
float:left;
outline:none;
margin-top:7px;
text-indent:10px;
}

.site_con .form_group2{
height:90px;
}

.site_area{
width:280px;
height:60px;
border:1px solid #ddd;
outline:none;
padding:10px;
}
.info_submit{
width:80px;
height:30px;
background-color:#635a5a;
border:0px;
color:#fff;
margin:10px 0 10px 100px;
cursor:pointer;
font-family:'Microsoft Yahei'
}
</style>
