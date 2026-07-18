<template>
  <div class="overview-tab">
    <el-row :gutter="20">
      <el-col :span="14">
        <el-card shadow="never">
          <template #header>
            <div style="display:flex;justify-content:space-between;align-items:center">
              <span>基本信息</span>
              <div v-if="isDraft">
                <template v-if="!editing">
                  <el-button size="small" type="primary" :icon="Edit" @click="startEdit">编辑</el-button>
                </template>
                <template v-else>
                  <el-button size="small" :loading="saving" type="primary" @click="saveEdit">保存</el-button>
                  <el-button size="small" @click="cancelEdit">取消</el-button>
                </template>
              </div>
            </div>
          </template>

          <!-- view mode -->
          <el-descriptions v-if="!editing" :column="2" border>
            <el-descriptions-item :label="t('project.projectNo')">{{ project?.projectNo }}</el-descriptions-item>
            <el-descriptions-item :label="t('project.purpose')">{{ project?.purpose }}</el-descriptions-item>
            <el-descriptions-item :label="t('project.baseDate')">{{ project?.baseDate }}</el-descriptions-item>
            <el-descriptions-item :label="t('project.assetCategory')">
              {{ project ? t(`project.assetCategories.${project.assetCategory}`) : '' }}
            </el-descriptions-item>
            <el-descriptions-item :label="t('project.responsible')">{{ project?.responsible }}</el-descriptions-item>
            <el-descriptions-item :label="t('project.department')">{{ project?.department }}</el-descriptions-item>
            <el-descriptions-item :label="t('common.status')">
              <StatusTag :status="project?.status" />
            </el-descriptions-item>
            <el-descriptions-item :label="t('common.createdAt')">{{ project?.createdAt }}</el-descriptions-item>
            <el-descriptions-item :label="t('common.remark')" :span="2">{{ project?.remark }}</el-descriptions-item>
          </el-descriptions>

          <!-- edit mode -->
          <el-form v-else :model="editForm" label-width="110px">
            <el-form-item :label="t('project.purpose')">
              <el-input v-model="editForm.purpose" />
            </el-form-item>
            <el-form-item :label="t('project.baseDate')">
              <el-date-picker v-model="editForm.baseDate" type="date" value-format="YYYY-MM-DD" />
            </el-form-item>
            <el-form-item :label="t('project.assetCategory')">
              <el-select v-model="editForm.assetCategory">
                <el-option :label="t('project.assetCategories.fixed')"      value="fixed" />
                <el-option :label="t('project.assetCategories.intangible')" value="intangible" />
                <el-option :label="t('project.assetCategories.inventory')"  value="inventory" />
                <el-option :label="t('project.assetCategories.whole')"      value="whole" />
              </el-select>
            </el-form-item>
            <el-form-item :label="t('project.responsible')">
              <el-select v-model="editForm.responsible">
                <el-option label="张伟" value="张伟" />
                <el-option label="李娜" value="李娜" />
                <el-option label="王磊" value="王磊" />
                <el-option label="赵敏" value="赵敏" />
              </el-select>
            </el-form-item>
            <el-form-item :label="t('project.department')">
              <el-input v-model="editForm.department" />
            </el-form-item>
            <el-form-item :label="t('common.remark')">
              <el-input v-model="editForm.remark" type="textarea" :rows="3" />
            </el-form-item>
          </el-form>
        </el-card>

        <el-card shadow="never" header="底稿" style="margin-top:16px">
          <div class="scratch-docs">
            <div v-for="doc in scratchDocTypes" :key="doc.key" class="scratch-doc-item">
              <div class="scratch-doc-label">
                <el-icon><Document /></el-icon>
                {{ doc.label }}
              </div>
              <template v-if="!editing && scratchFiles(doc.key).length">
                <div
                  v-for="(file, idx) in scratchFiles(doc.key)"
                  :key="idx"
                  class="scratch-file-row"
                >
                  <el-icon style="color:#1677ff"><Paperclip /></el-icon>
                  <span class="file-name">{{ file.name }}</span>
                  <span class="file-size">{{ file.size }}</span>
                  <el-button link type="primary" size="small" @click="downloadFile(file)">下载</el-button>
                </div>
              </template>
              <div v-if="editing" style="margin-top:6px;padding-left:20px">
                <el-upload
                  v-model:file-list="attachments[doc.key]"
                  action="#"
                  :auto-upload="false"
                  :limit="3"
                  accept=".pdf,.doc,.docx,.xlsx,.xls,.jpg,.png"
                  :on-exceed="() => ElMessage.warning('最多上传3个文件')"
                  :on-remove="(file) => markForDelete(file)"
                >
                  <el-button size="small" :icon="Upload">上传文件</el-button>
                </el-upload>
              </div>
              <div v-else-if="!scratchFiles(doc.key).length" class="scratch-empty">未上传</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="10">
        <ApprovalFlowCard
          :approvals="stageApprovals"
          :on-submit="handleApprove"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Document, Paperclip, Edit, Upload } from '@element-plus/icons-vue'
