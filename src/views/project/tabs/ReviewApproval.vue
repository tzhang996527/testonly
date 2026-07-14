<template>
  <div class="review-tab">
    <el-row :gutter="20">
      <el-col :span="14">
        <el-card shadow="never" header="底稿上传">
          <div class="scratch-docs">
            <div v-for="doc in scratchDocTypes" :key="doc.key" class="scratch-doc-item">
              <div class="scratch-doc-label">
                <el-icon><Document /></el-icon>
                {{ doc.label }}
              </div>
              <template v-if="attachments[doc.key].length">
                <div
                  v-for="(file, idx) in attachments[doc.key]"
                  :key="idx"
                  class="scratch-file-row"
                >
                  <el-icon style="color:#1677ff"><Paperclip /></el-icon>
                  <span class="file-name">{{ file.name }}</span>
                  <el-button link type="primary" size="small">下载</el-button>
                  <el-button v-if="!locked" link type="danger" size="small" @click="attachments[doc.key].splice(idx, 1)">删除</el-button>
                </div>
              </template>
              <div v-else class="scratch-empty">
                <el-upload
                  v-model:file-list="attachments[doc.key]"
                  action="#"
                  :auto-upload="false"
                  :limit="3"
                  accept=".pdf,.doc,.docx,.xlsx,.xls"
                  :disabled="locked"
                  :on-exceed="() => ElMessage.warning('最多上传3个文件')"
                >
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
              <el-checkbox value="reviewing">审核中</el-checkbox>
              <el-checkbox value="approved">审核通过</el-checkbox>
              <el-checkbox value="rejected">已驳回</el-checkbox>
            </div>
          </el-checkbox-group>
        </el-card>

        <el-card v-if="!locked" shadow="never" header="审批流配置" style="margin-top:16px">
          <ApprovalFlowConfig ref="flowConfigRef" v-model="approvalFlow" />
          <div style="margin-top:16px">
            <el-button type="primary" :loading="saving" @click="saveReview">保存并发送审批</el-button>
          </div>
        </el-card>
      </el-col>

      <el-col :span="10">
        <ApprovalFlowCard
          header="审核审批"
          :approvals="project?.reviewApprovals || []"
          :on-submit="handleApprove"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Document, Paperclip, Upload } from '@element-plus/icons-vue'
import { useProjectStore } from '@/stores/project.js'
import ApprovalFlowConfig from '@/components/common/ApprovalFlowConfig.vue'
import ApprovalFlowCard from '@/components/common/ApprovalFlowCard.vue'

const route = useRoute()
const projectStore = useProjectStore()

const project = computed(() => projectStore.current)

const saving = ref(false)
const erpStatus = ref([])
const approvalFlow = ref([])
const flowConfigRef = ref()

const locked = computed(() => (projectStore.current?.currentStep ?? 1) > 6)

const scratchDocTypes = [
  { key: 'assessReport', label: '评估报告' },
  { key: 'assessNote', label: '评估说明' },
  { key: 'tripleReview', label: '三审单' },
  { key: 'majorIssue', label: '重大问题处理结果' },
]

const attachments = reactive({
  assessReport: [],
  assessNote: [],
  tripleReview: [],
  majorIssue: [],
})

async function saveReview() {
  const flowError = flowConfigRef.value?.validate()
  if (flowError) {
    ElMessage.warning(flowError)
    return
  }
  saving.value = true
  try {
    await projectStore.saveReviewInfo(route.params.id, {
      approvalFlow: approvalFlow.value,
      erpStatus: erpStatus.value,
    })
    ElMessage.success('审核审批信息已保存，审批请求已发送')
  } finally {
    saving.value = false
  }
}

async function handleApprove(payload) {
  await projectStore.approveReview(route.params.id, payload)
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

.erp-status-list { display: flex; flex-direction: column; gap: 12px; }
</style>
