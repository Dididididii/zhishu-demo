<template>
  <div class="add-card">
    <header class="add-header">
      <el-page-header content="月卡续费" @back="$router.back()" />
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">车辆信息</div>
        <div class="form">
          <el-form ref="fromInfo1" label-width="100px" :model="formData1" :rules="rules1">
            <el-form-item label="车主姓名" prop="personName">
              <el-input v-model="formData1.personName" :disabled="true" />
            </el-form-item>
            <el-form-item label="联系方式" prop="phoneNumber">
              <el-input v-model="formData1.phoneNumber" :disabled="true" />
            </el-form-item>
            <el-form-item label="车辆号码" prop="carNumber">
              <el-input v-model="formData1.carNumber" :disabled="true" />
            </el-form-item>
            <el-form-item label="车辆品牌" prop="carBrand">
              <el-input v-model="formData1.carBrand" :disabled="true" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="form-container">
        <div class="title">最新一次月卡缴费信息</div>
        <div class="form">
          <el-form ref="fromInfo2" label-width="100px" :rules="rules2" :model="formData2">
            <el-form-item label="有效日期" prop="payTime">
              <el-date-picker
                v-model="formData2.payTime"
                :default-value="formatDate(new Date(), 'YY-MM-DD')"
                type="daterange"
                :start-placeholder="formatDate(new Date(), 'YY-MM-DD')"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions"
                unlink-panels
              >
                <template v-slot:range-separator>
                  <i class="el-icon-sort-down" style="transform: rotateY(180deg) rotate(90deg);" />
                  <!-- 这里使用了 Element UI 的箭头图标 -->
                </template>
              </el-date-picker>
            </el-form-item>
            <el-form-item label="支付金额" prop="paymentAmount">
              <el-input v-model="formData2.paymentAmount" />
            </el-form-item>
            <el-form-item label="支付方式" prop="paymentMethod">
              <el-select v-model="formData2.paymentMethod" placeholder="请选择支付方式">
                <el-option v-for="item in pay" :key="item.industryCode" :value="item.industryCode" :label="item.industryName" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </main>
    <footer class="add-footer">
      <div class="btn-container">
        <el-button @click="resetForm">重置</el-button>
        <el-button type="primary" @click="onSubmit">确定</el-button>
      </div>
    </footer>
  </div>
</template>

<script>
// 导入 续费月卡信息接口 获取月卡详情 接口
import { getMonthItemAPI, renewMonthItemAPI } from '@/api/month'

