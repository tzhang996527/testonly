<template>
  <div class="inventory-tab">
    <el-row :gutter="20">
      <el-col :span="14">
    <!-- 底稿表单（G-27 / C3-1-1/2） -->
    <el-card shadow="never" style="margin-top:16px" class="scratch-tabs-card">
      <el-tabs type="border-card" class="scratch-tabs" model-value="g27">
        <el-tab-pane label="G-27 现场勘查记录表" name="g27">
          <div class="form-sheet">
        <table class="form-table">
          <colgroup>
            <col style="width: 110px" />
            <col />
            <col style="width: 120px" />
            <col />
            <col style="width: 80px" />
            <col />
            <col style="width: 90px" />
            <col style="width: 110px" />
            <col style="width: 90px" />
            <col style="width: 100px" />
          </colgroup>
          <tbody>
            <!-- 抬头 -->
            <tr>
              <td colspan="10" class="form-title">上海城乡资产评估有限责任公司</td>
            </tr>
            <tr>
              <td colspan="10" class="form-title-en">
                SHANGHAI URBAN &amp; RURAL ASSETS APPRAISAL CO.,LTD
              </td>
            </tr>
            <tr>
              <td colspan="10" class="form-title">现场勘查记录表</td>
            </tr>
            <tr>
              <td colspan="10" class="form-index">索引号：G-27</td>
            </tr>
            <!-- 勘查对象名称 / 勘察日期 -->
            <tr>
              <td class="label-cell" colspan="2">勘查对象名称</td>
              <td colspan="4">
                <input
                  v-model="g27.objectName"
                  class="cell-input"
                  :disabled="locked"
                />
              </td>
              <td class="label-cell">勘察日期</td>
              <td colspan="3">
                <input
                  v-model="g27.surveyDate"
                  type="date"
                  class="cell-input"
                  :disabled="locked"
                />
              </td>
            </tr>
            <!-- 勘查人员 / 接洽人员 -->
            <tr>
              <td class="label-cell" colspan="2">勘查人员</td>
              <td colspan="4">
                <input
                  v-model="g27.surveyor"
                  class="cell-input"
                  :disabled="locked"
                />
              </td>
              <td class="label-cell">接洽人员</td>
              <td colspan="3">
                <input
                  v-model="g27.contactPerson"
                  class="cell-input"
                  :disabled="locked"
                />
              </td>
            </tr>
            <!-- 勘查对象所处位置 -->
            <tr>
              <td class="label-cell" colspan="2">勘查对象所处位置</td>
              <td colspan="8">
                <input
                  v-model="g27.location"
                  class="cell-input"
                  :disabled="locked"
                />
              </td>
            </tr>
            <!-- 勘查对象周围环境 -->
            <tr>
              <td class="label-cell" colspan="2">勘查对象周围环境</td>
              <td colspan="8">
                <textarea
                  v-model="g27.environment"
                  class="cell-textarea"
                  rows="2"
                  :disabled="locked"
                />
              </td>
            </tr>
            <!-- 勘查结论 -->
            <tr>
              <td class="label-cell" colspan="2">勘查结论</td>
              <td colspan="5">
                <textarea
                  v-model="g27.conclusion"
                  class="cell-textarea"
                  rows="2"
                  :disabled="locked"
                />
              </td>
              <td class="sign-cell" colspan="3">
                <input
                  v-model="g27.firstSignature"
                  class="cell-input"
                  style="text-align: center"
                  placeholder="接待方签字（盖章）"
                  :disabled="locked"
                />
              </td>
            </tr>
            <!-- 第二次勘查 -->
            <tr>
              <td class="label-cell" colspan="2">第二次勘查时间</td>
              <td colspan="2">
                <input
                  v-model="g27.secondTime"
                  type="date"
                  class="cell-input"
                  :disabled="locked"
                />
              </td>
              <td class="label-cell">勘查人员</td>
              <td colspan="3">
                <input
                  v-model="g27.secondSurveyor"
                  class="cell-input"
                  :disabled="locked"
                />
              </td>
              <td class="label-cell">接洽人员</td>
              <td>
                <input
                  v-model="g27.secondContact"
                  class="cell-input"
                  :disabled="locked"
                />
              </td>
            </tr>
            <tr>
              <td class="label-cell" colspan="2">勘查结论</td>
              <td colspan="5">
                <textarea
                  v-model="g27.secondConclusion"
                  class="cell-textarea"
                  rows="2"
                  :disabled="locked"
                />
              </td>
              <td class="sign-cell" colspan="3">
                <input
                  v-model="g27.secondSignature"
                  class="cell-input"
                  style="text-align: center"
                  placeholder="接待方签字（盖章）"
                  :disabled="locked"
                />
              </td>
            </tr>
            <!-- 第三次勘查 -->
            <tr>
              <td class="label-cell" colspan="2">第三次勘查时间</td>
              <td colspan="2">
                <input
                  v-model="g27.thirdTime"
                  type="date"
                  class="cell-input"
                  :disabled="locked"
                />
              </td>
              <td class="label-cell">勘查人员</td>
              <td colspan="3">
                <input
                  v-model="g27.thirdSurveyor"
                  class="cell-input"
                  :disabled="locked"
                />
              </td>
              <td class="label-cell">接洽人员</td>
              <td>
                <input
                  v-model="g27.thirdContact"
                  class="cell-input"
                  :disabled="locked"
                />
              </td>
            </tr>
            <tr>
              <td class="label-cell" colspan="2">勘查结论</td>
              <td colspan="5">
                <textarea
                  v-model="g27.thirdConclusion"
                  class="cell-textarea"
                  rows="2"
                  :disabled="locked"
                />
              </td>
              <td class="sign-cell" colspan="3">
                <input
                  v-model="g27.thirdSignature"
                  class="cell-input"
                  style="text-align: center"
                  placeholder="接待方签字（盖章）"
                  :disabled="locked"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div class="scratch-save-row">
          <PermGuard
            :perm="PERM.PROJECT_EDIT"
            mode="disable"
            disabled-tip="无编辑权限"
          >
            <template #default="{ disabled }">
              <el-button
                size="small"
                type="primary"
                :loading="savingG27"
                :disabled="disabled || locked"
                @click="saveG27"
                >保存 G-27</el-button
              >
            </template>
          </PermGuard>
        </div>
      </div>
        </el-tab-pane>

        <el-tab-pane label="C3-1-1/2 库存现金作业分析表" name="c3">
          <div class="form-sheet">
            <!-- 抬头 -->
            <table class="form-table">
              <tbody>
                <tr>
                  <td colspan="6" class="form-title">上海城乡资产评估有限责任公司</td>
                </tr>
                <tr>
                  <td colspan="6" class="form-title-en">
                    SHANGHAI URBAN &amp; RURAL ASSETS APPRAISAL CO.,LTD
                  </td>
                </tr>
                <tr>
                  <td colspan="6" class="form-title">库 存 现 金 作 业 分 析 表</td>
                </tr>
                <tr>
                  <td colspan="6" class="form-index">索引号: C3-1-1/2</td>
                </tr>
              </tbody>
            </table>
            <!-- 基本信息 -->
            <table class="form-table" style="margin-top: 8px">
              <tbody>
                <tr>
                  <td class="label-cell">被评估单位:</td>
                  <td>
                    <input
                      v-model="c3.unitName"
                      class="cell-input"
                      :disabled="locked"
                    />
                  </td>
                  <td class="label-cell">评估基准日:</td>
                  <td>
                    <input
                      v-model="c3.baseDate"
                      type="date"
                      class="cell-input"
                      :disabled="locked"
                    />
                  </td>
                  <td class="label-cell">页次:</td>
                  <td>
                    共
                    <input v-model="c3.pageTotal" class="page-inline" :disabled="locked" />
                    页 第
                    <input v-model="c3.pageNo" class="page-inline" :disabled="locked" />
                    页
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- 盘点面额 + 平衡法调节（对齐 sheet 的 A-I 九列，含 F 列） -->
            <table class="form-table cash-grid" style="margin-top: 8px">
              <colgroup>
                <col style="width: 78px" />
                <col style="width: 72px" />
                <col style="width: 72px" />
                <col style="width: 72px" />
                <col style="width: 72px" />
                <col style="width: 210px" />
                <col style="width: 40px" />
                <col style="width: 130px" />
                <col style="width: 60px" />
              </colgroup>
              <tbody>
                <!-- 表头第一行 -->
                <tr>
                  <td class="label-cell" rowspan="2">面额</td>
                  <td class="label-cell" colspan="2">外币( )</td>
                  <td class="label-cell" colspan="2">人民币</td>
                  <td class="label-cell"></td>
                  <td class="label-cell">项目</td>
                  <td class="label-cell" colspan="2">金额</td>
                </tr>
                <!-- 表头第二行 -->
                <tr>
                  <td class="label-cell">张数</td>
                  <td class="label-cell">( )金额</td>
                  <td class="label-cell">张数</td>
                  <td class="label-cell">金额</td>
                  <td class="label-cell">平衡法调节</td>
                  <td></td>
                  <td colspan="2"></td>
                </tr>
                <!-- 数据行：面额(行8~17) 与 平衡法调节项目 同行 -->
                <tr v-for="(d, i) in c3.denominations" :key="i">
                  <td class="label-cell">{{ d.denom }}</td>
                  <td>
                    <input v-model="d.fcCount" class="cell-input" :disabled="locked" />
                  </td>
                  <td>
                    <input v-model="d.fcAmount" class="cell-input" :disabled="locked" />
                  </td>
                  <td>
                    <input v-model="d.rmbCount" class="cell-input" :disabled="locked" />
                  </td>
                  <td>
                    <input v-model="d.rmbAmount" class="cell-input" :disabled="locked" />
                  </td>
                  <template v-if="i < 10">
                    <td :class="['cash-item-label', { 'cash-item-indent': BALANCE_ITEMS[i].indent }]">
                      {{ BALANCE_ITEMS[i].label }}
                    </td>
                    <td></td>
                    <td colspan="2">
                      <input v-model="c3.balanceItems[BALANCE_ITEMS[i].key]" class="cell-input" :disabled="locked" />
                    </td>
                  </template>
                  <template v-else-if="i === 10">
                    <td colspan="4" rowspan="3">
                      原因分析:<br />
                      <textarea v-model="c3.reasonAnalysis" class="cell-textarea" rows="3" :disabled="locked" />
                    </td>
                  </template>
                  <template v-else-if="i === 11 || i === 12"></template>
                  <template v-else-if="i === 13">
                    <td colspan="4" rowspan="2">
                      库存现金保管地点:<br />
                      <input v-model="c3.storageLocation" class="cell-input" :disabled="locked" />
                    </td>
                  </template>
                  <template v-else-if="i === 14"></template>
                </tr>
                <!-- 出纳签字 -->
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td colspan="4" rowspan="2">
                    出纳签字:<br />
                    <input v-model="c3.cashierSign" class="cell-input" :disabled="locked" />
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <!-- 会计主管 + 实点合计 -->
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td colspan="4" rowspan="2">
                    会计主管:<br />
                    <input v-model="c3.accountingSupervisor" class="cell-input" :disabled="locked" />
                  </td>
                </tr>
                <tr>
                  <td class="label-cell">实点合计</td>
                  <td>
                    <input v-model="c3.total.fcCount" class="cell-input" :disabled="locked" />
                  </td>
                  <td>
                    <input v-model="c3.total.fcAmount" class="cell-input" :disabled="locked" />
                  </td>
                  <td>
                    <input v-model="c3.total.rmbCount" class="cell-input" :disabled="locked" />
                  </td>
                  <td>
                    <input v-model="c3.total.rmbAmount" class="cell-input" :disabled="locked" />
                  </td>
                </tr>
                <!-- 即期汇率 / 人民币 + 评估监盘人员 -->
                <tr>
                  <td class="label-cell">即期汇率</td>
                  <td colspan="4">
                    <input v-model="c3.exchangeRate" class="cell-input" :disabled="locked" />
                  </td>
                  <td colspan="4" rowspan="2">
                    评估监盘人员:<br />
                    <input v-model="c3.monitorPerson" class="cell-input" :disabled="locked" />
                  </td>
                </tr>
                <tr>
                  <td class="label-cell">人民币</td>
                  <td colspan="4">
                    <input v-model="c3.rmbNote" class="cell-input" :disabled="locked" />
                  </td>
                </tr>
                <!-- 清查日期 / 填表人 / 复核人 -->
                <tr>
                  <td class="label-cell">清查日期</td>
                  <td colspan="3">
                    <input v-model="c3.checkDate" type="date" class="cell-input" :disabled="locked" />
                  </td>
                  <td></td>
                  <td>
                    填表人:
                    <input v-model="c3.filler" class="cell-input-inline" :disabled="locked" />
                  </td>
                  <td></td>
                  <td colspan="2">
                    复核人:
                    <input v-model="c3.reviewer" class="cell-input-inline" :disabled="locked" />
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="scratch-save-row">
              <PermGuard
                :perm="PERM.PROJECT_EDIT"
                mode="disable"
                disabled-tip="无编辑权限"
              >
                <template #default="{ disabled }">
                  <el-button
                    size="small"
                    type="primary"
                    :loading="savingC3"
                    :disabled="disabled || locked"
                    @click="saveC3"
                    >保存 C3-1-1/2</el-button
                  >
                </template>
              </PermGuard>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-card shadow="never" style="margin-top:16px">
      <template #header>底稿上传</template>
      <div class="scratch-docs">
        <div v-for="doc in scratchDocTypes" :key="doc.key" class="scratch-doc-item">
          <div class="scratch-doc-label">
            <el-icon><Document /></el-icon>
            {{ doc.label }}
          </div>
          <template v-if="scratchFiles(doc.key).length">
            <div v-for="(file, idx) in scratchFiles(doc.key)" :key="idx" class="scratch-file-row">
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

    <el-card shadow="never" style="margin-top:16px">
      <template #header>ERP 状态确认</template>
      <el-checkbox-group v-model="erpStatus" :disabled="locked">
        <div class="erp-status-list">
          <el-checkbox value="inventoryDone">盘点完成</el-checkbox>
          <el-checkbox value="diffPending">差异待处理</el-checkbox>
          <el-checkbox value="diffHandled">差异已处理</el-checkbox>
          <el-checkbox value="detailEntered">评估明细表、各科目工作底稿已录入</el-checkbox>
          <el-checkbox value="interviewUploaded">访谈记录已上传</el-checkbox>
        </div>
      </el-checkbox-group>
      <div style="margin-top:16px">
        <PermGuard :perm="PERM.PROJECT_EDIT" mode="disable" disabled-tip="无编辑权限">
          <template #default="{ disabled }">
            <el-button type="primary" :loading="saving" :disabled="disabled || locked" @click="saveInventory">保存</el-button>
          </template>
        </PermGuard>
      </div>
    </el-card>
      </el-col>
      <el-col :span="10">
        <ApprovalFlowCard
          header="清查盘点审批"
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
import { scratchApi } from '@/api/index.js'
import { useProjectStore } from '@/stores/project.js'
import ApprovalFlowCard from '@/components/common/ApprovalFlowCard.vue'
import PermGuard from '@/components/common/PermGuard.vue'
import { PERM } from '@/constants/permissions.js'

