<template>
  <div class="worklog-form">
    <div class="page-header">
      <el-button :icon="ArrowLeft" @click="$router.push('/worklog')">返回列表</el-button>
      <h2>工作日志 — {{ weekLabel }}</h2>
      <div class="week-nav">
        <el-button :icon="ArrowLeft" circle @click="shiftWeek(-1)" />
        <el-button @click="goCurrentWeek">本周</el-button>
        <el-button :icon="ArrowRight" circle @click="shiftWeek(1)" />
      </div>
    </div>

    <el-tabs v-model="activeTab" class="log-tabs">
      <!-- ─── Tab 1: 本周工作小结 ─── -->
      <el-tab-pane label="本周工作小结" name="summary">
        <el-card shadow="never" class="section-card">
          <template #header>
            <div class="card-header">
              <span>本周（{{ weekLabel }}）工作小结</span>
              <el-button type="primary" size="small" :icon="Plus" @click="openEntryDialog('summary')">新增条目</el-button>
            </div>
          </template>

          <!-- 上周计划参考 -->
          <el-collapse v-if="planEntries.length" style="margin-bottom:12px">
            <el-collapse-item>
              <template #title>
                <span style="font-size:13px;color:#6b7280">
                  <el-icon style="vertical-align:-2px;margin-right:4px"><InfoFilled /></el-icon>
                  查看本周原定计划（{{ planEntries.length }} 条）— 对照填写小结
                </span>
              </template>
              <el-table :data="planEntries" size="small" style="margin-top:4px">
                <el-table-column label="日期" width="140">
                  <template #default="{ row }">{{ formatDate(row.entryDate) }}</template>
                </el-table-column>
                <el-table-column label="项目" min-width="160" show-overflow-tooltip>
                  <template #default="{ row }">
                    <template v-if="row.projectNo">
                      <el-tag size="small" type="primary">{{ row.projectNo }}</el-tag>
                      {{ row.projectName }}
                    </template>
                    <span v-else>{{ row.note || '—' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="地点" width="70" align="center">
                  <template #default="{ row }">
                    <el-tag :type="row.workType === 'field' ? 'warning' : 'info'" size="small">
                      {{ row.workType === 'field' ? '现场' : '公司' }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="计划工时" width="90" align="right">
                  <template #default="{ row }">{{ row.plannedHours }}h</template>
                </el-table-column>
                <el-table-column label="预计进度" width="110" align="center">
                  <template #default="{ row }">
                    <el-progress :percentage="row.plannedProgress" :stroke-width="5" />
                  </template>
                </el-table-column>
              </el-table>
            </el-collapse-item>
          </el-collapse>

          <el-table :data="summaryEntries" empty-text="暂无小结条目">
            <el-table-column label="日期" width="140">
              <template #default="{ row }">
                <span class="date-cell">{{ formatDate(row.entryDate) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="项目" min-width="160" show-overflow-tooltip>
              <template #default="{ row }">
                <span v-if="row.projectNo" class="project-ref">
                  <el-tag size="small" type="primary">{{ row.projectNo }}</el-tag>
                  {{ row.projectName }}
                </span>
                <span v-else class="non-project">{{ row.note || '—' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="工作地点" width="90" align="center">
              <template #default="{ row }">
                <el-tag :type="row.workType === 'field' ? 'warning' : 'info'" size="small">
                  {{ row.workType === 'field' ? '现场' : '公司' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="实际工时" width="90" align="right">
              <template #default="{ row }">{{ row.actualHours }}h</template>
            </el-table-column>
            <el-table-column label="实际进度" width="120" align="center">
              <template #default="{ row }">
                <el-progress
                  :percentage="row.actualProgress"
                  :stroke-width="6"
                  :color="progressColor(row)"
                />
              </template>
            </el-table-column>
            <el-table-column label="延期原因" min-width="120" show-overflow-tooltip>
              <template #default="{ row }">
                <span v-if="row.delayReason" class="delay-reason">{{ row.delayReason }}</span>
                <span v-else class="dim">—</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" link size="small" @click="editEntry(row)">编辑</el-button>
                <el-button type="danger" link size="small" @click="deleteEntry(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="summary-stats" v-if="summaryEntries.length">
            <span>共 <b>{{ summaryEntries.length }}</b> 条</span>
            <span>总实际工时：<b>{{ totalActualHours }}h</b></span>
            <span>平均进度：<b>{{ avgActualProgress }}%</b></span>
          </div>

          <el-divider />
          <el-form-item label="总体小结说明">
            <el-input
              v-model="logData.summaryNote"
              type="textarea"
              :rows="3"
              placeholder="本周总结：按计划完成情况、未完成原因、下周需跟进事项等"
              @blur="saveSummaryNote"
            />
          </el-form-item>
        </el-card>
      </el-tab-pane>

      <!-- ─── Tab 2: 下周工作计划 ─── -->
      <el-tab-pane label="下周工作计划" name="plan">
        <el-card shadow="never" class="section-card">
          <template #header>
            <div class="card-header">
              <span>下周（{{ nextWeekLabel }}）计划安排</span>
              <el-button type="primary" size="small" :icon="Plus" @click="openEntryDialog('plan')">新增条目</el-button>
            </div>
          </template>

          <el-table :data="planEntries" empty-text="暂无计划条目">
            <el-table-column label="日期" width="140">
              <template #default="{ row }">
                <span class="date-cell">{{ formatDate(row.entryDate) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="项目" min-width="160" show-overflow-tooltip>
              <template #default="{ row }">
                <span v-if="row.projectNo" class="project-ref">
                  <el-tag size="small" type="primary">{{ row.projectNo }}</el-tag>
                  {{ row.projectName }}
                </span>
                <span v-else class="non-project">{{ row.note || '—' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="工作地点" width="90" align="center">
              <template #default="{ row }">
                <el-tag :type="row.workType === 'field' ? 'warning' : 'info'" size="small">
                  {{ row.workType === 'field' ? '现场' : '公司' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="计划工时" width="90" align="right">
              <template #default="{ row }">{{ row.plannedHours }}h</template>
            </el-table-column>
            <el-table-column label="预计完成进度" width="120" align="center">
              <template #default="{ row }">
                <el-progress :percentage="row.plannedProgress" :stroke-width="6" />
              </template>
            </el-table-column>
            <el-table-column label="备注" min-width="120" show-overflow-tooltip prop="note" />
            <el-table-column label="操作" width="120" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" link size="small" @click="editEntry(row)">编辑</el-button>
                <el-button type="danger" link size="small" @click="deleteEntry(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="summary-stats" v-if="planEntries.length">
            <span>共 <b>{{ planEntries.length }}</b> 条</span>
            <span>总计划工时：<b>{{ totalPlannedHours }}h</b></span>
          </div>

          <el-divider />
          <el-form-item label="总体计划说明">
            <el-input
              v-model="nextLogData.planNote"
              type="textarea"
              :rows="3"
              placeholder="对下周整体工作安排的补充说明（如特殊情况、协调事项等）"
              @blur="savePlanNote"
            />
          </el-form-item>
        </el-card>
      </el-tab-pane>

      <!-- ─── Tab 3: 项目工时汇总 ─── -->
      <el-tab-pane label="项目工时汇总" name="hours">
        <el-card shadow="never" class="section-card">
          <template #header>本周涉及项目工时汇总</template>
          <el-table :data="projectHoursSummary" empty-text="本周无项目条目">
            <el-table-column label="项目编号" prop="projectNo" width="140" />
            <el-table-column label="项目名称" prop="projectName" min-width="180" show-overflow-tooltip />
            <el-table-column label="预算工时" width="100" align="right">
              <template #default="{ row }">
                <span :class="{ 'over-budget': row.budgetHours > 0 && row.totalActual > row.budgetHours }">
                  {{ row.budgetHours ? row.budgetHours + 'h' : '未设置' }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="累计用时" width="100" align="right">
              <template #default="{ row }">
                <b>{{ row.totalActual }}h</b>
              </template>
            </el-table-column>
            <el-table-column label="本周用时" width="100" align="right">
              <template #default="{ row }">{{ row.weekActual }}h</template>
            </el-table-column>
            <el-table-column label="预算使用率" width="130" align="center">
              <template #default="{ row }">
                <template v-if="row.budgetHours > 0">
                  <el-progress
                    :percentage="Math.min(Math.round(row.totalActual / row.budgetHours * 100), 100)"
                    :stroke-width="6"
                    :color="row.totalActual > row.budgetHours ? '#f5222d' : '#52c41a'"
                  />
                </template>
                <span v-else class="dim">—</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <!-- Entry dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogMode === 'plan' ? '新增计划条目' : '新增小结条目'"
      width="560px"
      :close-on-click-modal="false"
    >
      <el-form :model="entryForm" :rules="entryRules" ref="entryFormRef" label-width="100px">
        <el-form-item label="日期" prop="entryDate">
          <el-date-picker
            v-model="entryForm.entryDate"
            type="date"
            value-format="YYYY-MM-DD"
            :disabled-date="disableOutsideWeek"
            placeholder="选择日期"
            style="width:100%"
          />
        </el-form-item>
        <el-form-item label="关联项目">
          <el-select
            v-model="entryForm.projectId"
            placeholder="可不关联（非项目工作）"
            clearable
            filterable
            style="width:100%"
            @change="onProjectSelect"
          >
            <el-option
              v-for="p in activeProjects"
              :key="p.id"
              :label="`${p.projectNo} — ${p.purpose}`"
              :value="p.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="工作地点" prop="workType">
          <el-radio-group v-model="entryForm.workType">
            <el-radio value="office">公司</el-radio>
            <el-radio value="field">现场</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="dialogMode === 'plan'">
          <el-form-item label="计划工时" prop="plannedHours">
            <el-input-number v-model="entryForm.plannedHours" :min="0.5" :max="24" :step="0.5" />
            <span class="unit">小时</span>
          </el-form-item>
          <el-form-item label="预计进度" prop="plannedProgress">
            <el-slider v-model="entryForm.plannedProgress" :step="5" show-input style="flex:1" />
          </el-form-item>
        </template>
        <template v-if="dialogMode === 'summary'">
          <el-form-item label="实际工时" prop="actualHours">
            <el-input-number v-model="entryForm.actualHours" :min="0" :max="24" :step="0.5" />
            <span class="unit">小时</span>
          </el-form-item>
          <el-form-item label="实际进度" prop="actualProgress">
            <el-slider v-model="entryForm.actualProgress" :step="5" show-input style="flex:1" />
          </el-form-item>
          <el-form-item label="延期原因">
            <el-input v-model="entryForm.delayReason" placeholder="如有延期请填写原因" />
          </el-form-item>
        </template>
        <el-form-item label="备注">
          <el-input v-model="entryForm.note" placeholder="补充说明" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="savingEntry" @click="submitEntry">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, ArrowRight, Plus, InfoFilled } from '@element-plus/icons-vue'
import { worklogApi, projectApi } from '@/api/index.js'
import { useAuthStore } from '@/stores/auth.js'

const route  = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// ── Week state ────────────────────────────────────────────────
// currentWeekStart: the week being summarised (本周小结)
// nextWeekStart:    the week being planned for (下周计划)
const currentWeekStart = ref('')
const nextWeekStart    = ref('')

// Two separate log records
const logData     = ref({ id: '', summaryNote: '', entries: [] }) // 本周
const nextLogData = ref({ id: '', planNote:    '', entries: [] }) // 下周

const loading   = ref(false)
const activeTab = ref('summary')

// ── Projects list ─────────────────────────────────────────────
const activeProjects = ref([])

onMounted(async () => {
  const pRes = await projectApi.list({ pageSize: 200 })
  activeProjects.value = (pRes.data || []).filter(p => p.status !== 'archived')

  const qs = route.query
  currentWeekStart.value = qs.weekStart || getWeekStart(new Date().toISOString().slice(0, 10))
  nextWeekStart.value    = addDays(currentWeekStart.value, 7)
  await loadWeek()
})

watch(() => route.query.weekStart, val => {
  if (val && val !== currentWeekStart.value) {
    currentWeekStart.value = val
    nextWeekStart.value    = addDays(val, 7)
    loadWeek()
  }
})

function getWeekStart(dateStr) {
  const d = new Date(dateStr)
  const day = d.getDay()
  d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day))
  return d.toISOString().slice(0, 10)
}

function addDays(dateStr, days) {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function shiftWeek(delta) {
  currentWeekStart.value = addDays(currentWeekStart.value, delta * 7)
  nextWeekStart.value    = addDays(currentWeekStart.value, 7)
  router.replace({ query: { weekStart: currentWeekStart.value } })
  loadWeek()
}

function goCurrentWeek() {
  currentWeekStart.value = getWeekStart(new Date().toISOString().slice(0, 10))
  nextWeekStart.value    = addDays(currentWeekStart.value, 7)
  router.replace({ query: { weekStart: currentWeekStart.value } })
  loadWeek()
}

async function loadWeek() {
  loading.value = true
  try {
    const uid   = authStore.userId
    const uname = authStore.userName
    // Load both week records in parallel
    const [curRes, nextRes] = await Promise.all([
      worklogApi.getWeekByDate({ weekStart: currentWeekStart.value, userId: uid, userName: uname }),
      worklogApi.getWeekByDate({ weekStart: nextWeekStart.value,    userId: uid, userName: uname }),
    ])
    logData.value     = curRes.data
    nextLogData.value = nextRes.data
  } finally {
    loading.value = false
  }
}

// ── Labels ────────────────────────────────────────────────────
const weekLabel     = computed(() => formatWeekRange(currentWeekStart.value))
const nextWeekLabel = computed(() => formatWeekRange(nextWeekStart.value))

function formatWeekRange(weekStart) {
  if (!weekStart) return ''
  const d = new Date(weekStart)
  const end = new Date(d)
  end.setDate(end.getDate() + 4)
  return `${d.getMonth()+1}/${d.getDate()} - ${end.getMonth()+1}/${end.getDate()}`
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const days = ['日','一','二','三','四','五','六']
  return `${d.getMonth()+1}/${d.getDate()} (周${days[d.getDay()]})`
}

// ── Entries: plan from nextLogData, summary from logData ───────
const planEntries    = computed(() =>
  (nextLogData.value.entries || []).filter(e => e.entryType === 'plan')
    .sort((a, b) => a.entryDate.localeCompare(b.entryDate))
)
const summaryEntries = computed(() =>
  (logData.value.entries || []).filter(e => e.entryType === 'summary')
    .sort((a, b) => a.entryDate.localeCompare(b.entryDate))
)

const totalPlannedHours = computed(() => planEntries.value.reduce((s, e) => s + (e.plannedHours || 0), 0).toFixed(1))
const totalActualHours  = computed(() => summaryEntries.value.reduce((s, e) => s + (e.actualHours || 0), 0).toFixed(1))
const avgActualProgress = computed(() => {
  const entries = summaryEntries.value
  if (!entries.length) return 0
  return Math.round(entries.reduce((s, e) => s + (e.actualProgress || 0), 0) / entries.length)
})

// ── Project hours summary (Tab 3) — uses current week's summary entries ──
const projectHoursSummary = computed(() => {
  const map = {}
  for (const e of (logData.value.entries || [])) {
    if (!e.projectId || e.entryType !== 'summary') continue
    if (!map[e.projectId]) {
      const proj = activeProjects.value.find(p => p.id === e.projectId)
      map[e.projectId] = {
        projectId:   e.projectId,
        projectNo:   e.projectNo,
        projectName: e.projectName,
        budgetHours: proj?.budgetHours ?? 0,
        totalActual: 0,
        weekActual:  0,
      }
    }
    map[e.projectId].weekActual  += (e.actualHours || 0)
    map[e.projectId].totalActual += (e.actualHours || 0)
  }
  return Object.values(map)
})

// ── Save notes ────────────────────────────────────────────────
// planNote lives in next week's log; summaryNote lives in current week's log
async function savePlanNote() {
  const id = nextLogData.value.id || 'new'
  const res = await worklogApi.saveWeekNotes(id, {
    planNote:  nextLogData.value.planNote,
    userId:    authStore.userId,
    userName:  authStore.userName,
    weekStart: nextWeekStart.value,
  })
  if (!nextLogData.value.id && res.data?.id) {
    nextLogData.value.id = res.data.id
  }
}

async function saveSummaryNote() {
  const id = logData.value.id || 'new'
  const res = await worklogApi.saveWeekNotes(id, {
    summaryNote: logData.value.summaryNote,
    userId:      authStore.userId,
    userName:    authStore.userName,
    weekStart:   currentWeekStart.value,
  })
  if (!logData.value.id && res.data?.id) {
    logData.value.id = res.data.id
  }
}

// ── Entry dialog ──────────────────────────────────────────────
const dialogVisible  = ref(false)
const dialogMode     = ref('plan')
const savingEntry    = ref(false)
const editingEntryId = ref(null)
const entryFormRef   = ref()

const entryForm = ref({
  entryDate: '', projectId: '', workType: 'office',
  plannedHours: 4, actualHours: 4,
  plannedProgress: 50, actualProgress: 50,
  note: '', delayReason: '',
})

const entryRules = {
  entryDate: [{ required: true, message: '请选择日期', trigger: 'change' }],
}

function openEntryDialog(mode) {
  dialogMode.value     = mode
  editingEntryId.value = null
  // Default date: next week Monday for plan, current week Monday for summary
  const base = mode === 'plan' ? new Date(nextWeekStart.value) : new Date(currentWeekStart.value)
  entryForm.value = {
    entryDate: base.toISOString().slice(0, 10),
    projectId: '', workType: 'office',
    plannedHours: 4, actualHours: 4,
    plannedProgress: 50, actualProgress: 50,
    note: '', delayReason: '',
  }
  dialogVisible.value = true
}

function editEntry(row) {
  dialogMode.value     = row.entryType
  editingEntryId.value = row.id
  entryForm.value = {
    entryDate:       row.entryDate,
    projectId:       row.projectId || '',
    workType:        row.workType || 'office',
    plannedHours:    row.plannedHours    || 4,
    actualHours:     row.actualHours     || 4,
    plannedProgress: row.plannedProgress || 50,
    actualProgress:  row.actualProgress  || 50,
    note:            row.note        || '',
    delayReason:     row.delayReason || '',
  }
  dialogVisible.value = true
}

function onProjectSelect() {}  // reserved for future use
function disableOutsideWeek() { return false }

async function submitEntry() {
  await entryFormRef.value.validate()
  savingEntry.value = true
  const proj = activeProjects.value.find(p => p.id === entryForm.value.projectId)
  // Plan entries belong to next week's log; summary entries to current week's log
  const isPlan       = dialogMode.value === 'plan'
  const targetLog    = isPlan ? nextLogData.value : logData.value
  const targetWeek   = isPlan ? nextWeekStart.value : currentWeekStart.value

  try {
    const payload = {
      entryDate:       entryForm.value.entryDate,
      projectId:       entryForm.value.projectId || null,
      projectNo:       proj?.projectNo || '',
      projectName:     proj?.purpose   || '',
      workType:        entryForm.value.workType,
      plannedHours:    entryForm.value.plannedHours,
      actualHours:     entryForm.value.actualHours,
      plannedProgress: entryForm.value.plannedProgress,
      actualProgress:  entryForm.value.actualProgress,
      note:            entryForm.value.note,
      delayReason:     entryForm.value.delayReason,
    }

    if (editingEntryId.value) {
      await worklogApi.updateEntry(editingEntryId.value, payload)
    } else {
      const res = await worklogApi.addEntry({
        ...payload,
        weeklyLogId: targetLog.id || null,  // null triggers lazy-create on backend
        userId:      authStore.userId,
        userName:    authStore.userName,
        weekStart:   targetWeek,
        entryType:   dialogMode.value,
      })
      // Capture the newly created weeklyLogId so subsequent saves use it
      if (!targetLog.id && res.data?.weeklyLogId) {
        targetLog.id = res.data.weeklyLogId
      }
    }
    ElMessage.success('保存成功')
    dialogVisible.value = false
    await loadWeek()
  } finally {
    savingEntry.value = false
  }
}

async function deleteEntry(row) {
  await ElMessageBox.confirm('确定删除该条目？', '提示', { type: 'warning' })
  await worklogApi.deleteEntry(row.id)
  ElMessage.success('已删除')
  await loadWeek()
}

function progressColor(row) {
  const diff = row.actualProgress - row.plannedProgress
  if (diff >= 0) return '#52c41a'
  if (diff >= -20) return '#faad14'
  return '#f5222d'
}
</script>

<style scoped>
.worklog-form { max-width: 1100px; }
.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}
.page-header h2 { margin: 0; font-size: 18px; flex: 1; }
.week-nav { display: flex; align-items: center; gap: 8px; }
.log-tabs { margin-top: 4px; }
.section-card { margin-bottom: 16px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.date-cell { font-size: 13px; font-weight: 500; color: #374151; }
.project-ref { display: flex; align-items: center; gap: 6px; }
.non-project { color: #6b7280; font-size: 13px; }
.delay-reason { color: #f5222d; font-size: 12px; }
.dim { color: #d1d5db; }
.summary-stats {
  display: flex;
  gap: 24px;
  padding: 12px 0;
  font-size: 13px;
  color: #6b7280;
}
.unit { margin-left: 8px; color: #9ca3af; }
.over-budget { color: #f5222d; font-weight: 600; }
:deep(.el-form-item) { margin-bottom: 8px; }
</style>
