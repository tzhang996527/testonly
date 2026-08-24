<template>
  <div class="review-tab">
    <el-row :gutter="20">
      <el-col :span="14">
        <!-- 底稿表单（G-10 / G-11） -->
        <el-card shadow="never" style="margin-bottom:16px" class="scratch-tabs-card">
          <el-tabs type="border-card" class="scratch-tabs">
            <!-- G-10 评估报告审核表 -->
            <el-tab-pane label="G-10 评估报告审核表">
              <div class="form-sheet">
                <table class="form-table">
                  <colgroup>
                    <col style="width: 130px" />
                    <col />
                    <col style="width: 130px" />
                    <col />
                  </colgroup>
                  <tbody>
                    <tr>
                      <td colspan="4" class="form-title">上海城乡资产评估有限责任公司</td>
                    </tr>
                    <tr>
                      <td colspan="4" class="form-title-en">SHANGHAI URBAN &amp; RURAL ASSETS APPRAISAL CO.,LTD</td>
                    </tr>
                    <tr>
                      <td colspan="4" class="form-title">评估报告审核表　索引号：G-10</td>
                    </tr>
                    <tr>
                      <td class="label-cell">项目名称：</td>
                      <td colspan="3">
                        <input v-model="g10.projectName" class="cell-input" :disabled="locked" />
                      </td>
                    </tr>
                    <tr>
                      <td class="label-cell">报告文号：</td>
                      <td>
                        <input v-model="g10.reportNo" class="cell-input" :disabled="locked" />
                      </td>
                      <td class="label-cell">评估基准日：</td>
                      <td>
                        <input v-model="g10.baseDate" type="date" class="cell-input" :disabled="locked" />
                      </td>
                    </tr>
                    <tr>
                      <td class="label-cell">项目负责人：</td>
                      <td>
                        <input v-model="g10.projectLeader" class="cell-input" :disabled="locked" />
                      </td>
                      <td class="label-cell">签字资产评估专业人员：</td>
                      <td>
                        <input v-model="g10.signer" class="cell-input" :disabled="locked" />
                      </td>
                    </tr>
                    <tr>
                      <td class="label-cell-left" colspan="2">签字资产评估专业人员审核意见：</td>
                      <td class="label-cell-left" colspan="2">部门（项目）经理审核意见：</td>
                    </tr>
                    <tr>
                      <td colspan="2">
                        <textarea v-model="g10.signerOpinion" class="cell-textarea" rows="3" :disabled="locked" />
                      </td>
                      <td colspan="2">
                        <textarea v-model="g10.managerOpinion" class="cell-textarea" rows="3" :disabled="locked" />
                      </td>
                    </tr>
                    <tr>
                      <td class="label-cell-left" colspan="2">
                        二名资产评估专业人员签字及日期：
                        <input v-model="g10.signerSign" class="cell-input-inline" :disabled="locked" />
                      </td>
                      <td class="label-cell-left" colspan="2">
                        项目经理签字及日期：
                        <input v-model="g10.managerSign" class="cell-input-inline" :disabled="locked" />
                      </td>
                    </tr>
                    <tr>
                      <td class="label-cell-left" colspan="2">总师室审核意见：</td>
                      <td class="label-cell-left" colspan="2">修改情况：</td>
                    </tr>
                    <tr>
                      <td colspan="2" rowspan="3">
                        <textarea v-model="g10.chiefOfficeOpinion" class="cell-textarea" rows="3" :disabled="locked" />
                      </td>
                      <td colspan="2" rowspan="5">
                        <textarea v-model="g10.revisionStatus" class="cell-textarea" rows="5" :disabled="locked" />
                      </td>
                    </tr>
                    <tr></tr>
                    <tr></tr>
                    <tr>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td colspan="2"></td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td colspan="2" rowspan="2">
                        审核人及审核日期：
                        <input v-model="g10.auditorRight" class="cell-input-inline" :disabled="locked" />
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2"></td>
                    </tr>
                    <tr>
                      <td colspan="2">
                        审核人及审核日期：
                        <input v-model="g10.auditorLeft" class="cell-input-inline" :disabled="locked" />
                      </td>
                      <td colspan="2">
                        <el-checkbox v-model="g10.approvalDraftChecked" :disabled="locked">同意先出具一份核准/备案稿</el-checkbox>
                        <span style="margin-left:8px">审核人：</span>
                        <input v-model="g10.approvalDraft" class="cell-input-inline" :disabled="locked" />
                      </td>
                    </tr>
                    <!-- 项目情况 -->
                    <tr>
                      <td class="label-cell" rowspan="4">项目情况：</td>
                      <td class="label-cell">是否涉及国资项目</td>
                      <td colspan="2">
                        <el-radio-group v-model="g10.stateFund" :disabled="locked">
                          <el-radio value="是">是</el-radio>
                          <el-radio value="核准/备案">核准/备案</el-radio>
                          <el-radio value="否">否</el-radio>
                        </el-radio-group>
                      </td>
                    </tr>
                    <tr>
                      <td class="label-cell">是否涉及上市公司</td>
                      <td colspan="2">
                        <el-radio-group v-model="g10.listedCompany" :disabled="locked">
                          <el-radio value="是">是</el-radio>
                          <el-radio value="公告">公告</el-radio>
                          <el-radio value="否">否</el-radio>
                        </el-radio-group>
                      </td>
                    </tr>
                    <tr>
                      <td class="label-cell">报告类型</td>
                      <td colspan="2">
                        <el-radio-group v-model="g10.reportType" :disabled="locked">
                          <el-radio value="A类">A类</el-radio>
                          <el-radio value="B类">B类</el-radio>
                        </el-radio-group>
                      </td>
                    </tr>
                    <tr>
                      <td class="label-cell">是否以前承接相同项目情况</td>
                      <td colspan="2">
                        <el-radio-group v-model="g10.sameProject" :disabled="locked">
                          <el-radio value="是">是</el-radio>
                          <el-radio value="否">否</el-radio>
                        </el-radio-group>
                      </td>
                    </tr>
                    <tr>
                      <td class="label-cell">备注：</td>
                      <td colspan="3">
                        <input v-model="g10.remark" class="cell-input" :disabled="locked" />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div class="scratch-save-row">
                  <PermGuard :perm="PERM.PROJECT_EDIT" mode="disable" disabled-tip="无编辑权限">
                    <template #default="{ disabled }">
                      <el-button
                        size="small"
                        type="primary"
                        :loading="savingG10"
                        :disabled="disabled || locked"
                        @click="saveG10"
                        >保存 G-10</el-button
                      >
                    </template>
                  </PermGuard>
                </div>
              </div>
            </el-tab-pane>
            <!-- G-11 评估报告签发表 -->
            <el-tab-pane label="G-11 评估报告签发表">
              <div class="form-sheet">
                <table class="form-table">
                  <colgroup>
                    <col style="width: 130px" />
                    <col />
                    <col style="width: 130px" />
                    <col />
                  </colgroup>
                  <tbody>
                    <tr>
                      <td colspan="4" class="form-title">上海城乡资产评估有限责任公司</td>
                    </tr>
                    <tr>
                      <td colspan="4" class="form-title-en">SHANGHAI URBAN &amp; RURAL ASSETS APPRAISAL CO.,LTD</td>
                    </tr>
                    <tr>
                      <td colspan="4" class="form-title">评估报告签发表</td>
                    </tr>
                    <tr>
                      <td colspan="3"></td>
                      <td class="form-index">索引号：G-11</td>
                    </tr>
                    <tr>
                      <td class="label-cell">项目名称</td>
                      <td colspan="3">
                        <input v-model="g11.projectName" class="cell-input" :disabled="locked" />
                      </td>
                    </tr>
                    <tr>
                      <td class="label-cell">报告文号</td>
                      <td>
                        <input v-model="g11.reportNo" class="cell-input" :disabled="locked" />
                      </td>
                      <td class="label-cell">评估基准日：</td>
                      <td>
                        <input v-model="g11.baseDate" type="date" class="cell-input" :disabled="locked" />
                      </td>
                    </tr>
                    <tr>
                      <td class="label-cell">项目负责人</td>
                      <td>
                        <input v-model="g11.projectLeader" class="cell-input" :disabled="locked" />
                      </td>
                      <td class="label-cell">签字资产评估专业人员：</td>
                      <td>
                        <input v-model="g11.signer" class="cell-input" :disabled="locked" />
                      </td>
                    </tr>
                    <!-- 部门（项目）经理审核意见 -->
                    <tr>
                      <td colspan="4" class="label-cell-left">部门（项目）经理审核意见：</td>
                    </tr>
                    <tr>
                      <td colspan="4" class="label-cell-left">
                        <el-checkbox v-model="g11.managerAgree" :disabled="locked">同意出具评估报告</el-checkbox>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="4" class="label-cell-left">
                        <el-checkbox v-model="g11.managerDisagree" :disabled="locked">不同意出具评估报告，需作如下修改或核实如下问题：</el-checkbox>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="4">
                        <textarea v-model="g11.managerReasons" class="cell-textarea" rows="3" :disabled="locked" />
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2">
                        项目经理签字：<input v-model="g11.managerSign" class="cell-input-inline" :disabled="locked" />
                      </td>
                      <td colspan="2">
                        日期：<input v-model="g11.managerDate" type="date" class="cell-input-inline" :disabled="locked" />
                      </td>
                    </tr>
                    <!-- 总师室审核意见 -->
                    <tr>
                      <td colspan="4" class="label-cell-left">总师室审核意见：</td>
                    </tr>
                    <tr>
                      <td colspan="4" class="label-cell-left">
                        <el-checkbox v-model="g11.chiefAgree" :disabled="locked">同意出具评估报告</el-checkbox>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="4" class="label-cell-left">
                        <el-checkbox v-model="g11.chiefDisagree" :disabled="locked">不同意出具评估报告，需作如下修改或核实如下问题：</el-checkbox>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="4">
                        <textarea v-model="g11.chiefReasons" class="cell-textarea" rows="3" :disabled="locked" />
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2">
                        审核人：<input v-model="g11.chiefSign" class="cell-input-inline" :disabled="locked" />
                      </td>
                      <td colspan="2">
                        日期：<input v-model="g11.chiefDate" type="date" class="cell-input-inline" :disabled="locked" />
                      </td>
                    </tr>
                    <!-- 机构负责人审核意见 -->
                    <tr>
                      <td colspan="4" class="label-cell-left">机构负责人审核意见：</td>
                    </tr>
                    <tr>
                      <td colspan="4" class="label-cell-left">
                        <el-checkbox v-model="g11.headAgree" :disabled="locked">同意出具评估报告</el-checkbox>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="4" class="label-cell-left">
                        <el-checkbox v-model="g11.headDisagree" :disabled="locked">不同意出具评估报告，需作如下修改或核实如下问题：</el-checkbox>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="4">
                        <textarea v-model="g11.headReasons" class="cell-textarea" rows="3" :disabled="locked" />
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2">
                        机构负责人：<input v-model="g11.headSign" class="cell-input-inline" :disabled="locked" />
                      </td>
                      <td colspan="2">
                        日期：<input v-model="g11.headDate" type="date" class="cell-input-inline" :disabled="locked" />
                      </td>
                    </tr>
                    <!-- 需要说明的问题 -->
                    <tr>
                      <td colspan="4" class="label-cell-left">需要说明的问题：</td>
                    </tr>
                    <tr>
                      <td colspan="4">
                        <textarea v-model="g11.issues" class="cell-textarea" rows="3" :disabled="locked" />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div class="scratch-save-row">
                  <PermGuard :perm="PERM.PROJECT_EDIT" mode="disable" disabled-tip="无编辑权限">
                    <template #default="{ disabled }">
                      <el-button
                        size="small"
                        type="primary"
                        :loading="savingG11"
                        :disabled="disabled || locked"
                        @click="saveG11"
                        >保存 G-11</el-button
                      >
                    </template>
                  </PermGuard>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>

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
                  <el-button link type="primary" size="small" @click="downloadFile(file)">下载</el-button>
                  <el-button v-if="!locked" link type="danger" size="small" @click="attachments[doc.key].splice(idx, 1)">删除</el-button>
                </div>
              </template>
              <div v-else class="scratch-empty">
                <el-upload
                  action="#"
                  :auto-upload="false"
                  :limit="3"
                  accept=".pdf,.doc,.docx,.xlsx,.xls"
                  :disabled="locked"
                  :on-change="(f) => handleScratchUpload(doc.key, f)"
                  :show-file-list="false"
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
            <PermGuard :perm="PERM.PROJECT_EDIT" mode="disable" disabled-tip="无编辑权限">
              <template #default="{ disabled }">
                <el-button type="primary" :loading="saving" :disabled="disabled" @click="saveReview">保存并发送审批</el-button>
              </template>
            </PermGuard>
          </div>
        </el-card>
      </el-col>

      <el-col :span="10">
        <ApprovalFlowCard
          header="审核审批"
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
import { Document, Paperclip, Upload } from '@element-plus/icons-vue'
import { useProjectStore } from '@/stores/project.js'
import { documentApi, scratchApi } from '@/api/index.js'
import ApprovalFlowConfig from '@/components/common/ApprovalFlowConfig.vue'
import ApprovalFlowCard from '@/components/common/ApprovalFlowCard.vue'
import PermGuard from '@/components/common/PermGuard.vue'
import { PERM } from '@/constants/permissions.js'

