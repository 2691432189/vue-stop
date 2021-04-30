<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item> 分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑导航 -->
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 警告横幅 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        show-icon
      />
      <!-- 警告横幅 -->
      <!-- 级联选择器 -->
      <span>选择商品分类：</span>
      <el-cascader
        :options="cateList"
        clearable
        :props="props"
        placeholder="请选择分类级别"
        v-model="cascaderValue"
        @change="cascaderValueChange"
      />
      <!-- 级联选择器 -->
      <!-- tabs标头 -->
      <el-tabs
        v-model="tabsValue"
        @tab-click="getCorrespondData"
      >
        <el-tab-pane
          label="静态属性"
          name="only"
          :disabled="whetherDisabled"
        >
          <!-- 添加属性按钮 -->
          <el-button
            type="primary"
            :disabled="whetherDisabled"
            @click="whetherShowAddAttributesDialog=true"
          >
            添加属性
          </el-button>
          <!-- 添加属性按钮 -->
          <!-- 静态属性表格 -->
          <el-table
            :data="onlyList"
            stripe
            style="width: 100%"
          >
            <el-table-column
              type="expand"
              width="60"
            >
              <template slot-scope="scope">
                <el-tag
                  v-for="(item,index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="removeTag(index,scope.row)"
                >
                  {{ item }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                />
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >
                  + New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              label="#"
              type="index"
              width="60"
            />
            <el-table-column
              prop="attr_name"
              label="参数名称"
            />
            <el-table-column
              label="操作"
            >
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  @click="modifyAttributes(scope.row)"
                >
                  修改
                </el-button>
                <el-button
                  type="danger"
                  size="mini"
                  @click="removeAttributes(scope.row)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 静态属性表格 -->
        </el-tab-pane>
        <el-tab-pane
          label="动态参数"
          name="many"
          :disabled="whetherDisabled"
        >
          <!-- 添加属性按钮 -->
          <el-button
            type="primary"
            :disabled="whetherDisabled"
            @click="whetherShowAddAttributesDialog=true"
          >
            添加属性
          </el-button>
          <!-- 添加属性按钮 -->
          <!-- 动态参数表格 -->
          <el-table
            :data="manyList"
            stripe
            style="width: 100%"
          >
            <el-table-column
              type="expand"
              width="60"
            >
              <template slot-scope="scope">
                <el-tag
                  v-for="(item,index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="removeTag(index,scope.row)"
                >
                  {{ item }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                />
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >
                  + New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              label="#"
              type="index"
              width="60"
            />
            <el-table-column
              prop="attr_name"
              label="属性名称"
            />
            <el-table-column
              label="操作"
            >
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  @click="modifyAttributes(scope.row)"
                >
                  修改
                </el-button>
                <el-button
                  type="danger"
                  size="mini"
                  @click="removeAttributes(scope.row)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 动态参数表格 -->
        </el-tab-pane>
      </el-tabs>
      <!-- tabs标头 -->
    </el-card>
    <!-- 卡片 -->
    <!-- 添加属性弹出框 -->
    <el-dialog
      :title="tabsValue=='only'?'添加属性-静态':'添加属性-动态'"
      :visible.sync="whetherShowAddAttributesDialog"
      width="50%"
    >
      <!-- 添加属性表单 -->
      <el-form
        :model="addAttributesFormObj"
        :rules="attributesFormRules"
        ref="addAttributesForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="活动名称"
          prop="name"
        >
          <el-input v-model="addAttributesFormObj.name" />
        </el-form-item>
      </el-form>
      <!-- 添加属性表单 -->
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="whetherShowAddAttributesDialog = false">取 消</el-button>
        <el-button
          type="primary"
          @click="AddAttributes()"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加属性弹出框 -->
    <!-- 修改属性弹出框 -->
    <el-dialog
      :title="tabsValue=='only'?'修改属性-静态':'修改属性-动态'"
      :visible.sync="whetherShowModifyAttributesDialog"
      width="50%"
    >
      <!-- 修改属性表单 -->
      <el-form
        :model="modifyAttributesFormObj"
        :rules="attributesFormRules"
        ref="modifyAttributesForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="属性名称"
          prop="name"
        >
          <el-input v-model="modifyAttributesFormObj.name" />
        </el-form-item>
      </el-form>
      <!-- 修改属性表单 -->
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="whetherShowModifyAttributesDialog = false">取 消</el-button>
        <el-button
          type="primary"
          @click="submitModifyAttributes()"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改性弹出框 -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 分类列表(所有级数)
      cateList: [],
      // 下拉选择框配置对象
      props: {
        value: 'cat_id',
        label: 'cat_name',
        expandTrigger: 'hover'
      },
      // 下拉选择框value
      cascaderValue: [],
      // only静态属性列表
      onlyList: [],
      //  many动态参数列表
      manyList: [],
      // tabs标头value
      tabsValue: 'only',
      // 是否显示添加属性对话框
      whetherShowAddAttributesDialog: false,
      // 是否显示修改属性对话框
      whetherShowModifyAttributesDialog: false,
      // 添加属性表单对象
      addAttributesFormObj: {
        name: '' // 参数名称
      },
      // 修改属性表单对象
      modifyAttributesFormObj: {
        name: '', // 参数名称
        attr_id: ''
      },
      // 属性表单规则
      attributesFormRules: {
        name: [
          { required: true, message: '请输入属性名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取分类列表方法
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.cateList = res.data
    },
    // 当选择器选中三级分类时，获取当前分类的参数方法
    async getCorrespondData () {
      if (this.cascaderValue.length !== 3) {
        this.onlyList = []
        this.manyList = []
        return
      }
      const res = await this.$http.get('categories/' + this.cascaderValue[2] + '/attributes', {
        params: {
          sel: this.tabsValue
        }
      })
      if (res.data.meta.status !== 200) return this.$message.error(res.meta.msg)
      if (res.config.params.sel === 'only') {
        res.data.data.forEach(element => {
          element.attr_vals = element.attr_vals ? element.attr_vals.split(' ') : []
          element.inputVisible = false // 控制添加标签是什么状态
          element.inputValue = '' // 添加标签input的值
        })
        this.onlyList = res.data.data
      } else {
        res.data.data.forEach(element => {
          element.attr_vals = element.attr_vals ? element.attr_vals.split(' ') : []
          element.inputVisible = false // 控制添加标签是什么状态
          element.inputValue = '' // 添加标签input的值
        })
        this.manyList = res.data.data
      }
    },
    // 下拉选择框value变化则调用
    cascaderValueChange () {
      this.getCorrespondData()
    },
    // 提交添加属性
    async AddAttributes () {
      this.$refs.addAttributesForm.validate(async data => {
        if (data) {
          const { data: res } = await this.$http.post(`categories/${this.cascaderValue[2]}/attributes`, {
            attr_name: this.addAttributesFormObj.name,
            attr_sel: this.tabsValue
          })
          if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
          this.whetherShowAddAttributesDialog = false
          this.getCorrespondData()
          this.addAttributesFormObj.name = ''
        }
      })
    },
    // 提交删除属性
    removeAttributes (row) {
      this.$confirm('此操作将永久删除该属性, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`categories/${this.cascaderValue[2]}/attributes/${row.attr_id}`)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.getCorrespondData()
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
    // 修改属性
    async  modifyAttributes (row) {
      const { data: res } = await this.$http.get(`categories/${this.cascaderValue[2]}/attributes/${row.attr_id}`, {
        params: {
          attr_sel: this.tabsValue
        }
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.modifyAttributesFormObj.name = res.data.attr_name
      this.modifyAttributesFormObj.attr_id = res.data.attr_id
      this.whetherShowModifyAttributesDialog = true
    },
    // 提交修改属性
    async submitModifyAttributes () {
      this.$refs.modifyAttributesForm.validate(async data => {
        if (data) {
          const { data: res } = await this.$http.put(`categories/${this.cascaderValue[2]}/attributes/${this.modifyAttributesFormObj.attr_id}`, {
            attr_name: this.modifyAttributesFormObj.name,
            attr_sel: this.tabsValue
          })
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.whetherShowModifyAttributesDialog = false
          this.getCorrespondData()
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
        }
      })
    },
    // 控制添加标签从按钮变成输入框并获得焦点
    showInput (row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.focus()
      })
    },

    // 控制添加标签从输入框变成按钮，并清空输入框的值
    async  handleInputConfirm (row) {
      const inputValue = row.inputValue
      if (inputValue.trim().length !== 0) {
        row.attr_vals.push(inputValue.trim())
        const { data: res } = await this.$http.put(`categories/${this.cascaderValue[2]}/attributes/${row.attr_id}`, {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      }
      row.inputVisible = false
      row.inputValue = ''
    },
    // 删除标签
    async removeTag (index, row) {
      console.log(row)
      row.attr_vals.splice(index, 1)
      const { data: res } = await this.$http.put(`categories/${this.cascaderValue[2]}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
    }
  },
  computed: {
    // 监听下拉选择框value的length长度并返回布尔值，用于是否禁用tabs标头
    whetherDisabled () {
      if (this.cascaderValue.length === 3) {
        // 调用 当选择器选中三级分类时，获取当前分类的参数方法
        return false
      } else {
        return true
      }
    },
    // 监听下拉选择框value的length长度并返回下拉选择框所选中参数的id
    getCascaderValueId () {
      return this.cascaderValue[this.cascaderValue.length - 1]
    }
  },
  // 生命钩子函数
  created () {
    // 调用获取分类列表方法
    this.getCateList()
  }
}
</script>

<style lang="less" scoped>
.el-alert{
  margin-bottom: 20px;
}
.el-cascader{
  margin-bottom: 20px;
}
.el-tag{
  margin: 10px 20px;
}
.input-new-tag {
  width: 90px;
}
</style>
