<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑导航 -->
    <!-- 卡片盒子 -->
    <el-card class="box-card">
      <!-- 表格 -->
      <el-table
        :data="rightsList"
        stripe
        style="width: 100%"
      >
        <el-table-column
          width="50px"
          label="#"
          type="index"
        />
        <el-table-column
          prop="authName"
          label="权限名称"
        />
        <el-table-column
          prop="path"
          label="路径"
        />
        <el-table-column
          label="权限等级"
        >
          <template slot-scope="scope">
            <el-tag
              type="success"
              v-if="scope.row.level==='0'"
            >
              一级
            </el-tag>
            <el-tag
              type="warning"
              v-else-if="scope.row.level==='1'"
            >
              二级
            </el-tag>
            <el-tag
              type="danger"
              v-else
            >
              三级
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <!-- 表格 -->
    </el-card>
    <!-- 卡片盒子 -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      rightsList: []
    }
  },
  methods: {
    // 请求权限列表方法
    async getRightsList () {
      const { data: res } = await this.$http.get('rights/list')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取权限列表失败')
      this.rightsList = res.data
    }
  },
  // 生命钩子函数
  created () {
    // 调用请求权限列表方法
    this.getRightsList()
  }
}
</script>

<style lang="less" scoped>

</style>
