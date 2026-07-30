<template>
  <div>
    <div class="page-header">
      <h3>角色管理</h3>
      <el-button type="primary" @click="showAddDialog">新建角色</el-button>
    </div>
    <el-row :gutter="20" v-loading="loading">
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
                    link type="danger" size="small"
                    style="margin-left:auto;min-width:auto;padding:2px 4px"
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
          <div style="margin-top:12px">
            <el-button type="primary" size="small" :loading="saving" @click="savePermissions">保存权限</el-button>
            <span v-if="unsaved" style="margin-left:10px;color:#fa8c16;font-size:12px">有未保存的修改</span>
          </div>
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
import { ref, computed, onMounted } from 'vue'
import { Delete } from '@element-plus/icons-vue'
import { roleApi } from '@/api/index.js'
import { ElMessage } from 'element-plus'
import { PERM } from '@/constants/permissions.js'

const loading   = ref(false)
const saving    = ref(false)
const unsaved   = ref(false)
const roles     = ref([])
const selectedRole = ref('')
const permTreeRef = ref(null)
const dialogPermTreeRef = ref(null)

// roleKey -> permission id[]
const rolePermissions = ref({})

const currentCheckedKeys = computed(() => rolePermissions.value[selectedRole.value] || [])

const permTree = [
  { id: 100, label: '资产评估', children: [
    { id: 1, label: '评估立项', children: [
      { id: PERM.PROJECT_VIEW,   label: '查看' },
      { id: PERM.PROJECT_CREATE, label: '创建' },
      { id: PERM.PROJECT_EDIT,   label: '编辑' },
      { id: PERM.PROJECT_SUBMIT, label: '提交审批' },
    ]},
    { id: 2, label: '清查盘点', children: [
      { id: PERM.INVENTORY_VIEW,  label: '查看' },
      { id: PERM.INVENTORY_INPUT, label: '录入盘点数据' },
      { id: PERM.INVENTORY_DIFF,  label: '处理差异' },
    ]},
    { id: 3, label: '资料收集', children: [
      { id: PERM.COLLECTION_VIEW,   label: '查看' },
      { id: PERM.COLLECTION_UPLOAD, label: '上传资料' },
      { id: PERM.COLLECTION_DELETE, label: '删除资料' },
    ]},
    { id: 4, label: '评定估算', children: [
      { id: PERM.ESTIMATION_VIEW,  label: '查看' },
      { id: PERM.ESTIMATION_INPUT, label: '录入估算' },
      { id: PERM.ESTIMATION_EDIT,  label: '修改估算' },
    ]},
    { id: 5, label: '审核审批', children: [
      { id: PERM.REVIEW_VIEW,  label: '查看' },
      { id: PERM.REVIEW_L1,    label: '一级审核' },
      { id: PERM.REVIEW_L2,    label: '二级审核' },
      { id: PERM.REVIEW_FINAL, label: '最终审批' },
    ]},
    { id: 6, label: '资产台账', children: [
      { id: PERM.ASSETS_VIEW,   label: '查看' },
      { id: PERM.ASSETS_EDIT,   label: '编辑' },
      { id: PERM.ASSETS_EXPORT, label: '导出' },
    ]},
    { id: 7, label: '报表中心', children: [
      { id: PERM.REPORTS_VIEW, label: '查看报表' },
    ]},
  ]},
  { id: 9, label: '会计', children: [
    { id: PERM.ACCOUNTING_VIEW,   label: '查看' },
    { id: PERM.ACCOUNTING_EDIT,   label: '编辑' },
    { id: PERM.ACCOUNTING_EXPORT, label: '导出' },
  ]},
  { id: 10, label: '工程核算', children: [
    { id: PERM.ENGINEERING_VIEW,   label: '查看' },
    { id: PERM.ENGINEERING_EDIT,   label: '编辑' },
    { id: PERM.ENGINEERING_EXPORT, label: '导出' },
  ]},
  { id: 201, label: '人事', children: [
    { id: PERM.HR_VIEW,   label: '查看' },
    { id: PERM.HR_EDIT,   label: '编辑' },
    { id: PERM.HR_EXPORT, label: '导出' },
  ]},
  { id: 202, label: '工作日志', children: [
    { id: PERM.WORKLOG_VIEW,     label: '查看自己的日志' },
    { id: PERM.WORKLOG_EDIT,     label: '填写日志' },
    { id: PERM.WORKLOG_VIEW_ALL, label: '全员概览' },
  ]},
  { id: 8, label: '系统管理', children: [
    { id: PERM.ADMIN_USERS,        label: '用户管理' },
    { id: PERM.ADMIN_ROLES,        label: '角色管理' },
    { id: PERM.ADMIN_FLOW,         label: '流程配置' },
    { id: PERM.CHANGE_LOGS_VIEW,   label: '变更记录查看' },
    { id: PERM.CHANGE_LOGS_DELETE, label: '变更记录删除' },
  ]},
]

