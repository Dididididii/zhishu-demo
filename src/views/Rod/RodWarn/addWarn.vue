<template>
  <div class="add-card">
    <header class="add-header">
      <el-page-header content="警告详情" @back="$router.back()" />
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">告警详情</div>
        <div class="form">
          <el-form label-width="100px">
            <el-form-item label="警告时间：">
              <span>{{ warningObj.warningTime }}</span>
            </el-form-item>
            <el-form-item label="一体杆名称：">
              <span>{{ warningObj.poleName }}</span>
            </el-form-item>
            <el-form-item label="告警区域：">
              <span>{{ warningObj.areaName }}</span>
            </el-form-item>
            <el-form-item label="一体杆编号：">
              <span>{{ warningObj.poleNumber }}</span>
            </el-form-item>
            <el-form-item label="故障类型：">
              <span>{{ warningObj.errorType }}</span>
            </el-form-item>
            <el-form-item label="处置状态：">
              <span>{{ handleStatusList[warningObj.handleStatus] }}</span>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="form-container">
        <div class="title">告警处理</div>
        <div class="form">
          <el-form label-width="100px">
            <el-form-item label="处理人：">
              <span>{{ warningObj.handleUser }}</span>
            </el-form-item>
            <el-form-item label="联系方式：">
              <span>{{ warningObj.phonenumber }}</span>
            </el-form-item>
            <el-form-item label="处理结果：">
              <span>{{ warningObj.handleResult }}</span>
            </el-form-item>
            <el-form-item label="完成时间：">
              <span>{{ warningObj.handleTime }}</span>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { getWarningAPI } from '@/api/warning'

export default {
  data() {
    return {
      warningObj: {},
      handleStatusList: ['未派单', '已派单', '已接单', '已完成']
    }
  },
  created() {
    this.getWarning()
  },
  methods: {
    async getWarning() {
      const res = await getWarningAPI(this.$route.query.id)
      this.warningObj = res.data
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
