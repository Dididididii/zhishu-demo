<template>
  <div class="AddRuleBox">
    <!-- 弹框 -->
    <el-dialog :visible="dialogVisible" width="680px" :title="type === 'add' ? '新增规则':'编辑规则'" destroy-on-close :before-close="beforeClose">
      <!-- 表单接口 -->
      <div class="form-container">
        <el-form ref="addForm" :model="addForm" :rules="addFormRules" label-position="top">
          <el-form-item label="计费规则编号" prop="ruleNumber">
            <el-input v-model="addForm.ruleNumber" />
          </el-form-item>
          <el-form-item label="计费规则名称" prop="ruleName">
            <el-input v-model="addForm.ruleName" />
          </el-form-item>
          <el-form-item label="计费方式" prop="chargeType">
            <el-radio-group v-model="addForm.chargeType" size="small">
              <el-radio label="duration" border>时长收费</el-radio>
              <el-radio label="turn" border>按次收费</el-radio>
              <el-radio label="partition" border>分段收费</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="flex-container" style="display:flex;justify-content:space-between">
            <el-form-item label="免费时长">
              <el-input v-model="addForm.freeDuration" />
            </el-form-item>
            <el-form-item label="收费上限">
              <el-input v-model="addForm.chargeCeiling" />
            </el-form-item>
          </div>
          <el-form-item label="计费规则">
            <!-- 按时长收费区域 -->
            <div v-if="addForm.chargeType === 'duration'" class="duration" style="display:flex">
              每
              <el-input v-model="addForm.durationTime" class="input-box" type="number" min="0" style="width: 280px; margin-right: 10px;" />
              <el-select v-model="addForm.durationType" placeholder="请选择" style="width: 280px; margin-right: 10px;">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
              <el-input v-model="addForm.durationPrice" class="input-box" style="width: 280px; margin-right: 10px;" />元
            </div>
            <!-- 按次收费区域 -->
            <div v-if="addForm.chargeType === 'turn'" class="turn" style="display:flex">
              每次
              <el-input v-model="addForm.turnPrice" class="input-box" style="width:150px" />元
            </div>
            <!-- 按分段收费区域 -->
            <div v-if="addForm.chargeType === 'partition'" class="partition">
              <div class="item" style="display:flex">
                <el-input v-model="addForm.partitionFrameTime" class="input-box" style="width:100px" />小时内,每小时收费
                <el-input v-model="addForm.partitionFramePrice" class="input-box" style="width:100px" />元
              </div>
              <div class="item" style="display:flex;margin:30px auto 0">
                每增加
                <el-input v-model="addForm.partitionIncreaseTime" class="input-box" style="width:120px;" />小时,增加
                <el-input v-model="addForm.partitionIncreasePrice" class="input-box" style="width:120px;" />元
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button size="mini" @click="beforeClose">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitForm">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
// 导入添加计费规则 查看计费规则详情 编辑计费规则接口
import { addBillingRuleListAPI, searchBillingRuleItemAPI, updateBillingRuleAPI } from '@/api/billingRule'

export default {
  // 控制弹层的隐藏和显示
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      type: 'add',
      boolList: false,
      options: [
        {
          value: 'hour',
          label: '小时'
        },
        {
          value: 'minute',
          label: '分钟'
        }
      ],
      addForm: {
        ruleNumber: '', // 计费规则编号
        ruleName: '', // 计费规则名称
        chargeType: 'duration', // 计费规则类型 duration / turn / partition
        chargeCeiling: null,
        freeDuration: null,
        // 时长计费独有字段
        durationTime: null, // 时长计费单位时间
        durationPrice: null, // 时长计费单位价格
        durationType: 'hour',
        // 按次收费独有字段
        turnPrice: null,
        // 分段计费独有字段
        partitionFrameTime: null, // 段内时间
        partitionFramePrice: null, // 段内费用
        partitionIncreaseTime: null, // 超出时间
        partitionIncreasePrice: null // 超出费为收费价钱
      }, // 计费规则表单对象
      addFormRules: {
        ruleNumber: [{ required: true, message: '请输入规则编号', trigger: 'blur' }],
        ruleName: [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
        chargeType: [{ required: true, message: '请选择收费类型', trigger: 'blur' }]
      } // 计费规则校验规则对象
    }
  },
  methods: {
    // 父组件调用子组件方法
    async editItem(id, type) {
      this.type = type
      if (id) {
        const res = await searchBillingRuleItemAPI(id)
        this.addForm = res.data
        // console.log(res.data)
      }
    },
    // 关闭窗口
    beforeClose() {
      this.$refs.addForm.resetFields()
      this.$emit('offdialogVisible', this.boolList)
      this.addForm = {
        chargeCeiling: null,
        chargeType: 'duration',
        durationPrice: null,
        durationTime: null,
        durationType: 'hour',
        freeDuration: null,
        partitionFramePrice: null,
        partitionFrameTime: null,
        partitionIncreasePrice: null,
        partitionIncreaseTime: null,
        ruleName: '',
        ruleNumber: '',
        turnPrice: null
      }
    },
    // 点击提交
    submitForm() {
      this.$refs.addForm.validate(async valid => {
        if (!valid) return
        // 调用添加计费规则接口
        if (this.type === 'add') {
          await addBillingRuleListAPI(this.addForm)
          this.$message.success('添加成功.')
        } else {
          // 编辑计费规则接口
          await updateBillingRuleAPI(this.addForm)
          delete this.addForm.id
          this.$message.success('修改成功.')
        }
        this.boolList = true
        this.beforeClose()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.form-container {
  padding: 0px 80px;
}
</style>
