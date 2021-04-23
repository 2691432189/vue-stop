<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑导航 -->
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 添加角色按钮 -->
      <el-button
        type="primary"
        class="addButton"
        @click="isAddForm=true"
      >
        添加角色
      </el-button>
      <!-- 添加角色按钮 -->
      <!-- 表格 -->
      <el-table
        :data="rolesList"
        stripe
        style="width: 100%"
      >
        <el-table-column
          width="50px"
          type="expand"
        >
          <template slot-scope="scope">
            <!-- 一级 -->
            <el-row
              v-for="(item1) in scope.row.children"
              :key="item1.id"
              :class="['top-divider']"
            >
              <el-col
                :span="5"
              >
                <el-tag
                  type="danger"
                  closable
                  @close="removeRolesRights(scope.row,item1.id)"
                >
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right" />
              </el-col>
              <el-col :span="19">
                <!-- 二级 -->
                <el-row
                  v-for="(item2 ,index2) in item1.children"
                  :key="item2.id"
                  :class="[index2===0?'':'top-divider']"
                >
                  <el-col
                    :span="7"
                  >
                    <el-tag
                      closable
                      @close="removeRolesRights(scope.row,item2.id)"
                    >
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right" />
                  </el-col>
                  <el-col
                    :span="17"
                  >
                    <!-- 三级 -->
                    <el-tag
                      type="success"
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRolesRights(scope.row,item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  <!-- 三级 -->
                  </el-col>
                </el-row>
                <!-- 二级 -->
              </el-col>
            </el-row>
            <!-- 一级 -->
          </template>
        </el-table-column>
        <el-table-column
          label="#"
          type="index"
          width="50px"
        />
        <el-table-column
          prop="roleName"
          label="角色名称"
        />
        <el-table-column
          prop="roleDesc"
          label="角色描述"
        />
        <el-table-column
          label="操作"
          width="300px"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="modifyRoles(scope.row.id)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeRoles(scope.row.id)"
            >
              删除
            </el-button>
            <el-button
              type="warning"
              icon="el-icon-star-off"
              size="mini"
              @click="showSetRights(scope.row)"
            >
              分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 表格 -->
    </el-card>
    <!-- 卡片 -->
    <!-- 添加角色弹出框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="isAddForm"
      width="50%"
    >
      <span>
        <!-- 添加角色表单 -->
        <el-form
          class="Long_form"
          :model="rolesAddObj"
          ref="rolesAddFormRules"
          :rules="rolesFormRules"
        >
          <el-form-item prop="roleName">
            <el-input
              v-model="rolesAddObj.roleName"
              placeholder="请输入角色名称"
              prefix-icon="iconfont icon-user"
            />
          </el-form-item>
          <el-form-item prop="roleDesc">
            <el-input
              v-model="rolesAddObj.roleDesc"
              placeholder="请输入角色描述"
              prefix-icon="iconfont icon-user"
            />
          </el-form-item>
        </el-form>
        <!-- 添加角色表单 -->
      </span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="isAddForm = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addRoles"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色弹出框 -->
    <!-- 修改用户弹出窗 -->
    <el-dialog
      title="修改角色"
      :visible.sync="isModifyForm"
      width="50%"
    >
      <span>
        <!-- 修改角色表单 -->
        <el-form
          class="Long_form"
          :model="rolesModifyObj"
          ref="rolesModifyFormRules"
          :rules="rolesFormRules"
        >
          <el-form-item prop="roleName">
            <el-input
              v-model="rolesModifyObj.roleName"
              placeholder="请输入角色名称"
              prefix-icon="iconfont icon-user"
            />
          </el-form-item>
          <el-form-item prop="roleDesc">
            <el-input
              v-model="rolesModifyObj.roleDesc"
              placeholder="请输入角色描述"
              prefix-icon="iconfont icon-user"
            />
          </el-form-item>
        </el-form>
        <!-- 修改角色表单 -->
      </span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="isModifyForm = false">取 消</el-button>
        <el-button
          type="primary"
          @click="submitModifyRoles"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户弹出窗 -->
    <!-- 分配权限弹出框 -->
    <el-dialog
      title="提示"
      :visible.sync="isSetRights"
      width="50%"
    >
      <!-- 树形权限解构 -->
      <el-tree
        :data="treeRulesList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        :default-checked-keys="RightsId"
        :default-expand-all="true"
        ref="treeRightsList"
      />
      <!-- 树形权限解构 -->

      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="isSetRights = false">取 消</el-button>
        <el-button
          type="primary"
          @click="submitModifyRights"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限弹出框 -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 用户列表数组
      rolesList: [],
      // 添加角色弹出框是否显示
      isAddForm: false,
      // 修改角色弹出框是否显示
      isModifyForm: false,
      // 分配角色权限弹出框是否显示
      isSetRights: false,
      // 添加角色请求对象
      rolesAddObj: {
        roleName: '',
        roleDesc: ''
      },
      // 修改角色请求对象
      rolesModifyObj: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      // 用户表单规则
      rolesFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 2,
            max: 15,
            message: '长度在 2 到 15 个字符',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 2,
            max: 15,
            message: '长度在 2 到 15 个字符',
            trigger: 'blur'
          }
        ]
      },
      // 权限列表(树状)
      treeRulesList: [],
      // 权限树配置对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 即将被重新分配权限的角色id
      roleId: '',
      // 即将被重新分配权限的角色已有的所有权限id
      RightsId: []
    }
  },
  methods: {
    // 获取角色列表方法
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.rolesList = res.data
    },
    // 弹出添加用户对话框方法
    addRoles () {
      this.$refs.rolesAddFormRules.validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.post('roles', this.rolesAddObj)
          if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
          this.$message({
            message: res.meta.msg,
            type: 'success'
          })
          this.isAddForm = false
          this.getRolesList()
        }
      })
    },
    // 弹出修改用户对话框方法
    async modifyRoles (id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('获取角色失败')
      this.rolesModifyObj.id = res.data.roleId
      this.rolesModifyObj.roleName = res.data.roleName
      this.rolesModifyObj.roleDesc = res.data.roleDesc
      this.isModifyForm = true
    },
    // 提交修改用户方法
    submitModifyRoles () {
      this.$refs.rolesModifyFormRules.validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.put('roles/' + this.rolesModifyObj.id, {
            roleName: this.rolesModifyObj.roleName,
            roleDesc: this.rolesModifyObj.roleDesc
          })
          if (res.meta.status !== 200) return this.$message.error('修改角色失败')
          this.$message({
            message: '修改角色成功',
            type: 'success'
          })
          this.isModifyForm = false
          this.getRolesList()
        }
      })
    },
    // 删除角色方法
    removeRoles (id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete('roles/' + id)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getRolesList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 删除角色下的某个权限
    removeRolesRights (role, rightId) {
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete('roles/' + role.id + '/rights/' + rightId)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        role.children = res.data
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 弹出分配权限对话框
    async showSetRights (role) {
      this.RightsId = []
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      this.treeRulesList = res.data
      this.getRoleAlreadyRightsId(role, this.RightsId)
      this.isSetRights = true
    },
    // 利用递归获取当前角色拥有的权限id方法
    getRoleAlreadyRightsId (role, arr) {
      if (!role.children) return arr.push(role.id)
      role.children.forEach(item => this.getRoleAlreadyRightsId(item, arr)
      )
    },
    // 提交分配用户权限方法
    async submitModifyRights () {
      const keys = [...this.$refs.treeRightsList.getCheckedKeys(), ...this.$refs.treeRightsList.getHalfCheckedKeys()]
      const { data: res } = await this.$http.post('roles/' + this.roleId + '/rights', {
        rids: keys.join(',')
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message({
        type: 'success',
        message: '分配权限成功!'
      })
      this.isSetRights = false
      this.getRolesList()
    }

  },
  // 生命钩子函数
  created () {
    // 调用获取角色列表方法
    this.getRolesList()
  }
}
</script>

<style lang="less" scoped>
.addButton{
  margin-bottom: 15px !important;
}
.el-tag{
  margin: 10px;
}
.top-divider{
  border-top: 1px solid #cccccc;
}
</style>
