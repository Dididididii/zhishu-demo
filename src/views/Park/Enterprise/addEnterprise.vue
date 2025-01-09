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
          <el-form ref="ruleForm" label-width="100px" :rules="rules" :model="addForm">
            <el-form-item label="企业名称" prop="name">
              <el-input v-model="addForm.name" />
            </el-form-item>
            <el-form-item label="法人" prop="legalPerson">
              <el-input v-model="addForm.legalPerson" />
            </el-form-item>
            <el-form-item label="注册地址" prop="registeredAddress">
              <el-input v-model="addForm.registeredAddress" />
            </el-form-item>
            <el-form-item label="所在行业" prop="industryCode">
              <el-select v-model="addForm.industryCode">
                <el-option v-for="item in options" :key="item.industryCode" :label="item.industryName" :value="item.industryCode" />
              </el-select>
            </el-form-item>
            <el-form-item label="企业联系人" prop="contact">
              <el-input v-model="addForm.contact" />
            </el-form-item>
            <el-form-item label="联系电话" prop="contactNumber">
              <el-input v-model="addForm.contactNumber" />
            </el-form-item>
            <el-form-item label="营业执照" prop="businessLicenseId">
              <el-upload
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
            </el-form-item>
          </el-form>
          <el-image ref="image" style="display: none;" :src="url" :preview-src-list="srcList" />
        </div>
      </div>
    </main>
    <footer class="add-footer">
      <div class="btn-container">
        <el-button @click="resetForm">重置</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </footer>
  </div>
</template>

<script>
// 导入获取企业行业 添加企业 查看企业 编辑企业 接口
import { searchEnterPriseIndustryAPI, addEnterpriseAPI, searchEnterpriseAPI, updatEnterpriseAPI } from '@/api/enterprise'
// 导入上传图片接口
import { uploadAPI } from '@/api/commit'

export default {
  data() {
    return {
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
    }
  },
  created() {
    this.searchEnterPriseIndustry()
  },
  methods: {
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
