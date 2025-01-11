<template>
  <div class="rule-container">
    <div class="create-container">
      <el-button type="primary" @click="openCard(null,'add')">增加停车计费规则</el-button>
      <el-button @click="exportExcel">导出Excel</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table :data="billingRuleList" style="width: 100%">
        <el-table-column label="序号" type="index" :index="indexMethod" />
        <el-table-column label="计费规则编号" prop="ruleNumber" />
        <el-table-column label="计费规则名称" prop="ruleName" />
        <el-table-column label="免费时长(分钟)" prop="freeDuration" />
        <el-table-column label="收费上线(元)" prop="chargeCeiling">
          <template #default="scope">
            <span>{{ scope.row.chargeCeiling ? scope.row.chargeCeiling : '--' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="计费方式" prop="chargeType">
          <template #default="scope">
            <span>{{ convertType(scope.row.chargeType) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="计费规则" prop="ruleNameView" />
        <el-table-column label="操作" fixed="right" width="120">
          <template #default="scope">
            <el-button size="mini" type="text" @click="openCard(scope.row.id,'edit')">编辑</el-button>
            <el-button size="mini" type="text" @click="delBillingRuleList(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <div class="pageBox">
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
    <!-- 弹窗区域 -->
    <AddRule ref="child" :dialog-visible="dialogVisible" @offdialogVisible="offdialogVisible" />
  </div>
</template>

<script>
// 导入 查看计费规则列表 删除计费规则 接口
import { getbillingRuleListAPI, delBillingRuleListAPI } from '@/api/billingRule'
// 导入创建导出Excel文档插件
import { utils, writeFileXLSX } from 'xlsx'
// 导入组件
import AddRule from './component/AddRule.vue'

export default {
  name: 'Building',
  components: { AddRule },
  data() {
    return {
      dialogVisible: false,
      params: {
        page: 1,
        pageSize: 2
      },
      billingRuleList: [],
      total: 0
    }
  },
  created() {
    this.getbillingRuleList()
  },
  methods: {
    // 点击删除
    delBillingRuleList(id) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await delBillingRuleListAPI(id)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getbillingRuleList()
      })
    },
    // 关闭窗口时返回的数据
    offdialogVisible(bool) {
      if (bool) {
        // 如果子组件是发送数据之后关闭窗口则执行以下
        this.getbillingRuleList()
      }
      this.dialogVisible = false
    },
    // 打开弹窗
    openCard(id, type) {
      this.dialogVisible = true
      this.$refs.child.editItem(id, type)
    },
    // 关闭弹窗
    handleClose() {
      this.dialogVisible = false
    },
    // 页码改变
    handleCurrentChange(page) {
      this.params.page = page
      this.getbillingRuleList()
    },
    // 每页条数改变
    handleSizeChange(size) {
      this.params.pageSize = size
      this.getbillingRuleList()
    },
    // 计费方式转换
    // 计费方式转换
    convertType(type) {
      if (type === 'duration') return '时长收费'
      if (type === 'turn') return '按次收费'
      if (type === 'partition') return '分段收费'
    },
    // 导出excel方法
    async exportExcel() {
      // 第一种方式
      // const list = []
      // this.billingRuleList.forEach((item, index) => {
      //   list.push({
      //     indx: index + 1,
      //     ruleNumber: item.ruleNumber,
      //     ruleName: item.ruleName,
      //     freeDuration: item.freeDuration,
      //     chargeCeiling: item.chargeCeiling ? item.chargeCeiling : 0,
      //     chargeType: this.convertType(item.chargeType),
      //     ruleNameView: item.ruleNameView
      //   })
      // })

      // 第二种
      // 获取要导出的业务数据
      const res = await getbillingRuleListAPI(this.params)
      // 表头英文字段key
      const tableHeaderKeys = ['ruleNumber', 'ruleName', 'freeDuration', 'chargeCeiling', 'chargeType', 'ruleNameView']
      // 表头中文字段value
      const tableHeaderValues = ['计费规则编号', '计费规则名称', '免费时长(分钟)', '收费上线(元)', '计费方式', '计费规则']
      // 以excel表格的顺序调整后端数据
      const sheetData = res.data.rows.map(item => {
        const obj = {}
        tableHeaderKeys.forEach(key => {
          if (key === 'chargeType') {
            obj[key] = this.convertType(item[key])
          } else {
            obj[key] = item[key]
          }
        })
        return obj
      })
      // 创建一个新的工作簿
      const workbook = utils.book_new()
      // 创建一个工作表 要求一个对象数组格式
      const worksheet = utils.json_to_sheet(sheetData)

      // 把工作表添加到工作簿  Data为工作表名称
      utils.book_append_sheet(workbook, worksheet, 'Data')
      // 改写表头
      utils.sheet_add_aoa(worksheet, [tableHeaderValues], {
        origin: 'A1'
      })
      // 导出方法进行导出
      writeFileXLSX(workbook, 'SheetJSVueAoO.xlsx')
    },
    // 修改自定义序号
    indexMethod(index) {
      return index + 1 + (this.params.page - 1) * this.params.pageSize
    },
    // 查看计费规则列表方法
    async getbillingRuleList() {
      const res = await getbillingRuleListAPI(this.params)
      this.billingRuleList = res.data.rows
      this.total = res.data.total
    },
    // 页条改变
    handleSizeChange(val) {
      this.params.pageSize = val
      this.getbillingRuleList()
    },
    // 页数改变
    handleCurrentChange(val) {
      this.params.page = val
      this.getbillingRuleList()
    }
  }
}
</script>

<style lang="scss" scoped>
.pageBox {
  margin-top: 10px;
  float: right;
  margin-right: 20px;
}
.rule-container {
  padding: 20px;
  background-color: #fff;
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
</style>
