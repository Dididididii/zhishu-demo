<template>
  <div class="card-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <span class="search-label">车牌号码：</span>
      <el-input v-model="params.carNumber" clearable placeholder="请输入内容" class="search-main" />
      <span class="search-label">缴纳状态：</span>
      <el-select v-model="params.paymentStatus">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button type="primary" class="search-btn" @click="searchPayment">查询</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table v-loading="loading" style="width: 100%" :data="paymentList">
        <el-table-column type="index" label="序号" :index="indexMethod" />
        <el-table-column label="车牌号码" prop="carNumber" />
        <el-table-column label="收费类型" prop="chargeType">
          <template slot-scope="scope">
            <el-tag>{{ showChargeType(scope.row.chargeType) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="停车总时长" prop="parkingTime" />
        <el-table-column label="缴纳费用(元)" prop="actualCharge" />
        <el-table-column label="缴纳状态" prop="paymentStatus">
          <template slot-scope="scope">
            <el-tag type="warning">{{ showPaymentStatus(scope.row.paymentStatus) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="缴纳方式" prop="paymentMethod">
          <template slot-scope="scope">{{ showPaymentMethod(scope.row.paymentMethod) }}</template>
        </el-table-column>
        <el-table-column label="缴纳时间" prop="paymentTime" />
      </el-table>
    </div>
    <div class="page-container">
      <el-pagination layout="total, prev, pager, next" :total="total" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import { getPaymentListAPI } from '@/api/payment'

export default {
  data() {
    return {
      options: [
        {
          value: null,
          label: '全部'
        },
        {
          value: 0,
          label: '待缴纳'
        },
        {
          value: 1,
          label: '已缴纳'
        }
      ],
      paymentList: [],
      params: {
        page: 1,
        pageSize: 10,
        carNumber: null,
        paymentStatus: null
      },
      total: 0,
      loading: false
    }
  },
  created() {
    this.getPaymentList()
  },
  methods: {
    // 查询
    searchPayment() {
      this.params.page = 1
      this.getPaymentList()
    },
    // 显示支付方式
    showPaymentMethod(paymentMethod) {
      switch (paymentMethod) {
        case 'Cash':
          return '线下支付'
        case 'Alipay':
          return '支付宝'
        case 'WeChat':
          return '微信'
        default:
          return '--'
      }
    },
    // 显示收费状态
    showPaymentStatus(paymentStatus) {
      switch (paymentStatus) {
        case 0:
          return '未缴纳'
        case 1:
          return '已缴纳'
        default:
          return '不明状态'
      }
    },
    // 显示收费类型
    showChargeType(chargetype) {
      switch (chargetype) {
        case 'card':
          return '月卡'
        case 'temp':
          return '临时停车'
        default:
          return '不明卡类'
      }
    },
    // 修改自定义序号
    indexMethod(index) {
      return index + 1 + (this.params.page - 1) * this.params.pageSize
    },
    // 修改页数时触发
    handleCurrentChange(val) {
      this.params.page = val
      this.getPaymentList()
    },
    async getPaymentList() {
      this.loading = true
      const res = await getPaymentListAPI(this.params)
      this.paymentList = res.data.rows
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
