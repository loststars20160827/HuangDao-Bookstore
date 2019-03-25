<template>
  <div class="reset-password">
    <div class="reset-top clearfix">
      <a href="" class="reset-logo"><img src="../images/logo.png" style="height: 60px;"></a>
    </div>
    <div class="reset-form_bg">
      <div class="reset-form_wrap clearfix">
        <div class="reset-banner fl">
          <img src="../images/banner.jpeg" alt="">
        </div>
        <div class="reset-form">
          <div class="reset-title clearfix">
            <h1>重置密码</h1>
          </div>
          <div class="form_input">
            <el-form ref="emailForm" :rules="emailRules" :model="emailForm" status-icon class="form" v-show="isValidEmail">
              <el-form-item prop="email">
                <el-input v-model="emailForm.email" placeholder="邮箱" clearable>
                   <el-button slot="append" @click="validateEmailHandler">验证</el-button>
                </el-input>
              </el-form-item>
              <el-form-item prop="code">
                <el-input v-model="emailForm.code" placeholder="验证码" clearable>
                </el-input>
              </el-form-item>
              <el-form-item>
                <button @click="validateCodeHandler" style="width:100%;background:#635a5a;color:#fff;height:40px;font-size:14px;">确认</button>
              </el-form-item>
            </el-form>
            <el-form ref="passwordForm" :rules="passwordRules" :model="passwordForm" status-icon class="form" v-show="!isValidEmail">
                <el-form-item prop="newPassword" >
                <el-input type="password" v-model="passwordForm.newPassword" placeholder="新密码" maxlength="18" clearable></el-input>
              </el-form-item>
              <el-form-item prop="checkPassword">
                <el-input type="password" v-model="passwordForm.checkPassword" placeholder="确认密码" maxlength="18" clearable></el-input>
              </el-form-item>
              <el-form-item>
                <el-row type="flex" justify="space-between">
                  <el-col :span="8">
                    <el-button @click="cancelHandler" plain style="width:100%">取消</el-button>
                  </el-col>
                  <el-col :span="8">
                    <el-button type="primary" plain style="width:100%" @click="finishHandler('passwordForm')">完成</el-button>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-form>
            <div @click="giveUpReset" style="color:#999;font-size:14px">放弃重置</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ResetPassword',
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.passwordForm.checkPassword !== '') {
          this.$refs.passwordForm.validateField('checkPassword')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.passwordForm.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    var validateEmail = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入邮箱'))
      } else {
        callback()
      }
    }
    var validateCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'))
      } else {
        callback()
      }
    }
    return {
      email: '',
      emailForm: {
        email: '',
        code: ''
      },
      emailRules: {
        email: [{
          validator: validateEmail,
          trigger: 'blur'
        }],
        code: [{
          validator: validateCode,
          trigger: 'blur'
        }]
      },
      passwordForm: {
        newPassword: '',
        checkPassword: ''
      },
      passwordRules: {
        newPassword: [{
          validator: validatePass,
          trigger: 'blur'
        },
        {
          min: 6,
          max: 12,
          message: '密码长度为6~12',
          trigger: 'blur'
        }],
        checkPassword: [{
          validator: validatePass2,
          trigger: 'blur'
        },
        {
          min: 6,
          max: 12,
          message: '密码长度为6~12',
          trigger: 'blur'
        }]
      },
      isValidEmail: true,
      companyId: 0,
      user: {}
    }
  },
  methods: {
    validateEmailHandler: function () {
      this.$axios({
        method: 'POST',
        url: '/users/change/',
        data: {
          email: this.emailForm.email
        }
      })
        .then(res => {
          if (res.status === 200) {
            this.user = res.data
            this.$message({
              message: '验证码已发送，请登录邮箱查看验证码',
              type: 'success'
            })
          }
        })
        .catch(err => {
          if (err.response.status === 404) {
            this.$message({
              message: '邮箱不存在，请重新输入',
              type: 'error'
            })
          }
        })
      return true
    },
    validateCodeHandler: function () {
      this.$axios({
        method: 'POST',
        url: '/users/verify/',
        data: {
          code: this.emailForm.code,
          email: this.emailForm.email
        }
      })
        .then(res => {
          if (res.status === 200) {
            this.isValidEmail = false
            this.$message({
              message: '验证成功',
              type: 'success'
            })
          }
        })
        .catch(err => {
          if (err.response.status === 400) {
            this.$message({
              message: '验证码错误，请重新输入',
              type: 'error'
            })
          }
        })
      return true
    },
    finishHandler: function (formName) {
      let form = this.passwordForm
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios({
            method: 'POST',
            url: '/users/setP/',
            data: {
              email: this.emailForm.email,
              password: form.newPassword
            }
          })
            .then(res => {
              if (res.status === 200) {
                this.$store.commit('setPassword', form.newPassword)
                this.$refs['passwordForm'].resetFields()
                this.resetHandler(true)
              }
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    },
    toLogin: function () {
      this.$router.push('/login')
    },
    giveUpReset: function () {
      this.toLogin()
    },
    resetHandler: function (result) {
      if (result) {
        this.$message({
          message: '密码重置成功，将在三秒后跳转至登录界面',
          type: 'success'
        })
        setTimeout(this.toLogin, 3000)
      } else {
        this.$message.error('密码重置失败，请重试！')
      }
    },
    cancelHandler: function () {
      this.$confirm('放弃重置密码?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.toLogin()
        })
        .catch()
    },
    beforeRouteLeave (to, from, next) {
      this.email = ''
      next()
    }
  }
}
</script>

<style scoped>
.reset-top{width:960px;height:130px;margin:0 auto;}
.reset-logo{display:block;width:193px;height:76px;margin-top:30px;}
.reset-form_bg{height:480px;}
.no-mp{margin-top:0px;}
.reset-form_wrap{width:100%;height:480px;margin:0 auto;position: relative;}
.reset-banner{width:400px;height:400px;position: absolute;top: 0;left:25%;}
.reset-banner img{width:400px;}
.slogan{width:40px;height:300px;font-size:30px;color:#f0f9e8;text-align:center;line-height:36px;margin:80px 0 0 120px}
.reset-form{width:368px;height:368px;border:1px solid #c6c6c5;background-color:#fff;position: absolute;top: 60px;left:48%;text-align: center;}

.reset-title{height:60px;width:308px;margin:10px auto;border-bottom:1px solid #e0e0e0;}

.reset-title h1{font-size:24px;height:60px;line-height:60px;color:#797878;font-weight:bold;}

.form_input{width:308px;height:250px;margin:20px auto;position:relative;}

.input_submit{width:100%;height:40px;position:absolute;left:0;top:180px;background-color:#4277ad;color:#fff;font-size:22px;border:0px;font-family:'Microsoft Yahei';cursor:pointer;}
</style>
