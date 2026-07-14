<template>
  <div>
    <div class="page-header">
      <h3>角色管理</h3>
      <el-button type="primary" @click="showAddDialog">新建角色</el-button>
    </div>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="never" header="角色列表">
          <el-menu :default-active="selectedRole" @select="handleRoleSelect">
            <el-menu-item v-for="role in roles" :key="role.key" :index="role.key">
              <el-tag :type="role.tagType" size="small" style="margin-right:8px">{{ role.label }}</el-tag>
              <el-popconfirm
                title="确定删除此角色？"
                confirm-button-text="确定"
                cancel-button-text="取消"
                @confirm.stop="handleDelete(role)"
              >
                <template #reference>
                  <el-button
                    link
                    type="danger"
                    size="small"
                    style="margin-left:auto; min-width:auto; padding:2px 4px;"
                    @click.stop
                  >
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </template>
              </el-popconfirm>
            </el-menu-item>
          </el-menu>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card shadow="never" :header="'权限配置: ' + (roles.find(r=>r.key===selectedRole)?.label || '')">
          <el-tree
            ref="permTreeRef"
            :data="permTree"
            show-checkbox
            node-key="id"
            :default-checked-keys="currentCheckedKeys"
            :props="{ label: 'label', children: 'children' }"
            @check="handlePermCheck"
          />
        </el-card>
      </el-col>
    </el-row>

    <!-- 新建角色对话框 -->
    <el-dialog v-model="dialogVisible" title="新建角色" width="520px" :close-on-click-modal="false">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="角色标识" prop="key">
          <el-input v-model="form.key" placeholder="如：auditor" />
        </el-form-item>
        <el-form-item label="角色名称" prop="label">
          <el-input v-model="form.label" placeholder="如：审计人员" />
        </el-form-item>
        <el-form-item label="标签类型" prop="tagType">
          <el-select v-model="form.tagType" placeholder="请选择" clearable style="width:100%">
            <el-option label="默认" value="" />
            <el-option label="危险" value="danger" />
            <el-option label="主要" value="primary" />
            <el-option label="警告" value="warning" />
            <el-option label="成功" value="success" />
            <el-option label="信息" value="info" />
          </el-select>
        </el-form-item>
        <el-form-item label="权限配置">
          <el-tree
            ref="dialogPermTreeRef"
            :data="permTree"
            show-checkbox
            node-key="id"
            :default-checked-keys="form.permissions"
            :props="{ label: 'label', children: 'children' }"
            @check="handleDialogPermCheck"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { roleApi } from '@/api/index.js'
import { ElMessage, ElMessageBox } from 'element-plus'

const selectedRole = ref('assessor')
const permTreeRef = ref(null)
const dialogPermTreeRef = ref(null)

// 每个角色对应的权限ID列表
const defaultRolePerms = {
  admin: [11, 12, 13, 14, 21, 22, 23, 31, 32, 33, 41, 42, 43, 51, 52, 53, 54, 61, 62, 63, 71, 72, 73],
  assessor: [11, 12, 13, 14, 21, 22, 23, 31, 32, 41, 42, 61, 63],
  deptManager: [11, 13, 21, 22, 23, 31, 32, 41, 42, 43, 51, 52, 61, 62, 63],
  chiefEngineer: [11, 13, 21, 22, 23, 31, 32, 41, 42, 43, 51, 52, 53, 61, 62, 63],
  ceo: [11, 13, 14, 21, 23, 31, 32, 41, 43, 51, 52, 53, 54, 61, 62, 63],
  riskControl: [11, 13, 14, 21, 31, 41, 51, 52, 61],
}

const rolePermissions = reactive({
  admin: defaultRolePerms.admin,
  assessor: defaultRolePerms.assessor,
  deptManager: defaultRolePerms.deptManager,
  chiefEngineer: defaultRolePerms.chiefEngineer,
  ceo: defaultRolePerms.ceo,
  riskControl: defaultRolePerms.riskControl,
})

const roles = ref([
  { key: 'admin', label: '系统管理员', tagType: 'danger' },
  { key: 'assessor', label: '评估专业人员', tagType: 'primary' },
  { key: 'deptManager', label: '部门负责人', tagType: 'warning' },
  { key: 'chiefEngineer', label: '总师室', tagType: 'warning' },
  { key: 'ceo', label: '总经理', tagType: 'success' },
  { key: 'riskControl', label: '风控', tagType: '' },
])

const currentCheckedKeys = computed(() => rolePermissions[selectedRole.value] || [])

