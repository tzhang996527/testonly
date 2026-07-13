<template>
  <div class="user-manage">
    <div class="page-header">
      <h3>用户管理</h3>
      <el-button type="primary" :icon="Plus">新增用户</el-button>
    </div>
    <el-card shadow="never">
      <el-table :data="users" stripe>
        <el-table-column label="用户名" prop="username" width="130" />
        <el-table-column label="姓名" prop="name" width="100" />
        <el-table-column label="角色" prop="role" width="130">
          <template #default="{ row }">
            <el-tag :type="roleColors[row.role]" size="small">{{ roleLabels[row.role] || row.role }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="部门" prop="department" width="140" />
        <el-table-column label="邮箱" prop="email" min-width="180" />
        <el-table-column label="状态" prop="status" width="90">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'" size="small">
              {{ row.status === 'active' ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template #default>
            <el-button link type="primary" size="small">编辑</el-button>
            <el-button link type="warning" size="small">重置密码</el-button>
            <el-button link type="danger" size="small">禁用</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { userApi } from '@/api/index.js'

const users = ref([])

const roleLabels = { admin: '系统管理员', assessor: '评估专业人员', deptManager: '部门负责人', riskControl: '风控', office: '办公室', ceo: '总经理' }
const roleColors = { admin: 'danger', assessor: 'primary', deptManager: 'warning', riskControl: 'warning', office: '', ceo: 'success' }

onMounted(async () => {
  const res = await userApi.list()
  users.value = res.data
})
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.page-header h3 { margin: 0; font-size: 20px; font-weight: 600; }
</style>
