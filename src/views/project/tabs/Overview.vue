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
        <ApprovalFlowCard
          :approvals="project?.approvals || []"
          :on-submit="handleApprove"
        />
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
import StatusTag from '@/components/common/StatusTag.vue'
import ApprovalFlowCard from '@/components/common/ApprovalFlowCard.vue'

const { t } = useI18n()
const route = useRoute()
const projectStore = useProjectStore()

const project = computed(() => projectStore.current)

const scratchDocTypes = [
  { key: 'basicInfo',      label: '基本情况表' },
  { key: 'independence',   label: '独立性审核' },
  { key: 'riskAssessment', label: '风险评价表' },
]

function scratchFiles(key) {
  const files = project.value?.attachments?.[key]
  if (!files || !files.length) return []
  return files.map(f => ({
    name: f.name,
    size: f.size
      ? (typeof f.size === 'number' ? (f.size / 1024 / 1024).toFixed(1) + ' MB' : f.size)
      : '',
  }))
}

async function handleApprove(payload) {
  await projectStore.approve(route.params.id, payload)
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
