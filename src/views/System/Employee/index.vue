<template>
  <div class="employee-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">员工姓名：</div>
      <el-input v-model="params.name" clearable placeholder="请输入内容" class="search-main" />
      <el-button type="primary" @click="searchUser">查询</el-button>
    </div>
    <div class="create-container">
      <el-button v-permission="'sys:user:add_edit'" type="primary" @click="addEmployee">添加员工</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table v-loading="loading" style="width: 100%" :data="employeeList">
        <el-table-column type="index" label="序号" :index="indexMethod" />
        <el-table-column label="员工姓名" width="180" prop="name" />
        <el-table-column label="登录账号" width="180" prop="userName" />
        <el-table-column label="联系方式" width="120" prop="phonenumber" />
        <el-table-column label="角色" width="120" prop="roleName" />
        <el-table-column label="状态">
          <template #default="scope">{{ statusList[scope.row.status] }}</template>
        </el-table-column>
        <el-table-column label="添加时间" prop="createTime" />
        <el-table-column label="操作" fixed="right" width="120">
          <template #default="scope">
            <el-button v-permission="'sys:user:add_edit'" size="mini" type="text" @click="editEenu(scope.row.id)">编辑</el-button>
            <el-button v-permission="'sys:user:remove'" size="mini" type="text" @click="delEmployee(scope.row.id)">删除</el-button>
            <el-button v-permission="'sys:user:resetPwd'" size="mini" type="text" @click="resetPwd(scope.row.id)">重置密码</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-container">
      <el-pagination layout="total, prev, pager, next" :total="total" :page-size="2" @current-change="handleCurrentChange" />
    </div>
    <!-- 添加员工 -->
    <el-dialog :title="addForm.id?'编辑员工':'添加员工'" width="480px" :visible.sync="dialogVisible" @close="closeDialog">
      <!-- 表单接口 -->
      <div class="form-container">
        <el-form ref="addForm" :model="addForm" :rules="addFormRules" label-width="80px">
          <el-form-item label="员工姓名" prop="name">
            <el-input v-model="addForm.name" />
          </el-form-item>
          <el-form-item label="登录账号" prop="userName">
            <el-input v-model="addForm.userName" />
          </el-form-item>
          <el-form-item label="联系方式" prop="phonenumber">
            <el-input v-model="addForm.phonenumber" />
          </el-form-item>
          <el-form-item label="分配角色" prop="roleId">
            <el-select v-model="addForm.roleId" placeholder="请选择角色">
              <el-option v-for="item in roleList" :key="item.roleId" :label="item.roleName" :value="item.roleId" />
            </el-select>
          </el-form-item>
          <el-form-item label="员工状态" prop="status">
            <el-radio-group v-model="addForm.status">
              <el-radio :label="0">禁用</el-radio>
              <el-radio :label="1">启用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitForm">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getEmployeeListAPI, addEmployeeAPI, getEmployeeAPI, updateEmployeeAPI, resetPwdAPI, delEmployeeAPI } from '@/api/menu'
import { getSysRoleListAPI } from '@/api/system'

export default {
  name: 'Employee',
  data() {
    return {
      statusList: ['未启用', '启用 '],
      employeeList: [],
      params: {
        page: 1,
        pageSize: 2,
        name: null
      },
      loading: false,
      total: 0,
      dialogVisible: false, // 控制弹框打开关闭
      roleList: [], // 角色列表
      addForm: {
        name: '',
        phonenumber: '',
        roleId: '',
        status: 1,
        userName: ''
      },
      addFormRules: {
        name: [{ required: true, message: '请输入员工姓名', trigger: 'blur' }],
        userName: [{ required: true, message: '请输入登录账号', trigger: 'blur' }],
        phonenumber: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
        roleId: [{ required: true, message: '请分配角色', trigger: 'blur' }],
        status: [{ required: true, message: '请选择员工状态', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    // 删除员工
    delEmployee(id) {
      this.$confirm('确定要将此员工删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await delEmployeeAPI(id)
        this.getEmployeeList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    },
    // 重置密码
    resetPwd(id) {
      this.$confirm('确定要将密码重置为“123456”吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await resetPwdAPI(id)
        this.$message({
          type: 'success',
          message: '密码重置成功!'
        })
      })
    },
    // 编辑
    async editEenu(id) {
      const res1 = await getSysRoleListAPI()
      this.roleList = res1.data
      const res = await getEmployeeAPI(id)
      // console.log(res)

      this.addForm = res.data
      this.dialogVisible = true
    },
    // 查询
    searchUser() {
      this.params.page = 1
      this.getEmployeeList()
    },
    submitForm() {
      this.$refs.addForm.validate(async valid => {
        if (!valid) return
        // 执行提交
        if (this.addForm.id) {
          // 编辑
          // console.log(this.addForm)
          const obj = this.addForm
          delete obj.createTime
          await updateEmployeeAPI(obj)
          this.$message({
            type: 'success',
            message: '修改成功'
          })
        } else {
          // 添加
          await addEmployeeAPI(this.addForm)
          this.$message({
            type: 'success',
            message: '添加成功'
          })
        }

        this.closeDialog()
        this.getEmployeeList()
      })
    },
    // 关闭弹框
    closeDialog() {
      this.addForm = {
        name: '',
        phonenumber: '',
        roleId: '',
        status: 1,
        userName: ''
      }
      this.$refs.addForm.resetFields()
      this.dialogVisible = false
    },
    // 打开弹框
    async addEmployee() {
      this.dialogVisible = true
      const res = await getSysRoleListAPI()
      this.roleList = res.data
    },
    // 修改自定义序号
    indexMethod(index) {
      return index + 1 + (this.params.page - 1) * this.params.pageSize
    },
    handleCurrentChange(val) {
      this.params.page = val
      this.getEmployeeList()
    },
    async getEmployeeList() {
      this.loading = true
      const res = await getEmployeeListAPI(this.params)
      this.employeeList = res.data.rows
      this.total = res.data.total
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.employee-container {
  padding: 10px;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, 0.9);
  padding-bottom: 20px;

  .search-label {
    width: 100px;
  }

  .search-main {
    width: 220px;
    margin-right: 10px;
  }
}
.create-container {
  margin: 10px 0px;
}
.page-container {
  padding: 4px 0px;
  text-align: right;
}
.form-container {
  padding: 0px 80px;
}
</style>
