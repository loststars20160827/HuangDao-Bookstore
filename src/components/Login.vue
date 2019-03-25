<template>
  <div class="wrap">
    <div class="login_top clearfix">
      <a href="" class="login_logo"><img src="../images/logo.png" style="height: 60px;"></a>
    </div>

    <div class="login_form_bg">
      <div class="login_form_wrap clearfix">
        <div class="login_banner fl">
          <img src="../images/banner.jpeg" alt="">
        </div>
        <div class="login_form">
          <div class="login_title clearfix">
            <h1>用户登录</h1>
            <div @click="toRegister">立即注册</div>
          </div>
          <div class="form_input">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="form">
              <el-form-item prop="username">
                <el-input v-model="ruleForm.username" placeholder="用户名" class="login-input"></el-input>
              </el-form-item>
              <el-form-item label="" prop="password" class="password">
                <el-input type="password" v-model="ruleForm.password" placeholder="密码"  class="login-input"></el-input>
              </el-form-item>
              <el-form-item label="" prop="verifyCode" class="verifyCode">
                <el-input v-model="ruleForm.verifyCode" placeholder="验证码"  class="login-input" style="width:60%;"></el-input>
                <img style="width:30%;;height:40px;" class="fr" :src="verifyCodeImg" alt="验证码" @click="refreshVerifyCode">
              </el-form-item>
              <el-checkbox v-model="checked">记住用户名</el-checkbox>
              <span @click="toResetPassword" class="fr" style="cursor:pointer;color:#555;font-size:14px;">忘记密码 ？</span>
              <el-form-item>
                <button  @click="handleLogin('ruleForm')" class="login-button">登录</button>
              </el-form-item>
            </el-form>
            <div style="text-align:right;color:#555;" @click="toHomepage">随便看看 ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      checked: false,
      ruleForm: {
        username: '',
        password: '',
        verifyCode: ''
      },
      rules: {
        username: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }, {
          min: 1,
          max: 15,
          message: '密码长度为1~15',
          trigger: 'blur'
        }],
        verifyCode: [{
          required: true,
          message: '请输入验证码',
          trigger: 'blur'
        }]
      },
      verifyCodeImg: '/users/verifycode/'
    }
  },
  methods: {
    toRegister () {
      this.$router.push('/register')
    },
    toResetPassword () {
      this.$router.push('/resetpassword')
    },
    toHomepage () {
      this.$router.push('/bookstore/homepage')
    },
    handleLogin (formName) {
      let form = this.ruleForm
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios({
            method: 'POST',
            url: '/users/login/',
            data: {
              username: form.username,
              password: form.password,
              verifycode: form.verifyCode,
              remember: this.checked
            }
          })
            .then(res => {
              let status = res.data.res
              if (status === 0) {
                this.$message({
                  message: '用户名或密码错误，请重试',
                  type: 'error'
                })
                this.resetInput('username')
                this.resetInput('password')
              } else if (status === 1) {
                this.$message({
                  message: '登录成功！',
                  type: 'success'
                })
                this.$store.commit('setUsername', form.username)
                this.$store.commit('setPassword', form.password)
                this.$store.commit('setUserId', res.data.id)
                this.$store.commit('setRemember', this.checked)

                let goTo = this.$store.state.url
                if (goTo !== '') {
                  this.$store.commit('setUrl', '')
                  this.$router.push(goTo)
                } else {
                  this.toHomepage()
                }
              } else {
                this.$message({
                  message: '验证码错误，请重试',
                  type: 'error'
                })
              }
              this.resetInput('verifyCode')
              this.refreshVerifyCode()
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          return false
        }
      })
    },
    resetInput (prop) {
      let fields = this.$refs['ruleForm'].fields
      for (let i = 0; i < fields.length; i++) {
        if (fields[i].prop === prop) {
          fields[i].resetField()
          break
        }
      }
    },
    refreshVerifyCode () {
      this.verifyCodeImg = '/users/verifycode/?' + Math.random()
    }
  },
  created () {
    if (this.$store.state.remember === true) {
      this.ruleForm.username = this.$store.state.username
      this.checked = this.$store.state.remember
    }
  }
}
</script>

<style scoped>
.login_top{width:960px;height:130px;margin:0 auto;}
.login_logo{display:block;width:193px;height:76px;margin-top:30px;}
.login_form_bg{height:480px;}
.no-mp{margin-top:0px;}
.login_form_wrap{width:100%;height:480px;margin:0 auto;position: relative;}
.login_banner{width:400px;height:400px;position: absolute;top: 0;left:25%;}
.login_banner img{width:400px;}
.login_form{width:368px;height:418px;border:1px solid #c6c6c5;background-color:#fff;position: absolute;top: 60px;left:48%;}

.login_title{height:60px;width:308px;margin:10px auto;border-bottom:1px solid #e0e0e0;}

.login_title h1{font-size:24px;height:60px;line-height:60px;color:#797878;float:left;font-weight:bold;margin-left:44px;}
.login_title div{width:100px;height:20px;background:url(../images/arrow.png) left 3px no-repeat;font-size:16px;color:#635a5a;text-indent:26px;float:left;margin:20px 0 0 60px;cursor: pointer;}

.form_input{width:308px;height:250px;margin:20px auto;position:relative;}

.input_submit{width:100%;height:40px;position:absolute;left:0;top:180px;background-color:#4277ad;color:#fff;font-size:22px;border:0px;font-family:'Microsoft Yahei';cursor:pointer;}
.login-button{margin:20px 0 0 0;width:100%;background:#635a5a;color:#fff;height:40px;font-size:14px;}
</style>
