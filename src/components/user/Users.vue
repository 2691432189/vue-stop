<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item> 用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑导航 -->
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 栅格 -->
      <el-row :gutter="20">
        <!-- 搜索框 -->
        <el-col :span="12">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="usersListObj.query"
            @change="getUsersList()"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUsersList()"
            />
          </el-input>
        </el-col>
        <!-- 搜索框 -->
        <!-- 添加用户按钮 -->
        <el-col :span="12">
          <el-button
            type="primary"
            @click="dialogVisible = true"
          >
            添加用户
          </el-button>
        </el-col>
        <!-- 添加用户按钮 -->
      </el-row>
      <!-- 栅格 -->
      <!-- 用户列表表格 -->
      <el-table
        :data="usersList.users"
        stripe
        style="width: 100%"
      >
        <el-table-column
          type="index"
          width="50"
          label="#"
        />
        <el-table-column
          prop="username"
          label="用户名"
        />
        <el-table-column
          prop="email"
          label="邮箱"
        />
        <el-table-column
          prop="mobile"
          label="电话"
        />
        <el-table-column
          prop="role_name"
          label="角色"
        />
        <el-table-column
          label="状态"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeUserStatus(scope.row.id,scope.row.mg_state)"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="220"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="usersInfoModify(scope.row.id)"
            />
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="usersInfoRemove(scope.row.id)"
            />
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-star-off"
                @click="setRole(scope.row)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 用户列表表格 -->
      <!-- 分页功能 -->
      <el-pagination
        :page-size="usersListObj.pagesize"
        :pager-count="7"
        layout="prev, pager, next"
        :total="usersList.total"
        :current-page="usersListObj.pagenum"
        @current-change="currentPage"
      />
      <!-- 分页功能 -->
    </el-card>
    <!-- 卡片 -->
    <!-- 添加用户弹出框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="closeEmptyForm"
    >
      <span>
        <!-- 添加用户表单 -->
        <el-form
          class="Long_form"
          :model="addUserData"
          :rules="UserFormRules"
          ref="addUserFormRules"
        >
          <!-- 用户名 -->
          <el-form-item prop="username">
            <el-input
              placeholder="请输入用户名"
              prefix-icon="iconfont icon-user"
              v-model="addUserData.username"
            />
          </el-form-item>
          <!-- 用户名 -->
          <!-- 密码 -->
          <el-form-item prop="password">
            <el-input
              placeholder="请输入密码"
              prefix-icon="iconfont icon-3702mima"
              v-model="addUserData.password"
              show-password
            />
          </el-form-item>
          <!-- 密码 -->
          <!-- 邮箱 -->
          <el-form-item prop="email">
            <el-input
              placeholder="请输入邮箱"
              prefix-icon="el-icon-s-promotion"
              v-model="addUserData.email"
            />
          </el-form-item>
          <!-- 邮箱 -->
          <!-- 电话 -->
          <el-form-item prop="mobile">
            <el-input
              placeholder="请输入电话号"
              prefix-icon="el-icon-phone"
              v-model="addUserData.mobile"
            />
          </el-form-item>
          <!-- 电话 -->
        </el-form>
        <!-- 添加用户表单 -->
      </span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addUser"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加用户弹出框 -->
    <!-- 修改用户弹出框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="modifyVisible"
      width="50%"
    >
      <span>
        <!-- 修改用户表单 -->
        <el-form
          class="Long_form"
          :model="usersModifyObj"
          :rules="UserFormRules"
          ref="usersModifyRules"
        >
          <!-- 用户名 -->
          <el-form-item>
            <el-input
              placeholder="请输入用户名"
              prefix-icon="iconfont icon-user"
              v-model="usersModifyObj.usersName"
              disabled
            />
          </el-form-item>
          <!-- 用户名 -->
          <!-- 邮箱 -->
          <el-form-item prop="email">
            <el-input
              placeholder="请输入邮箱"
              prefix-icon="el-icon-s-promotion"
              v-model="usersModifyObj.email"
            />
          </el-form-item>
          <!-- 邮箱 -->
          <!-- 电话 -->
          <el-form-item prop="mobile">
            <el-input
              placeholder="请输入电话号"
              prefix-icon="el-icon-phone"
              v-model="usersModifyObj.mobile"
            />
          </el-form-item>
          <!-- 电话 -->
        </el-form>
        <!-- 修改用户表单 -->
      </span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="modifyVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="submitUserModify"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户弹出框 -->
    <!-- 分配角色弹出框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="isRightsVisible"
      width="40%"
    >
      <div>
        <p>当前用户名 : {{ usersInfo.username }}</p>
        <p>当前的角色 : {{ usersInfo.role_name }}</p>
        <p>
          分配新角色 :
          <el-select
            v-model="roleId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            />
          </el-select>
        </p>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="isRightsVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="submitSetRole"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色弹出框 -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 用户列表请求参数对象
      usersListObj: {
        query: '',
        pagenum: 1, // 当前页码
        pagesize: 6 // 每页显示条数
      },
      // 用户信息修改请求参数对象
      usersModifyObj: {
        usersName: '',
        id: '',
        email: '',
        mobile: ''
      },
      // 用户列表数组
      usersList: [],
      // 即将被分配角色的用户信息
      usersInfo: {},
      // 即将被分配角色的用户被分配的角色id
      roleId: '',
      // 控制添加用户弹出框是否显示
      dialogVisible: false,
      // 添加用户参数对象
      addUserData: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 控制修改用户弹出框是否显示
      modifyVisible: false,
      // 控制分配角色弹出框是否显示
      isRightsVisible: false,
      // 角色列表
      roleList: {},
      // 添加用户表单规则
      UserFormRules: {
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
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            type: 'email',
            min: 6,
            max: 15,
            message: '请输入正确的邮箱',
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '请输入电话号', trigger: 'blur' },
          {
            min: 11,
            max: 11,
            message: '长度在应为11位的手机号',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 获取用户列表方法
    async getUsersList () {
      const { data: usersList, status } = await this.$http.get('users', {
        params: this.usersListObj
      })
      if (status !== 200) return this.$message.error('获取用户列表失败')
      this.usersList = usersList.data
    },
    // 被修改后的修改用户信息
    async usersInfoModify (id) {
      this.modifyVisible = true
      const { data: usersInfo } = await this.$http.get('users/' + id)
      this.usersModifyObj.usersName = usersInfo.data.username
      this.usersModifyObj.id = usersInfo.data.id
      this.usersModifyObj.email = usersInfo.data.email
      this.usersModifyObj.mobile = usersInfo.data.mobile
    },
    // 删除用户信息
    usersInfoRemove (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete('users/' + id)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.getUsersList()
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
    // 翻页方法
    currentPage (page) {
      this.usersListObj.pagenum = page
      this.getUsersList()
    },
    // 更改用户状态
    async changeUserStatus (id, status) {
      const { data: res } = await this.$http.put('users/' + id + '/state/' + status)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message({
        message: res.meta.msg,
        type: 'success'
      })
    },
    // 添加用户方法
    async addUser () {
      this.$refs.addUserFormRules.validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.post('users', this.addUserObj)
          if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
          this.$message({
            message: res.meta.msg,
            type: 'success'
          })
          this.dialogVisible = false
          this.getUsersList()
        }
      })
    },
    // 关闭添加用户窗口清空表单
    closeEmptyForm () {
      this.$refs.addUserFormRules.resetFields()
    },
    // 提交修改用户信息
    async submitUserModify () {
      this.$refs.usersModifyRules.validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.put('users/' + this.usersModifyObj.id, {
            email: this.usersModifyObj.email,
            mobile: this.usersModifyObj.mobile
          })
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.$message({
            message: res.meta.msg,
            type: 'success'
          })
          this.modifyVisible = false
          this.getUsersList()
        }
      })
    },
    // 分配角色
    async setRole (role) {
      this.usersInfo = role
      this.isRightsVisible = true
      const { data: res } = await this.$http.get('roles')
      this.roleList = res.data
    },
    // 提交用户被分配的角色
    async submitSetRole () {
      const { data: res } = await this.$http.put('users/' + this.usersInfo.id + '/role', {
        rid: this.roleId
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message({
        message: res.meta.msg,
        type: 'success'
      })
      this.isRightsVisible = false
      this.usersInfo = {}
      this.roleId = ''
      this.getUsersList()
    }
  },
  // 生命钩子函数
  created () {
    // 调用获取用户列表方法
    this.getUsersList()
  }

}
</script>

<style lang="less" scoped>

.el-row{
  margin-bottom: 20px;
}

.el-pagination{
  margin-top: 25px;
}

</style>
