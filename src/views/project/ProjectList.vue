<template>
  <div class="project-list">
    <div class="page-header">
      <h3>{{ t('project.title') }}</h3>
      <el-button type="primary" :icon="Plus" @click="$router.push('/project/create')">
        {{ t('common.create') }}
      </el-button>
    </div>

    <!-- Filters -->
    <el-card shadow="never" style="margin-bottom:16px">
      <el-form :model="filters" inline>
        <el-form-item :label="t('common.status')">
          <el-select v-model="filters.status" clearable style="width:140px" :placeholder="t('common.all')">
            <el-option label="草稿" value="draft" />
            <el-option label="执行中" value="inProgress" />
            <el-option label="审核中" value="reviewing" />
            <el-option label="已确认" value="confirmed" />
            <el-option label="已归档" value="archived" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('common.search')">
          <el-input v-model="filters.keyword" :placeholder="t('project.projectNo') + '/' + t('project.purpose')" clearable style="width:220px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="fetchData">{{ t('common.search') }}</el-button>
          <el-button @click="resetFilters">{{ t('common.reset') }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- Table -->
    <el-card shadow="never">
      <!-- toolbar: export + column chooser -->
      <div class="table-toolbar">
        <el-button type="success" :icon="Download" size="small" @click="exportCSV">导出</el-button>
        <el-popover placement="bottom-end" :width="220" trigger="click">
          <template #reference>
            <el-button :icon="Setting" size="small">列设置</el-button>
          </template>
          <div class="col-chooser">
            <div class="col-chooser-title">显示列</div>
            <el-checkbox
              v-for="col in toggleableColumns"
              :key="col.key"
              v-model="col.visible"
              @change="saveColPrefs"
              class="col-chooser-item"
            >{{ col.label }}</el-checkbox>
            <el-divider style="margin:8px 0" />
            <el-button size="small" text @click="resetColPrefs">恢复默认</el-button>
          </div>
        </el-popover>
      </div>

      <el-table :data="projectStore.list" v-loading="projectStore.loading" stripe @sort-change="handleSortChange">
        <!-- projectNo always visible -->
        <el-table-column :label="t('project.projectNo')" prop="projectNo" width="140" sortable="custom" />

        <el-table-column
          v-if="colVisible('purpose')"
          :label="t('project.purpose')" prop="purpose" min-width="160" sortable="custom"
        />
        <el-table-column
          v-if="colVisible('assetCategory')"
          :label="t('project.assetCategory')" prop="assetCategory" width="120" sortable="custom"
        >
          <template #default="{ row }">
            {{ t(`project.assetCategories.${row.assetCategory}`) }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="colVisible('baseDate')"
          :label="t('project.baseDate')" prop="baseDate" width="120" sortable="custom"
        />
        <el-table-column
          v-if="colVisible('responsible')"
          :label="t('project.responsible')" prop="responsible" width="100" sortable="custom"
        />
        <el-table-column
          v-if="colVisible('status')"
          :label="t('common.status')" width="110" sortable="custom" prop="status"
        >
          <template #default="{ row }">
            <StatusTag :status="row.status" />
          </template>
        </el-table-column>
        <el-table-column
          v-if="colVisible('currentStep')"
          label="当前步骤" width="140" sortable="custom" prop="currentStep"
        >
          <template #default="{ row }">
            <el-progress
              :percentage="Math.round(row.currentStep / 9 * 100)"
              :stroke-width="8"
              :show-text="false"
            />
            <div style="font-size:11px;color:#8c8c8c;margin-top:2px">
              {{ row.currentStep }}/9 {{ stepLabels[row.currentStep - 1] }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="colVisible('createdAt')"
          :label="t('common.createdAt')" prop="createdAt" width="160" sortable="custom"
        />

        <!-- operation always visible + fixed right -->
        <el-table-column :label="t('common.operation')" width="140" fixed="right">
          <template #default="{ row }">
            <div style="white-space:nowrap">
              <el-button link type="primary" @click="$router.push(`/project/${row.id}/overview`)">详情</el-button>
              <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="projectStore.total"
          :page-sizes="[15, 30, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          background
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, Setting, Download } from '@element-plus/icons-vue'
import { useProjectStore } from '@/stores/project.js'
import StatusTag from '@/components/common/StatusTag.vue'

const { t } = useI18n()
const projectStore = useProjectStore()

const filters    = reactive({ status: '', keyword: '' })
const pagination = reactive({ page: 1, pageSize: 15 })
const sort       = reactive({ prop: '', order: '' })

const stepLabels = ['评估立项', '前期工作', '清查盘点', '资料收集', '评定估算', '内部审核', '结果确认', '报告归档', '后续跟踪']

// ── Column visibility ────────────────────────────────────────────────────────
const STORAGE_KEY = 'project_list_columns'

const defaultVisible = ['purpose', 'assetCategory', 'baseDate', 'responsible', 'status', 'currentStep', 'createdAt']

const toggleableColumns = reactive([
  { key: 'purpose',       label: '评估目的',   visible: true },
  { key: 'assetCategory', label: '资产类别',   visible: true },
  { key: 'baseDate',      label: '评估基准日', visible: true },
  { key: 'responsible',   label: '负责人',     visible: true },
  { key: 'status',        label: '状态',       visible: true },
  { key: 'currentStep',   label: '当前步骤',   visible: true },
  { key: 'createdAt',     label: '创建时间',   visible: true },
])

function loadColPrefs() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    if (!saved) return
    for (const col of toggleableColumns) {
      if (Object.prototype.hasOwnProperty.call(saved, col.key)) {
        col.visible = saved[col.key]
      }
    }
  } catch {}
}

