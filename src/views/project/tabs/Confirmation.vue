<template>
  <div class="confirmation-tab">
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card shadow="never" header="评估结果确认单">
          <el-form :model="form" label-width="130px">
            <el-row :gutter="16">
              <el-col :span="12">
                <el-form-item :label="t('project.projectNo')">
                  <el-input v-model="form.projectNo" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="报告编号">
                  <el-input v-model="form.reportNo" placeholder="RPT-2024-XXX" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="16">
              <el-col :span="12">
                <el-form-item :label="t('assets.originalValue')">
                  <el-input-number v-model="form.originalValue" :disabled="locked" style="width:100%" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="t('assets.netValue')">
                  <el-input-number v-model="form.netValue" :disabled="locked" style="width:100%" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="16">
              <el-col :span="12">
                <el-form-item :label="t('assets.assessedValue')">
                  <el-input-number v-model="form.assessedValue" :disabled="locked" style="width:100%" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="t('assets.method')">
                  <el-select v-model="form.method" :disabled="locked" style="width:100%">
                    <el-option :label="t('assets.methods.market')" value="market" />
                    <el-option :label="t('assets.methods.income')" value="income" />
                    <el-option :label="t('assets.methods.assetBase')" value="assetBase" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="评估机构">
              <el-input v-model="form.assessmentOrg" :disabled="locked" placeholder="内部/外部评估机构名称" />
            </el-form-item>
            <el-form-item :label="t('assets.assessor')">
              <el-input v-model="form.assessor" :disabled="locked" />
            </el-form-item>
            <el-form-item label="委托方意见">
              <el-input v-model="form.clientFeedback" :disabled="locked" type="textarea" :rows="3" />
            </el-form-item>

            <el-form-item v-if="!locked">
              <PermGuard :perm="PERM.PROJECT_EDIT" mode="disable" disabled-tip="无编辑权限">
                <template #default="{ disabled }">
                  <el-button type="primary" :disabled="disabled" @click="confirmResult">确认并锁定结果</el-button>
                  <el-button :disabled="disabled" @click="saveResult">保存草稿</el-button>
                </template>
              </PermGuard>
            </el-form-item>
            <el-form-item v-else>
              <el-tag type="success" size="large">结果已确认锁定 — 如需修改请走变更流程</el-tag>
              <el-button style="margin-left:16px">申请变更</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="never" header="确认状态">
          <div class="confirm-status">
            <el-icon :size="48" :color="locked ? '#52c41a' : '#faad14'">
              <component :is="locked ? CircleCheck : Clock" />
            </el-icon>
            <div style="margin-top:12px;font-size:16px;font-weight:600">
              {{ locked ? '结果已正式生效' : '待确认' }}
            </div>
            <div style="color:#8c8c8c;font-size:13px;margin-top:4px">
              {{ locked ? '确认时间: 2024-05-10 14:30' : '等待确认评估结果' }}
            </div>
          </div>
        </el-card>
        <ApprovalFlowCard
          header="结果确认审批"
          :approvals="stageApprovals"
          :on-submit="handleApprove"
          style="margin-top:16px"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { CircleCheck, Clock } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import { useProjectStore } from '@/stores/project.js'
import ApprovalFlowCard from '@/components/common/ApprovalFlowCard.vue'
import PermGuard from '@/components/common/PermGuard.vue'
import { PERM } from '@/constants/permissions.js'

const { t } = useI18n()
const route = useRoute()
const projectStore = useProjectStore()
const project = computed(() => projectStore.current)
const stageApprovals = computed(() => project.value?.approvalsByStage?.['confirmation'] || [])
async function handleApprove(payload) {
  await projectStore.approveStage(route.params.id, 'confirmation', payload)
  ElMessage.success(payload.action === 'approved' ? '已审批通过' : '已驳回')
}
const locked = ref(project.value?.status === 'confirmed' || project.value?.status === 'archived')

const form = ref({
  projectNo: project.value?.projectNo || '',
  reportNo: 'RPT-2024-001',
  originalValue: 7050000,
  netValue: 5712000,
  assessedValue: 8550000,
  method: 'assetBase',
  assessmentOrg: '内部评估',
  assessor: '李评估师',
  clientFeedback: '委托方已确认评估结果，无异议。',
})

function saveResult() { ElMessage.success('草稿已保存') }

async function confirmResult() {
  await ElMessageBox.confirm('确认后结果将被锁定，不可随意修改。是否继续？', '确认评估结果', {
    confirmButtonText: '确认锁定',
    cancelButtonText: '取消',
    type: 'warning',
  })
  locked.value = true
  ElMessage.success('评估结果已确认并锁定')
}
</script>

<style scoped>
.confirm-status { text-align: center; padding: 24px 0; }
</style>
