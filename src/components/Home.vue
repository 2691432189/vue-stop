<template>
  <el-container class="home_container">
    <!-- 头部 -->
    <el-header>
      <span>
        <img src="../assets/heima.png">
        后台管理
      </span>
      <el-button
        type="info"
        @click="signOut"
        class="sign_out"
      >
        登出
      </el-button>
    </el-header>
    <!-- 头部 -->
    <!-- 主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse?'55px':'200px'">
        <div
          class="collapse"
          @click="collapse"
        >
          |||
        </div>
        <el-menu
          background-color="#313743"
          text-color="#fff"
          active-text-color="#4182d1"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="navState"
        >
          <!-- 一级选项 -->
          <el-submenu
            :index="item.id+''"
            v-for="item in boardList"
            :key="item.id"
          >
            <template slot="title">
              <!-- 图标 -->
              <i :class="boardIcon[item.id]" />
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级选项 -->
            <el-menu-item
              :index="'/'+childItems.path"
              v-for="childItems in item.children"
              :key="childItems.id"
              @click="saveNavState('/'+childItems.path)"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-location" />
                <!-- 文本 -->
                <span>{{ childItems.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <!-- 一级菜单 -->
        </el-menu>
      </el-aside>
      <!-- 侧边栏 -->
      <!-- 内容 -->
      <el-main>
        <router-view />
      </el-main>
      <!-- 内容 -->
    </el-container>
  </el-container>
  <!-- 主体 -->
</template>

<script>
export default {
  data () {
    return {
      boardList: [],
      boardIcon: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false,
      navState: ''
    }
  },
  // 生命钩子函数
  created () {
    // 调用获取权限列表方法
    this.getBoardList()
    this.navState = window.sessionStorage.getItem('navState')
  },
  methods: {
    // 退出登录方法
    signOut () {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    // 定义获取权限列表方法
    async getBoardList () {
      const { data: res } = await this.$http.get('menus')
      // 判断状态码是否正常
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.boardList = res.data
    },
    // 控制权限列表折叠
    collapse () {
      this.isCollapse = !this.isCollapse
    },
    // 保存路由状态
    saveNavState (index) {
      window.sessionStorage.setItem('navState', index)
    }
  }
}
</script>

<style lang="less" scoped>
// 主体
.home_container{
  height:100% ;
}
// 头部
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color:#363d40 ;
  span{
    display: flex;
    align-items: center;
    color: #ddd;
    font-size: 18px;
    img{
      margin-right: 10px;
    }
  }
}

.collapse{
  color: #fff;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  background-color: #475164;
  letter-spacing: 0.2em;
  cursor: pointer;
}

.el-menu{
  border-right: 0px;
}

.el-aside{
  background-color:#313743 ;
}

.iconfont {
  margin-right: 10px;
}
</style>
