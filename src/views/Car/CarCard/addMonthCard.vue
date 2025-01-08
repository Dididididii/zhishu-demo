<template>
  <div v-loading.fullscreen.lock="fullscreenLoading" class="add-card">
    <header class="add-header">
      <el-page-header :content="typeAll[$route.query.type]" @back="$router.back()" />
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">车辆信息</div>
        <div class="form">
          <el-form ref="fromInfo1" label-width="100px" :model="formData1" :rules="$route.query.type === '3'? {} :rules1">
            <el-form-item label="车主姓名:" prop="personName">
              <el-input v-if="$route.query.type !== '3'" v-model="formData1.personName" :disabled="$route.query.type === '2'" />
              <span v-else>{{ formData1.personName }}</span>
            </el-form-item>
            <el-form-item label="联系方式:" prop="phoneNumber">
              <el-input v-if="$route.query.type !== '3'" v-model="formData1.phoneNumber" :disabled="$route.query.type === '2'" />
              <span v-else>{{ formData1.phoneNumber }}</span>
            </el-form-item>
            <el-form-item label="车辆号码:" prop="carNumber">
              <el-input v-if="$route.query.type !== '3'" v-model="formData1.carNumber" :disabled="$route.query.type === '2'" />
              <span v-else>{{ formData1.carNumber }}</span>
            </el-form-item>
            <el-form-item label="车辆品牌:" prop="carBrand">
              <el-input v-if="$route.query.type !== '3'" v-model="formData1.carBrand" :disabled="$route.query.type === '2'" />
              <span v-else>{{ formData1.carBrand }}</span>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="form-container">
        <div class="title">{{ cardMsg[$route.query.type] }}</div>
        <div class="form">
          <!-- 不是查看时显示 -->
          <el-form v-if="$route.query.type !== '3'" ref="fromInfo2" label-width="100px" :rules="rules2" :model="formData2">
            <el-form-item label="有效日期:" prop="payTime">
              <el-date-picker
                v-model="formData2.payTime"
                :default-value="$route.query.type === '2' ? formatDate(new Date(), 'YY-MM-DD') : new Date()"
                type="daterange"
                :start-placeholder="$route.query.type === '2' ? formatDate(new Date(), 'YY-MM-DD') :'开始日期'"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions"
              >
                <template v-slot:range-separator>
                  <i
                    class="el-icon-sort-down"
                    style="transform: rotateY(180deg) rotate(90deg);"
                  /> <!-- 这里使用了 Element UI 的箭头图标 -->
                </template>
              </el-date-picker>
              </el-date-picker></el-form-item>
            <el-form-item label="支付金额:" prop="paymentAmount">
              <el-input v-model="formData2.paymentAmount" />
            </el-form-item>
            <el-form-item label="支付方式:" prop="paymentMethod">
              <el-select v-model="formData2.paymentMethod" placeholder="请选择支付方式">
                <el-option v-for="item in pay" :key="item.industryCode" :value="item.industryCode" :label="item.industryName" />
              </el-select>
            </el-form-item>
          </el-form>
          <!-- 是查看时显示 -->
          <el-table
            v-else
            :data="rechargeList"
            style="width: 100%"
          >
            <el-table-column
              type="index"
              label="序号"
              width="80"
            />
            <el-table-column
              prop="StartAndEndDate"
              label="有效时间"
              width="280"
            />
            <el-table-column
              prop="paymentAmount"
              label="支付金额"
            />
            <el-table-column
              prop="payMethod"
              label="支付方式"
            />
            <el-table-column
              prop="createTime"
              label="办理时间"
            />
            <el-table-column
              prop="createUser"
              label="办理人"
            />
          </el-table>
        </div>
      </div>
    </main>
    <footer v-if="$route.query.type !== '3'" class="add-footer"">
      <div class="btn-container">
        <el-button @click="resetForm">重置</el-button>
        <el-button type="primary" @click="onSubmit">确定</el-button>
      </div>
    </footer>
  </div>
</template>

<script>
// 导入 添加月卡 编辑月卡信息接口 获取月卡详情 续费月卡信息接口 查看月卡详情 接口
import { addMonthCardAPI, getMonthItemAPI, editMonthItemAPI, renewMonthItemAPI, checkMonthItemAPI } from '@/api/month'