const route = useRoute()
const projectStore = useProjectStore()

const project = computed(() => projectStore.current)

const saving = ref(false)
const erpStatus = ref([])
const approvalFlow = ref([])
const flowConfigRef = ref()
const stageApprovals = computed(() => project.value?.approvalsByStage?.['review'] || [])
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

// ── G-10 评估报告审核表 ────────────────────────────────────────────
const savingG10 = ref(false)
const g10 = reactive({
  projectName: '',
  reportNo: '',
  baseDate: '',
  projectLeader: '',
  signer: '',
  signerOpinion: '',
  managerOpinion: '',
  signerSign: '',
  managerSign: '',
  chiefOfficeOpinion: '',
  revisionStatus: '',
  auditorLeft: '',
  auditorRight: '',
  approvalDraftChecked: false,
  approvalDraft: '',
  stateFund: '',
  listedCompany: '',
  reportType: '',
  sameProject: '',
  remark: '',
})

async function loadG10() {
  try {
    const { data } = await scratchApi.getG10(route.params.id, 'review')
    if (data) {
      Object.assign(g10, {
        projectName: data.projectName || '',
        reportNo: data.reportNo || '',
        baseDate: data.baseDate || '',
        projectLeader: data.projectLeader || '',
        signer: data.signer || '',
        signerOpinion: data.signerOpinion || '',
        managerOpinion: data.managerOpinion || '',
        signerSign: data.signerSign || '',
        managerSign: data.managerSign || '',
        chiefOfficeOpinion: data.chiefOfficeOpinion || '',
        revisionStatus: data.revisionStatus || '',
        auditorLeft: data.auditorLeft || '',
        auditorRight: data.auditorRight || '',
        approvalDraftChecked: !!data.approvalDraftChecked,
        approvalDraft: data.approvalDraft || '',
        stateFund: data.stateFund || '',
        listedCompany: data.listedCompany || '',
        reportType: data.reportType || '',
        sameProject: data.sameProject || '',
        remark: data.remark || '',
      })
    }
  } catch {
    ElMessage.error('G-10 加载失败')
  }
}

