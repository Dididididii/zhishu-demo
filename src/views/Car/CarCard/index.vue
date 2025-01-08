<template>
  <div class="card-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <span class="search-label">车牌号码：</span>
      <el-input v-model="params.carNumber" clearable placeholder="请输入内容" class="search-main" />
      <span class="search-label">车主姓名：</span>
      <el-input v-model="params.personName" clearable placeholder="请输入内容" class="search-main" />
      <span class="search-label">状态：</span>
      <el-select v-model="params.cardStatus">
        <el-option v-for="item in statusList" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>
      <el-button type="primary" class="search-btn" @click="queryCardList">查询</el-button>
    </div>
    <!-- 新增删除操作区域 -->
    <div class="create-container">
      <el-button type="primary" @click="$router.push('/car/addcard')">添加月卡</el-button>
      <el-button @click="open">批量删除</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="carList" row-class-name="tablelist" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="序号" :index="indexMethod" />
        <el-table-column label="车主名称" prop="personName" />
        <el-table-column label="联系方式" prop="phoneNumber" />
        <el-table-column label="车牌号码" prop="carNumber" />
        <el-table-column label="车辆品牌" prop="carBrand" />
        <el-table-column label="剩余有效天数" prop="totalEffectiveDate" />
        <!-- <el-table-column label="状态" prop="cardStatus" :formatter="formatStatus" /> -->
        <el-table-column label="状态" prop="cardStatus" :formatter="formatStatus" />
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="scope">
            <el-button size="mini" type="text" @click="$router.push({path:'/car/renewcard',query: {id:scope.row.id}})">续费</el-button>
            <el-button size="mini" type="text">查看</el-button>
            <el-button size="mini" type="text" @click="$router.push({path:'/car/editcard',query: {id:scope.row.id}})">编辑</el-button>
            <el-button size="mini" type="text" @click="open(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
        <template slot="empty">
          <div class="table-empty">
            <slot name="empty">
              <img src="@/assets/empty.svg" alt="notData" style="width: 160px; height: 160px" />
              <!-- <div>暂无内222容</div> -->
            </slot>
          </div>
        </template>
      </el-table>
    </div>
    <div class="page-container">
      <el-pagination
        :current-page="params.page"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 添加楼宇 -->
    <!-- <el-dialog title="添加楼宇" width="580px"> -->
    <!-- 表单接口 -->
    <!-- <div class="form-container">
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
      </div>
      <template #footer>
        <el-button size="mini">取 消</el-button>
        <el-button size="mini" type="primary">确 定</el-button>
      </template>
    </el-dialog>-->
  </div>
</template>

<script>
// 导入 获取月卡列表、删除月卡 API
import { getMonthListAPI, delMonthCardAPI } from '@/api/month'

export default {
  data() {
    return {
      statusList: [
        {
          id: null,
          label: '全部'
        },
        {
          id: 0,
          label: '可用'
        },
        {
          id: 1,
          label: '已过期'
        }
      ],
      carList: [],
      params: {
        page: 1,
        pageSize: 2,
        carNumber: '',
        personName: '',
        cardStatus: null
      },
      total: 0,
      addForm: {
        name: '',
        floors: '',
        area: '',
        propertyFeePrice: ''
      },
      addFormRules: [],
      multipleSelection: []
    }
  },
  created() {
    this.getMonthList()
  },
  methods: {
    // 查询月卡
    queryCardList() {
      this.params.page = 1
      this.getMonthList()
    },
    // 车牌号码校验
    isValidLicensePlate(e) {
      // 使用正则表达式验证车牌号格式
      const regex = /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5,6}$/
      if (e.target.value === '') {
        return
      } else {
        if (regex.test(e.target.value)) {
          console.log('正确')
        } else {
          this.$message.error('车牌号格式不对,请输入正确的格式.')
        }
      }
    },
    // 修改自定义序号
    indexMethod(index) {
      return index + 1 + (this.params.page - 1) * this.params.pageSize
    },
    // 获取月卡列表
    async getMonthList() {
      const res = await getMonthListAPI(this.params)
      this.carList = res.data.rows
      this.total = res.data.total
    },
    // 判断月卡状态
    formatStatus(row) {
      const obj = {
        0: '可用',
        1: '已过期'
      }
      return obj[row.cardStatus]
    },
    // 修改页容量重新渲染
    handleSizeChange(val) {
      this.params.pageSize = val
      this.getMonthList()
    },
    // 修改页数重新渲染
    handleCurrentChange(val) {
      this.params.page = val
      this.getMonthList()
    },
    // 批量选择数据
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 删除月卡
    async delMonthCard(id) {
      // 判断有没有传入id
      if (typeof id === 'number') {
        // 有传入id单点删除按钮
        const res = await delMonthCardAPI(id)
        if (res.code === 10000) {
          this.$message.success('删除成功.')
          // 重新获取月卡
          this.getMonthList()
        } else {
          this.$message.error(res.msg)
        }
      } else {
        // 没传入id 点击批量删除按钮
        if (this.multipleSelection.length > 0) {
          // 将选择存放数据的数组获取所有id
          const reg = this.multipleSelection.map(item => item.id)
          // 将数组所有id转换成 ‘id,id’字符串格式然后调用接口删除数据
          const res = await delMonthCardAPI(reg.join(','))
          if (res.code === 10000) {
            this.$message.success('删除成功.')
            // 重新获取月卡
            this.getMonthList()
          } else {
            this.$message.error(res.msg)
          }
        }
      }
    },
    open(id = null) {
      this.$confirm('是否确定删除月卡', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delMonthCard(id)
      })
    },
    // 跳转到编辑月卡
    editCard(id) {}
  }
}
</script>

<style lang="scss" scoped>
.tablelist {
  background: rgb(244, 246, 248) !important;
}
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
