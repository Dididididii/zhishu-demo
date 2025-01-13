<template>
  <div class="add-role">
    <header class="add-header">
      <div class="left">
        <span class="arrow" @click="$router.back()">
          <i class="el-icon-arrow-left" />返回
        </span>
        <span>|</span>
        <span>{{ $route.query.id ?'修改角色' :'添加角色' }}</span>
      </div>
      <div class="right">黑马程序员</div>
    </header>
    <main class="add-main">
      <div class="step-container">
        <el-steps direction="vertical" :active="active" finish-status="success">
          <el-step title="角色信息" />
          <el-step title="权限信息" />
          <el-step title="检查并完成" />
        </el-steps>
      </div>
      <div v-if="active === 0" class="form-container">
        <div class="title">角色信息</div>
        <div class="form">
          <el-form ref="nameFrom" class="form-box" :model="roleForm" :rules="roleRules">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="roleForm.roleName" />
            </el-form-item>
            <el-form-item label="角色描述" prop="remark">
              <el-input v-model="roleForm.remark" type="textarea" :rows="2" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div v-else-if="active === 1" class="form-container">
        <div class="title">权限配置</div>
        <div class="form">
          <template>
            <div class="tree-wrapper">
              <div v-for="(item,index) in treeList" :key="item.roleId" class="tree-item">
                <div class="tree-title">{{ item.title }}</div>
                <el-tree
                  ref="tree"
                  show-checkbox
                  check-strictly
                  default-expand-all
                  node-key="id"
                  :props="defaultProps"
                  :data="item.children"
                  :default-checked-keys="roleForm.perms[index]"
                />
              </div>
            </div>
          </template>
        </div>
      </div>
      <div v-else class="form-container">
        <div class="title">检查并完成</div>
        <div class="form">
          <div class="info">
            <div class="form-item">角色名称：{{ roleForm.roleName }}</div>
            <div class="form-item">角色描述：{{ roleForm.remark }}</div>
            <div class="form-item">角色权限：</div>
            <div class="tree-wrapper">
              <div v-for="(item,index) in treeList" :key="item.id" class="tree-item">
                <div class="tree-title">{{ item.title }}</div>
                <el-tree
                  ref="diabledTree"
                  :data="item.children"
                  show-checkbox
                  check-strictly
                  default-expand-all
                  node-key="id"
                  :default-checked-keys="roleForm.perms[index]"
                  :props="defaultProps"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <footer class="add-footer">
      <div class="btn-container">
        <el-button v-if="active>0" @click="handleStepChange(-1)">上一步</el-button>
        <el-button v-if="active<2" type="primary" @click="handleStepChange(1)">下一步</el-button>
        <el-button v-if="active===2" type="primary" @click="submit">{{ $route.query.id ?'确认修改':'确认添加' }}</el-button>
      </div>
    </footer>
  </div>
</template>

<script>
import { getSysRoleTreeAPI, addRoleUserAPI, getRoleDetailItemAPI, updateRoleUserAPI } from '@/api/system'

export default {
  data() {
    return {
      //   checkList: [],
      treeList: [],
      defaultProps: {
        label: 'title'
      },
      active: 0,
      roleForm: {
        roleName: '',
        remark: '',
        perms: []
      },
      roleRules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getSysRoleTreeList()
  },
  methods: {
    // 递归方法
    addDisabledProps(roleTreeList, blo) {
      roleTreeList.forEach(item => {
        // if (!blo) {
        //   delete item.disabled
        // } else {
        //   item.disabled = blo
        // }
        item.disabled = blo
        if (item.children && item.children.length > 0) {
          this.addDisabledProps(item.children, blo)
        }
      })
    },
    // 提交/修改
    async submit() {
      if (this.$route.query.id) {
        // 修改
        delete this.roleForm.userTotal
        await updateRoleUserAPI(this.roleForm)
        this.$message.success('添加成功')
      } else {
        // 添加
        await addRoleUserAPI(this.roleForm)
        this.$message.success('添加成功')
      }
      //   this.$refs.nameFrom.resetFields()
      //   this.roleForm.perms = []
      this.roleForm = {
        roleName: '',
        remark: '',
        perms: []
      }
      //   this.checkList = []
      this.$router.back()
    },
    handleStepChange(step) {
      if (this.active === 0) {
        this.$refs.nameFrom.validate(valid => {
          if (!valid) return
          this.active = this.active + step
          //   this.addDisabledProps(this.treeList, false)
        })
      } else if (this.active === 1) {
        // this.$refs.tree.getCheckedKeys()
        if (this.$route.query.id) {
          const list = []
          // this.checkList = []
          this.$refs.tree.forEach(item => {
            if (item.getCheckedKeys().length > 0) {
              list.push(item.getCheckedKeys())
              // this.checkList.push(...item.getCheckedKeys())
            }
          })
          this.roleForm.perms = list
        } else {
          this.roleForm.perms = []
          // this.checkList = []
          this.$refs.tree.forEach(item => {
            if (item.getCheckedKeys().length > 0) {
              this.roleForm.perms.push(item.getCheckedKeys())
              // this.checkList.push(...item.getCheckedKeys())
            }
          })
        }

        if (this.roleForm.perms.flat().length <= 0) {
          this.$message.warning('请至少选择一个权限')
          return
        } else {
          //   console.log(this.roleForm.perms)
          this.active = this.active + step
          this.addDisabledProps(this.treeList, true)
        }
      } else {
        this.active = this.active + step
        this.addDisabledProps(this.treeList, false)
      }
    },
    async getSysRoleTreeList() {
      const res = await getSysRoleTreeAPI()
      this.treeList = res.data
      if (this.$route.query.id) {
        const res = await getRoleDetailItemAPI(this.$route.query.id)
        this.roleForm = res.data
      }
    }
  }
}
</script>
  <style scoped lang="scss">
.add-role {
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
    position: fixed;
    top: 64px;
    bottom: 88px;
    width: 100%;
    overflow-y: auto;
    background: #f4f6f8;
    padding: 20px 230px;
    display: flex;
    .step-container {
      height: 400px;
      width: 200px;
    }
    .form-container {
      flex: 1;
      background-color: #fff;
      overflow-y: auto;
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
        }
        .info {
          font-size: 14px;
          color: #666;
          .form-item {
            margin-bottom: 20px;
          }
        }
      }
      .form-box {
        width: 600px;
        display: flex;
        flex-direction: column;
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
    z-index: 10001;
  }
  .tree-wrapper {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .tree-item {
      flex: 1;
      padding: 0px 4px;
      text-align: center;
      .tree-title {
        background: #f5f7fa;
        text-align: center;
        padding: 10px 0;
        margin-bottom: 12px;
      }
    }
  }
}
</style>
