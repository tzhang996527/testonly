<template>
  <div class="prework-tab">
    <el-row :gutter="20">
      <el-col :span="14">
        <el-card shadow="never" header="业务委托合同">
          <el-alert
            v-if="locked"
            title="前期工作已锁定，内容不可修改"
            type="success"
            :closable="false"
            show-icon
            style="margin-bottom:16px"
          />
          <el-form label-width="120px">
            <el-form-item label="合同编号">
              <el-input v-model="form.contractNo" placeholder="合同编号" :disabled="locked" />
            </el-form-item>
            <el-form-item label="委托单位">
              <el-input v-model="form.clientName" placeholder="委托单位名称" :disabled="locked" />
            </el-form-item>
            <el-form-item label="签订日期">
              <el-date-picker v-model="form.signDate" type="date" value-format="YYYY-MM-DD" :disabled="locked" />
            </el-form-item>
            <el-form-item label="合同金额">
              <el-input-number v-model="form.amount" :precision="2" :min="0" :disabled="locked" />
            </el-form-item>
            <el-form-item label="计划开始日期">
              <el-date-picker v-model="form.planStart" type="date" value-format="YYYY-MM-DD" :disabled="locked" />
            </el-form-item>
            <el-form-item label="计划完成日期">
              <el-date-picker v-model="form.planEnd" type="date" value-format="YYYY-MM-DD" :disabled="locked" />
            </el-form-item>
            <el-form-item label="人员安排">
              <el-select v-model="form.members" multiple placeholder="选择参与人员" :disabled="locked">
                <el-option label="张伟" value="张伟" />
                <el-option label="李娜" value="李娜" />
                <el-option label="王磊" value="王磊" />
              </el-select>
            </el-form-item>
          </el-form>
        </el-card>

        <el-card shadow="never" header="ERP 状态确认" style="margin-top:16px">
          <el-checkbox-group v-model="erpStatus" :disabled="locked">
            <div class="erp-status-list">
              <el-checkbox label="contractSigned" value="contractSigned">合同已签</el-checkbox>
              <el-checkbox label="listLocked" value="listLocked">清单已锁定</el-checkbox>
              <el-checkbox label="staffArranged" value="staffArranged">人员安排已完成</el-checkbox>
            </div>
          </el-checkbox-group>
        </el-card>

        <el-card v-if="!locked" shadow="never" header="审批流配置" style="margin-top:16px">
          <ApprovalFlowConfig ref="flowConfigRef" v-model="approvalFlow" />
          <div style="margin-top:16px">
            <el-button type="primary" :loading="saving" @click="savePreWork">保存并发送审批</el-button>
          </div>
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
              <div v-else class="scratch-empty">
                <el-upload action="#" :auto-upload="false" accept=".pdf,.docx,.xlsx" :disabled="locked">
                  <el-button size="small" :icon="Upload" :disabled="locked">上传</el-button>
                </el-upload>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="10">
        <ApprovalFlowCard
          header="前期工作审批"
          :approvals="project?.preWorkApprovals || []"
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
import ApprovalFlowCard from '@/components/common/ApprovalFlowCard.vue'
import ApprovalFlowConfig from '@/components/common/ApprovalFlowConfig.vue'

const route = useRoute()
const projectStore = useProjectStore()

const project = computed(() => projectStore.current)

const currentStep = computed(() => projectStore.current?.currentStep ?? 1)
const preWorkApproved = computed(() =>
  project.value?.preWorkApprovals?.length > 0 &&
  project.value.preWorkApprovals.every(n => n.nodeStatus === 'approved')
)
const locked = computed(() => preWorkApproved.value || currentStep.value > 2)
const flowConfigRef = ref()
const saving = ref(false)
const approvalFlow = ref([])
const erpStatus = ref([])

const form = reactive({
  contractNo: 'HT-2024-001',
  clientName: '某科技股份有限公司',
  signDate: '2024-01-20',
  amount: 150000,
  planStart: '2024-02-01',
  planEnd: '2024-03-31',
  members: ['张伟', '李娜'],
})

const scratchDocTypes = [
  { key: 'entrustment',   label: '业务委托书' },
  { key: 'materialList',  label: '资料清单' },
  { key: 'assessPlan',    label: '评估计划表' },
]

function scratchFiles(key) {
  const files = project.value?.attachments?.[key]
  if (!files?.length) return []
  return files.map(f => ({
    name: f.name,
    size: f.size
      ? (typeof f.size === 'number' ? (f.size / 1024 / 1024).toFixed(1) + ' MB' : f.size)
      : '',
  }))
}

async function handleApprove(payload) {
  await projectStore.approvePreWork(route.params.id, payload)
  ElMessage.success(payload.action === 'approved' ? '已审批通过' : '已驳回')
}

async function savePreWork() {
  const flowError = flowConfigRef.value?.validate()
  if (flowError) {
    ElMessage.warning(flowError)
    return
  }
  saving.value = true
  try {
    await projectStore.savePreWorkInfo(route.params.id, {
      form: { ...form },
      approvalFlow: approvalFlow.value,
    })
    ElMessage.success('前期工作已保存，审批请求已发送')
  } finally {
    saving.value = false
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

.erp-status-list { display: flex; flex-direction: column; gap: 12px; }
</style>