async function saveG10() {
  savingG10.value = true
  try {
    await scratchApi.saveG10(route.params.id, 'review', {
      ...g10,
      approvalDraftChecked: g10.approvalDraftChecked ? 1 : 0,
    })
    ElMessage.success('G-10 已保存')
  } catch {
    ElMessage.error('保存失败')
  } finally {
    savingG10.value = false
  }
}

// ── G-11 评估报告签发表 ────────────────────────────────────────────
const savingG11 = ref(false)
const g11 = reactive({
  projectName: '',
  reportNo: '',
  baseDate: '',
  projectLeader: '',
  signer: '',
  managerAgree: false,
  managerDisagree: false,
  managerReasons: '',
  managerSign: '',
  managerDate: '',
  chiefAgree: false,
  chiefDisagree: false,
  chiefReasons: '',
  chiefSign: '',
  chiefDate: '',
  headAgree: false,
  headDisagree: false,
  headReasons: '',
  headSign: '',
  headDate: '',
  issues: '',
})

async function loadG11() {
  try {
    const { data } = await scratchApi.getG11(route.params.id, 'review')
    if (data) {
      Object.assign(g11, {
        projectName: data.projectName || '',
        reportNo: data.reportNo || '',
        baseDate: data.baseDate || '',
        projectLeader: data.projectLeader || '',
        signer: data.signer || '',
        managerAgree: !!data.managerAgree,
        managerDisagree: !!data.managerDisagree,
        managerReasons: data.managerReasons || '',
        managerSign: data.managerSign || '',
        managerDate: data.managerDate || '',
        chiefAgree: !!data.chiefAgree,
        chiefDisagree: !!data.chiefDisagree,
        chiefReasons: data.chiefReasons || '',
        chiefSign: data.chiefSign || '',
        chiefDate: data.chiefDate || '',
        headAgree: !!data.headAgree,
        headDisagree: !!data.headDisagree,
        headReasons: data.headReasons || '',
        headSign: data.headSign || '',
        headDate: data.headDate || '',
        issues: data.issues || '',
      })
    }
  } catch {
    ElMessage.error('G-11 加载失败')
  }
}

