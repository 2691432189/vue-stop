<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item> 添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑导航 -->
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 提示信息 -->
      <el-alert
        title="消息提示的文案"
        type="info"
        center
        :closable="false"
        show-icon
      />
      <!-- 提示信息 -->
      <!-- 步骤条 -->
      <el-steps
        :active="index-0"
        finish-status="success"
        :align-center="true"
      >
        <el-step title="基本信息" />
        <el-step title="商品参数" />
        <el-step title="商品属性" />
        <el-step title="商品图片" />
        <el-step title="商品内容" />
        <el-step title="完成" />
      </el-steps>
      <!-- 步骤条 -->
      <!-- 添加商品表单 -->
      <el-form
        :model="addGoodsForm"
        :rules="addGoodsFormRules"
        ref="addGoodsFormRef"
        label-width="100px"
        class="demo-ruleForm"
        label-position="top"
      >
        <!-- abs 标签页 -->
        <el-tabs
          tab-position="left"
          v-model="index"
          :before-leave="banSwitch"
        >
          <el-tab-pane
            label="基本信息"
            name="0"
          >
            <!-- 商品名称input -->
            <el-form-item
              label="商品名称"
              prop="goods_name"
              :required="true"
            >
              <el-input v-model="addGoodsForm.goods_name" />
            </el-form-item>
            <!-- 商品名称input -->
            <!-- 商品价格input -->
            <el-form-item
              label="商品价格"
              prop="goods_price"
              :required="true"
            >
              <el-input v-model.number="addGoodsForm.goods_price" />
            </el-form-item>
            <!-- 商品价格input -->
            <!-- 商品重量input -->
            <el-form-item
              label="商品重量"
              prop="goods_weight"
              :required="true"
            >
              <el-input v-model.number="addGoodsForm.goods_weight" />
            </el-form-item>
            <!-- 商品重量input -->
            <!-- 商品数量input -->
            <el-form-item
              label="商品重量"
              prop="goods_number"
              :required="true"
            >
              <el-input v-model.number="addGoodsForm.goods_number" />
            </el-form-item>
            <!-- 商品数量input -->
            <!-- 商品分类 -->
            <el-form-item
              label="商品分类"
              prop="goods_cat"
              :required="true"
            >
              <!-- 级联选择器 -->
              <el-cascader
                :options="cateList"
                clearable
                :props="props"
                placeholder="请选择分类级别"
                v-model="addGoodsForm.goods_cat"
                @change="cascaderChange"
              />
              <!-- 级联选择器 -->
            </el-form-item>
            <!-- 商品分类 -->
          </el-tab-pane>
          <el-tab-pane
            label="商品参数"
            name="1"
          >
            <!-- 商品参数 -->
            <el-form-item
              :label="item.attr_name"
              v-for="(item) in manyList"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="item1"
                  v-for="(item1, index1) in item.attr_vals"
                  :key="index1"
                  border
                />
              </el-checkbox-group>
            </el-form-item>
            <!-- 商品参数 -->
          </el-tab-pane>
          <el-tab-pane
            label="商品属性"
            name="2"
          >
            <!-- 商品参数 -->
            <el-form-item
              :label="item.attr_name"
              v-for="(item) in onlyList"
              :key="item.attr_id"
            >
              <el-input v-model.number="item.attr_vals" />
            </el-form-item>
            <!-- 商品参数 -->
          </el-tab-pane>
          <el-tab-pane
            label="商品图片"
            name="3"
          >
            <!-- 图片上传 -->
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="onSuccess"
              list-type="picture"
              :headers="headers"
            >
              <el-button
                size="small"
                type="primary"
              >
                点击上传
              </el-button>
            </el-upload>
            <!-- 图片上传 -->
          </el-tab-pane>
          <el-tab-pane
            label="商品内容"
            name="4"
          >
            <!-- 富文本编辑器 -->
            <quill-editor
              ref="myQuillEditor"
              v-model="addGoodsForm.goods_introduce"
            />
            <!-- 富文本编辑器 -->
            <!-- 添加商品按钮 -->
            <el-button
              type="primary"
              @click="addGoods"
            >
              添加商品
            </el-button>
            <!-- 添加商品按钮 -->
          </el-tab-pane>
        </el-tabs>
      <!-- abs 标签页 -->
      </el-form>
      <!-- 添加商品表单 -->
    </el-card>
    <!-- 卡片 -->
    <!-- 图片预览弹出框 -->
    <el-dialog
      :visible.sync="previe.dialogTableVisible"
      width="60%"
    >
      <img
        :src="previe.previewUrl"
        class="previeImg"
      >
    </el-dialog>
    <!-- 图片预览弹出框 -->
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data () {
    return {
      // 步骤条-abs标签页联动
      index: 0,
      // 添加商品表单
      addGoodsForm: {
        goods_name: '', // 商品名称
        goods_cat: [], //  以为','分割的分类列表
        goods_price: 1, // 价格
        goods_number: 1, // 数量
        goods_weight: 1, // 重量
        goods_introduce: '', // 介绍
        pics: [], // 上传的图片临时路径（对象）
        attrs: [] // 商品的参数（数组），包含 `动态参数` 和 `静态属性`
      },
      // 添加商品表单规则
      addGoodsFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请输选择商品分类', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
          { type: 'number', message: '商品价格必须为数字值' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
          { type: 'number', message: '商品数量必须为数字值' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
          { type: 'number', message: '商品重量必须为数字值' }
        ],
        goods_introduce: [],
        pics: [],
        attrs: []
      },
      // 分类列表(所有级数)
      cateList: [],
      // 下拉选择框配置对象
      props: {
        value: 'cat_id',
        label: 'cat_name',
        expandTrigger: 'hover'
      },
      // only静态属性列表
      manyList: [],
      // only静态属性列表
      onlyList: [],
      // 请求头参数
      headers: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 图片预览对象
      previe: {
        previewUrl: '', // 图片地址
        dialogTableVisible: false // 图片预览对话框
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
    // 是否禁止abs标签
    banSwitch (activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addGoodsForm.goods_cat.length !== 3) {
        this.$message.error('请选择分类')
        return false
      }
    },
    // 当级联选择器选中节点变化时触发
    cascaderChange () {
      this.getParameter()
    },
    // 获取商品参数列表
    async  getParameter () {
      if (this.getClassificationId !== null) {
        const manyRes = await this.$http.get('categories/' + this.getClassificationId + '/attributes', {
          params: {
            sel: 'many'
          }
        })
        manyRes.data.data.forEach(element => {
          element.attr_vals = element.attr_vals ? element.attr_vals.split(' ') : []
        })
        this.manyList = manyRes.data.data
        const onlyRes = await this.$http.get('categories/' + this.getClassificationId + '/attributes', {
          params: {
            sel: 'only'
          }
        })
        this.onlyList = onlyRes.data.data
      }
    },
    // 处理图片删除
    handleRemove (file, fileList) {
      const index = this.addGoodsForm.pics.findIndex(element => {
        return element.pic === file.response.data.tmp_path
      })
      this.addGoodsForm.pics.splice(index, 1)
    },
    // 处理图片预览
    handlePreview (file) {
      this.previe.dialogTableVisible = true
      this.previe.previewUrl = file.response.data.url
    },
    // 图片上传成功时处理
    onSuccess (response, file, fileList) {
      const path = { pic: response.data.tmp_path }
      this.addGoodsForm.pics.push(path)
    },
    // 添加商品方法
    addGoods () {
      this.$refs.addGoodsFormRef.validate(async bl => {
        if (!bl) return this.$message.error('请填写必要的商品参数')
        this.addGoodsForm.attrs = []
        // 处理manyList
        this.manyList.forEach(item => {
          const newObj = { attr_id: item.attr_id, attr_value: item.attr_vals.join(' ') }
          this.addGoodsForm.attrs.push(newObj)
        })
        // 处理onlyList
        this.onlyList.forEach(item => {
          const newObj = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addGoodsForm.attrs.push(newObj)
        })
        // 深拷贝addGoodsForm
        var form = _.cloneDeep(this.addGoodsForm)
        // 处理onlyListgoods_cat
        form.goods_cat = form.goods_cat.join(',')
        // 发起添加商品请求
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$router.push('/categories')
        this.$message({
          type: 'success',
          message: '添加商品成功!'
        })
      })
    }
  },
  // 计算属性
  computed: {
    //  自动获取分类ID
    getClassificationId () {
      if (this.addGoodsForm.goods_cat.length === 3) {
        return this.addGoodsForm.goods_cat[2]
      } else {
        return null
      }
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
.el-checkbox{
  margin: 0 10px 0 0!important;
}
.previeImg{
  width: 100%;
}
</style>
