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
      <el-table :data="projectStore.list" v-loading="projectStore.loading" stripe>
        <el-table-column :label="t('project.projectNo')" prop="projectNo" width="160" />
        <el-table-column :label="t('project.purpose')" prop="purpose" min-width="140" />
        <el-table-column :label="t('project.assetCategory')" prop="assetCategory" width="120">
          <template #default="{ row }">
            {{ t(`project.assetCategories.${row.assetCategory}`) }}
          </template>
        </el-table-column>
        <el-table-column :label="t('project.baseDate')" prop="baseDate" width="120" />
        <el-table-column :label="t('project.responsible')" prop="responsible" width="100" />
        <el-table-column :label="t('common.status')" width="110">
          <template #default="{ row }">
            <StatusTag :status="row.status" />
          </template>
        </el-table-column>
        <el-table-column label="当前步骤" width="110">
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
        <el-table-column :label="t('common.createdAt')" prop="createdAt" width="160" />
        <el-table-column :label="t('common.operation')" width="120" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="$router.push(`/project/${row.id}/overview`)">详情</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="projectStore.total"
          layout="total, prev, pager, next"
          background
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'
import { useProjectStore } from '@/stores/project.js'
import StatusTag from '@/components/common/StatusTag.vue'

const { t } = useI18n()
const projectStore = useProjectStore()

const filters = reactive({ status: '', keyword: '' })
const pagination = reactive({ page: 1, pageSize: 10 })

const stepLabels = ['评估立项', '前期工作', '清查盘点', '资料收集', '评定估算', '内部审核', '结果确认', '报告归档', '后续跟踪']

function fetchData() {
  projectStore.fetchList({ status: filters.status, keyword: filters.keyword })
}

function resetFilters() {
  filters.status = ''
  filters.keyword = ''
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

onMounted(fetchData)
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.page-header h3 { margin: 0; font-size: 20px; font-weight: 600; }
.pagination { display: flex; justify-content: flex-end; margin-top: 16px; }
</style>