async function saveG11() {
  savingG11.value = true
  try {
    await scratchApi.saveG11(route.params.id, 'review', {
      ...g11,
      managerAgree: g11.managerAgree ? 1 : 0,
      managerDisagree: g11.managerDisagree ? 1 : 0,
      chiefAgree: g11.chiefAgree ? 1 : 0,
      chiefDisagree: g11.chiefDisagree ? 1 : 0,
      headAgree: g11.headAgree ? 1 : 0,
      headDisagree: g11.headDisagree ? 1 : 0,
    })
    ElMessage.success('G-11 已保存')
  } catch {
    ElMessage.error('保存失败')
  } finally {
    savingG11.value = false
  }
}

onMounted(async () => {
  await Promise.all([loadG10(), loadG11()])
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
  } catch (e) {
    const msg = e?.response?.data?.message || e?.message || '请重试'
    ElMessage.error('保存失败：' + msg)
  } finally {
    saving.value = false
  }
}

async function handleApprove(payload) {
  await projectStore.approveStage(route.params.id, 'review', payload)
  ElMessage.success(payload.action === 'approved' ? '已审批通过' : '已驳回')
}

async function handleScratchUpload(category, fileItem) {
  if (!fileItem?.raw) return
  try {
    const res = await documentApi.upload(route.params.id, fileItem.raw, 'review', category)
    attachments[category].push(res.data)
    ElMessage.success('上传成功')
  } catch {
    ElMessage.error('上传失败')
  }
}

