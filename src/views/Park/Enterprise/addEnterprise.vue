<template>
  <div class="add-enterprise">
    <header class="add-header">
      <div class="left">
        <span class="arrow" @click="$router.back()">
          <i class="el-icon-arrow-left" />返回
        </span>
        <span>|</span>
        <span>{{ pageTitle }}</span>
      </div>
      <div class="right">黑马程序员</div>
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">企业信息</div>
        <div class="form">
          <el-form ref="ruleForm" label-width="100px" :rules="$route.path==='/enterprise/see' ? {}:rules" :model="addForm">
            <el-form-item label="企业名称:" prop="name">
              <el-input v-if="$route.path!=='/enterprise/see'" v-model="addForm.name" />
              <span v-else>{{ addForm.name }}</span>
            </el-form-item>
            <el-form-item label="法人:" prop="legalPerson">
              <el-input v-if="$route.path!=='/enterprise/see'" v-model="addForm.legalPerson" />
              <span v-else>{{ addForm.legalPerson }}</span>
            </el-form-item>
            <el-form-item label="注册地址:" prop="registeredAddress">
              <el-input v-if="$route.path!=='/enterprise/see'" v-model="addForm.registeredAddress" />
              <span v-else>{{ addForm.registeredAddress }}</span>
            </el-form-item>
            <el-form-item label="所在行业:" prop="industryCode">
              <el-select v-if="$route.path!=='/enterprise/see'" v-model="addForm.industryCode">
                <el-option v-for="item in options" :key="item.industryCode" :label="item.industryName" :value="item.industryCode" />
              </el-select>
              <span v-else>{{ industry }}</span>
            </el-form-item>
            <el-form-item label="企业联系人:" prop="contact">
              <el-input v-if="$route.path!=='/enterprise/see'" v-model="addForm.contact" />
              <span v-else>{{ addForm.contact }}</span>
            </el-form-item>
            <el-form-item label="联系电话:" prop="contactNumber">
              <el-input v-if="$route.path!=='/enterprise/see'" v-model="addForm.contactNumber" />
              <span v-else>{{ addForm.contactNumber }}</span>
            </el-form-item>
            <el-form-item label="营业执照:" prop="businessLicenseId">
              <el-upload
                v-if="$route.path!=='/enterprise/see'"
                class="upload-demo"
                :on-preview="previewUpload"
                :before-upload="beforeUpload"
                action="#"
                :limit="1"
                :http-request="uploadImage"
                :on-remove="removeImage"
                :file-list="fileList"
              >
                <el-button
                  size="small"
                  :disabled="fileList.length>0"
                  :type="addForm.businessLicenseUrl ? 'success' : 'primary'"
                >{{ addForm.businessLicenseUrl ? '已上传' : '上传文件' }}</el-button>
                <div slot="tip" class="el-upload__tip">支持扩展名：.png .jpg .jpeg，文件大小不得超过5M</div>
              </el-upload>
              <el-image v-else style="width: 250px; height: 200px" :src="addForm.businessLicenseUrl" fit="cover" />
            </el-form-item>
          </el-form>
          <el-image ref="image" style="display: none;" :src="url" :preview-src-list="srcList" />
        </div>
      </div>
      <div v-if="$route.path==='/enterprise/see'" class="form-container">
        <div class="title">租赁记录</div>
        <div class="form">
          <template>
            <el-table :data="addForm.rent" header-row-class-name="tableBox">
              <el-table-column type="index" width="50" label="序号" />
              <el-table-column label="租赁楼宇" width="320" prop="name" />
              <el-table-column label="租赁起始时间" prop="startTime">
                <template slot-scope="scope">
                  <p>{{ time(scope.row) }}</p>
                </template>
              </el-table-column>
              <el-table-column label="租赁合同" width="200" prop="contractName">
                <template #default="scope">
                  <el-link type="primary" :underline="false" :href="reViewUrl+scope.row.contractUrl">{{ scope.row.contractName }}</el-link>
                </template>
              </el-table-column>
              <el-table-column label="录入时间" width="250" prop="createTime" />
              <el-table-column label="合同状态">
                <template slot-scope="scope">
                  <p>{{ status(scope.row.status) }}</p>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180">
                <template #default="scope">
                  <el-link type="primary" :underline="false" :href="scope.row.contractUrl">合同下载</el-link>
                  <!-- <el-button size="mini" type="text" @click="quitEnterpriseContract(scope.row.id)">退租</el-button>
                  <el-button size="mini" type="text" @click="delEnterpriseContract(scope.row.id)">删除</el-button>-->
                </template>
              </el-table-column>
            </el-table>
          </template>
        </div>
      </div>
    </main>
    <footer v-if="$route.path!=='/enterprise/see'" class="add-footer">
      <div class="btn-container">
        <el-button @click="resetForm">重置</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </footer>
  </div>
</template>

<script>
// 导入获取企业行业 添加企业 查看企业 编辑企业 删除合同 退租租赁合同 接口
import {
  searchEnterPriseIndustryAPI,
  addEnterpriseAPI,
  searchEnterpriseAPI,
  updatEnterpriseAPI,
  delEnterpriseContractAPI,
  quitEnterpriseContractAPI
} from '@/api/enterprise'
// 导入上传图片 下载接口
import { uploadAPI } from '@/api/commit'

