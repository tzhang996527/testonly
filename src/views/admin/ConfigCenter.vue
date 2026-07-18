<template>
  <div>
    <div class="page-header">
      <h3>配置中心</h3>
    </div>

    <el-row :gutter="20">
      <!-- 评估目的 -->
      <el-col :span="12">
        <el-card shadow="never">
          <template #header>
            <div style="display:flex;justify-content:space-between;align-items:center">
              <span>评估目的</span>
              <el-button size="small" type="primary" :icon="Plus" @click="openAdd('purpose')">新增</el-button>
            </div>
          </template>
          <el-table :data="purposes" stripe v-loading="loadingPurpose">
            <el-table-column label="名称" prop="name" />
            <el-table-column label="排序" prop="sortOrder" width="70" />
            <el-table-column label="启用" width="80">
              <template #default="{ row }">
                <el-switch
                  :model-value="!!row.enabled"
                  @change="val => toggleEnabled('purpose', row, val)"
                />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="110">
              <template #default="{ row }">
                <el-button link type="primary" size="small" @click="openEdit('purpose', row)">编辑</el-button>
                <el-popconfirm title="确认删除？" @confirm="remove('purpose', row.id)">
                  <template #reference>
                    <el-button link type="danger" size="small">删除</el-button>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <!-- 评估方法 -->
      <el-col :span="12">
        <el-card shadow="never">
          <template #header>
            <div style="display:flex;justify-content:space-between;align-items:center">
              <span>评估方法</span>
              <el-button size="small" type="primary" :icon="Plus" @click="openAdd('method')">新增</el-button>
            </div>
          </template>
          <el-table :data="methods" stripe v-loading="loadingMethod">
            <el-table-column label="名称" prop="name" />
            <el-table-column label="排序" prop="sortOrder" width="70" />
            <el-table-column label="启用" width="80">
              <template #default="{ row }">
                <el-switch
                  :model-value="!!row.enabled"
                  @change="val => toggleEnabled('method', row, val)"
                />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="110">
              <template #default="{ row }">
                <el-button link type="primary" size="small" @click="openEdit('method', row)">编辑</el-button>
                <el-popconfirm title="确认删除？" @confirm="remove('method', row.id)">
                  <template #reference>
                    <el-button link type="danger" size="small">删除</el-button>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- Add/Edit dialog -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="400px" :close-on-click-modal="false">
      <el-form :model="form" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sortOrder" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="save">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { configApi } from '@/api/index.js'

const purposes = ref([])
const methods = ref([])
const loadingPurpose = ref(false)
const loadingMethod = ref(false)

const dialogVisible = ref(false)
const dialogTitle = ref('')
const saving = ref(false)
const editingType = ref('')  // 'purpose' | 'method'
const editingId = ref(null)
const form = ref({ name: '', sortOrder: 0 })

async function loadAll() {
  loadingPurpose.value = true
  loadingMethod.value = true
  try {
    const [p, m] = await Promise.all([configApi.listPurposes(), configApi.listMethods()])
    purposes.value = p.data
    methods.value = m.data
  } finally {
    loadingPurpose.value = false
    loadingMethod.value = false
  }
}

onMounted(loadAll)

function openAdd(type) {
  editingType.value = type
  editingId.value = null
  form.value = { name: '', sortOrder: 0 }
  dialogTitle.value = type === 'purpose' ? '新增评估目的' : '新增评估方法'
  dialogVisible.value = true
}

function openEdit(type, row) {
  editingType.value = type
  editingId.value = row.id
  form.value = { name: row.name, sortOrder: row.sortOrder }
  dialogTitle.value = type === 'purpose' ? '编辑评估目的' : '编辑评估方法'
  dialogVisible.value = true
}

async function save() {
  if (!form.value.name.trim()) return ElMessage.warning('请输入名称')
  saving.value = true
  try {
    if (editingId.value) {
      if (editingType.value === 'purpose') {
        await configApi.updatePurpose(editingId.value, form.value)
      } else {
        await configApi.updateMethod(editingId.value, form.value)
      }
    } else {
      if (editingType.value === 'purpose') {
        await configApi.createPurpose(form.value)
      } else {
        await configApi.createMethod(form.value)
      }
    }
    dialogVisible.value = false
    await loadAll()
    ElMessage.success('已保存')
  } catch {
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

async function remove(type, id) {
  try {
    if (type === 'purpose') {
      await configApi.deletePurpose(id)
    } else {
      await configApi.deleteMethod(id)
    }
    await loadAll()
    ElMessage.success('已删除')
  } catch {
    ElMessage.error('删除失败')
  }
}

async function toggleEnabled(type, row, val) {
  try {
    if (type === 'purpose') {
      await configApi.updatePurpose(row.id, { enabled: val ? 1 : 0 })
    } else {
      await configApi.updateMethod(row.id, { enabled: val ? 1 : 0 })
    }
    await loadAll()
  } catch {
    ElMessage.error('操作失败')
  }
}
</script>

<style scoped>
.page-header { display: flex; align-items: center; margin-bottom: 16px; }
.page-header h3 { margin: 0; font-size: 20px; font-weight: 600; }
</style>
