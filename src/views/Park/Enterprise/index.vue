<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">企业名称：</div>
      <el-input v-model="params.name" clearable placeholder="请输入内容" class="search-main" />
      <el-button type="primary" @click="searchEnterprise">查询</el-button>
    </div>
    <div class="create-container">
      <el-button type="primary" @click="$router.push({path:'/enterprise/add'})">添加企业</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="enterpriseList">
        <el-table-column type="index" label="序号" :index="indexMethod" />
        <el-table-column label="企业名称" width="320" prop="name" />
        <el-table-column label="联系人" prop="contact" />
        <el-table-column label="联系电话" prop="contactNumber" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="mini" type="text">添加合同</el-button>
            <el-button size="mini" type="text">查看</el-button>
            <el-button size="mini" type="text" @click="$router.push({path:'/enterprise/edit',query:{id:scope.row.id}})">编辑</el-button>
            <el-button size="mini" type="text" @click="removeEnterprise(scope.row.id)">删除</el-button>
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
// 导入获取 企业管理列表 删除企业接口
import { getEnterpriseListAPI, delEnterpriseAPI } from '@/api/enterprise'

export default {
  name: 'Building',
  data() {
    return {
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
    // 调用接口获取企业管理列表数据
    async getEnterpriseList() {
      const res = await getEnterpriseListAPI(this.params)
      this.enterpriseList = res.data.rows
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
    }
  }
}
</script>

