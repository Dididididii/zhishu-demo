<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">企业名称：</div>
      <el-input v-model="params.name" clearable placeholder="请输入内容" class="search-main" />
      <el-button type="primary" @click="searchEnterprise">查询</el-button>
    </div>
    <div class="create-container">
      <el-button v-permission="'park:enterprise:add_edit'" type="primary" @click="$router.push({path:'/enterprise/add'})">添加企业</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="enterpriseList" @expand-change="onabortEnterprise">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table :data="props.row.renList">
              <el-table-column label="租赁楼宇" width="320" prop="buildingName" />
              <el-table-column label="租赁起始时间" prop="startTime">
                <template #default="scope">
                  <span>{{ `${scope.row.startTime}至${scope.row.endTime}` }}</span>
                </template>
              </el-table-column>
              <el-table-column label="合同状态" prop="status">
                <template #default="scope">
                  <el-tag :type="formatInfoType(scope.row.status)">{{ formartStatus(scope.row.status) }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180">
                <template #default="scope">
                  <el-button
                    v-permission="'park:rent:add_surrender'"
                    size="mini"
                    type="text"
                    :disabled="scope.row.status ===3"
                    @click="surrenderTenancy(scope.row)"
                  >退租</el-button>
                  <el-button
                    v-permission="'park:rent:remove'"
                    size="mini"
                    type="text"
                    :disabled="scope.row.status !==3"
                    @click="delTenancy(scope.row)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" :index="indexMethod" />
        <el-table-column label="企业名称" width="320" prop="name" />
        <el-table-column label="联系人" prop="contact" />
        <el-table-column label="联系电话" prop="contactNumber" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button v-permission="'park:rent:add_surrender'" size="mini" type="text" @click="openDialog(scope.row.id)">添加合同</el-button>
            <el-button
              v-permission="'park:enterprise:query'"
              size="mini"
              type="text"
              @click="$router.push({path:'/enterprise/see',query:{id:scope.row.id}})"
            >查看</el-button>
            <el-button
              v-permission="'park:enterprise:add_edit'"
              size="mini"
              type="text"
              @click="$router.push({path:'/enterprise/edit',query:{id:scope.row.id}})"
            >编辑</el-button>
            <el-button v-permission="'park:enterprise:remove'" size="mini" type="text" @click="removeEnterprise(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-container">
      <el-pagination
        :page-sizes="[2, 4, 6, 8]"
        :page-size="2"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog title="添加合同" :visible="rentDialogVisible" width="580px" destroy-on-close @close="closeDialog">
      <!-- 表单区域 -->
      <div class="form-container">
        <el-form ref="addForm" :model="rentForm" :rules="rentRules" label-position="top">
          <el-form-item label="租赁楼宇" prop="buildingId">
            <el-select v-model="rentForm.buildingId" placeholder="请选择">
              <el-option v-for="item in renList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="租赁起止日期" prop="rentTime">
            <el-date-picker
              v-model="rentForm.rentTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
            />
          </el-form-item>
          <el-form-item label="租赁合同" prop="contractId">
            <el-upload
              :file-list="fileList"
              action="#"
              :limit="1"
              :before-upload="beforeUpload"
              :http-request="loadWPS"
              :on-remove="onRemove"
            >
              <el-button size="small" type="primary" plain>上传合同文件</el-button>
              <div slot="tip" class="el-upload__tip">支持扩展名：.doc .docx .pdf, 文件大小不超过5M</div>
            </el-upload>
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

<style lang="scss" scoped>
.department-container {
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

<script>
// 导入获取 企业管理列表 删除企业 添加/续租企业的租赁合同 企业租赁信息列表-展开查看 退租租赁合同 删除合同接口
import {
  getEnterpriseListAPI,
  delEnterpriseAPI,
  addEnterpriseRentAPI,
  onabortEnterpriseAPI,
  surrenderTenancyAPI,
  delTenancyAPI
} from '@/api/enterprise'
// 导入查询可租赁楼宇接口 searchBuildingAPI
import { searchBuildingAPI } from '@/api/ren'
// 导入上传接口
import { uploadAPI } from '@/api/commit'

export default {
  name: 'Building',
  data() {
    return {
      fileList: [],
      //   日期选择器设置从今天开始选
      pickerOptions: {
        disabledDate(time) {
          // 获取今天的日期
          const today = new Date()
          // 设置时间为00:00:00
          today.setHours(0, 0, 0, 0)
          // 返回小于今天日期的时间为true，即这些时间会被禁用
          return time.getTime() < today.getTime()
        }
      },
      renList: [],
      rentRules: {
        buildingId: [{ required: true, message: '请选择租赁楼宇', trigger: 'change' }],
        rentTime: [{ type: 'array', required: true, message: '请选择租赁起止日期', trigger: 'change' }],
        contractId: [{ required: true, message: '请上传租赁合同', trigger: 'blur' }]
      },
      rentForm: {
        buildingId: '',
        rentTime: '',
        contractId: null,
        type: '0',
        enterpriseId: null,
        contractUrl: '',
        startTime: '',
        endTime: ''
      },
      rentDialogVisible: false,
      enterpriseList: [], // 企业列表
      params: {
        name: null, // 企业名称
        page: 1, // 当前页
        pageSize: 2 // 每页条数
      },
      total: 0 // 总条数
    }
  },
  created() {
    this.getEnterpriseList()
  },
  methods: {
    // 删除合同
    delTenancy(row) {
      this.$confirm('确定要删除该合同吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await delTenancyAPI(row.id)
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.getEnterpriseList()
        // this.enterpriseList.forEach(item => {
        //   item.renList.find((val, index) => {
        //     if (val.id === row.id) {
        //       item.renList.splice(index, 1)
        //       // console.log(item)
        //     }
        //   })
        // })
        // console.log(this.enterpriseList.map(item => item.id === row.id))
        // this.enterpriseList.
        // console.log(row)
      })
    },
    // 退租
    surrenderTenancy(row) {
      this.$confirm('确定要退租吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await surrenderTenancyAPI(row.id)
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        // eslint-disable-next-line require-atomic-updates
        // row.status = 3
        this.getEnterpriseList()
      })
    },
    // 格式化tag类型
    formatInfoType(status) {
      const MAP = {
        0: 'warning',
        1: 'success',
        2: 'info',
        3: 'danger'
      }
      // return 格式化之后的中文显示
      return MAP[status]
    },
    // 格式化status
    formartStatus(type) {
      const TYPEMAP = {
        0: '待生效',
        1: '生效中',
        2: '已到期',
        3: '已退租'
      }
      return TYPEMAP[type]
    },
    // 展开表格发送请求
    async onabortEnterprise(row, expandedRows) {
      const isOpen = expandedRows.find(item => item.id === row.id)
      if (isOpen) {
        // const test = this.enterpriseList.find(item => item.id === row.id)
        const res = await onabortEnterpriseAPI(row.id)
        // eslint-disable-next-line require-atomic-updates
        row.renList = res.data

        // if (test) {
        //   const res = await onabortEnterpriseAPI(row.id)
        //   // this.onabortList.push()
        //   test.rows = res.data
        // }
        // console.log(row, expandedRows)
      }

      // const res = await onabortEnterpriseAPI(row.id)
      // // this.onabortList.push()
      // test[0].rows = res.data
      // console.log(test)
    },
    // 关闭合同窗口
    closeDialog() {
      this.rentDialogVisible = false
      this.$refs.addForm.resetFields()
      this.rentForm.contractUrl = ''
      this.rentForm.startTime = ''
      this.rentForm.endTime = ''
      this.rentForm.enterpriseId = null
    },
    // 调用接口获取企业管理列表数据
    async getEnterpriseList() {
      const res = await getEnterpriseListAPI(this.params)
      this.enterpriseList = res.data.rows.map(item => {
        return {
          ...item,
          renList: []
        }
      })
      this.total = res.data.total
    },
    // 页面数量改变
    handleSizeChange(i) {
      this.params.pageSize = i
      this.getEnterpriseList()
    },
    // 页面改变
    handleCurrentChange(i) {
      this.params.page = i
      this.getEnterpriseList()
    },
    // 修改自定义序号
    indexMethod(index) {
      return index + 1 + (this.params.page - 1) * this.params.pageSize
    },
    // 查询企业
    searchEnterprise() {
      this.params.page = 1
      this.getEnterpriseList()
    },
    // 删除企业
    removeEnterprise(id) {
      this.$confirm('是否确认删除当前企业?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await delEnterpriseAPI(id)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getEnterpriseList()
      })
    },
    // 打开合同窗口，顺便获取楼宇请求
    async openDialog(id) {
      this.rentForm.enterpriseId = id
      this.rentDialogVisible = true
      const res = await searchBuildingAPI()
      this.renList = res.data
    },
    // 提交合同
    submitForm() {
      this.$refs.addForm.validate(async valid => {
        if (!valid) return false
        // 校验通过
        this.rentForm.startTime = this.rentForm.rentTime[0]
        this.rentForm.endTime = this.rentForm.rentTime[1]
        delete this.rentForm.rentTime
        await addEnterpriseRentAPI(this.rentForm)
        this.$message.success('合同添加成功.')
        this.closeDialog()
        this.getEnterpriseList()
      })
    },
    // 上传文件前的处理
    beforeUpload(file) {
      const allowedTypes = [
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/pdf'
      ]
      const isAllowed = allowedTypes.includes(file.type)
      const isLt2M = file.size / 1024 / 1024 < 5 // 这里可以根据需要设置文件大小限制

      if (!isAllowed) {
        this.$message.error('只能上传.doc/.docx/.pdf文件!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 10MB!')
        return false
      }
      return true
    },
    // 上传好文件后的操作
    async loadWPS({ file }) {
      const fromData = new FormData()
      fromData.append('file', file)
      fromData.append('type', '2')
      const res = await uploadAPI(fromData)
      // console.log(res)
      this.rentForm.contractId = res.data.id
      this.rentForm.contractUrl = res.data.url
    },
    // 删除文件时的校验
    onRemove() {
      this.rentForm.contractId = null
      this.rentForm.contractUrl = ''
      this.$refs.addForm.validateField('contractId')
    }
  }
}
</script>

