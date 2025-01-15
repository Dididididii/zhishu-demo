<template>
  <div class="card-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <span class="search-label">一体杆名称：</span>
      <el-input v-model="params.poleName" clearable placeholder="请输入内容" class="search-main" />
      <span class="search-label">一体杆编号：</span>
      <el-input v-model="params.poleNumber" clearable placeholder="请输入内容" class="search-main" />
      <span class="search-label">处置状态：</span>
      <el-select v-model="params.handleStatus">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button type="primary" class="search-btn" @click="searchWarn">查询</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table v-loading="loading" style="width: 100%" :data="warningList">
        <el-table-column type="index" label="序号" />
        <el-table-column label="一体杆名称" prop="poleName" />
        <el-table-column label="一体杆编号" prop="poleNumber" />
        <el-table-column label="故障类型" prop="errorType" />
        <el-table-column label="处置状态" prop="handleStatus">
          <template #default="scope">
            <span>{{ handleStatusList[scope.row.handleStatus] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="警告时间" prop="warningTime" />
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="scope">
            <el-button v-permission="'pole:warning:send'" size="mini" type="text" :disabled="scope.row.handleStatus === 0">派单</el-button>
            <el-button
              v-permission="'pole:warning:query'"
              size="mini"
              type="text"
              @click="$router.push(`/warn/detail?id=${scope.row.id}`)"
            >详情</el-button>
            <el-button
              v-permission="'pole:warning:remove'"
              size="mini"
              type="text"
              :disabled="scope.row.handleStatus === 1"
              @click="delWarning(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-container">
      <el-pagination layout="total, prev, pager, next" :total="total" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import { getWarningListAPI, delWarningAPI } from '@/api/warning'

export default {
  data() {
    return {
      loading: false,
      options: [
        {
          value: null,
          label: '全部 '
        },
        {
          value: 0,
          label: '未派单'
        },
        {
          value: 1,
          label: '已派单'
        },
        {
          value: 2,
          label: '已接单'
        },
        {
          value: 3,
          label: '已完成'
        }
      ],
      handleStatusList: ['未派单', '已派单', '已接单', '已完成'],
      warningList: [],
      params: {
        page: 1,
        pageSize: 10,
        poleName: null,
        poleNumber: null,
        handleStatus: null
      },
      total: 0
    }
  },
  created() {
    this.getWarningList()
  },
  methods: {
    handleCurrentChange(val) {
      this.params.page = val
      this.getWarningList()
    },
    searchWarn() {
      this.params.page = 1
      this.getWarningList()
    },
    async getWarningList() {
      this.loading = true
      const res = await getWarningListAPI(this.params)
      this.warningList = res.data.rows
      this.total = res.data.total
      this.loading = false
    },
    delWarning(id) {
      this.$confirm('此操作将永久删除该警告, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await delWarningAPI(id)
        this.getWarningList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
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