const route = useRoute()
const saving = ref(false)
const erpStatus = ref([])

const projectStore = useProjectStore()
const locked = computed(() => (projectStore.current?.currentStep ?? 1) > 3)
const stageApprovals = computed(() => projectStore.current?.approvalsByStage?.['inventory'] || [])
async function handleApprove(payload) {
  await projectStore.approveStage(route.params.id, 'inventory', payload)
  ElMessage.success(payload.action === 'approved' ? '已审批通过' : '已驳回')
}

const scratchDocTypes = [
  { key: 'assessDetail', label: '评估明细表' },
  { key: 'subjectWorkpaper', label: '各科目工作底稿' },
]

function scratchFiles(key) {
  const files = projectStore.current?.attachments?.[key]
  if (!files?.length) return []
  return files.map(f => ({
    name: f.name,
    size: f.size
      ? (typeof f.size === 'number' ? (f.size / 1024 / 1024).toFixed(1) + ' MB' : f.size)
      : '',
  }))
}

// ── G-27 现场勘查记录表 ───────────────────────────────────────────────────────
const savingG27 = ref(false)
const g27 = reactive({
  objectName: '',
  surveyDate: '',
  surveyor: '',
  contactPerson: '',
  location: '',
  environment: '',
  conclusion: '',
  firstSignature: '',
  secondTime: '',
  secondSurveyor: '',
  secondContact: '',
  secondConclusion: '',
  secondSignature: '',
  thirdTime: '',
  thirdSurveyor: '',
  thirdContact: '',
  thirdConclusion: '',
  thirdSignature: '',
})

