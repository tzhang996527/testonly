<template>
  <div class="dashboard">
    <el-row :gutter="20" class="stat-cards">
      <el-col :span="6" v-for="card in statCards" :key="card.key">
        <el-card shadow="never" class="stat-card">
          <div class="stat-content">
            <div>
              <div class="stat-value">{{ dashboard?.stats[card.key] ?? '-' }}</div>
              <div class="stat-label">{{ card.label }}</div>
            </div>
            <el-icon class="stat-icon" :style="{ color: card.color }"><component :is="card.icon" /></el-icon>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top:20px">
      <!-- My Tasks -->
      <el-col :span="14">
        <el-card shadow="never" class="section-card">
          <template #header>
            <span class="card-title">我的待办</span>
            <el-badge :value="dashboard?.myTasks?.length" type="danger" style="margin-left:8px" />
          </template>
          <el-table :data="dashboard?.myTasks" size="small" stripe>
            <el-table-column label="项目编号" prop="projectNo" width="140" />
            <el-table-column label="任务" prop="title" min-width="200" />
            <el-table-column label="类型" prop="type" width="100">
              <template #default="{ row }">
                <el-tag size="small" :type="taskTypeMap[row.type]?.type">{{ taskTypeMap[row.type]?.label }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="优先级" prop="priority" width="90">
              <template #default="{ row }">
                <el-tag size="small" :type="row.priority === 'high' ? 'danger' : 'warning'">
                  {{ row.priority === 'high' ? '高' : '中' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="截止日期" prop="dueDate" width="110" />
            <el-table-column label="操作" width="80">
              <template #default="{ row }">
                <el-button link type="primary" size="small" @click="handleTask(row)">处理</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <!-- Project Status Distribution -->
      <el-col :span="10">
        <el-card shadow="never" class="section-card">
          <template #header><span class="card-title">项目状态分布</span></template>
          <div class="status-list">
            <div v-for="item in dashboard?.projectsByStatus" :key="item.status" class="status-row">
              <el-tag :type="statusColors[item.status]" size="small" style="width:80px;text-align:center">
                {{ item.label }}
              </el-tag>
              <el-progress
                :percentage="Math.round(item.count / (dashboard?.stats?.totalProjects || 1) * 100)"
                :stroke-width="12"
                :color="progressColors[item.status]"
                style="flex:1;margin:0 12px"
              />
              <span class="count">{{ item.count }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Recent Activities -->
    <el-card shadow="never" style="margin-top:20px">
      <template #header><span class="card-title">最近动态</span></template>
      <el-timeline>
        <el-timeline-item
          v-for="act in dashboard?.recentActivities"
          :key="act.id"
          :type="activityTypes[act.type]"
          :timestamp="act.time"
          placement="top"
        >
          <span class="activity-user">{{ act.user }}</span>
          <span class="activity-action">{{ act.action }}</span>
          <el-tag size="small" type="info" style="margin-left:8px">{{ act.project }}</el-tag>
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { dashboardApi } from '@/api/index.js'
import { Folder, Clock, Check, TrendCharts } from '@element-plus/icons-vue'

const router = useRouter()

const dashboard = ref(null)

const statCards = [
  { key: 'totalProjects', label: '项目总数', icon: Folder, color: '#1677ff' },
  { key: 'inProgressProjects', label: '执行中项目', icon: Clock, color: '#faad14' },
  { key: 'pendingApproval', label: '待审批', icon: TrendCharts, color: '#ff4d4f' },
  { key: 'completedThisMonth', label: '本月完成', icon: Check, color: '#52c41a' },
]

const taskTypeMap = {
  review: { label: '审核', type: 'warning' },
  estimation: { label: '估算', type: 'primary' },
  approval: { label: '审批', type: 'danger' },
}

const statusColors = {
  draft: 'info', inProgress: 'primary', reviewing: 'warning', confirmed: 'success', archived: ''
}

const progressColors = {
  draft: '#8c8c8c', inProgress: '#1677ff', reviewing: '#faad14', confirmed: '#52c41a', archived: '#d9d9d9'
}

const activityTypes = {
  approve: 'success', upload: 'primary', submit: 'warning', create: 'primary', complete: 'success'
}

onMounted(async () => {
  const res = await dashboardApi.get()
  dashboard.value = res.data
})

// stage name → tab route name (matches router config)
const STAGE_TAB = {
  overview:     'overview',
  'pre-work':   'pre-work',
  inventory:    'inventory',
  collection:   'collection',
  estimation:   'estimation',
  review:       'review',
  confirmation: 'confirmation',
  archive:      'archive',
  tracking:     'tracking',
}

function handleTask(row) {
  const tab = STAGE_TAB[row.stage] || row.stage
  router.push(`/project/${row.projectId}/${tab}`)
}
</script>

<style scoped>
.stat-card {
  border-radius: 8px;
}

.stat-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #262626;
  line-height: 1;
}

.stat-label {
  font-size: 13px;
  color: #8c8c8c;
  margin-top: 8px;
}

.stat-icon {
  font-size: 36px;
  opacity: 0.8;
}

.section-card { height: 360px; }
.section-card :deep(.el-card__body) { height: calc(100% - 55px); overflow-y: auto; }

.card-title { font-weight: 600; font-size: 15px; }

.status-list { display: flex; flex-direction: column; gap: 16px; padding: 8px 0; }
.status-row { display: flex; align-items: center; }
.count { font-weight: 600; width: 24px; text-align: right; }

.activity-user { font-weight: 600; color: #262626; }
.activity-action { color: #595959; margin-left: 6px; }
</style>
