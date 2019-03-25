<template>
  <div class="register">
    <div class="reg-top clearfix">
      <a href="" class="reg-logo"><img src="../images/logo.png" style="height: 60px;"></a>
    </div>
    <div class="reg-form_bg">
      <div class="reg-form_wrap clearfix">
        <div class="reg-banner fl">
          <img src="../images/banner.jpeg" alt="">
        </div>
        <div class="reg-form">
          <div class="reg-title clearfix">
            <h1>用户注册</h1>
            <div @click="toLogin">登录</div>
          </div>
          <div class="form_input">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="form" label-position="left">
              <el-form-item prop="username">
                <el-input v-model="ruleForm.username" placeholder="用户名" class="login-input"></el-input>
              </el-form-item>
              <el-form-item prop="password" style="margin-top:20px;">
                <el-input type="password" v-model="ruleForm.password" placeholder="密码"  class="login-input"></el-input>
              </el-form-item>
              <el-form-item prop="checkPassword"  style="margin-top:20px;">
                <el-input type="password" v-model="ruleForm.checkPassword" placeholder="确认密码"  class="login-input"></el-input>
              </el-form-item>
              <el-form-item prop="email"  style="margin-top:20px;">
                <el-input v-model="ruleForm.email" placeholder="邮箱"></el-input>
              </el-form-item>
              <el-form-item>
                <button  @click="handleRegister('ruleForm')" class="reg-button">注册</button>
              </el-form-item>
            </el-form>
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
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPassword !== '') {
          this.$refs.ruleForm.validateField('checkPassword')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.checkPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    var validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'))
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
    return {
      ruleForm: {
        username: '',
        password: '',
        checkPassword: '',
        email: ''
      },
      rules: {
        username: [{
          validator: validateUsername,
          trigger: 'blur'
        }],
        password: [{
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
        }],
        email: [{
          validator: validateEmail,
          trigger: 'blur'
        },
        {
          pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
          message: '请输入合法邮箱'
        }]
      }
    }
  },
  methods: {
    handleRegister (formName) {
      let form = this.ruleForm
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios({
            method: 'POST',
            url: '/users/register/',
            data: {
              username: form.username,
              password: form.password,
              email: form.email
            }
          })
            .then(res => {
              if (res.status === 201) {
                this.$store.commit('setToken', res.data)
                this.$message({
                  message: '注册成功！',
                  type: 'success'
                })
                this.$router.push('/login')
              } else {
                this.$message({
                  message: '注册失败！',
                  type: 'error'
                })
              }
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          return false
        }
      })
    },
    toLogin () {
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.reg-top{width:960px;height:130px;margin:0 auto;}
.reg-logo{display:block;width:193px;height:76px;margin-top:30px;}
.reg-form_bg{height:480px;}
.no-mp{margin-top:0px;}
.reg-form_wrap{width:100%;height:480px;margin:0 auto;position: relative;}
.reg-banner{width:400px;height:400px;position: absolute;top: 0;left:25%;}
.reg-banner img{width:400px;}
.reg-form{width:368px;height:418px;border:1px solid #c6c6c5;background-color:#fff;position: absolute;top: 60px;left:48%;}

.reg-title{height:60px;width:308px;margin:10px auto;border-bottom:1px solid #e0e0e0;}

.reg-title h1{font-size:24px;height:60px;line-height:60px;color:#797878;float:left;font-weight:bold;margin-left:44px;}
.reg-title div{width:100px;height:20px;background:url(../images/arrow.png) left 3px no-repeat;font-size:16px;color:#635a5a;text-indent:26px;float:left;margin:20px 0 0 60px;cursor: pointer;}

.form_input{width:308px;height:250px;margin:20px auto;position:relative;}

.input_submit{width:100%;height:40px;position:absolute;left:0;top:180px;background-color:#4277ad;color:#fff;font-size:22px;border:0px;font-family:'Microsoft Yahei';cursor:pointer;}
.reg-button{width:100%;background:#635a5a;color:#fff;height:40px;font-size:14px;}
</style>
