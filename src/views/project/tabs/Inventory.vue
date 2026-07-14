<template>
  <div class="inventory-tab">
    <div style="margin-bottom:16px;display:flex;justify-content:space-between;align-items:center">
      <span style="font-weight:600">资产盘点明细</span>
      <div>
        <el-tag type="warning" style="margin-right:8px">差异待处理: {{ pendingCount }}</el-tag>
        <el-button type="primary" size="small" :icon="Plus" :disabled="locked">录入盘点数据</el-button>
        <el-button type="success" size="small" @click="exportDiff">导出差异表</el-button>
      </div>
    </div>

    <el-table :data="items" v-loading="loading" stripe border>
      <el-table-column :label="t('assets.assetNo')" prop="assetNo" width="140" />
      <el-table-column :label="t('assets.assetName')" prop="assetName" min-width="130" />
      <el-table-column label="账面净值" prop="bookValue" width="120">
        <template #default="{ row }">{{ formatMoney(row.bookValue) }}</template>
      </el-table-column>
      <el-table-column label="现场核查值" prop="fieldValue" width="130">
        <template #default="{ row }">{{ formatMoney(row.fieldValue) }}</template>
      </el-table-column>
      <el-table-column label="差异额" prop="diff" width="110">
        <template #default="{ row }">
          <span :class="row.diff < 0 ? 'negative' : row.diff > 0 ? 'positive' : ''">
            {{ row.diff === 0 ? '-' : formatMoney(row.diff) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="差异原因" prop="diffReason" min-width="120" />
      <el-table-column label="处理状态" width="110">
        <template #default="{ row }">
          <el-tag :type="row.status === 'handled' ? 'success' : row.status === 'done' ? 'success' : 'warning'" size="small">
            {{ row.status === 'handled' ? '已处理' : row.status === 'done' ? '无差异' : '待处理' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button v-if="row.diff !== 0 && row.status !== 'handled'" link type="warning" size="small" :disabled="locked" @click="handleDiff(row)">处理差异</el-button>
          <el-button link type="primary" size="small" @click="viewDetail(row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-card shadow="never" style="margin-top:16px">
      <template #header>现场勘察记录</template>
      <el-form label-width="120px">
        <el-form-item label="勘察日期"><el-date-picker v-model="surveyForm.date" value-format="YYYY-MM-DD" :disabled="locked" /></el-form-item>
        <el-form-item label="勘察人员"><el-input v-model="surveyForm.personnel" placeholder="参与勘察人员" :disabled="locked" /></el-form-item>
        <el-form-item label="勘察说明"><el-input v-model="surveyForm.description" type="textarea" :rows="3" placeholder="勘察现场情况描述" :disabled="locked" /></el-form-item>
        <el-form-item label="访谈记录">
          <el-upload action="#" :auto-upload="false" :disabled="locked"><el-button size="small" type="primary" :disabled="locked">上传访谈记录</el-button></el-upload>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never" style="margin-top:16px">
      <template #header>底稿上传</template>
      <div class="scratch-docs">
        <div v-for="doc in scratchDocTypes" :key="doc.key" class="scratch-doc-item">
          <div class="scratch-doc-label">
            <el-icon><Document /></el-icon>
            {{ doc.label }}
          </div>
          <template v-if="scratchFiles(doc.key).length">
            <div v-for="(file, idx) in scratchFiles(doc.key)" :key="idx" class="scratch-file-row">
              <el-icon style="color:#1677ff"><Paperclip /></el-icon>
              <span class="file-name">{{ file.name }}</span>
              <span class="file-size">{{ file.size }}</span>
              <el-button link type="primary" size="small">下载</el-button>
            </div>
          </template>
          <div v-else class="scratch-empty">
            <el-upload action="#" :auto-upload="false" accept=".pdf,.docx,.xlsx" :disabled="locked">
              <el-button size="small" :icon="Upload" :disabled="locked">上传</el-button>
            </el-upload>
          </div>
        </div>
      </div>
    </el-card>

    <el-card shadow="never" style="margin-top:16px">
      <template #header>ERP 状态确认</template>
      <el-checkbox-group v-model="erpStatus" :disabled="locked">
        <div class="erp-status-list">
          <el-checkbox value="inventoryDone">盘点完成</el-checkbox>
          <el-checkbox value="diffPending">差异待处理</el-checkbox>
          <el-checkbox value="diffHandled">差异已处理</el-checkbox>
          <el-checkbox value="detailEntered">评估明细表、各科目工作底稿已录入</el-checkbox>
          <el-checkbox value="interviewUploaded">访谈记录已上传</el-checkbox>
        </div>
      </el-checkbox-group>
      <div style="margin-top:16px">
        <el-button type="primary" :loading="saving" :disabled="locked" @click="saveInventory">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { Plus, Document, Paperclip, Upload } from '@element-plus/icons-vue'
import { inventoryApi } from '@/api/index.js'
import { useProjectStore } from '@/stores/project.js'

const { t } = useI18n()
const route = useRoute()
const items = ref([])
const loading = ref(false)
const saving = ref(false)
const erpStatus = ref([])

const surveyForm = reactive({
  date: '',
  personnel: '',
  description: '',
})

const projectStore = useProjectStore()
const locked = computed(() => (projectStore.current?.currentStep ?? 1) > 3)

const pendingCount = computed(() => items.value.filter(i => i.diff !== 0 && i.status !== 'handled').length)

const scratchDocTypes = [
  { key: 'assessDetail', label: '评估明细表' },
  { key: 'subjectWorkpaper', label: '各科目工作底稿' },
]

function scratchFiles(key) {
  const files = projectStore.current?.attachments?.[key]
  if (!files?.length) return []
  return files.map(f => ({
    name: f.name,
    size: f.size
      ? (typeof f.size === 'number' ? (f.size / 1024 / 1024).toFixed(1) + ' MB' : f.size)
      : '',
  }))
}

function formatMoney(v) {
  return v ? '¥' + v.toLocaleString() : '-'
}

function handleDiff(row) {
  row.status = 'handled'
  ElMessage.success('差异已标记处理')
}

function viewDetail(row) {
  ElMessage.info('查看资产: ' + row.assetName)
}

function exportDiff() {
  ElMessage.success('差异表已导出')
}

async function saveInventory() {
  saving.value = true
  try {
    await projectStore.saveInventoryInfo?.(route.params.id, { erpStatus: erpStatus.value })
    ElMessage.success('盘点信息已保存')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  loading.value = true
  try {
    const res = await inventoryApi.list(route.params.id)
    items.value = res.data
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.negative { color: #ff4d4f; }
.positive { color: #52c41a; }

.scratch-docs { display: flex; flex-direction: column; gap: 0; }

.scratch-doc-item {
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.scratch-doc-item:last-child { border-bottom: none; }

.scratch-doc-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 8px;
}

.scratch-file-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0 4px 20px;
}

.file-name { flex: 1; font-size: 13px; color: #595959; }

.file-size { font-size: 12px; color: #bfbfbf; }

.erp-status-list { display: flex; flex-direction: column; gap: 12px; }
</style>