async function loadG27() {
  const { data } = await scratchApi.getG27(route.params.id, 'inventory')
  if (data) Object.assign(g27, data)
}

async function saveG27() {
  savingG27.value = true
  try {
    await scratchApi.saveG27(route.params.id, 'inventory', { ...g27 })
    ElMessage.success('G-27 已保存')
  } catch {
    ElMessage.error('G-27 保存失败')
  } finally {
    savingG27.value = false
  }
}

// ── C3-1-1/2 库存现金作业分析表 ────────────────────────────────────────────────
const savingC3 = ref(false)
const DENOMINATIONS = [
  '1000', '500', '100', '50', '20', '10', '5', '2', '1',
  '0.5', '0.2', '0.1', '0.05', '0.02', '0.01',
]
// 平衡法调节各项目：与面额行(denominations 下标 0~9)一一对应，加/减项缩进
const BALANCE_ITEMS = [
  { label: '清查日盘点库存现金余额', key: 'inventoryBalance', indent: false },
  { label: '加: 基准日至清查日支出未记账', key: 'addUnrecordedExpense', indent: true },
  { label: '减: 基准日至清查日收入未记账', key: 'minusUnrecordedIncome', indent: true },
  { label: '加: 基准日至清查日支出已记账', key: 'addRecordedExpense', indent: true },
  { label: '减: 基准日至清查日收入已记账', key: 'minusRecordedIncome', indent: true },
  { label: '平衡法调整后账面值', key: 'adjustedBookValue', indent: false },
  { label: '评估基准日账面值', key: 'baseBookValue', indent: false },
  { label: '长款金额:', key: 'longAmount', indent: false },
  { label: '短款金额:', key: 'shortAmount', indent: false },
  { label: '评估价值:', key: 'appraisedValue', indent: false },
]
const c3 = reactive({
  unitName: '',
  baseDate: '',
  pageTotal: '',
  pageNo: '',
  denominations: DENOMINATIONS.map((denom) => ({
    denom,
    fcCount: '',
    fcAmount: '',
    rmbCount: '',
    rmbAmount: '',
  })),
  total: { fcCount: '', fcAmount: '', rmbCount: '', rmbAmount: '' },
  exchangeRate: '',
  rmbNote: '',
  checkDate: '',
  balanceItems: {
    inventoryBalance: '',
    addUnrecordedExpense: '',
    minusUnrecordedIncome: '',
    addRecordedExpense: '',
    minusRecordedIncome: '',
    adjustedBookValue: '',
    baseBookValue: '',
    longAmount: '',
    shortAmount: '',
    appraisedValue: '',
  },
  reasonAnalysis: '',
  storageLocation: '',
  cashierSign: '',
  accountingSupervisor: '',
  monitorPerson: '',
  filler: '',
  reviewer: '',
})

