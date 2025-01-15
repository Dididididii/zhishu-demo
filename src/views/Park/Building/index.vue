<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="search-container" style="margin-bottom: 10px;">
      <div class="search-label">楼宇名称：</div>
      <el-input v-model="params.name" placeholder="请输入内容" class="search-main" clearable />
      <el-button type="primary" @click="searchBuild">查询</el-button>
    </div>
    <el-button v-permission="'park:building:add_edit'" type="primary" @click="addBuilding">添加楼宇</el-button>

    <!-- 表格区域 -->
    <div class="table" style="margin-top: 10px;">
      <el-table v-loading="loading" style="width: 100%" :data="builingList">
        <el-table-column type="index" label="序号" :index="indexMethod" />
        <el-table-column label="楼宇名称" width="180" prop="name" />
        <el-table-column label="层数" prop="floors" />
        <el-table-column label="在管面积(m²)" width="120" prop="area" />
        <el-table-column label="物业费(元/m²)" width="120" prop="propertyFeePrice" />
        <el-table-column label="状态" prop="status">
          <template #default="{row}">
            <span>{{ statusMsg(row.status) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button v-permission="'park:building:add_edit'" size="mini" type="text" @click="updateBilling(scope.row.id)">编辑</el-button>
            <el-button v-permission="'park:building:remove'" size="mini" type="text" @click="delBilling(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pageBox" style="float: right; margin-right: 20px; margin-top: 10px;">
        <el-pagination layout="prev, pager, next" :total="total" @current-change="handleCurrentChange" />
      </div>
      <!-- 添加楼宇 -->
      <!-- 添加楼宇弹框 -->
      <el-dialog :title="addForm.id?'编辑楼宇':'添加楼宇'" :visible="dialogVisible" width="580px" @close="closeDialog">
        <el-form ref="addForm" :model="addForm" :rules="addFormRules">
          <el-form-item label="楼宇名称" prop="name">
            <el-input v-model="addForm.name" />
          </el-form-item>
          <el-form-item label="楼宇层数" prop="floors">
            <el-input v-model="addForm.floors" />
          </el-form-item>
          <el-form-item label="在管面积" prop="area">
            <el-input v-model="addForm.area" />
          </el-form-item>
          <el-form-item label="物业费" prop="propertyFeePrice">
            <el-input v-model="addForm.propertyFeePrice" />
          </el-form-item>
        </el-form>
        <!-- <p v-if="addForm.id">状态</p>
        <el-select v-if="addForm.id" v-model="addForm.status" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>-->
        <template #footer>
          <el-button size="mini" @click="closeDialog">取 消</el-button>
          <el-button size="mini" type="primary" @click="confirmAdd">确 定</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getBuilingListAPI, addBuildingAPI, getBuilingItemAPI, updateBuildingItemAPI, delBuildingItemAPI } from '@/api/building'

export default {
  name: 'Building',
  data() {
    return {
      loading: false,
      options: [
        {
          value: 0,
          label: '空置中'
        },
        {
          value: 1,
          label: '租赁中'
        }
      ],
      addForm: {
        name: '',
        floors: null,
        area: null,
        propertyFeePrice: null
      },
      addFormRules: {
        name: [{ required: true, message: '请输入楼宇名称', trigger: 'blur' }],
        floors: [{ required: true, message: '请输入楼宇层数', trigger: 'blur' }],
        area: [{ required: true, message: '请输入楼宇面积', trigger: 'blur' }],
        propertyFeePrice: [{ required: true, message: '请输入楼宇物业费', trigger: 'blur' }]
      },
      dialogVisible: false,
      builingList: [],
      params: {
        page: 1,
        pageSize: 10,
        name: null
      },
      total: 0
    }
  },
  created() {
    this.getBuilingList()
  },
  methods: {
    // 点击删除
    delBilling(id) {
      this.$confirm('此操作将永久删除该楼宇, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await delBuildingItemAPI(id)
        this.params.page = 1
        this.getBuilingList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    },
    // 点击编辑
    async updateBilling(id) {
      const res = await getBuilingItemAPI(id)
      this.addForm = res.data
      this.dialogVisible = true
    },
    // 添加/编辑楼宇按钮
    confirmAdd() {
      this.$refs.addForm.validate(async valid => {
        if (!valid) return
        // 校验成功 添加/编辑楼宇
        if (this.addForm.id) {
          // 修改
          const obj = this.addForm
          // delete obj.area
          delete obj.createBy
          delete obj.createTime
          delete obj.delFlag
          delete obj.remark
          delete obj.status
          delete obj.updateBy
          delete obj.updateTime
          // console.log(obj)
          await updateBuildingItemAPI(obj)
          this.$message.success('修改成功.')
        } else {
          // 添加
          await addBuildingAPI(this.addForm)
          this.$message.success('添加成功.')
        }
        this.params.page = 1
        this.getBuilingList()
        this.closeDialog()
      })
    },
    // 关闭弹窗
    closeDialog() {
      this.$refs.addForm.resetFields()
      this.dialogVisible = false
    },
    // 添加楼宇
    addBuilding() {
      this.dialogVisible = true
    },
    // 查询楼宇
    searchBuild() {
      this.params.page = 1
      this.getBuilingList()
      //
      // this.this.builingList = []
      // this.getBuilingList()
    },
    // 修改页数时触发
    handleCurrentChange(val) {
      this.params.page = val
      this.getBuilingList()
    },
    // 修改自定义序号
    indexMethod(index) {
      return index + 1 + (this.params.page - 1) * this.params.pageSize
    },
    statusMsg(val) {
      const msg = ['空置中', '租赁中']
      return msg[val]
    },
    async getBuilingList() {
      this.loading = true
      const res = await getBuilingListAPI(this.params)
      this.builingList = res.data.rows
      this.total = res.data.total
      this.loading = false
    }
  }
}
</script>

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
</style>
