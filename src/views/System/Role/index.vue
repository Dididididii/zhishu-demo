<template>
  <div class="role-container">
    <div class="left-wrapper">
      <div
        v-for="(item,index) in roleList"
        :key="item.roleId"
        class="role-item"
        :class="{active:roleIndex === index}"
        @click="changeRole(index)"
      >
        <div class="role-info">
          <svg-icon :icon-class="roleIndex === index?'user-active':'user'" class="icon" />
          {{ item.roleName }}
        </div>
        <div class="more">
          <el-dropdown @command="(command)=>handleCommand(command,item.roleId)">
            <span class="el-dropdown-link">
              <svg-icon icon-class="more" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="edit">编辑角色</el-dropdown-item>
              <el-dropdown-item command="del">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <el-button class="addBtn" size="mini" @click="$router.push('/sys/role/add')">添加角色</el-button>
    </div>

    <div class="right-wrapper">
      <el-tabs v-model="activeName">
        <el-tab-pane label="权限管理" name="tree">
          <div class="tree-wrapper">
            <div v-for="item in roleTreeList" :key="item.id" class="tree-item">
              <div class="tree-title">{{ item.title }}</div>
              <el-tree ref="tree" :data="item.children" :props="defaultProps" default-expand-all show-checkbox node-key="id" />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="`成员(${userTotal})`" name="member">
          <div class="box" style="margin: 0 20px;">
            <el-table :data="userList" style="width: 100%">
              <el-table-column type="index" width="50" label="序号" :index="indexMethod" />
              <el-table-column prop="name" label="员工姓名" />
              <el-table-column prop="userName" label="员工账号" />
            </el-table>
            <div class="page" style="float: right; margin-right: 20px; margin-top: 10px;">
              <el-pagination
                :page-sizes="[1, 2, 3, 4]"
                :page-size="params.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="userTotal"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { getSysRoleListAPI, getSysRoleTreeAPI, getRoleDetailAPI, getRoleUserAPI, delRoleUserAPI } from '@/api/system'

export default {
  name: 'Role',
  data() {
    return {
      params: {
        page: 1,
        pageSize: 1
      },
      userList: [],
      userTotal: 0,
      activeName: 'tree',
      roleList: [],
      roleIndex: 0,
      roleTreeList: [],
      defaultProps: {
        label: 'title'
      }
    }
  },
  async created() {
    await this.getSysRoleList()
    await this.getSysRoleTree()
    this.changeRole(0)
  },
  methods: {
    // 下拉框点击事件
    handleCommand(command, id) {
      if (command === 'edit') {
        this.$router.push(`/sys/role/add?id=${id}`)
      } else {
        // 删除
        this.$confirm('此操作将删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await delRoleUserAPI(id)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          await this.getSysRoleList()
        })
      }
    },
    // 修改自定义序号
    indexMethod(index) {
      return index + 1 + (this.params.page - 1) * this.params.pageSize
    },
    handleSizeChange(val) {
      this.params.pageSize = val
      this.changeRole(this.roleIndex)
    },
    async handleCurrentChange(val) {
      this.params.page = val
      this.changeRole(this.roleIndex)
    },
    // 获取权限角色列表
    async getRoleUser(id) {
      const res = await getRoleUserAPI(id, this.params)
      this.total = res.data.total
      this.userList = res.data.rows
    },
    // 获取权限树状数组
    async getSysRoleTree() {
      const res = await getSysRoleTreeAPI()
      this.roleTreeList = res.data
      this.addDisabledProps(this.roleTreeList)
    },
    // 递归方法
    addDisabledProps(roleTreeList) {
      roleTreeList.forEach(item => {
        item.disabled = true
        if (item.children && item.children.length > 0) {
          this.addDisabledProps(item.children)
        }
      })
    },
    // 点击修改index激活
    changeRole(index) {
      this.roleIndex = index
      this.getRoleDetail(this.roleList[index].roleId)
      this.getRoleUser(this.roleList[index].roleId)
    },
    // 获取角色权限
    async getRoleDetail(id) {
      const res = await getRoleDetailAPI(id)
      const perms = res.data.perms
      this.userTotal = res.data.userTotal
      this.$refs.tree.forEach((item, index) => {
        item.setCheckedKeys(perms[index])
      })
    },
    // 获取权限列表
    async getSysRoleList() {
      const res = await getSysRoleListAPI()
      this.roleList = res.data
    }
  }
}
</script>

<style scoped lang="scss">
.role-container {
  display: flex;
  font-size: 14px;
  background-color: #fff;
  padding: 20px;
  .left-wrapper {
    width: 200px;
    border-right: 1px solid #e4e7ec;
    padding: 4px;
    text-align: center;

    .role-item {
      position: relative;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      cursor: pointer;

      &.active {
        background: #edf5ff;
        color: #4770ff;
      }
    }

    .role-info {
      display: flex;
      align-items: center;

      .icon {
        margin-right: 10px;
      }
    }

    .more {
      display: flex;
      align-items: center;
    }
    .addBtn {
      width: 100%;
      margin-top: 20px;
    }
  }

  .right-wrapper {
    flex: 1;

    .tree-wrapper {
      display: flex;
      justify-content: space-between;

      .tree-item {
        flex: 1;
        border-right: 1px solid #e4e7ec;
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

    ::v-deep .el-tabs__nav-wrap {
      padding-left: 20px;
    }

    .user-wrapper {
      padding: 20px;
    }
  }
}
</style>
