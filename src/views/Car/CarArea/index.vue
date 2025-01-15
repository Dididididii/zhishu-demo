<template>
  <div class="building-container">
    <!-- 创建区域 -->
    <div class="add-container">
      <el-button v-permission="'parking:area:add_edit'" type="primary" @click="addArea">添加区域</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table v-loading="loading" style="width: 100%" :data="areaList">
        <el-table-column type="index" label="序号" width="100" :index="indexMethod" />
        <el-table-column label="区域名称" width="250" prop="areaName" />
        <el-table-column label="车位数(个)" width="150" prop="spaceNumber" />
        <el-table-column label="面积(m²)" width="150" prop="areaProportion" />
        <el-table-column label="计费规则" width="250" prop="ruleName">
          <template #default="scope">
            <el-dropdown>
              <span>{{ scope.row.ruleName ? scope.row.ruleName : ruleNameRule[scope.row.ruleId].label }}</span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item disabled>{{ showDropText(scope.row.ruleId) }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button v-permission="'parking:area:add_edit'" size="mini" type="text" @click="updateArea(scope.row.id)">编辑</el-button>
            <el-button v-permission="'parking:area:remove'" size="mini" type="text" @click="delArea(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pageBox" style="float: right; margin-right: 20px; margin-top: 10px;">
        <el-pagination layout="prev, pager, next" :total="total" @current-change="handleCurrentChange" />
      </div>
      <!-- 添加/编辑区域 -->
      <el-dialog :title="addForm.id?'编辑区域':'添加区域'" :visible="dialogVisible" width="580px" @close="closeDialog">
        <!-- 表单接口 -->
        <div class="form-container">
          <el-form ref="addFrom" :model="addForm" :rules="addFormRules">
            <el-form-item label="区域名称" prop="areaName">
              <el-input v-model="addForm.areaName" />
            </el-form-item>
            <el-form-item label="车位数（个）" prop="spaceNumber">
              <el-input v-model="addForm.spaceNumber" />
            </el-form-item>
            <el-form-item label="面积（㎡）" prop="areaProportion">
              <el-input v-model="addForm.areaProportion" />
            </el-form-item>
            <el-form-item label="关联计费规则" prop="ruleId">
              <br />
              <el-select v-model="addForm.ruleId" placeholder="请选择">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="addForm.remark" type="textarea" />
            </el-form-item>
          </el-form>
        </div>
        <template #footer>
          <el-button size="mini" @click="closeDialog">取 消</el-button>
          <el-button size="mini" type="primary" @click="submitForm">确 定</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getAreaListAPI, addAreaAPI, getAreaDropListAPI, updateAreaDropAPI, delAreaAPI } from '@/api/area'

export default {
  name: 'Building',
  data() {
    return {
      ruleNameRule: {
        0: {
          label: '分段计费',
          text: '收费上限:200元;免费时长:15分钟;2小时内每小时收费6元,每增加1小时,增加2元'
        },
        1: {
          label: '按次收费',
          text: '免费时长:15分钟;每次10元'
        },
        2: {
          label: '按小时计费',
          text: '收费上限:200元;免费时长:30分钟;每1小时6元'
        },
        3: {
          label: '按分钟计费',
          text: '收费上限:200元;免费时长:15分钟;每30分钟5元'
        }
      }, // ['分段收费', '按次收费', '按小时计费', '按分钟计费'],
      options: [
        {
          value: 0,
          label: '分段计费'
        },
        {
          value: 1,
          label: '按次收费'
        },
        {
          value: 2,
          label: '按小时计费'
        },
        {
          value: 3,
          label: '按分钟计费'
        }
      ],
      addForm: {
        areaName: '',
        spaceNumber: null,
        areaProportion: null,
        ruleId: null,
        remark: null
      },
      addFormRules: {
        areaName: [{ required: true, message: '请输入区域名称', trigger: 'blur' }],
        spaceNumber: [{ required: true, message: '请输入车位数', trigger: 'blur' }],
        areaProportion: [{ required: true, message: '请输入面积', trigger: 'blur' }],
        ruleId: [{ required: true, message: '请选择关联计费规则', trigger: 'change' }],
        remark: [{ required: true, message: '请输入备注', trigger: 'blur' }]
      },
      areaList: [],
      loading: false,
      params: {
        page: 1,
        pageSize: 10
      },
      total: 0,
      dialogVisible: false
    }
  },
  created() {
    this.getAreaList()
    // this.getAreaDropList()
  },
  methods: {
    // 删除区域
    delArea(id) {
      this.$confirm('此操作将永久删除该区域, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await delAreaAPI(id)
        this.getAreaList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    },
    // 编辑区域
    updateArea(id) {
      const area = this.areaList.find(item => item.id === id)
      this.addForm = area
      this.dialogVisible = true
      // console.log(area)
    },
    // 显示收费规则
    showDropText(id) {
      if (this.ruleNameRule[id]) {
        return this.ruleNameRule[id].text
      } else {
        // this.ruleNameRule[id]
        return '收费上限:200元;免费时长:15分钟;2小时内每小时收费6元,每增加1小时,增加2元'
      }
      // console.log(this.ruleNameRule[id])
    },
    // 点击添加/编辑确定按钮
    submitForm() {
      this.$refs.addFrom.validate(async valid => {
        if (!valid) return
        // 校验通过
        if (this.addForm.id) {
          // 编辑
          const obj = this.addForm
          delete obj.ruleName
          delete obj.hoverRuleName
          await updateAreaDropAPI(obj)
          this.$message.success('修改成功.')
        } else {
          // 添加
          await addAreaAPI(this.addForm)
          this.$message.success('添加成功.')
        }
        this.getAreaList()
        this.closeDialog()
      })
    },
    // 关闭弹窗
    closeDialog() {
      this.$refs.addFrom.resetFields()
      this.addForm = {
        areaName: '',
        spaceNumber: null,
        areaProportion: null,
        ruleId: null,
        remark: null
      }
      this.dialogVisible = false
    },
    // 添加区域
    addArea() {
      this.dialogVisible = true
    },
    // 修改页数时触发
    handleCurrentChange(val) {
      this.params.page = val
      this.getAreaList()
    },
    // 修改自定义序号
    indexMethod(index) {
      return index + 1 + (this.params.page - 1) * this.params.pageSize
    },
    async getAreaList() {
      this.loading = true
      const res = await getAreaListAPI(this.params)
      this.areaList = res.data.rows
      this.total = res.data.total
      this.loading = false
    },
    async getAreaDropList() {
      const res = await getAreaDropListAPI()
      console.log(res)

      // this.options = res.data.map(item => ({ value: item.id, label: item.name }))
    }
  }
}
</script>

<style lang="scss" scoped>
.department-container {
  padding: 10px;
}
.add-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, 0.9);
  padding-bottom: 20px;
}
</style>