import { useProjectStore } from '@/stores/project.js'
import { documentApi } from '@/api/index.js'
import StatusTag from '@/components/common/StatusTag.vue'
import ApprovalFlowCard from '@/components/common/ApprovalFlowCard.vue'

const { t } = useI18n()
const route = useRoute()
const projectStore = useProjectStore()

const project = computed(() => projectStore.current)
const isDraft = computed(() => project.value?.status === 'draft')
const stageApprovals = computed(() => project.value?.approvalsByStage?.['overview'] || [])
const editing = ref(false)
const saving = ref(false)
const pendingDeletes = ref([]) // document ids to delete on save

const attachments = reactive({
  basicInfo: [],
  independence: [],
  riskAssessment: [],
})

const editForm = reactive({
  purpose: '', baseDate: '', assetCategory: '',
  responsible: '', department: '', remark: '',
})

async function startEdit() {
  const p = project.value
  editForm.purpose      = p.purpose      || ''
  editForm.baseDate     = p.baseDate     || ''
  editForm.assetCategory= p.assetCategory|| ''
  editForm.responsible  = p.responsible  || ''
  editForm.department   = p.department   || ''
  editForm.remark       = p.remark       || ''
  pendingDeletes.value  = []

  // Load existing files into upload lists so el-upload can show and remove them
  const { data: docs } = await documentApi.list(route.params.id, 'overview')
  for (const key of Object.keys(attachments)) attachments[key] = []
  for (const doc of docs) {
    if (attachments[doc.category] !== undefined) {
      attachments[doc.category].push({
        uid: doc.id,
        name: doc.name,
        size: doc.size,
        status: 'success',
        _docId: doc.id,
      })
    }
  }
  editing.value = true
}

function cancelEdit() {
  editing.value = false
  pendingDeletes.value = []
  attachments.basicInfo = []
  attachments.independence = []
  attachments.riskAssessment = []
}

async function saveEdit() {
  saving.value = true
  try {
    await projectStore.update(route.params.id, { ...editForm })
    if (pendingDeletes.value.length) {
      await Promise.all(pendingDeletes.value.map(id => documentApi.remove(id)))
      pendingDeletes.value = []
    }
    const uploads = []
    for (const doc of scratchDocTypes) {
      for (const item of attachments[doc.key]) {
        if (item.raw) uploads.push(documentApi.upload(route.params.id, item.raw, 'overview', doc.key))
      }
    }
    if (uploads.length) await Promise.all(uploads)
    await projectStore.fetchOne(route.params.id)
    await loadSavedDocs()
    editing.value = false
    ElMessage.success('已保存')
  } finally {
    saving.value = false
  }
}

function markForDelete(file) {
  if (file._docId) pendingDeletes.value.push(file._docId)
}

const scratchDocTypes = [
  { key: 'basicInfo',      label: '基本情况表' },
  { key: 'independence',   label: '独立性审核' },
  { key: 'riskAssessment', label: '风险评价表' },
]

// saved files loaded from DB (view mode)
const savedDocs = ref([])

async function loadSavedDocs() {
  const { data } = await documentApi.list(route.params.id, 'overview')
  savedDocs.value = data
}

onMounted(loadSavedDocs)

function scratchFiles(key) {
  return savedDocs.value
    .filter(f => f.category === key)
    .map(f => ({
      name: f.name,
      storedName: f.storedName,
      size: f.size || '',
    }))
}

function downloadFile(file) {
  if (!file.storedName) return ElMessage.warning('该文件暂无下载')
  const a = document.createElement('a')
  a.href = documentApi.fileUrl(file.storedName)
  a.download = file.name
  a.click()
}

async function handleApprove(payload) {
  await projectStore.approveStage(route.params.id, 'overview', payload)
  ElMessage.success(payload.action === 'approved' ? '已审批通过' : '已驳回')
}
</script>

<style scoped>
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
.scratch-empty { padding-left: 20px; font-size: 13px; color: #bfbfbf; }
</style>