const permTree = [
  { id: 1, label: '评估立项', children: [
    { id: 11, label: '查看' }, { id: 12, label: '创建' }, { id: 13, label: '编辑' }, { id: 14, label: '提交审批' },
  ]},
  { id: 2, label: '清查盘点', children: [
    { id: 21, label: '查看' }, { id: 22, label: '录入盘点数据' }, { id: 23, label: '处理差异' },
  ]},
  { id: 3, label: '资料收集', children: [
    { id: 31, label: '查看' }, { id: 32, label: '上传资料' }, { id: 33, label: '删除资料' },
  ]},
  { id: 4, label: '评定估算', children: [
    { id: 41, label: '查看' }, { id: 42, label: '录入估算' }, { id: 43, label: '修改估算' },
  ]},
  { id: 5, label: '审核审批', children: [
    { id: 51, label: '查看' }, { id: 52, label: '一级审核' }, { id: 53, label: '二级审核' }, { id: 54, label: '最终审批' },
  ]},
  { id: 6, label: '资产台账', children: [
    { id: 61, label: '查看' }, { id: 62, label: '编辑' }, { id: 63, label: '导出' },
  ]},
  { id: 7, label: '系统管理', children: [
    { id: 71, label: '用户管理' }, { id: 72, label: '角色管理' }, { id: 73, label: '流程配置' },
  ]},
]

// 新建角色
const dialogVisible = ref(false)
const submitting = ref(false)
const formRef = ref(null)
const form = reactive({
  key: '',
  label: '',
  tagType: '',
  permissions: [],
})

const rules = {
  key: [
    { required: true, message: '请输入角色标识', trigger: 'blur' },
    { pattern: /^[a-zA-Z][a-zA-Z0-9]*$/, message: '角色标识必须以字母开头，仅包含字母和数字', trigger: 'blur' },
    { validator: (rule, value, callback) => {
      if (roles.value.some(r => r.key === value)) {
        callback(new Error('角色标识已存在'))
      } else {
        callback()
      }
    }, trigger: 'blur' },
  ],
  label: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { validator: (rule, value, callback) => {
      if (roles.value.some(r => r.label === value)) {
        callback(new Error('角色名称已存在'))
      } else {
        callback()
      }
    }, trigger: 'blur' },
  ],
}

async function handleDelete(role) {
  try {
    await ElMessageBox.confirm(
      `确定要删除角色「${role.label}」吗？此操作不可恢复。`,
      '删除确认',
      { confirmButtonText: '确定删除', cancelButtonText: '取消', type: 'warning' }
    )
    await roleApi.remove(role.key)
    // 从 roles 列表中移除
    const idx = roles.value.findIndex(r => r.key === role.key)
    if (idx !== -1) roles.value.splice(idx, 1)
    // 清理权限数据
    delete rolePermissions[role.key]
    // 如果删除的是当前选中的角色，切换到第一个角色
    if (selectedRole.value === role.key) {
      selectedRole.value = roles.value[0]?.key || ''
    }
    ElMessage.success(`角色「${role.label}」已删除`)
  } catch (e) {
    // 用户取消或删除失败都不处理
    if (e !== 'cancel') {
      ElMessage.error('删除失败: ' + (e.message || '未知错误'))
    }
  }
}

function handleRoleSelect(key) {
  selectedRole.value = key
  // 切换后同步树勾选状态
  setTimeout(() => {
    if (permTreeRef.value) {
      permTreeRef.value.setCheckedKeys(rolePermissions[key] || [])
    }
  }, 0)
}

function handlePermCheck() {
  if (permTreeRef.value) {
    rolePermissions[selectedRole.value] = permTreeRef.value.getCheckedKeys()
  }
}

function handleDialogPermCheck() {
  if (dialogPermTreeRef.value) {
    form.permissions = dialogPermTreeRef.value.getCheckedKeys()
  }
}

function showAddDialog() {
  form.key = ''
  form.label = ''
  form.tagType = ''
  form.permissions = []
  dialogVisible.value = true
  // 等待 dialog 渲染完成后清空树勾选
  setTimeout(() => {
    if (dialogPermTreeRef.value) {
      dialogPermTreeRef.value.setCheckedKeys([])
    }
  }, 0)
}

async function handleSubmit() {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  submitting.value = true
  try {
    const { data } = await roleApi.create({ key: form.key, label: form.label, tagType: form.tagType })
    roles.value.push(data)
    // 保存权限
    rolePermissions[data.key] = [...form.permissions]
    selectedRole.value = data.key
    dialogVisible.value = false
    ElMessage.success('角色创建成功')
  } catch (e) {
    ElMessage.error('创建失败: ' + (e.message || '未知错误'))
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.page-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}
</style>