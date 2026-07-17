<template>
  <div class="user-manage">
    <div class="page-header">
      <h3>用户管理</h3>
      <el-button type="primary" :icon="Plus" @click="openCreateDialog">新增用户</el-button>
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
        <el-table-column label="操作" width="160">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="openEditDialog(row)">编辑</el-button>
            <el-button link type="warning" size="small" @click="openResetDialog(row)">重置密码</el-button>
            <el-button link type="danger" size="small" @click="toggleStatus(row)">
              {{ row.status === 'active' ? '禁用' : '启用' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新建/编辑用户对话框 -->
    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑用户' : '新建用户'" width="500px" :close-on-click-modal="false">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" :disabled="!!editingId" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role" placeholder="请选择角色" style="width:100%">
            <el-option v-for="(label, value) in roleLabels" :key="value" :label="label" :value="value" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-input v-model="form.department" placeholder="请输入部门" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio value="active">正常</el-radio>
            <el-radio value="disabled">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 重置密码对话框 -->
    <el-dialog v-model="resetDialogVisible" title="重置密码" width="400px" :close-on-click-modal="false">
      <el-form ref="resetFormRef" :model="resetForm" :rules="resetRules" label-width="90px">
        <el-form-item label="用户">
          <span>{{ resetTarget?.name }}（{{ resetTarget?.username }}）</span>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input v-model="resetForm.password" type="password" show-password placeholder="留空则重置为默认密码 123456" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="resetDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleResetPassword">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { userApi } from '@/api/index.js'

const users = ref([])
const dialogVisible = ref(false)
const resetDialogVisible = ref(false)
const submitting = ref(false)
const formRef = ref(null)
const resetFormRef = ref(null)
const editingId = ref(null)
const resetTarget = ref(null)

const roleLabels = { admin: '系统管理员', assessor: '评估专业人员', deptManager: '部门负责人', riskControl: '风控', office: '办公室', ceo: '总经理' }
const roleColors = { admin: 'danger', assessor: 'primary', deptManager: 'warning', riskControl: 'warning', office: '', ceo: 'success' }

const initialForm = () => ({ username: '', name: '', role: '', department: '', email: '', status: 'active' })
const form = reactive(initialForm())
const resetForm = reactive({ password: '' })

const rules = {
  username:   [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  name:       [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  role:       [{ required: true, message: '请选择角色', trigger: 'change' }],
  department: [{ required: true, message: '请输入部门', trigger: 'blur' }],
  email:      [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
  ],
}
const resetRules = {}

onMounted(async () => {
  const res = await userApi.list()
  users.value = res.data
})

function openCreateDialog() {
  editingId.value = null
  Object.assign(form, initialForm())
  dialogVisible.value = true
}

function openEditDialog(row) {
  editingId.value = row.id
  Object.assign(form, { username: row.username, name: row.name, role: row.role, department: row.department, email: row.email, status: row.status })
  dialogVisible.value = true
}

function openResetDialog(row) {
  resetTarget.value = row
  resetForm.password = ''
  resetDialogVisible.value = true
}

async function handleSubmit() {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  submitting.value = true
  try {
    if (editingId.value) {
      const res = await userApi.update(editingId.value, { name: form.name, role: form.role, department: form.department, email: form.email, status: form.status })
      const idx = users.value.findIndex(u => u.id === editingId.value)
      if (idx !== -1) users.value[idx] = res.data
      ElMessage.success('用户信息已更新')
    } else {
      const res = await userApi.create({ ...form })
      users.value.push(res.data)
      ElMessage.success('用户创建成功')
    }
    dialogVisible.value = false
  } catch {
    ElMessage.error('操作失败，请重试')
  } finally {
    submitting.value = false
  }
}

async function handleResetPassword() {
  submitting.value = true
  try {
    await userApi.resetPassword(resetTarget.value.id, resetForm.password || '123456')
    ElMessage.success(`密码已重置为：${resetForm.password || '123456'}`)
    resetDialogVisible.value = false
  } catch {
    ElMessage.error('重置失败，请重试')
  } finally {
    submitting.value = false
  }
}

async function toggleStatus(row) {
  const newStatus = row.status === 'active' ? 'disabled' : 'active'
  try {
    const res = await userApi.update(row.id, { status: newStatus })
    const idx = users.value.findIndex(u => u.id === row.id)
    if (idx !== -1) users.value[idx] = res.data
    ElMessage.success(newStatus === 'active' ? '用户已启用' : '用户已禁用')
  } catch {
    ElMessage.error('操作失败')
  }
}
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.page-header h3 { margin: 0; font-size: 20px; font-weight: 600; }
</style>