async function load() {
  loading.value = true
  try {
    const { data } = await roleApi.list()
    roles.value = data
    data.forEach(r => { rolePermissions.value[r.key] = r.permissions })
    if (!selectedRole.value && data.length) selectedRole.value = data[0].key
  } finally {
    loading.value = false
  }
}

onMounted(load)

function handleRoleSelect(key) {
  selectedRole.value = key
  unsaved.value = false
  setTimeout(() => {
    permTreeRef.value?.setCheckedKeys(rolePermissions.value[key] || [])
  }, 0)
}

function handlePermCheck() {
  unsaved.value = true
}

async function savePermissions() {
  if (!permTreeRef.value) return
  const perms = permTreeRef.value.getCheckedKeys(true)
  saving.value = true
  try {
    await roleApi.savePermissions(selectedRole.value, perms)
    rolePermissions.value[selectedRole.value] = perms
    unsaved.value = false
    ElMessage.success('权限已保存')
  } catch {
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

async function handleDelete(role) {
  try {
    await roleApi.remove(role.key)
    roles.value = roles.value.filter(r => r.key !== role.key)
    delete rolePermissions.value[role.key]
    if (selectedRole.value === role.key) {
      selectedRole.value = roles.value[0]?.key || ''
    }
    ElMessage.success(`角色「${role.label}」已删除`)
  } catch (e) {
    ElMessage.error('删除失败: ' + (e.message || '未知错误'))
  }
}

// ── new role dialog ───────────────────────────────────────
const dialogVisible = ref(false)
const submitting    = ref(false)
const formRef       = ref(null)
const form          = ref({ key: '', label: '', tagType: '', permissions: [] })

const rules = {
  key: [
    { required: true, message: '请输入角色标识', trigger: 'blur' },
    { pattern: /^[a-zA-Z][a-zA-Z0-9]*$/, message: '角色标识必须以字母开头，仅包含字母和数字', trigger: 'blur' },
    { validator: (rule, value, callback) => {
        roles.value.some(r => r.key === value)
          ? callback(new Error('角色标识已存在'))
          : callback()
      }, trigger: 'blur' },
  ],
  label: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { validator: (rule, value, callback) => {
        roles.value.some(r => r.label === value)
          ? callback(new Error('角色名称已存在'))
          : callback()
      }, trigger: 'blur' },
  ],
}

function showAddDialog() {
  form.value = { key: '', label: '', tagType: '', permissions: [] }
  dialogVisible.value = true
  setTimeout(() => dialogPermTreeRef.value?.setCheckedKeys([]), 0)
}

function handleDialogPermCheck() {
  if (dialogPermTreeRef.value) form.value.permissions = dialogPermTreeRef.value.getCheckedKeys()
}

async function handleSubmit() {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  submitting.value = true
  try {
    const { data } = await roleApi.create(form.value)
    roles.value.push(data)
    rolePermissions.value[data.key] = data.permissions || []
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
.page-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
.page-header h3 { margin:0; font-size:20px; font-weight:600; }
</style>
