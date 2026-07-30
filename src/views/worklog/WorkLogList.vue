<template>
  <div class="worklog-list">
    <div class="page-header">
      <h2>工作日志</h2>
      <el-button type="primary" :icon="Plus" @click="goToCurrentWeek">填写本周日志</el-button>
    </div>

    <!-- Filter bar -->
    <el-card shadow="never" class="filter-card">
      <el-row :gutter="16" align="middle">
        <el-col :span="6">
          <el-date-picker
            v-model="filterYear"
            type="year"
            placeholder="按年份筛选"
            value-format="YYYY"
            style="width:100%"
            @change="loadLogs"
          />
        </el-col>
        <el-col :span="6">
          <el-select v-model="filterUserId" placeholder="按人员筛选" clearable style="width:100%" @change="loadLogs">
            <el-option
              v-for="u in users"
              :key="u.id"
              :label="u.name"
              :value="u.id"
            />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button @click="resetFilter">重置</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- Weeks table -->
    <el-card shadow="never" class="table-card">
      <el-table :data="logs" v-loading="loading" stripe>
        <el-table-column label="周次" width="130">
          <template #default="{ row }">
            <span class="week-label">{{ formatWeekLabel(row.weekStart) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="人员" prop="userName" width="90" />
        <el-table-column label="计划条目" width="90" align="center">
          <template #default="{ row }">
            <el-tag type="info" size="small">{{ countEntries(row, 'plan') }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="小结条目" width="90" align="center">
          <template #default="{ row }">
            <el-tag type="success" size="small">{{ countEntries(row, 'summary') }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="计划工时" width="90" align="right">
          <template #default="{ row }">{{ sumHours(row, 'planned') }}h</template>
        </el-table-column>
        <el-table-column label="实际工时" width="90" align="right">
          <template #default="{ row }">{{ sumHours(row, 'actual') }}h</template>
        </el-table-column>
        <el-table-column label="完成率" width="100" align="center">
          <template #default="{ row }">
            <el-progress
              :percentage="completionRate(row)"
              :stroke-width="6"
              :color="progressColor(completionRate(row))"
            />
          </template>
        </el-table-column>
        <el-table-column label="计划备注" min-width="160" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="note-text">{{ row.planNote || '—' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="小结备注" min-width="160" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="note-text">{{ row.summaryNote || '—' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" width="150" prop="updatedAt" />
        <el-table-column label="操作" width="80" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="editWeek(row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="!loading && logs.length === 0" class="empty-hint">
        暂无日志记录，点击右上角"填写本周日志"开始记录
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Plus } from '@element-plus/icons-vue'
import { worklogApi, userApi } from '@/api/index.js'
import { useAuthStore } from '@/stores/auth.js'
import { PERM } from '@/constants/permissions.js'

const router = useRouter()
const authStore = useAuthStore()

const logs    = ref([])
const users   = ref([])
const loading = ref(false)
const filterYear   = ref(String(new Date().getFullYear()))
const filterUserId = ref('')

onMounted(async () => {
  const canViewAll = authStore.isAdmin || authStore.hasPerm(PERM.WORKLOG_VIEW_ALL)
  if (canViewAll) {
    const res = await userApi.list()
    users.value = res.data || []
  }
  await loadLogs()
})

async function loadLogs() {
  loading.value = true
  try {
    const canViewAll = authStore.isAdmin || authStore.hasPerm(PERM.WORKLOG_VIEW_ALL)
    const params = { year: filterYear.value || undefined }
    if (!canViewAll) {
      params.userId = authStore.userId
    } else if (filterUserId.value) {
      params.userId = filterUserId.value
    }

    const res = await worklogApi.listWeeks(params)
    const rows = res.data || []
    const withEntries = await Promise.all(rows.map(async row => {
      const detail = await worklogApi.getWeek(row.id)
      return detail.data
    }))
    // 过滤掉空壳记录（没有任何条目且没有备注）
    logs.value = withEntries.filter(r =>
      (r.entries && r.entries.length > 0) || r.planNote || r.summaryNote
    )
  } finally {
    loading.value = false
  }
}

function resetFilter() {
  filterYear.value = String(new Date().getFullYear())
  filterUserId.value = ''
  loadLogs()
}

function formatWeekLabel(weekStart) {
  if (!weekStart) return ''
  const d = new Date(weekStart)
  const end = new Date(d)
  end.setDate(end.getDate() + 4) // Friday
  const m1 = d.getMonth() + 1, d1 = d.getDate()
  const m2 = end.getMonth() + 1, d2 = end.getDate()
  return `${m1}/${d1} - ${m2}/${d2}`
}

function countEntries(row, type) {
  return (row.entries || []).filter(e => e.entryType === type).length
}

function sumHours(row, field) {
  if (field === 'planned') {
    return (row.entries || [])
      .filter(e => e.entryType === 'plan')
      .reduce((s, e) => s + (e.plannedHours || 0), 0).toFixed(1)
  }
  return (row.entries || [])
    .filter(e => e.entryType === 'summary')
    .reduce((s, e) => s + (e.actualHours || 0), 0).toFixed(1)
}

function completionRate(row) {
  const planned = (row.entries || []).filter(e => e.entryType === 'plan')
  if (!planned.length) return 0
  const total = planned.reduce((s, e) => s + (e.plannedProgress || 0), 0)
  return Math.round(total / planned.length)
}

function progressColor(pct) {
  if (pct >= 90) return '#52c41a'
  if (pct >= 60) return '#faad14'
  return '#f5222d'
}

function goToCurrentWeek() {
  router.push('/worklog/weekly')
}

function editWeek(row) {
  router.push(`/worklog/weekly?weekStart=${row.weekStart}&logId=${row.id}`)
}
</script>

<style scoped>
.worklog-list { max-width: 1200px; }
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.page-header h2 { margin: 0; font-size: 20px; }
.filter-card { margin-bottom: 16px; }
.table-card :deep(.el-card__body) { padding: 0; }
.week-label { font-weight: 600; color: #1d4ed8; }
.note-text { color: #6b7280; font-size: 13px; }
.empty-hint {
  text-align: center;
  padding: 48px 0;
  color: #9ca3af;
  font-size: 14px;
}
</style>
