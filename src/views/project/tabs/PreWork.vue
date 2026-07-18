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
              <el-checkbox value="contractSigned">合同已签</el-checkbox>
              <el-checkbox value="listLocked">清单已锁定</el-checkbox>
              <el-checkbox value="staffArranged">人员安排已完成</el-checkbox>
            </div>
          </el-checkbox-group>
        </el-card>

        <el-card shadow="never" header="底稿" style="margin-top:16px">
          <div class="scratch-docs">
            <div v-for="doc in scratchDocTypes" :key="doc.key" class="scratch-doc-item">
              <div class="scratch-doc-label">
                <el-icon><Document /></el-icon>
                {{ doc.label }}
              </div>
              <el-upload
                v-model:file-list="attachments[doc.key]"
                action="#"
                :auto-upload="false"
                :limit="3"
                accept=".pdf,.doc,.docx,.xlsx,.xls,.jpg,.png"
                :disabled="locked"
                :on-exceed="() => ElMessage.warning('最多上传3个文件')"
                :on-remove="(file) => markForDelete(file)"
              >
                <el-button size="small" :icon="Upload" :disabled="locked">上传文件</el-button>
              </el-upload>
            </div>
          </div>
        </el-card>

        <el-card v-if="!locked" shadow="never" header="审批流配置" style="margin-top:16px">
          <ApprovalFlowConfig ref="flowConfigRef" v-model="approvalFlow" />
          <div style="margin-top:16px">
            <el-button type="primary" :loading="saving" @click="savePreWork">保存并发送审批</el-button>
          </div>
        </el-card>
      </el-col>

      <el-col :span="10">
        <ApprovalFlowCard
          header="前期工作审批"
          :approvals="stageApprovals"
          :on-submit="handleApprove"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Document, Upload } from '@element-plus/icons-vue'
import { useProjectStore } from '@/stores/project.js'
import { documentApi, stagesApi } from '@/api/index.js'
import ApprovalFlowCard from '@/components/common/ApprovalFlowCard.vue'
import ApprovalFlowConfig from '@/components/common/ApprovalFlowConfig.vue'

const route = useRoute()
const projectStore = useProjectStore()

const project = computed(() => projectStore.current)
const currentStep = computed(() => projectStore.current?.currentStep ?? 1)
const stageApprovals = computed(() => project.value?.approvalsByStage?.['pre-work'] || [])
const preWorkApproved = computed(() =>
  stageApprovals.value.length > 0 &&
  stageApprovals.value.every(n => n.nodeStatus === 'approved')
)
const locked = computed(() => preWorkApproved.value || currentStep.value > 2)

const flowConfigRef = ref()
const saving = ref(false)
const approvalFlow = ref([])
const erpStatus = ref([])
const pendingDeletes = ref([])

const form = reactive({
  contractNo: '',
  clientName: '',
  signDate: '',
  amount: 0,
  planStart: '',
  planEnd: '',
  members: [],
})

const scratchDocTypes = [
  { key: 'entrustment',  label: '业务委托书' },
  { key: 'materialList', label: '资料清单' },
  { key: 'assessPlan',   label: '评估计划表' },
]

const attachments = reactive({
  entrustment: [],
  materialList: [],
  assessPlan: [],
})

async function loadStageData() {
  // load form data
  const { data } = await stagesApi.get(route.params.id, 'pre-work')
  if (data) {
    form.contractNo = data.contractNo || ''
    form.clientName = data.clientName || ''
    form.signDate   = data.signDate   || ''
    form.amount     = data.amount     || 0
    form.planStart  = data.planStart  || ''
    form.planEnd    = data.planEnd    || ''
    form.members    = Array.isArray(data.members) ? data.members : []
    erpStatus.value = Array.isArray(data.erpStatus) ? data.erpStatus : []
  }
  // load existing files into upload lists
  const { data: docs } = await documentApi.list(route.params.id, 'pre-work')
  for (const key of Object.keys(attachments)) attachments[key] = []
  for (const doc of docs) {
    if (attachments[doc.category] !== undefined) {
      attachments[doc.category].push({
        uid: doc.id, name: doc.name, size: doc.size,
        status: 'success', _docId: doc.id,
      })
    }
  }
  // restore approval flow from saved nodes — fetch directly, not from store cache
  const nodes = await projectStore.fetchStageApprovals(route.params.id, 'pre-work')
  if (nodes?.length) {
    approvalFlow.value = nodes.map(n => ({
      role: n.role,
      approvers: n.approvers.map(a => ({ name: a.name, username: a.username })),
    }))
  }
}

onMounted(loadStageData)

function markForDelete(file) {
  if (file._docId) pendingDeletes.value.push(file._docId)
}

async function handleApprove(payload) {
  await projectStore.approveStage(route.params.id, 'pre-work', payload)
  ElMessage.success(payload.action === 'approved' ? '已审批通过' : '已驳回')
}

function downloadFile(file) {
  if (!file.storedName) return ElMessage.warning('该文件暂无下载')
  const a = document.createElement('a')
  a.href = documentApi.fileUrl(file.storedName)
  a.download = file.name
  a.click()
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
      form: { ...form, members: [...form.members], erpStatus: [...erpStatus.value] },
      approvalFlow: approvalFlow.value,
    })

    // delete removed files
    if (pendingDeletes.value.length) {
      await Promise.all(pendingDeletes.value.map(id => documentApi.remove(id)))
      pendingDeletes.value = []
    }
    // upload new files
    const uploads = []
    for (const doc of scratchDocTypes) {
      for (const item of attachments[doc.key]) {
        if (item.raw) uploads.push(documentApi.upload(route.params.id, item.raw, 'pre-work', doc.key))
      }
    }
    if (uploads.length) await Promise.all(uploads)

    await loadStageData()
    ElMessage.success('前期工作已保存，审批请求已发送')
  } catch (e) {
    const msg = e?.response?.data?.message || e?.message || '请重试'
    ElMessage.error('保存失败：' + msg)
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

.erp-status-list { display: flex; flex-direction: column; gap: 12px; }
</style>