export default {
  data() {
    return {
      formData1: {
        personName: '',
        phoneNumber: '',
        carNumber: '',
        carBrand: ''
      },
      formData2: {
        payTime: '',
        paymentAmount: '',
        paymentMethod: ''
      },
      cardInfor: {
        carInfoId: 0
      },
      pay: [
        {
          industryCode: 'Alipay',
          industryName: '支付宝'
        },
        {
          industryCode: 'WeChat',
          industryName: '微信'
        },
        {
          industryCode: 'Cash',
          industryName: '现金支付'
        }
      ],
      //   日期选择器设置从今天开始选
      pickerOptions: {
        disabledDate(time) {
          // 获取今天的日期
          const today = new Date()
          // 设置时间为00:00:00
          today.setHours(0, 0, 0, 0)
          // 返回小于今天日期的时间为true，即这些时间会被禁用
          return time.getTime() < today.getTime() + 1
        }
      },
      rules1: {
        personName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        phoneNumber: [
          {
            required: true,
            message: '请输入联系人电话',
            trigger: 'blur'
          }
        ],
        carNumber: [{ required: true, message: '请输入车牌号', trigger: 'blur' }],
        carBrand: [{ required: true, message: '请输入车辆品牌', trigger: 'blur' }]
      },
      rules2: {
        paymentAmount: [{ required: true, message: '请输入金额', trigger: 'blur' }],
        paymentMethod: [{ type: 'string', required: true, message: '请选择支付方式', trigger: 'change' }],
        payTime: [{ type: 'array', required: true, message: '请选择日期', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getMonthItem()
  },
  methods: {
    // 日期格式化
    formatDate(date = new Date(), format = 'YY-MM-DD') {
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const today = date.getDate()
      const hour = date.getHours()
      const minute = date.getMinutes()
      const second = date.getSeconds()

      let currentTime

      switch (format) {
        case 'YY-MM-DD h:m:s':
          currentTime = `${year}-${month}-${today} ${hour}:${minute}:${second}`
          break
        case 'YY/MM/DD h:m:s':
          currentTime = `${year}/${month}/${today} ${hour}:${minute}:${second}`
          break
        case 'YY/MM/DD':
          currentTime = `${year}/${month}/${today}`
          break
        case 'YY-MM-DD':
          currentTime = `${year}-${month > 10 ? month : '0' + month}-${today + 1 > 10 ? today + 1 : '0' + (today + 1)}`
          break
        default:
          currentTime = `${year}/${month}/${today}`
          break
      }

      return currentTime
    },
    // 重置表单数据
    resetForm() {
      // 重置所有数据初始化
      this.$refs.fromInfo2.resetFields()
    },
    // 编辑月卡信息
    onSubmit() {
      // 开启表单验证
      this.$refs.fromInfo1.validate(valid => {
        if (valid) {
          this.$refs.fromInfo2.validate(async valid2 => {
            if (!valid2) return
            // 验证通过，提交数据
            // const obj = {
            //   personName: this.formData1.personName,
            //   phoneNumber: this.formData1.phoneNumber,
            //   carNumber: this.formData1.carNumber,
            //   carBrand: this.formData1.carBrand,
            //   cardStartDate: this.formData2.payTime[0],
            //   cardEndDate: this.formData2.payTime[1],
            //   paymentAmount: this.formData2.paymentAmount,
            //   paymentMethod: this.formData2.paymentMethod
            // }
            const obj = {
              ...this.formData2,
              cardStartDate: this.formData2.payTime[0],
              cardEndDate: this.formData2.payTime[1],
              ...this.cardInfor
            }
            delete obj.payTime
            await renewMonthItemAPI(obj)
            this.$message.success('车辆续费成功.')
            this.$router.back()
            this.resetForm()
          })
        } else {
          this.$refs.fromInfo2.validate(valid2 => {
            // if (!valid2) return
            return
          })
        }
      })
    },
    // 获取月卡详情
    async getMonthItem() {
      const res = await getMonthItemAPI(this.$route.query.id)
      this.formData1.personName = res.data.personName
      this.formData1.phoneNumber = res.data.phoneNumber
      this.formData1.carNumber = res.data.carNumber
      this.formData1.carBrand = res.data.carBrand
      this.formData2.payTime = [res.data.cardStartDate]
      this.cardInfor.carInfoId = res.data.carInfoId
      // console.log(res)
    }
  }
}
</script>

  <style scoped lang="scss">
.add-card {
  background-color: #f4f6f8;
  height: 100vh;

  .add-header {
    display: flex;
    align-items: center;
    padding: 0 20px;
    height: 64px;
    background-color: #fff;

    .left {
      span {
        margin-right: 4px;
      }
      .arrow {
        cursor: pointer;
      }
    }

    .right {
      text-align: right;
    }
  }

  .add-main {
    background: #f4f6f8;
    padding: 20px 130px;

    .form-container {
      background-color: #fff;

      .title {
        height: 60px;
        line-height: 60px;
        padding-left: 20px;
      }

      .form {
        margin-bottom: 20px;
        padding: 20px 65px 24px;

        .el-form {
          display: flex;
          flex-wrap: wrap;

          .el-form-item {
            width: 50%;
          }
        }
      }
    }
    .preview {
      img {
        width: 100px;
      }
    }
  }

  .add-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 24px 50px;
    color: #000000d9;
    font-size: 14px;
    background: #fff;
    text-align: center;
  }
}
</style>
