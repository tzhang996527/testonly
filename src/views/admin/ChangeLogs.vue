<template>
  <div class="change-logs">
    <div class="page-header">
      <h3>变更记录</h3>
    </div>

    <!-- Filter bar -->
    <el-card shadow="never" style="margin-bottom:16px">
      <el-form inline :model="filter" @submit.prevent="loadData">
        <el-form-item label="操作时间">
          <el-date-picker
            v-model="filter.dateRange"
            type="daterange"
            value-format="YYYY-MM-DD"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width:260px"
          />
        </el-form-item>
        <el-form-item label="操作类型">
          <el-select v-model="filter.action" placeholder="全部" clearable style="width:110px">
            <el-option label="新增" value="create" />
            <el-option label="修改" value="update" />
            <el-option label="删除" value="delete" />
          </el-select>
        </el-form-item>
        <el-form-item label="数据类型">
          <el-select v-model="filter.entityType" placeholder="全部" clearable style="width:140px">
            <el-option v-for="opt in entityTypeOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键字">
          <el-input v-model="filter.keyword" placeholder="操作人/项目编号" clearable style="width:180px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">查询</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never">
      <el-table :data="rows" stripe v-loading="loading" size="small">
        <el-table-column label="操作时间" prop="operatedAt" width="160" />
        <el-table-column label="操作人" width="140">
          <template #default="{ row }">
            {{ row.operatorName }}
            <span v-if="row.operatorUsername" style="color:#8c8c8c;font-size:12px">
              ({{ row.operatorUsername }})
            </span>
          </template>
        </el-table-column>
        <el-table-column label="IP地址" prop="operatorIp" width="140" />
        <el-table-column label="数据类型" width="130">
          <template #default="{ row }">
            {{ entityTypeLabel(row.entityType) }}
          </template>
        </el-table-column>
        <el-table-column label="操作类型" width="90">
          <template #default="{ row }">
            <el-tag :type="actionTagType(row.action)" size="small">{{ actionLabel(row.action) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="变更字段数" width="90">
          <template #default="{ row }">
            <span v-if="row.action !== 'delete'">{{ row.fieldChanges?.length ?? 0 }}</span>
            <span v-else style="color:#8c8c8c">—</span>
          </template>
        </el-table-column>
        <el-table-column label="所属项目" min-width="140">
          <template #default="{ row }">
            <el-button v-if="row.projectId" link type="primary" size="small" @click="goToProject(row.projectId, row.currentStep)">
              {{ row.projectNo || row.projectId }}
            </el-button>
            <span v-else style="color:#bfbfbf">—</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="openDetail(row)">查看明细</el-button>
            <el-button
              v-if="authStore.hasPerm(PERM.CHANGE_LOGS_DELETE)"
              link type="danger" size="small"
              @click="handleDelete(row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div style="margin-top:16px;display:flex;justify-content:flex-end">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[20, 50, 100]"
          layout="total, sizes, prev, pager, next"
          @size-change="loadData"
          @current-change="loadData"
        />
      </div>
    </el-card>

    <!-- Detail drawer -->
    <el-drawer v-model="drawerVisible" title="变更明细" size="600px" direction="rtl">
      <template v-if="detail">
        <el-descriptions :column="2" border size="small" style="margin-bottom:20px">
          <el-descriptions-item label="操作人">
            {{ detail.operatorName }} ({{ detail.operatorUsername }})
          </el-descriptions-item>
          <el-descriptions-item label="操作时间">{{ detail.operatedAt }}</el-descriptions-item>
          <el-descriptions-item label="IP地址">{{ detail.operatorIp || '—' }}</el-descriptions-item>
          <el-descriptions-item label="操作类型">
            <el-tag :type="actionTagType(detail.action)" size="small">{{ actionLabel(detail.action) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="数据类型">{{ entityTypeLabel(detail.entityType) }}</el-descriptions-item>
          <el-descriptions-item label="所属项目">
            <el-button v-if="detail.projectId" link type="primary" size="small" @click="goToProject(detail.projectId, detail.currentStep)">
              {{ detail.projectNo || detail.projectId }}
            </el-button>
            <span v-else>—</span>
          </el-descriptions-item>
        </el-descriptions>

        <template v-if="detail.action !== 'delete' && detail.fieldChanges?.length">
          <div style="font-weight:600;margin-bottom:8px">字段变更明细</div>
          <el-table :data="detail.fieldChanges" border size="small">
            <el-table-column label="字段名" prop="fieldLabel" width="130" />
            <el-table-column label="变更前" min-width="150">
              <template #default="{ row }">
                <span :class="{ 'old-value': row.oldValue !== null && row.oldValue !== undefined }">
                  {{ formatValue(row.oldValue) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="变更后" min-width="150">
              <template #default="{ row }">
                <span class="new-value">{{ formatValue(row.newValue) }}</span>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <el-empty v-else-if="detail.action === 'delete'" description="删除操作，无字段明细" />
        <el-empty v-else description="无字段变更" />
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/stores/auth.js'
import { PERM } from '@/constants/permissions.js'
import { changeLogApi } from '@/api/index.js'

const router    = useRouter()
const authStore = useAuthStore()
const rows    = ref([])
const total   = ref(0)
const loading = ref(false)
const page     = ref(1)
const pageSize = ref(20)

const drawerVisible = ref(false)
const detail = ref(null)

const filter = reactive({ dateRange: null, action: '', entityType: '', keyword: '' })

const entityTypeOptions = [
  { value: 'project',             label: '评估项目' },
  { value: 'asset',               label: '资产台账' },
  { value: 'inventory_item',      label: '盘点项目' },
  { value: 'approval',            label: '审批动作' },
  { value: 'stage_pre_work',      label: '前期工作' },
  { value: 'stage_inventory',     label: '清查盘点' },
  { value: 'stage_collection',    label: '资料收集' },
  { value: 'stage_estimation',    label: '评定估算' },
  { value: 'stage_review',        label: '内部审核' },
  { value: 'stage_confirmation',  label: '结果确认' },
  { value: 'stage_archive',       label: '报告归档' },
]

const entityTypeLabelMap = Object.fromEntries(entityTypeOptions.map(o => [o.value, o.label]))
const entityTypeLabel = (t) => entityTypeLabelMap[t] || t

const actionLabel   = (a) => ({ create: '新增', update: '修改', delete: '删除' }[a] || a)
const actionTagType = (a) => ({ create: 'success', update: 'warning', delete: 'danger' }[a] || '')

function formatValue(val) {
  if (val === null || val === undefined) return '—'
  if (typeof val === 'string' && (val.startsWith('[') || val.startsWith('{'))) {
    try { return JSON.stringify(JSON.parse(val), null, 1) } catch { /* fall through */ }
  }
  return String(val)
}

async function loadData() {
  loading.value = true
  try {
    const params = {
      page: page.value,
      pageSize: pageSize.value,
    }
    if (filter.action)     params.action     = filter.action
    if (filter.entityType) params.entityType = filter.entityType
    if (filter.keyword)    params.keyword    = filter.keyword
    if (filter.dateRange?.length === 2) {
      params.startDate = filter.dateRange[0]
      params.endDate   = filter.dateRange[1]
    }
    const res = await changeLogApi.list(params)
    rows.value  = res.data
    total.value = res.total
  } finally {
    loading.value = false
  }
}

function resetFilter() {
  Object.assign(filter, { dateRange: null, action: '', entityType: '', keyword: '' })
  page.value = 1
  loadData()
}

function openDetail(row) {
  detail.value = row
  drawerVisible.value = true
}

async function handleDelete(row) {
  try {
    await ElMessageBox.confirm('确定删除该条变更记录？此操作不可恢复。', '删除确认', {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning',
    })
  } catch {
    return
  }
  try {
    await changeLogApi.remove(row.id)
    rows.value = rows.value.filter(r => r.id !== row.id)
    total.value -= 1
    ElMessage.success('已删除')
  } catch {
    ElMessage.error('删除失败，请重试')
  }
}

const STEP_TAB = [
  'overview', 'pre-work', 'inventory', 'collection',
  'estimation', 'review', 'confirmation', 'archive', 'tracking',
]

function goToProject(projectId, currentStep) {
  const tab = STEP_TAB[(currentStep || 1) - 1] || 'overview'
  router.push(`/project/${projectId}/${tab}`)
}

onMounted(loadData)
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.page-header h3 { margin: 0; font-size: 20px; font-weight: 600; }
.old-value { color: #cf1322; text-decoration: line-through; }
.new-value { color: #389e0d; }
</style>
