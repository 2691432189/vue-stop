<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item> 商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑导航 -->
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 添加分类栅格 -->
      <el-row>
        <el-col>
          <!-- 添加分类按钮 -->
          <el-button
            type="primary"
            @click="showAddGoods"
          >
            添加分类
          </el-button>
          <!-- 添加分类按钮 -->
        </el-col>
      </el-row>
      <!-- 添加分类栅格 -->
      <!-- 商品分类列表 -->
      <el-row>
        <el-col>
          <table-tree
            :data="cateList"
            :columns="columns"
            :selection-type="false"
            :expand-type="false"
            :show-index="true"
            class="table-tree"
            index-text="#"
          >
            <template
              slot="isValid"
              slot-scope="scope"
            >
              <i
                class="el-icon-success"
                v-if="scope.row.cat_deleted===false"
              />
              <i
                class="el-icon-error"
                v-else
              />
            </template>
            <template
              slot="arrangement"
              slot-scope="scope"
            >
              <el-tag
                type="danger"
                v-if="scope.row.cat_level===0"
              >
                一级
              </el-tag>
              <el-tag v-else-if="scope.row.cat_level===1">
                二级
              </el-tag>
              <el-tag
                type="success"
                v-else
              >
                三级
              </el-tag>
            </template>
            <template
              slot="operating"
              slot-scope="scope"
            >
              <el-button
                type="primary"
                size="mini"
                @click="showModifyGoods(scope.row)"
              >
                编辑
              </el-button>
              <el-button
                type="danger"
                size="mini"
                @click="removeGoods(scope.row)"
              >
                删除
              </el-button>
            </template>
          </table-tree>
        </el-col>
      </el-row>
      <!-- 商品分类列表 -->
      <!-- 分页 -->
      <el-row>
        <el-col>
          <el-pagination
            :page-size="getCateListParameter.pagesize"
            :pager-count="7"
            :current-page="getCateListParameter.pagenum"
            layout="prev, pager, next"
            :total="getCateListParameter.total"
            @current-change="turnPage"
          />
        </el-col>
      </el-row>
      <!-- 分页 -->
    </el-card>
    <!-- 卡片 -->
    <!-- 添加分类弹出框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="isAddGoods"
      width="40%"
    >
      <span>
        <!-- 添加分类表单 -->
        <el-form
          :model="addGoodsFormObj"
          :rules="addGoodsFormRules"
          ref="addGoodsForm"
        >
          <el-form-item prop="cat_name">
            <el-input
              v-model="addGoodsFormObj.cat_name"
              placeholder="请输入分类名称"
            />
          </el-form-item>
          <el-form-item>
            <el-cascader
              :options="cateList_two"
              clearable
              v-model="addGoodsFormObj.cat_pid"
              :props="props"
              change-on-select
              placeholder="请选择分类级别"
            />
          </el-form-item>
        </el-form>
        <!-- 添加分类表单 -->
      </span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="isAddGoods = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addGoods"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加分类弹出框 -->
    <!-- 修改分类弹出框 -->
    <el-dialog
      title="修改分类"
      :visible.sync="ismodifyGoods"
      width="40%"
    >
      <!-- 添加分类表单 -->
      <el-form
        :model="addGoodsFormObj"
        :rules="addGoodsFormRules"
        ref="addGoodsForm"
      >
        <el-form-item prop="cat_name">
          <el-input
            v-model="modifyGoodsFormObj.cat_name"
            placeholder="请输入分类名称"
          />
        </el-form-item>
      </el-form>
      <!-- 添加分类表单 -->
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="ismodifyGoods = false">取 消</el-button>
        <el-button
          type="primary"
          @click="modifyGoods"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改分类弹出框 -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 分类列表(所有级数)
      cateList: [],
      // 分类列表(前两级数)
      cateList_two: [],
      // 请求分类列表参数
      getCateListParameter: {
        type: '', // [1,2,3]等级层数
        pagenum: 1, // 当前页码值
        pagesize: 8, // 每页显示多少条数据
        total: 1 // 总共的数据条数
      },
      // 表格列配置文件
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isValid'
        },
        {
          label: '排列',
          type: 'template',
          template: 'arrangement'
        },
        {
          label: '操作',
          type: 'template',
          template: 'operating'
        }
      ],
      // 是否显示添加分类对话框
      isAddGoods: false,
      // 添加分类表单数据对象
      addGoodsFormObj: {
        cat_pid: [], // 分类父 ID
        cat_name: '' // 分类名称
      },
      // 是否显示修改分类对话框
      ismodifyGoods: false,
      // 修改分类表单数据对象
      modifyGoodsFormObj: {
        cat_id: '', // 分类 ID
        cat_name: '' // 分类名称
      },
      // 表单验证对象
      addGoodsFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 下拉选择框配置对象
      props: {
        value: 'cat_id',
        label: 'cat_name',
        expandTrigger: 'hover'
      }
    }
  },
  methods: {
    // 获取分类列表方法
    async  getCateList () {
      const { data: res } = await this.$http.get('categories', {
        params: this.getCateListParameter
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.cateList = res.data.result
      this.getCateListParameter.pagenum = res.data.pagenum + 1
      this.getCateListParameter.pagesize = res.data.pagesize
      this.getCateListParameter.total = res.data.total
    },
    // 翻页方法
    turnPage (page) {
      this.getCateListParameter.pagenum = page
      this.getCateList()
    },
    // 显示添加商品分类对话框方法
    async showAddGoods () {
      this.isAddGoods = true
      const { data: res } = await this.$http.get('categories', {
        params: {
          type: 2
        }
      })
      this.cateList_two = res.data
    },
    // 提交添加商品分类方法
    addGoods () {
      this.$refs.addGoodsForm.validate(async data => {
        if (data) {
          const { data: res } = await this.$http.post('categories', {
            cat_pid: this.addGoodsFormObj.cat_pid[this.addGoodsFormObj.cat_pid.length - 1] || 0, // 分类父 ID
            cat_name: this.addGoodsFormObj.cat_name, // 分类名称
            cat_level: this.addGoodsFormObj.cat_pid.length // 分类层级
          })
          if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
          this.$message({
            type: 'success',
            message: '添加成功'
          })
          this.isAddGoods = false
          this.getCateList()
        }
      })
    },
    // 显示编辑商品分类对话框方法
    async showModifyGoods (goods) {
      const { data: res } = await this.$http.get('categories/' + goods.cat_id)
      this.modifyGoodsFormObj.cat_id = res.data.cat_id
      this.modifyGoodsFormObj.cat_name = res.data.cat_name
      this.ismodifyGoods = true
    },
    // 提交编辑商品分类方法
    async  modifyGoods () {
      const { data: res } = await this.$http.put('categories/' + this.modifyGoodsFormObj.cat_id, {
        cat_name: this.modifyGoodsFormObj.cat_name
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message({
        type: 'success',
        message: '编辑成功'
      })
      this.ismodifyGoods = false
      this.getCateList()
    },
    // 删除商品分类方法
    async removeGoods (goods) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete('categories/' + goods.cat_id)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.getCateList()
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
    }
  },
  // 生命钩子函数(初始化完成自动调用)
  created () {
    // 调用获取分类列表方法
    this.getCateList()
  }
}
</script>

<style lang="less" scoped>
.table-tree{
  margin-top: 20px;
}
.el-icon-success{
  color: rgb(38, 190, 0);
  font-size: 16px;
}
.el-icon-error{
  color: red;
  font-size: 16px;
}
</style>
