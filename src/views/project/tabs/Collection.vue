<template>
  <div class="collection-tab">
    <el-tabs v-model="activeCategory" type="card">
      <el-tab-pane label="权属证明" name="ownership" />
      <el-tab-pane label="财务资料" name="financial" />
      <el-tab-pane label="技术资料" name="technical" />
      <el-tab-pane label="外部资料" name="external" />
    </el-tabs>

    <div style="margin:16px 0;display:flex;justify-content:space-between">
      <el-descriptions :column="4" size="small">
        <el-descriptions-item v-for="cat in categories" :key="cat.key" :label="cat.label">
          <el-tag :type="getCategoryCount(cat.key) > 0 ? 'success' : 'info'" size="small">
            {{ getCategoryCount(cat.key) }} 份
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>
      <el-button type="primary" :icon="Upload" :disabled="locked" @click="showUploadDialog = true">上传资料</el-button>
    </div>

    <el-table :data="filteredDocs" stripe v-loading="loading">
      <el-table-column label="文件名" prop="name" min-width="200">
        <template #default="{ row }">
          <el-icon style="margin-right:6px;color:#1677ff"><Document /></el-icon>
          {{ row.name }}
        </template>
      </el-table-column>
      <el-table-column label="类别" prop="category" width="110">
        <template #default="{ row }">
          <el-tag size="small" type="info">{{ categoryLabels[row.category] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="大小" prop="size" width="90" />
      <el-table-column label="上传人" prop="uploadedBy" width="100" />
      <el-table-column label="上传时间" prop="uploadedAt" width="165" />
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'verified' ? 'success' : 'warning'" size="small">
            {{ row.status === 'verified' ? '已核验' : '待核验' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="previewFile(row)">预览</el-button>
          <el-button link type="primary" size="small" @click="downloadFile(row)">下载</el-button>
          <el-button link type="danger" size="small" :disabled="locked" @click="deleteDoc(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Upload Dialog -->
    <el-dialog v-model="showUploadDialog" title="上传资料" width="500px">
      <el-form label-width="80px">
        <el-form-item label="资料类别">
          <el-select v-model="uploadForm.category">
            <el-option v-for="cat in categories" :key="cat.key" :label="cat.label" :value="cat.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="文件">
          <el-upload
            v-model:file-list="uploadForm.fileList"
            drag
            action="#"
            :auto-upload="false"
            multiple
            accept=".pdf,.doc,.docx,.xlsx,.xls,.jpg,.png"
            :on-exceed="() => ElMessage.warning('最多上传10个文件')"
          >
            <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
            <div>拖拽文件到此处，或 <em>点击上传</em></div>
            <template #tip><div style="font-size:12px;color:#8c8c8c;margin-top:4px">支持 PDF、Word、Excel、图片，单个文件不超过 20MB</div></template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showUploadDialog = false">取消</el-button>
        <el-button type="primary" :loading="uploading" @click="doUpload">上传</el-button>
      </template>
    </el-dialog>

    <el-card shadow="never" style="margin-top:16px">
      <template #header>ERP 状态确认</template>
      <el-checkbox-group v-model="erpStatus" :disabled="locked">
        <div class="erp-status-list">
          <el-checkbox value="collectionDone">资料收集完成</el-checkbox>
        </div>
      </el-checkbox-group>
      <div style="margin-top:16px">
        <el-button type="primary" :loading="saving" :disabled="locked" @click="saveCollection">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Upload, Document, UploadFilled } from '@element-plus/icons-vue'
import { documentApi } from '@/api/index.js'
import { useProjectStore } from '@/stores/project.js'

const route = useRoute()
const docs = ref([])
const loading = ref(false)
const saving = ref(false)
const erpStatus = ref([])
const activeCategory = ref('ownership')
const showUploadDialog = ref(false)
const uploading = ref(false)
const uploadForm = ref({ category: 'ownership', fileList: [] })

const projectStore = useProjectStore()
const locked = computed(() => (projectStore.current?.currentStep ?? 1) > 4)

const categories = [
  { key: 'ownership', label: '权属证明' },
  { key: 'financial', label: '财务资料' },
  { key: 'technical', label: '技术资料' },
  { key: 'external', label: '外部资料' },
]

const categoryLabels = { ownership: '权属证明', financial: '财务资料', technical: '技术资料', external: '外部资料' }

const filteredDocs = computed(() => docs.value.filter(d => d.category === activeCategory.value))

function getCategoryCount(cat) {
  return docs.value.filter(d => d.category === cat).length
}

async function doUpload() {
  if (!uploadForm.value.fileList.length) {
    ElMessage.warning('请先选择文件')
    return
  }
  uploading.value = true
  try {
    for (const item of uploadForm.value.fileList) {
      await documentApi.upload(route.params.id, item.raw, uploadForm.value.category)
    }
    showUploadDialog.value = false
    uploadForm.value.fileList = []
    ElMessage.success('上传成功')
    const res = await documentApi.list(route.params.id)
    docs.value = res.data
  } finally {
    uploading.value = false
  }
}

async function saveCollection() {
  saving.value = true
  try {
    await projectStore.saveCollectionInfo?.(route.params.id, { erpStatus: erpStatus.value })
    ElMessage.success('资料收集信息已保存')
  } finally {
    saving.value = false
  }
}

function previewFile(row) {
  if (!row.storedName) return ElMessage.warning('该文件暂无预览')
  window.open(documentApi.fileUrl(row.storedName), '_blank')
}

function downloadFile(row) {
  if (!row.storedName) return ElMessage.warning('该文件暂无下载')
  const a = document.createElement('a')
  a.href = documentApi.fileUrl(row.storedName)
  a.download = row.name
  a.click()
}

async function deleteDoc(row) {
  await documentApi.remove(row.id)
  docs.value = docs.value.filter(d => d.id !== row.id)
  ElMessage.success('已删除')
}

onMounted(async () => {
  loading.value = true
  try {
    const res = await documentApi.list(route.params.id)
    docs.value = res.data
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.erp-status-list { display: flex; flex-direction: column; gap: 12px; }
</style>
