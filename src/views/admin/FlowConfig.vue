<template>
  <div>
    <div class="page-header">
      <h3>流程配置</h3>
    </div>
    <el-card shadow="never">
      <template #header>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span>审批流配置</span>
          <el-button size="small" type="primary" :icon="Plus" @click="openAdd">新增</el-button>
        </div>
      </template>
      <el-table :data="configs" stripe v-loading="loading">
        <el-table-column label="流程名称" prop="name" width="160" />
        <el-table-column label="适用场景" prop="scene" min-width="160" />
        <el-table-column label="审批节点" min-width="300">
          <template #default="{ row }">
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
              <template v-for="(node, idx) in row.nodes" :key="idx">
                <el-tag size="small">{{ node.role }}</el-tag>
                <el-icon v-if="idx < row.nodes.length - 1" style="color:#bfbfbf"><ArrowRight /></el-icon>
              </template>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="是否启用" width="100">
          <template #default="{ row }">
            <el-switch :model-value="!!row.enabled" @change="val => toggleEnabled(row, val)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="110">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="openEdit(row)">编辑</el-button>
            <el-popconfirm title="确认删除？" @confirm="remove(row.id)">
              <template #reference>
                <el-button link type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Add / Edit dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="editingId ? '编辑审批流' : '新增审批流'"
      width="760px"
      :close-on-click-modal="false"
    >
      <el-form :model="form" label-width="90px" style="margin-bottom:0">
        <el-form-item label="流程名称">
          <el-input v-model="form.name" placeholder="如：评估立项审批" />
        </el-form-item>
        <el-form-item label="适用场景">
          <el-input v-model="form.scene" placeholder="如：新建评估立项" />
        </el-form-item>
        <el-form-item label="审批节点">
          <ApprovalFlowConfig ref="flowConfigRef" v-model="form.nodes" />
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
import { Plus, ArrowRight } from '@element-plus/icons-vue'
import { flowConfigApi } from '@/api/index.js'
import ApprovalFlowConfig from '@/components/common/ApprovalFlowConfig.vue'

const configs = ref([])
const loading = ref(false)

const dialogVisible = ref(false)
const editingId = ref(null)
const saving = ref(false)
const flowConfigRef = ref()
const form = ref({ name: '', scene: '', nodes: [] })

async function load() {
  loading.value = true
  try {
    const { data } = await flowConfigApi.list()
    configs.value = data
  } finally {
    loading.value = false
  }
}

onMounted(load)

function openAdd() {
  editingId.value = null
  form.value = { name: '', scene: '', nodes: [] }
  dialogVisible.value = true
}

function openEdit(row) {
  editingId.value = row.id
  form.value = { name: row.name, scene: row.scene || '', nodes: row.nodes.map(n => ({ ...n })) }
  dialogVisible.value = true
}

async function save() {
  if (!form.value.name.trim()) return ElMessage.warning('请输入流程名称')
  const flowError = flowConfigRef.value?.validate()
  if (flowError) return ElMessage.warning(flowError)
  saving.value = true
  try {
    if (editingId.value) {
      await flowConfigApi.update(editingId.value, form.value)
    } else {
      await flowConfigApi.create(form.value)
    }
    dialogVisible.value = false
    await load()
    ElMessage.success('已保存')
  } catch {
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

async function remove(id) {
  try {
    await flowConfigApi.remove(id)
    await load()
    ElMessage.success('已删除')
  } catch {
    ElMessage.error('删除失败')
  }
}

async function toggleEnabled(row, val) {
  try {
    await flowConfigApi.update(row.id, { enabled: val ? 1 : 0 })
    await load()
  } catch {
    ElMessage.error('操作失败')
  }
}
</script>

<style scoped>
.page-header { display: flex; align-items: center; margin-bottom: 16px; }
.page-header h3 { margin: 0; font-size: 20px; font-weight: 600; }
</style>
