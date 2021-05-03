<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item> 订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑导航 -->
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 订单搜索框 -->
      <el-row>
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="getOrdersListObj.query"
            class="input-with-select"
            @change="searchGoods()"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchGoods()"
            />
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单搜索框 -->
      <!-- 订单表格 -->
      <el-table
        :data="ordersList"
        stripe
        :border="true"
        style="width: 100%"
      >
        <el-table-column
          type="index"
          label="#"
          width="50"
        />
        <el-table-column
          prop="order_number"
          label="订单编号"
        />
        <el-table-column
          prop="order_price"
          label="订单价格"
          width="90"
        />
        <el-table-column
          prop="order_pay"
          label="是否付款"
          width="100"
        >
          <template slot-scope="scope">
            <el-tag
              type="success"
              v-if="scope.row.order_pay==='1'"
            >
              已付款
            </el-tag>
            <el-tag
              type="danger"
              v-else
            >
              未付款
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_send"
          label="是否发货"
          width="100"
        />
        <el-table-column
          prop="create_time"
          label="下单时间"
          width="170"
        />
        <el-table-column
          label="操作"
          width="130"
        >
          <template>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="changeAddress"
            />
            <el-button
              type="success"
              icon="el-icon-star-off"
              size="mini"
              @click="timeline"
            />
          </template>
        </el-table-column>
      </el-table>
      <!-- 订单表格 -->
      <!-- 分页功能 -->
      <el-pagination
        :page-size="getOrdersListObj.pagesize"
        :pager-count="7"
        layout="prev, pager, next"
        :total="getOrdersListObj.total"
        :current-page="getOrdersListObj.pagenum"
        @current-change="currentPage"
      />
      <!-- 分页功能 -->
    </el-card>
    <!-- 卡片 -->
    <!-- 修改地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="whetherShowChangeAddress"
      width="50%"
    >
      <el-form
        :model="changeAddressForm"
        :rules="changeAddressFormRules"
        ref="changeAddressFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="省市区/县"
          :hide-required-asterisk="true"
          prop="ProvinceCityDistrict"
        >
          <el-cascader
            v-model="changeAddressForm.ProvinceCityDistrict"
            :options="Cascader"
            :props="{ expandTrigger: 'hover' }"
          />
        </el-form-item>
        <el-form-item
          label="详细地址"
          prop="Address"
          :hide-required-asterisk="true"
        >
          <el-input v-model="changeAddressForm.Address" />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="whetherShowChangeAddress = false">取 消</el-button>
        <el-button
          type="primary"
          @click="submitChangeAddress"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改地址对话框 -->
    <!-- 时间线对话框 -->
    <el-dialog
      title="物流时间线"
      :visible.sync="whetherShowTimeline"
      width="50%"
    >
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :timestamp="activity.timestamp"
        >
          {{ activity.content }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
    <!-- 时间线对话框 -->
  </div>
</template>

<script>
import Cascader from './citydata'
export default {
  data () {
    return {
      Cascader,
      // 获取订单列表请求参数
      getOrdersListObj: {
        total: 0, // 当前一共多少条数据
        query: '', // 参数
        pagenum: 1, // 当前页码
        pagesize: 8 // 每页显示条数
      },
      // 订单清单
      ordersList: [],
      // 是否显示时间表
      whetherShowTimeline: false,
      // 是否显示更改地址
      whetherShowChangeAddress: false,
      // 更改地址表格规则
      changeAddressFormRules: {
        ProvinceCityDistrict: [{ required: true, message: '请选择', trigger: 'blur' }],
        Address: [{ required: true, message: '请填写详细地址', trigger: 'blur' }]
      },
      // 更改地址表格
      changeAddressForm: {
        ProvinceCityDistrict: [],
        Address: ''
      },
      activities: [{
        content: '已到达北安',
        timestamp: '2018-04-15'
      }, {
        content: '已到达兰溪',
        timestamp: '2018-04-13'
      }, {
        content: '已到达哈尔滨',
        timestamp: '2018-04-11'
      }]
    }
  },
  methods: {
    // 获取订单列表方法
    async  getOrdersList () {
      const { data: res } = await this.$http.get('orders', {
        params: this.getOrdersListObj
      })
      if (res.meta.status !== 200) return this.$message.error('获取订单列表失败')
      res.data.goods.forEach(element => {
        element.create_time = this.$filter(element.create_time)
      })
      this.getOrdersListObj.pagenum = res.data.pagenum * 1
      this.getOrdersListObj.total = res.data.total
      this.ordersList = res.data.goods
    },
    // 翻页功能
    currentPage (page) {
      this.getOrdersListObj.pagenum = page
      this.getOrdersList()
    },
    // 搜索商品方法
    searchGoods () {
      // 调用获取商品列表方法
      this.getOrdersList()
    },
    // 更换地址
    changeAddress () {
      this.whetherShowChangeAddress = true
    },
    // 提交变更地址
    submitChangeAddress () {
      this.$refs.changeAddressFormRef.validate(bl => {
        if (bl) {
          this.whetherShowChangeAddress = false
          this.$message({
            type: 'success',
            message: '变更地址成功!'
          })
          this.changeAddressForm.ProvinceCityDistrict = ''
          this.changeAddressForm.Address = ''
        }
      })
    },
    // 时间线
    async timeline () {
      this.whetherShowTimeline = true
      // const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      // if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // console.log(res)
    }
  },
  created () {
    this.getOrdersList()
  }
}
</script>

<style lang="less" scoped>
.el-table{
  margin-top: 20px;
}
</style>