function mergeDenominations(saved) {
  if (!Array.isArray(saved)) return
  c3.denominations.forEach((d, i) => {
    const s = saved[i]
    if (!s) return
    d.fcCount = s.fcCount || ''
    d.fcAmount = s.fcAmount || ''
    d.rmbCount = s.rmbCount || ''
    d.rmbAmount = s.rmbAmount || ''
  })
}

async function loadC3() {
  const { data } = await scratchApi.getC3(route.params.id, 'inventory')
  if (!data) return
  c3.unitName = data.unitName || ''
  c3.baseDate = data.baseDate || ''
  c3.pageTotal = data.pageTotal || ''
  c3.pageNo = data.pageNo || ''
  mergeDenominations(JSON.parse(data.denominations || '[]'))
  Object.assign(c3.total, JSON.parse(data.total || '{}'))
  c3.exchangeRate = data.exchangeRate || ''
  c3.rmbNote = data.rmbNote || ''
  c3.checkDate = data.checkDate || ''
  Object.assign(c3.balanceItems, {
    inventoryBalance: data.inventoryBalance || '',
    addUnrecordedExpense: data.addUnrecordedExpense || '',
    minusUnrecordedIncome: data.minusUnrecordedIncome || '',
    addRecordedExpense: data.addRecordedExpense || '',
    minusRecordedIncome: data.minusRecordedIncome || '',
    adjustedBookValue: data.adjustedBookValue || '',
    baseBookValue: data.baseBookValue || '',
    longAmount: data.longAmount || '',
    shortAmount: data.shortAmount || '',
    appraisedValue: data.appraisedValue || '',
  })
  c3.reasonAnalysis = data.reasonAnalysis || ''
  c3.storageLocation = data.storageLocation || ''
  c3.cashierSign = data.cashierSign || ''
  c3.accountingSupervisor = data.accountingSupervisor || ''
  c3.monitorPerson = data.monitorPerson || ''
  c3.filler = data.filler || ''
  c3.reviewer = data.reviewer || ''
}

