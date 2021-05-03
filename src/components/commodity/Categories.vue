<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item> 商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑导航 -->
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 栅格 -->
      <el-row :gutter="20">
        <!-- 搜索框 -->
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            clearable
            v-model="getGoodsListObj.query"
            @change="searchGoods()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchGoods()"
            />
          </el-input>
        </el-col>
        <!-- 搜索框 -->
        <!-- 添加商品按钮 -->
        <el-col :span="14">
          <el-button
            type="primary"
            @click="goAdd"
          >
            添加商品
          </el-button>
        </el-col>
        <!-- 添加商品按钮 -->
      </el-row>
      <!-- 栅格 -->
      <!-- 商品表格 -->
      <el-table
        :data="goodsList"
        stripe
        style="width: 100%"
        :border="true"
      >
        <el-table-column
          type="index"
          width="60"
          label="#"
        />
        <el-table-column
          prop="goods_name"
          label="商品名称"
        />
        <el-table-column
          prop="goods_price"
          label="商品价格"
          width="100"
        />
        <el-table-column
          prop="goods_weight"
          label="商品重量"
          width="100"
        />
        <el-table-column
          prop="add_time"
          label="创建时间"
          width="130"
        />
        <el-table-column
          label="操作"
          width="150"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="goModify(scope.row)"
            >
              修改
            </el-button>
            <el-button
              type="danger"
              size="mini"
              @click="removeGoods(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 商品表格 -->
      <!-- 分页功能 -->
      <el-pagination
        layout="prev, pager, next"
        :total="getGoodsListObj.total"
        :page-size="getGoodsListObj.pagesize"
        :pager-count="7"
        @current-change="turnPage"
      />
      <!-- 分页功能 -->
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 商品列表
      goodsList: [],
      // 获取商品列表请求参数对象
      getGoodsListObj: {
        query: '', // 查询参数
        pagenum: 1, // 当前页码
        pagesize: 8, // 每页显示条数
        total: 0// 总共商品条数
      }
    }
  },
  methods: {
    // 获取商品列表方法
    async  getGoodsList () {
      const { data: res } = await this.$http.get('goods', {
        params: this.getGoodsListObj
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      res.data.goods.forEach(element => {
        element.add_time = this.$filter(element.add_time)
      })
      this.goodsList = res.data.goods
      this.getGoodsListObj.pagenum = res.data.pagenum
      this.getGoodsListObj.total = res.data.total
    },
    // 翻页方法
    turnPage (page) {
      this.getGoodsListObj.pagenum = page
      // 调用获取商品列表方法
      this.getGoodsList()
    },
    // 搜索商品方法
    searchGoods () {
      // 调用获取商品列表方法
      this.getGoodsList()
    },
    // 删除商品方法
    removeGoods (row) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`goods/${row.goods_id}`)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        // 调用获取商品列表方法
        this.getGoodsList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 跳转至添加页
    goAdd () {
      this.$router.push('/add')
    },
    goModify (row) {
      this.$router.push(`/modify/${row.goods_id}`)
    }
  },
  created () {
    // 调用获取商品列表方法
    this.getGoodsList()
  }
}
</script>

<style lang="less" scoped>
.el-pagination{
  margin-top: 20px;
}
.el-table{
  margin-top: 20px;
}
</style>
