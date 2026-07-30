<template>
  <div class="worklog-overview">
    <div class="page-header">
      <h2>工作日志 — 全员概览</h2>
      <div class="week-nav">
        <el-button :icon="ArrowLeft" circle @click="shiftWeek(-1)" />
        <span class="week-label">{{ weekLabel }}</span>
        <el-button :icon="ArrowRight" circle @click="shiftWeek(1)" />
        <el-button @click="goCurrentWeek" style="margin-left:8px">本周</el-button>
      </div>
    </div>

    <!-- Stats row -->
    <el-row :gutter="16" class="stats-row" v-if="overview.length">
      <el-col :span="6">
        <el-card shadow="never" class="stat-card">
          <div class="stat-num">{{ overview.length }}</div>
          <div class="stat-label">已提交人员</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never" class="stat-card">
          <div class="stat-num">{{ totalPlanEntries }}</div>
          <div class="stat-label">计划条目总数</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never" class="stat-card">
          <div class="stat-num">{{ totalActualHours }}h</div>
          <div class="stat-label">全员实际工时</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never" class="stat-card">
          <div class="stat-num">{{ avgCompletion }}%</div>
          <div class="stat-label">平均完成率</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Per-person accordion -->
    <div v-loading="loading">
      <div v-if="!loading && overview.length === 0" class="empty-hint">
        本周暂无任何人员提交工作日志
      </div>

      <el-collapse v-model="openPanels" class="person-collapse">
        <el-collapse-item
          v-for="log in overview"
          :key="log.id"
          :name="log.id"
        >
          <template #title>
            <div class="collapse-title">
              <el-avatar :size="28" style="background:#1d4ed8;font-size:13px;font-weight:600;flex-shrink:0">
                {{ (log.userName || '?').slice(0, 1) }}
              </el-avatar>
              <span class="person-name">{{ log.userName }}</span>
              <el-tag size="small" type="info">计划 {{ countEntries(log, 'plan') }} 条</el-tag>
              <el-tag size="small" type="success">小结 {{ countEntries(log, 'summary') }} 条</el-tag>
              <span class="hours-info">实际 <b>{{ sumActual(log) }}h</b></span>
              <el-progress
                :percentage="completionRate(log)"
                :stroke-width="6"
                style="width:100px"
                :color="progressColor(completionRate(log))"
              />
            </div>
          </template>

          <!-- Plan entries -->
          <div class="sub-section" v-if="countEntries(log, 'plan') > 0">
            <div class="sub-title">下周工作计划</div>
            <el-table :data="getPlanEntries(log)" size="small">
              <el-table-column label="日期" width="120">
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
                  <el-tag :type="row.workType === 'field' ? 'warning' : ''" size="small">
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
              <el-table-column label="备注" min-width="120" show-overflow-tooltip prop="note" />
            </el-table>
          </div>

          <!-- Summary entries -->
          <div class="sub-section" v-if="countEntries(log, 'summary') > 0">
            <div class="sub-title">本周工作小结</div>
            <el-table :data="getSummaryEntries(log)" size="small">
              <el-table-column label="日期" width="120">
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
                  <el-tag :type="row.workType === 'field' ? 'warning' : ''" size="small">
                    {{ row.workType === 'field' ? '现场' : '公司' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="实际工时" width="90" align="right">
                <template #default="{ row }">{{ row.actualHours }}h</template>
              </el-table-column>
              <el-table-column label="实际进度" width="110" align="center">
                <template #default="{ row }">
                  <el-progress :percentage="row.actualProgress" :stroke-width="5" />
                </template>
              </el-table-column>
              <el-table-column label="延期原因" min-width="120" show-overflow-tooltip>
                <template #default="{ row }">
                  <span :style="row.delayReason ? 'color:#f5222d' : 'color:#d1d5db'">
                    {{ row.delayReason || '—' }}
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- Notes -->
          <div class="notes-row" v-if="log.planNote || log.summaryNote">
            <div v-if="log.planNote" class="note-block">
              <span class="note-tag plan">计划说明</span>
              {{ log.planNote }}
            </div>
            <div v-if="log.summaryNote" class="note-block">
              <span class="note-tag summary">小结说明</span>
              {{ log.summaryNote }}
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { worklogApi } from '@/api/index.js'

const overview    = ref([])
const loading     = ref(false)
const openPanels  = ref([])

const currentWeekStart = ref(getWeekStart(new Date().toISOString().slice(0, 10)))

onMounted(() => loadOverview())

function getWeekStart(dateStr) {
  const d = new Date(dateStr)
  const day = d.getDay()
  d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day))
  return d.toISOString().slice(0, 10)
}

