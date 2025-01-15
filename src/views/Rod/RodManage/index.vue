<template>
  <div class="card-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <span class="search-label">一体杆名称：</span>
      <el-input v-model="params.poleName" clearable placeholder="请输入内容" class="search-main" />
      <span class="search-label">一体杆编号：</span>
      <el-input v-model="params.poleNumber" clearable placeholder="请输入内容" class="search-main" />
      <span class="search-label">状态：</span>
      <el-select v-model="params.poleStatus">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button type="primary" class="search-btn" @click="searchPoleInfo">查询</el-button>
    </div>
    <!-- 新增删除操作区域 -->
    <div class="create-container">
      <el-button v-permission="'pole:info:add_edit'" type="primary" @click="dialogVisible = true">添加一体杆</el-button>
      <el-button v-permission="'pole:info:remove'" @click="selectionDel">批量删除</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table v-loading="loading" style="width: 100%" :data="poleInfoList" @selection-change="selectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="序号" :index="indexMethod" />
        <el-table-column label="一体杆名称" prop="poleName" />
        <el-table-column label="一体杆编号" prop="poleNumber" />
        <el-table-column label="一体杆IP" prop="poleIp" />
        <el-table-column label="安装区域" prop="areaName" />
        <el-table-column label="一体杆类型" prop="poleType">
          <template #default="scope">
            <span>{{ showPoleType(scope.row.poleType) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="运行状态" prop="poleStatus">
          <template #default="scope">
            <span>{{ showPoleStatus(scope.row.poleStatus) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="scope">
            <el-button v-permission="'pole:info:add_edit'" size="mini" type="text" @click="editPoleInfo(scope.row.id)">编辑</el-button>
            <el-button v-permission="'pole:info:remove'" size="mini" type="text" @click="removePoleInfo(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-container">
      <el-pagination layout="total, prev, pager, next" :total="total" @current-change="handleCurrentChange" />
    </div>
    <!-- 添加楼宇 -->
    <el-dialog :title="addForm.id ? '编辑一体杆':'添加一体杆'" width="580px" :visible.sync="dialogVisible" @close="closeDialog">
      <!-- 表单接口 -->
      <div class="form-container">
        <el-form ref="addForm" :model="addForm" :rules="addFormRules">
          <el-form-item label="一体杆名称" prop="poleName">
            <el-input v-model="addForm.poleName" />
          </el-form-item>
          <el-form-item label="一体杆编号" prop="poleNumber">
            <el-input v-model="addForm.poleNumber" />
          </el-form-item>
          <el-form-item label="一体杆IP" prop="poleIp">
            <el-input v-model="addForm.poleIp" />
          </el-form-item>
          <el-form-item label="关联地区" prop="areaId">
            <el-select v-model="addForm.areaId" placeholder="请选择">
              <el-option v-for="item in areaIdOptions" :key="item.areaId" :label="item.areaName" :value="item.areaId" />
            </el-select>
          </el-form-item>
          <el-form-item label="一体杆类型" prop="poleType">
            <el-select v-model="addForm.poleType" placeholder="请选择">
              <el-option v-for="item in poleTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button size="mini" @click="closeDialog">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitForm">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getpoleInfoListAPI, addPoleInfoAPI, updatePoleInfoAPI, removePoleInfoAPI } from '@/api/poleInfo'
import { getAreaDropListAPI } from '@/api/area'

export default {
  data() {
    return {
      areaIdOptions: [],
      poleTypeOptions: [
        {
          value: 'entrance',
          label: '入口'
        },
        {
          value: 'export',
          label: '出口'
        }
      ],
      addFormRules: {
        poleName: [{ required: true, message: '一体杆名称不能为空', trigger: 'blur' }],
        poleNumber: [{ required: true, message: '一体杆编号不能为空', trigger: 'blur' }],
        poleIp: [{ required: true, message: '一体杆IP不能为空', trigger: 'blur' }],
        poleType: [{ required: true, message: '一体杆类型不能为空', trigger: 'change' }],
        areaId: [{ required: true, message: '关联地区不能为空', trigger: 'change' }]
      },
      dialogVisible: false,
      addForm: {
        poleName: '',
        poleNumber: '',
        poleIp: '',
        poleType: '',
        areaId: ''
      },
      options: [
        {
          value: null,
          label: '全部'
        },
        {
          value: 0,
          label: '正常'
        },
        {
          value: 1,
          label: '异常'
        }
      ],
      poleInfoList: [],
      params: {
        page: 1,
        pageSize: 10,
        poleName: null,
        poleNumber: null,
        poleStatus: null
      },
      total: 0,
      selectList: [],
      loading: false
    }
  },
  created() {
    this.getpoleInfoList()
    this.getAreaDropList()
  },
  methods: {
    selectionDel() {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const ids = this.selectList.join(',')
        // this.selectList
        if (ids) {
          await removePoleInfoAPI(ids)
          this.getpoleInfoList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        } else {
          this.$message({
            type: 'info',
            message: '请先选需要删除的数据!'
          })
        }
      })
    },
    selectionChange(selection) {
      this.selectList = []
      if (selection.length > 0) {
        selection.forEach(item => {
          this.selectList.push(item.id)
        })
      }
    },
    removePoleInfo(id) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await removePoleInfoAPI(id)
        this.getpoleInfoList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    },
    editPoleInfo(id) {
      const poleInfo = this.poleInfoList.find(item => item.id === id)
      this.addForm = poleInfo
      this.dialogVisible = true
    },
    // 添加一杆体
    submitForm() {
      this.$refs.addForm.validate(async valid => {
        if (!valid) return
        // 校验成功
        // console.log(this.addForm)
        if (this.addForm.id) {
          // 编辑
          const obj = this.addForm
          delete obj.areaName
          delete obj.poleStatus
          await updatePoleInfoAPI(obj)
          this.$message.success('修改成功.')
        } else {
          // 添加
          await addPoleInfoAPI(this.addForm)
          this.$message.success('添加成功.')
        }
        this.getpoleInfoList()
        this.closeDialog()
      })
    },
    async getAreaDropList() {
      const res = await getAreaDropListAPI()
      this.areaIdOptions = res.data
    },
    closeDialog() {
      this.$refs.addForm.resetFields()
      this.addForm = {
        poleName: '',
        poleNumber: '',
        poleIp: '',
        poleType: '',
        areaId: ''
      }
      this.dialogVisible = false
    },
    showPoleType(poleType) {
      switch (poleType) {
        case 'entrance':
          return '入口'
        case 'export':
          return '出口'
        default:
          return '中间'
      }
    },
    showPoleStatus(poleStatus) {
      switch (poleStatus) {
        case 0:
          return '正常'
        case 1:
          return '异常'
        default:
          return '未知'
      }
    },
    searchPoleInfo() {
      this.params.page = 1
      this.getpoleInfoList()
    },
    handleCurrentChange(val) {
      this.params.page = val
      this.getpoleInfoList()
    },
    // 修改自定义序号
    indexMethod(index) {
      return index + 1 + (this.params.page - 1) * this.params.pageSize
    },
    async getpoleInfoList() {
      this.loading = true
      const res = await getpoleInfoListAPI(this.params)
      this.poleInfoList = res.data.rows
      this.total = res.data.total
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.card-container {
  padding: 20px;
  background-color: #fff;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, 0.9);
  padding-bottom: 20px;
  .search-main {
    width: 220px;
    margin-right: 10px;
  }
  .search-btn {
    margin-left: 20px;
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
