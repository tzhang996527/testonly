<template>
  <div class="overview-tab">
    <el-row :gutter="20">
      <el-col :span="14">
        <el-card shadow="never" header="基本信息">
          <el-descriptions :column="2" border>
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
        </el-card>

        <el-card shadow="never" header="底稿" style="margin-top:16px">
          <div class="scratch-docs">
            <div v-for="doc in scratchDocTypes" :key="doc.key" class="scratch-doc-item">
              <div class="scratch-doc-label">
                <el-icon><Document /></el-icon>
                {{ doc.label }}
              </div>
              <template v-if="scratchFiles(doc.key).length">
                <div
                  v-for="(file, idx) in scratchFiles(doc.key)"
                  :key="idx"
                  class="scratch-file-row"
                >
                  <el-icon style="color:#1677ff"><Paperclip /></el-icon>
                  <span class="file-name">{{ file.name }}</span>
                  <span class="file-size">{{ file.size }}</span>
                  <el-button link type="primary" size="small">下载</el-button>
                </div>
              </template>
              <div v-else class="scratch-empty">未上传</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card shadow="never" header="审批流程">
          <ApprovalFlow :approvals="project?.approvals || []" />
          <div v-if="pendingPerson" style="margin-top:16px">
            <el-divider>我的审批操作</el-divider>
            <div style="margin-bottom:8px;font-size:13px;color:#595959">
              节点：<b>{{ pendingPerson.role }}</b> &nbsp;·&nbsp; 审批人：<b>{{ pendingPerson.name }}</b>
            </div>
            <el-input
              v-model="approvalComment"
              type="textarea"
              placeholder="审批意见（选填）"
              :rows="2"
              style="margin-bottom:12px"
            />
            <el-button type="success" :loading="submitting" @click="doApprove('approved')">
              {{ t('common.approve') }}
            </el-button>
            <el-button type="danger" :loading="submitting" @click="doApprove('rejected')">
              {{ t('common.reject') }}
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Document, Paperclip } from '@element-plus/icons-vue'
import { useProjectStore } from '@/stores/project.js'
import { useAuthStore } from '@/stores/auth.js'
import StatusTag from '@/components/common/StatusTag.vue'
import ApprovalFlow from '@/components/common/ApprovalFlow.vue'

const { t } = useI18n()
const route = useRoute()
const projectStore = useProjectStore()
const authStore = useAuthStore()

const project = computed(() => projectStore.current)
const approvalComment = ref('')
const submitting = ref(false)

const scratchDocTypes = [
  { key: 'basicInfo',      label: '基本情况表' },
  { key: 'independence',   label: '独立性审核' },
  { key: 'riskAssessment', label: '风险评价表' },
]

// attachments 存储在 project.attachments，每个 key 是 FileList-like 数组
function scratchFiles(key) {
  const files = project.value?.attachments?.[key]
  if (!files || !files.length) return []
  // el-upload file-list 格式：{ name, size, ... }；兼容字节数转换
  return files.map(f => ({
    name: f.name,
    size: f.size
      ? (typeof f.size === 'number' ? (f.size / 1024 / 1024).toFixed(1) + ' MB' : f.size)
      : '',
  }))
}

// 找到当前登录用户在哪个节点中、且该节点尚未通过、且本人还未审批
const pendingPerson = computed(() => {
  if (!project.value) return null
  const username = authStore.user?.username
  for (const node of project.value.approvals) {
    if (node.nodeStatus === 'approved' || node.nodeStatus === 'rejected') continue
    const person = node.approvers.find(a => a.username === username && a.status === 'pending')
    if (person) return { role: node.role, name: person.name, username: person.username }
  }
  return null
})

async function doApprove(action) {
  if (!pendingPerson.value) return
  submitting.value = true
  try {
    await projectStore.approve(route.params.id, {
      role: pendingPerson.value.role,
      username: pendingPerson.value.username,
      action,
      comment: approvalComment.value,
    })
    ElMessage.success(action === 'approved' ? '已审批通过' : '已驳回')
    approvalComment.value = ''
  } finally {
    submitting.value = false
  }
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
