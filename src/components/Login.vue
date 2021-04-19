<template>
  <div class="login-page">
    <div class="long_box">
      <!-- 登录头像 -->
      <div class="avatar_box">
        <img src="../assets/avatar.jpg">
      </div>
      <!-- 登录头像 -->
      <!-- 登录表单 -->
      <el-form
        class="Long_form"
        :model="loginForm"
        :rules="logFormRules"
        ref="resetLoginForm"
      >
        <!-- 账号 -->
        <el-form-item prop="username">
          <el-input
            placeholder="请输入账号"
            prefix-icon="iconfont icon-user"
            v-model="loginForm.username"
          />
        </el-form-item>
        <!-- 账号 -->
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            placeholder="请输入账号"
            prefix-icon="iconfont icon-3702mima"
            v-model="loginForm.password"
            show-password
          />
        </el-form-item>
        <!-- 密码 -->
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button
            type="info"
            @click="resetLoginForm"
          >
            重设
          </el-button>
          <el-button
            type="primary"
            @click="login"
          >
            登录
          </el-button>
        </el-form-item>
        <!-- 按钮 -->
      </el-form>
      <!-- 登录表单 -->
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 表单内容
      loginForm: {
        username: '',
        password: ''
      },
      // 表单本地验证
      logFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 5,
            max: 15,
            message: '长度在 5 到 15 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 清空表单
    resetLoginForm () {
      this.$refs.resetLoginForm.resetFields()
      this.$message(' 清空表单成功')
    },
    // 登录验证
    login () {
      this.$refs.resetLoginForm.validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.post('login', this.loginForm)
          if (res.meta.status !== 200) return this.$message.error('登录失败')
          this.$message({
            message: '登录成功',
            type: 'success'
          })
          // 将服务器下发的token储存到sessionStorage
          window.sessionStorage.setItem('token', res.data.token)
          // 跳转到路由到home
          this.$router.push('/home')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-page {
  background-color: #2b4b6b;
  height: 100%;
}
.long_box {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 450px;
  height: 300px;
  background-color: #ffffff;
  border-radius: 10px;
  transform: translate(-50%, -50%);
}
.avatar_box {
  box-sizing: border-box;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  border: 4px solid #ffffff;
  border-radius: 100%;
  background-color: #ffffff;
  box-shadow: 0 0 6px #6e6e6e;
}
.avatar_box img {
  width: 100%;
  height: 100%;
  border-radius: 100%;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.Long_form {
  padding: 100px 25px 0px;
  padding-top: 100px;
  padding-right: 25px;
}
</style>