export default {
  data() {
    return {
      // 懒加载
      fullscreenLoading: false,
      rechargeList: [],
      cardMsg: ['添加月卡信息', '最近一次月卡缴费信息', '月卡缴费信息', '月卡缴费记录'],
      // 提示消息
      msg: ['车辆信息添加成功.', '车辆信息修改成功.', '车辆续费成功.'],
      cardInfor: {
        carInfoId: 0,
        rechargeId: 0
      },
      // 页面类型
      typeAll: ['增加月卡', '编辑月卡', '月卡续费', '查看详情'],
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
      pay: [{
        industryCode: 'Alipay',
        industryName: '支付宝'
      }, {
        industryCode: 'WeChat',
        industryName: '微信'
      }, {
        industryCode: 'Cash',
        industryName: '现金支付'
      }],
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
      rules1: {
        personName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        phoneNumber: [
          {
            required: true,
            message: '请输入联系人电话',
            trigger: 'blur'
          },
          {
            validator: this.photoPass,
            trigger: 'blur'
          }
        ],
        carNumber: [
          { required: true, message: '请输入车牌号', trigger: 'blur' },
          {
            validator: this.carNumberPass,
            trigger: 'blur'
          }
        ],
        carBrand: [{ required: true, message: '请输入车辆品牌', trigger: 'blur' }]

      },
      rules2: {
        paymentAmount: [
          { required: true, message: '请输入金额', trigger: 'blur' },
          {
            validator: this.paymentAmountPass,
            trigger: 'blur'
          }
        ],
        paymentMethod: [{ type: 'string', required: true, message: '请选择支付方式', trigger: 'change' }],
        payTime: [{ type: 'array', required: true, message: '请选择日期', trigger: 'change' }]
      }
    }
  },
  created() {
    if (this.$route.query.type === '1' || this.$route.query.type === '2' || this.$route.query.type === '3') {
      // 开启懒加载
      this.fullscreenLoading = true
      // 编辑月卡
      this.getMonthItem()
      if (this.$route.query.type === '2') {
      // 月卡续费
        this.formData2.paymentAmount = ''
        this.formData2.paymentMethod = ''
        this.cardInfor.rechargeId = 0
      }
    }
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
    // 手机号码校验
    photoPass(rule, value, callback) {
      const reg = /^(1[3-9|])\d{9}$|^0\d{2,3}-?\d{7,8}$|^400[016-9]\d{6}$|^400-[016-9]\d{2}-\d{4}$/
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error('手机号码格式不正确.'))
      }
    },
    // 车牌号校验
    carNumberPass(rule, value, callback) {
      const reg = /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5,6}$/
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error('车牌号格式不正确.'))
      }
    },
    // 金额校验
    paymentAmountPass(rule, value, callback) {
      const reg = /^(([1-9]{1}\d{0,8})|([0]{1}))(\.(\d){0,4})?$/
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error('金额必须是大于0且不超过4位小数的数字(整数位不能超过9位).'))
      }
    },
    // 重置表单数据
    resetForm() {
      // 重置所有数据初始化
      this.$refs.fromInfo1.resetFields()
      this.$refs.fromInfo2.resetFields()
    },
    // 添加月卡
    onSubmit() {
      // 开启表单验证
      this.$refs.fromInfo1.validate((valid) => {
        if (valid) {
          this.$refs.fromInfo2.validate(async(valid2) => {
            if (!valid2) return
            // 验证通过，提交数据
            let obj = {
              ...this.formData1,
              ...this.formData2,
              cardStartDate: this.formData2.payTime[0],
              cardEndDate: this.formData2.payTime[1]
            }
            delete obj.payTime
            if (this.$route.query.type === '1') {
              // 编辑月卡
              obj = {
                ...obj,
                ...this.cardInfor
              }
              await editMonthItemAPI(obj)
            } else if (this.$route.query.type === '2') {
              // 月卡续费
              const renewObj = {
                ...this.formData2,
                cardStartDate: this.formData2.payTime[0],
                cardEndDate: this.formData2.payTime[1],
                ...this.cardInfor
              }
              delete renewObj.payTime
              delete renewObj.rechargeId
              await renewMonthItemAPI(renewObj)
            } else {
              // 增加月卡
              await addMonthCardAPI(obj)
            }

            this.$message.success(this.msg[this.$route.query.type])
            this.$router.back()
            this.resetForm()
          })
        } else {
          this.$refs.fromInfo2.validate((valid2) => {
            // if (!valid2) return
            return
          })
        }
      })
    },
    // 获取月卡详情
    async getMonthItem() {
      let res = null
      if (this.$route.query.type === '3') {
        res = await checkMonthItemAPI(this.$route.query.id)
        this.rechargeList = res.data.rechargeList
        this.rechargeList.map((item, { cardStartDate, cardEndDate }) => {
          item.StartAndEndDate = item.cardStartDate + ' 至 ' + item.cardEndDate
          item.payMethod = this.pay.filter(item1 => item1.industryCode === item.paymentMethod)[0].industryName
        })
      } else {
        res = await getMonthItemAPI(this.$route.query.id)
        this.formData2.payTime = this.$route.query.type === '1' ? [res.data.cardStartDate, res.data.cardEndDate] : [res.data.cardStartDate]
        this.formData2.paymentAmount = res.data.paymentAmount
        this.formData2.paymentMethod = res.data.paymentMethod
        this.cardInfor.rechargeId = res.data.rechargeId
      }
      this.formData1.carBrand = res.data.carBrand
      this.cardInfor.carInfoId = res.data.carInfoId
      this.formData1.phoneNumber = res.data.phoneNumber
      this.formData1.personName = res.data.personName
      this.formData1.carNumber = res.data.carNumber
      // 关闭懒加载
      this.fullscreenLoading = false
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