function downloadFile(file) {
  if (!file.storedName) return ElMessage.warning('该文件暂无下载')
  const a = document.createElement('a')
  a.href = documentApi.fileUrl(file.storedName)
  a.download = file.name
  a.click()
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

/* ── G-10 / G-11 底稿表单（样式同 Inventory） ── */
.form-sheet {
  padding: 12px 16px 16px;
  font-family: "SimSun", "Microsoft YaHei", sans-serif;
  font-size: 13px;
}

.form-table {
  width: 100%;
  border-collapse: collapse;
}
.form-table td,
.form-table th {
  border: 1px solid #bcc8d4;
  padding: 3px 5px;
  vertical-align: middle;
}

.label-cell {
  background: #dce6f0;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
  font-size: 12px;
  padding: 4px 6px;
  line-height: 1.4;
}

.label-cell-left {
  background: #dce6f0;
  font-weight: 600;
  text-align: left;
  white-space: nowrap;
  font-size: 12px;
  padding: 4px 8px;
  line-height: 1.4;
}

.form-title {
  text-align: center;
  font-weight: 700;
  font-size: 17px;
  letter-spacing: 3px;
  padding: 6px 8px;
  color: #262626;
}

.form-title-en {
  text-align: center;
  font-size: 11px;
  letter-spacing: 1px;
  color: #595959;
  padding: 2px 8px 4px;
}

.form-index {
  text-align: right;
  font-size: 12px;
  color: #595959;
  padding: 2px 8px 4px;
}

.cell-input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 13px;
  font-family: inherit;
  padding: 2px 4px;
  box-sizing: border-box;
}
.cell-input:focus {
  background: #fffbe6;
  outline: 2px solid #4096ff;
  outline-offset: -1px;
  border-radius: 2px;
}
.cell-input:disabled {
  color: #595959;
  cursor: default;
}

.cell-input-inline {
  width: 62%;
  border: none;
  border-bottom: 1px solid #bcc8d4;
  outline: none;
  background: transparent;
  font-size: 13px;
  font-family: inherit;
  padding: 1px 4px;
  box-sizing: border-box;
}
.cell-input-inline:disabled {
  color: #595959;
  cursor: default;
}

.cell-textarea {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 13px;
  font-family: inherit;
  padding: 2px 4px;
  box-sizing: border-box;
  resize: vertical;
  line-height: 1.5;
}
.cell-textarea:focus {
  background: #fffbe6;
  outline: 2px solid #4096ff;
  outline-offset: -1px;
  border-radius: 2px;
}
.cell-textarea:disabled {
  color: #595959;
  cursor: default;
}

.scratch-save-row {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}

/* ── 底稿 Tabs ── */
:deep(.scratch-tabs.el-tabs--border-card > .el-tabs__header) {
  background: #f7f8fa;
}
:deep(
  .scratch-tabs.el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active
) {
  color: #1677ff;
  font-weight: 600;
}
:deep(.scratch-tabs.el-tabs--border-card > .el-tabs__content) {
  padding: 0;
}
.scratch-tabs-card {
  padding: 0;
}
:deep(.scratch-tabs-card > .el-card__body) {
  padding: 0;
}
</style>