async function saveC3() {
  savingC3.value = true
  try {
    await scratchApi.saveC3(route.params.id, 'inventory', {
      unitName: c3.unitName,
      baseDate: c3.baseDate,
      pageTotal: c3.pageTotal,
      pageNo: c3.pageNo,
      denominations: JSON.stringify(c3.denominations),
      total: JSON.stringify(c3.total),
      exchangeRate: c3.exchangeRate,
      rmbNote: c3.rmbNote,
      checkDate: c3.checkDate,
      ...c3.balanceItems,
      reasonAnalysis: c3.reasonAnalysis,
      storageLocation: c3.storageLocation,
      cashierSign: c3.cashierSign,
      accountingSupervisor: c3.accountingSupervisor,
      monitorPerson: c3.monitorPerson,
      filler: c3.filler,
      reviewer: c3.reviewer,
    })
    ElMessage.success('C3-1-1/2 已保存')
  } catch {
    ElMessage.error('C3-1-1/2 保存失败')
  } finally {
    savingC3.value = false
  }
}

async function saveInventory() {
  saving.value = true
  try {
    await projectStore.saveInventoryInfo?.(route.params.id, { erpStatus: erpStatus.value })
    ElMessage.success('盘点信息已保存')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await Promise.all([loadG27(), loadC3()])
})
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

/* ── G-27 现场勘查记录表 (样式同 Overview G-1) ── */
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

.sign-cell {
  background: #fdf6ec;
  text-align: center;
  padding: 4px 6px;
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

/* ── 底稿 Tabs（同 Overview scratch-tabs） ── */
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

/* ── C3-1-1/2 库存现金作业分析表 ── */
.cash-grid {
  table-layout: fixed;
}
.cash-item-label {
  text-align: left;
  font-size: 12px;
  line-height: 1.5;
  color: #333;
  padding: 4px 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.cash-item-indent {
  padding-left: 20px;
}
.page-inline {
  width: 38px;
  border: none;
  border-bottom: 1px solid #bcc8d4;
  outline: none;
  background: transparent;
  font-size: 13px;
  text-align: center;
  font-family: inherit;
  padding: 1px 2px;
}
.page-inline:disabled {
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
</style>
