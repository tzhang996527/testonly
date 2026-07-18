<template>
  <div class="estimation-tab">
    <el-row :gutter="20">
      <el-col :span="14">
    <div style="margin-bottom:16px;display:flex;justify-content:space-between;align-items:center">
      <span style="font-weight:600">评定估算明细表</span>
      <div>
        <el-button type="primary" :icon="Plus" :disabled="locked" @click="showAddDialog = true">添加资产</el-button>
        <el-button :disabled="locked" @click="autoCalc">系统自动计算</el-button>
        <el-button type="success" :disabled="locked">生成评估明细表</el-button>
      </div>
    </div>

    <el-alert v-if="!assets.length" title="暂无评估资产，请先添加或从盘点结果导入" type="info" show-icon />

    <el-table v-if="assets.length" :data="assets" stripe border>
      <el-table-column :label="t('assets.assetNo')" prop="assetNo" width="130" />
      <el-table-column :label="t('assets.assetName')" prop="assetName" min-width="130" />
      <el-table-column :label="t('assets.originalValue')" prop="originalValue" width="120">
        <template #default="{ row }">{{ fmt(row.originalValue) }}</template>
      </el-table-column>
      <el-table-column :label="t('assets.netValue')" prop="netValue" width="110">
        <template #default="{ row }">{{ fmt(row.netValue) }}</template>
      </el-table-column>
      <el-table-column :label="t('assets.assessedValue')" prop="assessedValue" width="120">
        <template #default="{ row }">
          <span style="font-weight:600;color:#1677ff">{{ fmt(row.assessedValue) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="t('assets.appreciation')" width="110">
        <template #default="{ row }">
          <span :class="(row.assessedValue - row.netValue) >= 0 ? 'positive' : 'negative'">
            {{ fmt(row.assessedValue - row.netValue) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="t('assets.appreciationRate')" width="100">
        <template #default="{ row }">
          {{ row.netValue ? ((row.assessedValue - row.netValue) / row.netValue * 100).toFixed(1) + '%' : '-' }}
        </template>
      </el-table-column>
      <el-table-column :label="t('assets.method')" prop="method" width="120">
        <template #default="{ row }">{{ t(`assets.methods.${row.method}`) }}</template>
      </el-table-column>
    </el-table>

    <el-card v-if="assets.length" shadow="never" style="margin-top:16px">
      <template #header>汇总统计</template>
      <el-descriptions :column="4" border>
        <el-descriptions-item label="资产总数">{{ assets.length }} 项</el-descriptions-item>
        <el-descriptions-item label="原值合计">{{ fmt(totalOriginal) }}</el-descriptions-item>
        <el-descriptions-item label="净值合计">{{ fmt(totalNet) }}</el-descriptions-item>
        <el-descriptions-item label="评估值合计">
          <span style="font-weight:700;color:#1677ff">{{ fmt(totalAssessed) }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="增减值合计">
          <span :class="(totalAssessed - totalNet) >= 0 ? 'positive' : 'negative'">
            {{ fmt(totalAssessed - totalNet) }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="综合增值率">
          {{ totalNet ? ((totalAssessed - totalNet) / totalNet * 100).toFixed(1) + '%' : '-' }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-dialog v-model="showAddDialog" title="添加评估资产" width="600px">
      <el-form :model="addForm" label-width="120px">
        <el-form-item :label="t('assets.assetNo')"><el-input v-model="addForm.assetNo" /></el-form-item>
        <el-form-item :label="t('assets.assetName')"><el-input v-model="addForm.assetName" /></el-form-item>
        <el-form-item :label="t('assets.originalValue')"><el-input-number v-model="addForm.originalValue" :min="0" /></el-form-item>
        <el-form-item :label="t('assets.netValue')"><el-input-number v-model="addForm.netValue" :min="0" /></el-form-item>
        <el-form-item :label="t('assets.assessedValue')"><el-input-number v-model="addForm.assessedValue" :min="0" /></el-form-item>
        <el-form-item :label="t('assets.method')">
          <el-select v-model="addForm.method">
            <el-option :label="t('assets.methods.market')" value="market" />
            <el-option :label="t('assets.methods.income')" value="income" />
            <el-option :label="t('assets.methods.assetBase')" value="assetBase" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="addAsset">确定</el-button>
      </template>
    </el-dialog>

    <el-card shadow="never" style="margin-top:16px">
      <template #header>ERP 状态确认</template>
      <el-checkbox-group v-model="erpStatus" :disabled="locked">
        <div class="erp-status-list">
          <el-checkbox value="estimationDone">初步评估完成</el-checkbox>
        </div>
      </el-checkbox-group>
      <div style="margin-top:16px">
        <PermGuard :perm="PERM.PROJECT_EDIT" mode="disable" disabled-tip="无编辑权限">
          <template #default="{ disabled }">
            <el-button type="primary" :loading="saving" :disabled="disabled || locked" @click="saveEstimation">保存</el-button>
          </template>
        </PermGuard>
      </div>
    </el-card>
      </el-col>
      <el-col :span="10">
        <ApprovalFlowCard
          header="评定估算审批"
          :approvals="stageApprovals"
          :on-submit="handleApprove"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { assetApi } from '@/api/index.js'
import { useProjectStore } from '@/stores/project.js'
import ApprovalFlowCard from '@/components/common/ApprovalFlowCard.vue'
import PermGuard from '@/components/common/PermGuard.vue'
import { PERM } from '@/constants/permissions.js'

const { t } = useI18n()
const route = useRoute()
const assets = ref([])
const showAddDialog = ref(false)
const saving = ref(false)
const erpStatus = ref([])
const addForm = ref({ assetNo: '', assetName: '', originalValue: 0, netValue: 0, assessedValue: 0, method: 'market' })

const projectStore = useProjectStore()
const locked = computed(() => (projectStore.current?.currentStep ?? 1) > 5)
const stageApprovals = computed(() => projectStore.current?.approvalsByStage?.['estimation'] || [])
async function handleApprove(payload) {
  await projectStore.approveStage(route.params.id, 'estimation', payload)
  ElMessage.success(payload.action === 'approved' ? '已审批通过' : '已驳回')
}

const totalOriginal = computed(() => assets.value.reduce((s, a) => s + a.originalValue, 0))
const totalNet = computed(() => assets.value.reduce((s, a) => s + a.netValue, 0))
const totalAssessed = computed(() => assets.value.reduce((s, a) => s + a.assessedValue, 0))

function fmt(v) { return v ? '¥' + v.toLocaleString() : '-' }

function autoCalc() { ElMessage.success('系统已按账面净值自动计算评估值') }

async function addAsset() {
  await assetApi.create({ ...addForm.value, projectId: route.params.id })
  ElMessage.success('资产已添加')
  showAddDialog.value = false
  const res = await assetApi.list({ projectId: route.params.id })
  assets.value = res.data
}

async function saveEstimation() {
  saving.value = true
  try {
    await projectStore.saveEstimationInfo?.(route.params.id, { erpStatus: erpStatus.value })
    ElMessage.success('初步评估信息已保存')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  const res = await assetApi.list({ projectId: route.params.id })
  assets.value = res.data
})
</script>

<style scoped>
.positive { color: #52c41a; font-weight: 600; }
.negative { color: #ff4d4f; font-weight: 600; }
.erp-status-list { display: flex; flex-direction: column; gap: 12px; }
</style>