export default {
  data() {
    return {
      reViewUrl: 'https://view.officeapps.live.com/op/view.aspx?src=',
      fileList: [],
      url: '',
      srcList: [],
      addForm: {
        name: '', // 企业名称
        legalPerson: '', // 法人
        registeredAddress: '', // 注册地址
        industryCode: '', // 所在行业
        contact: '', // 企业联系人
        contactNumber: '', // 联系人电话
        businessLicenseUrl: '', // 营业执照url
        businessLicenseId: '' // 营业执照id
      },
      options: [],
      rules: {
        name: [{ required: true, message: '企业名称不能为空', trigger: 'blur' }],
        legalPerson: [{ required: true, message: '法人不能为空', trigger: 'blur' }],
        registeredAddress: [{ required: true, message: '注册地址不能为空', trigger: 'blur' }],
        industryCode: [{ required: true, type: 'number', message: '所在行业不能为空', trigger: 'change' }],
        contact: [{ required: true, message: '企业联系人不能为空', trigger: 'blur' }],
        contactNumber: [
          { required: true, message: '联系人电话不能为空', trigger: 'blur' },
          {
            validator: this.photoPass,
            trigger: 'blur'
          }
        ],
        businessLicenseId: [{ required: true, message: '营业执照不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    pageTitle() {
      if (this.$route.path === '/enterprise/add') return '添加企业'
      if (this.$route.path === '/enterprise/edit') return '编辑企业'
      if (this.$route.path === '/enterprise/see') return '查看企业'
    },
    industry() {
      let title = ''
      if (this.options.length > 0) {
        title = this.options.filter(item => item.industryCode === this.addForm.industryCode)[0]
        if (title) return title.industryName
      }
      return ''
    }
  },
  created() {
    this.searchEnterPriseIndustry()
  },
  methods: {
    // 退租合同处理
    quitEnterpriseContract(id) {
      this.$confirm('确定要退企业租赁吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await quitEnterpriseContractAPI(id)
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.searchEnterPriseIndustry()
      })
    },
    // 删除合同处理
    delEnterpriseContract(id) {
      this.$confirm('确定要删除企业租赁合同记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await delEnterpriseContractAPI(id)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.searchEnterPriseIndustry()
      })
    },
    // 处理返回时间字符串
    time(row) {
      // console.log()
      return row.startTime + '-' + row.endTime
    },
    // 返回合同状态字符串
    status(statu) {
      if (statu === 0) return '待生效'
      if (statu === 1) return '生效中'
      if (statu === 2) return '已到期'
      if (statu === 3) return '已退租'
      return statu
    },
    // 删除文件操作
    removeImage() {
      this.addForm.businessLicenseId = ''
      this.addForm.businessLicenseUrl = ''
      this.srcList = []
      this.url = ''
      this.fileList = []
    },
    // 点击图片名称时放大图片
    previewUpload() {
      this.$refs.image.clickHandler()
    },
    // 编写校验逻辑
    beforeUpload(file) {
      const allowImgType = ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)
      const isLt5M = file.size / 1024 / 1024 < 5

      if (!allowImgType) {
        this.$message.error('上传合同图片只能是 PNG/JPG/JPEG 格式!')
      }
      if (!isLt5M) {
        this.$message.error('上传合同图片大小不能超过 5MB!')
      }
      return allowImgType && isLt5M
    },
    // 上传文件处理
    async uploadImage({ file }) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 1)
      const res = await uploadAPI(formData)
      this.addForm.businessLicenseId = res.data.id
      this.addForm.businessLicenseUrl = res.data.url
      //   console.log(res)
      this.srcList = []
      this.url = res.data.url
      this.srcList.push(res.data.url)
      this.$refs.ruleForm.validateField('businessLicenseId')
      this.fileList.push({ name: res.data.name, file: res.data.url })
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
    // 调用接口获取数据
    async searchEnterPriseIndustry() {
      const res = await searchEnterPriseIndustryAPI()
      this.options = res.data
      if (this.$route.path === '/enterprise/edit') {
        const { data } = await searchEnterpriseAPI(this.$route.query.id)
        this.addForm = data
        this.fileList.push({ name: data.businessLicenseName, file: data.businessLicenseUrl })
        this.srcList = []
        this.url = data.businessLicenseUrl
        this.srcList.push(data.businessLicenseUrl)
        // console.log(data)
      }
      // 调用查看企业信息接口获取数据
      if (this.$route.path === '/enterprise/see') {
        const { data } = await searchEnterpriseAPI(this.$route.query.id)
        this.addForm = data
      }
    },
    submitForm() {
      this.$refs.ruleForm.validate(async valid => {
        if (!valid) return
        // 校验成功，提交接口
        if (this.$route.path === '/enterprise/add') {
          await addEnterpriseAPI(this.addForm)
          this.$message.success('添加成功.')
        } else if (this.$route.path === '/enterprise/edit') {
          delete this.addForm.industryName
          delete this.addForm.rent
          delete this.addForm.businessLicenseName
          await updatEnterpriseAPI(this.addForm)
          this.$message.success('修改成功.')
        }
        this.$router.back()
        this.resetForm()
      })
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
      this.removeImage()
    }
  }
}
</script>

  <style scoped lang="scss">
.add-enterprise {
  background-color: #f4f6f8;
  height: 100vh;

  .add-header {
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    height: 64px;
    line-height: 64px;
    font-size: 16px;
    font-weight: bold;
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