function shiftWeek(delta) {
  const d = new Date(currentWeekStart.value)
  d.setDate(d.getDate() + delta * 7)
  currentWeekStart.value = d.toISOString().slice(0, 10)
  loadOverview()
}

function goCurrentWeek() {
  currentWeekStart.value = getWeekStart(new Date().toISOString().slice(0, 10))
  loadOverview()
}

async function loadOverview() {
  loading.value = true
  try {
    const res = await worklogApi.getOverview({ weekStart: currentWeekStart.value })
    const all = (res.data || []).filter(r =>
      (r.entries && r.entries.length > 0) || r.planNote || r.summaryNote
    )
    overview.value   = all
    openPanels.value = all.map(l => l.id)
  } finally {
    loading.value = false
  }
}

const weekLabel = computed(() => {
  const d = new Date(currentWeekStart.value)
  const end = new Date(d)
  end.setDate(end.getDate() + 4)
  return `${d.getFullYear()}年 ${d.getMonth()+1}/${d.getDate()} — ${end.getMonth()+1}/${end.getDate()}`
})

const totalPlanEntries = computed(() => overview.value.reduce((s, l) => s + countEntries(l, 'plan'), 0))
const totalActualHours = computed(() => overview.value.reduce((s, l) => s + Number(sumActual(l)), 0).toFixed(1))
const avgCompletion    = computed(() => {
  if (!overview.value.length) return 0
  return Math.round(overview.value.reduce((s, l) => s + completionRate(l), 0) / overview.value.length)
})

function countEntries(log, type) {
  return (log.entries || []).filter(e => e.entryType === type).length
}
function getPlanEntries(log)    { return (log.entries || []).filter(e => e.entryType === 'plan').sort((a,b) => a.entryDate.localeCompare(b.entryDate)) }
function getSummaryEntries(log) { return (log.entries || []).filter(e => e.entryType === 'summary').sort((a,b) => a.entryDate.localeCompare(b.entryDate)) }
function sumActual(log)  { return (log.entries || []).reduce((s, e) => s + (e.actualHours || 0), 0).toFixed(1) }

function completionRate(log) {
  const planned = (log.entries || []).filter(e => e.entryType === 'plan')
  if (!planned.length) return 0
  return Math.round(planned.reduce((s, e) => s + (e.plannedProgress || 0), 0) / planned.length)
}

function progressColor(pct) {
  if (pct >= 90) return '#52c41a'
  if (pct >= 60) return '#faad14'
  return '#f5222d'
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const days = ['日','一','二','三','四','五','六']
  return `${d.getMonth()+1}/${d.getDate()} (周${days[d.getDay()]})`
}
</script>

<style scoped>
.worklog-overview { max-width: 1200px; }
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.page-header h2 { margin: 0; font-size: 20px; }
.week-nav { display: flex; align-items: center; gap: 8px; }
.week-label { font-weight: 600; font-size: 15px; min-width: 180px; text-align: center; }
.stats-row { margin-bottom: 20px; }
.stat-card { text-align: center; }
.stat-num { font-size: 28px; font-weight: 700; color: #1d4ed8; }
.stat-label { font-size: 13px; color: #6b7280; margin-top: 4px; }
.person-collapse { background: white; border-radius: 8px; box-shadow: 0 1px 3px rgb(0 0 0 / 0.06); }
.collapse-title { display: flex; align-items: center; gap: 10px; width: 100%; }
.person-name { font-weight: 600; min-width: 60px; }
.hours-info { font-size: 13px; color: #6b7280; margin-left: 4px; }
.sub-section { padding: 12px 16px; }
.sub-title { font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 8px; }
.notes-row { display: flex; gap: 24px; padding: 8px 16px 12px; }
.note-block { flex: 1; font-size: 13px; color: #374151; line-height: 1.6; }
.note-tag {
  display: inline-block;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 11px;
  margin-right: 6px;
  font-weight: 600;
}
.note-tag.plan    { background: #eff6ff; color: #1d4ed8; }
.note-tag.summary { background: #f0fdf4; color: #16a34a; }
.empty-hint {
  text-align: center;
  padding: 60px 0;
  color: #9ca3af;
  font-size: 14px;
  background: white;
  border-radius: 8px;
}
</style>