function saveColPrefs() {
  const prefs = Object.fromEntries(toggleableColumns.map(c => [c.key, c.visible]))
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
}

function resetColPrefs() {
  for (const col of toggleableColumns) {
    col.visible = defaultVisible.includes(col.key)
  }
  localStorage.removeItem(STORAGE_KEY)
}

function colVisible(key) {
  return toggleableColumns.find(c => c.key === key)?.visible ?? true
}

// ── Data ─────────────────────────────────────────────────────────────────────
function fetchData() {
  projectStore.fetchList({
    status:    filters.status,
    keyword:   filters.keyword,
    sortProp:  sort.prop,
    sortOrder: sort.order,
    page:      pagination.page,
    pageSize:  pagination.pageSize,
  })
}

function handleSortChange({ prop, order }) {
  sort.prop  = prop  || ''
  sort.order = order || ''
  pagination.page = 1
  fetchData()
}

function resetFilters() {
  filters.status = ''
  filters.keyword = ''
  pagination.page = 1
  fetchData()
}

async function handleDelete(row) {
  await ElMessageBox.confirm(`确认删除项目 ${row.projectNo}？此操作不可恢复。`, '删除确认', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning',
    confirmButtonClass: 'el-button--danger',
  })
  await projectStore.remove(row.id)
  ElMessage.success('项目已删除')
}

const statusLabels = { draft: '草稿', inProgress: '执行中', reviewing: '审核中', confirmed: '已确认', archived: '已归档' }
const assetCategoryLabels = { fixed: '固定资产', intangible: '无形资产', inventory: '存货', whole: '整体资产' }

async function exportCSV() {
  // fetch all matching rows (no pagination)
  const { projectApi } = await import('@/api/index.js')
  const res = await projectApi.list({
    status:    filters.status,
    keyword:   filters.keyword,
    sortProp:  sort.prop,
    sortOrder: sort.order,
    page:      1,
    pageSize:  9999,
  })
  const rows = res.data

  const visibleCols = [
    { key: 'projectNo',     label: '项目编号' },
    ...(colVisible('purpose')       ? [{ key: 'purpose',       label: '评估目的' }]   : []),
    ...(colVisible('assetCategory') ? [{ key: 'assetCategory', label: '资产类别' }]   : []),
    ...(colVisible('baseDate')      ? [{ key: 'baseDate',      label: '评估基准日' }] : []),
    ...(colVisible('responsible')   ? [{ key: 'responsible',   label: '负责人' }]     : []),
    ...(colVisible('status')        ? [{ key: 'status',        label: '状态' }]       : []),
    ...(colVisible('currentStep')   ? [{ key: 'currentStep',   label: '当前步骤' }]   : []),
    ...(colVisible('createdAt')     ? [{ key: 'createdAt',     label: '创建时间' }]   : []),
  ]

  function cellValue(row, key) {
    if (key === 'status')        return statusLabels[row[key]] || row[key]
    if (key === 'assetCategory') return assetCategoryLabels[row[key]] || row[key]
    if (key === 'currentStep')   return `${row[key]}/9 ${stepLabels[row[key] - 1] || ''}`
    return row[key] ?? ''
  }

  const header = visibleCols.map(c => `"${c.label}"`).join(',')
  const body   = rows.map(row =>
    visibleCols.map(c => `"${String(cellValue(row, c.key)).replace(/"/g, '""')}"`).join(',')
  ).join('\n')

  const csv  = '﻿' + header + '\n' + body   // BOM for Excel UTF-8
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `项目列表_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

onMounted(() => {
  loadColPrefs()
  fetchData()
})

watch(() => [pagination.page, pagination.pageSize], fetchData)
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.page-header h3 { margin: 0; font-size: 20px; font-weight: 600; }
.pagination { display: flex; justify-content: flex-end; margin-top: 16px; }

.table-toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
}

.col-chooser { padding: 4px 0; }
.col-chooser-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--el-text-color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}
.col-chooser-item {
  display: flex !important;
  width: 100%;
  padding: 4px 0;
  margin: 0 !important;
}

/* keep sort icon inline with header text */
:deep(.el-table__column-filter-trigger),
:deep(.cell) {
  white-space: nowrap;
}
:deep(.el-table .caret-wrapper) {
  display: inline-flex;
  flex-shrink: 0;
}
</style>
