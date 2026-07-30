<template>
  <div class="project-detail" v-loading="projectStore.loading">
    <div class="page-header">
      <el-button :icon="ArrowLeft" @click="$router.push('/project')">{{ t('common.back') }}</el-button>
      <div>
        <span class="project-no">{{ project?.projectNo }}</span>
        <StatusTag :status="project?.status" style="margin-left:12px" />
      </div>
      <el-button
        v-if="project?.currentStep < 9"
        type="primary"
        @click="handleAdvance"
        :loading="advancing"
      >
        推进到下一步
      </el-button>
    </div>

    <!-- Workflow Progress -->
    <el-card shadow="never" style="margin-bottom:16px">
      <WorkflowProgress :current-step="project?.currentStep || 1" />
    </el-card>

    <!-- Tab Navigation -->
    <el-tabs v-model="activeTab" @tab-click="handleTabClick" type="card">
      <el-tab-pane
        v-for="tab in visibleTabs"
        :key="tab.name"
        :label="tab.label"
        :name="tab.name"
      />
    </el-tabs>

    <div class="tab-content">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import { useProjectStore } from '@/stores/project.js'
import StatusTag from '@/components/common/StatusTag.vue'
import WorkflowProgress from '@/components/common/WorkflowProgress.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const projectStore = useProjectStore()

const { current: project } = storeToRefs(projectStore)
const advancing = ref(false)

// tab[i] requires currentStep >= i; overview (i=0) is always visible
const allTabs = [
  { label: '项目概览', name: 'overview' },
  { label: '前期工作', name: 'pre-work' },
  { label: '清查盘点', name: 'inventory' },
  { label: '资料收集', name: 'collection' },
  { label: '评定估算', name: 'estimation' },
  { label: '内部审核', name: 'review' },
  { label: '结果确认', name: 'confirmation' },
  { label: '报告归档', name: 'archive' },
  { label: '后续跟踪', name: 'tracking' },
  { label: '变更记录', name: 'change-history' },
]
const visibleTabs = computed(() =>
  allTabs.filter((tab, i) => tab.name === 'change-history' || (project.value?.currentStep || 1) > i)
)
const tabRouteMap = allTabs.map(t => t.name)
const activeTab = ref(route.path.split('/').at(-1) || 'overview')

watch(() => route.path, (p) => {
  activeTab.value = p.split('/').at(-1) || 'overview'
})

function handleTabClick(tab) {
  router.push(`/project/${route.params.id}/${tab.props.name}`)
}

// 每步的完成校验：返回 { ok, reason } 或直接 throw 阻止推进
const stepChecks = {
  1: (p) => {
    const nodes = p.approvalsByStage?.['overview'] || []
    const pending = nodes.filter(n => n.nodeStatus !== 'approved')
    if (pending.length) {
      return { ok: false, reason: `以下审批节点尚未通过：${pending.map(n => n.role).join('、')}` }
    }
    return { ok: true }
  },
  2: () => ({ ok: true, confirm: '前期工作\n\n请确认以下事项已完成：\n· 业务委托合同已签订\n· 资料清单已锁定\n· 评估计划及人员安排已完成' }),
  3: () => ({ ok: true, confirm: '清查盘点\n\n请确认以下事项已完成：\n· 所有资产已完成现场核查\n· 盘点差异已处理完毕\n· 现场勘察记录和访谈记录已上传' }),
  4: () => ({ ok: true, confirm: '资料收集\n\n请确认以下资料已收集并上传：\n· 权属证明（产权证/发票/合同）\n· 财务资料（台账/审计报告/财报）\n· 技术资料（图纸/说明书）\n· 外部资料（市场报价/可比案例）' }),
  5: () => ({ ok: true, confirm: '评定估算\n\n请确认以下事项已完成：\n· 所有资产已录入评估值\n· 评估方法已确定\n· 评估明细表已生成' }),
  6: () => ({ ok: true, confirm: '内部审核\n\n请确认以下事项已完成：\n· 三级审核均已通过\n· 评估报告（初稿）已出具\n· 三审单已签署' }),
  7: () => ({ ok: true, confirm: '结果确认\n\n请确认以下事项已完成：\n· 评估结果确认单已审批通过\n· 结果已锁定，委托方意见已收集' }),
  8: () => ({ ok: true, confirm: '报告归档\n\n请确认以下事项已完成：\n· 评估报告已正式出具并盖章\n· 全套资料已归档\n· 委托方签收单已上传' }),
}

async function handleAdvance() {
  const step = project.value?.currentStep
  const check = stepChecks[step]

  if (check) {
    const result = check(project.value)

    if (!result.ok) {
      ElMessage.warning(result.reason)
      return
    }

    if (result.confirm) {
      try {
        await ElMessageBox.confirm(result.confirm, '确认推进流程', {
          confirmButtonText: '确认完成，推进',
          cancelButtonText: '取消',
          type: 'warning',
          customStyle: { whiteSpace: 'pre-wrap' },
        })
      } catch {
        return
      }
    }
  }

  advancing.value = true
  try {
    const updated = await projectStore.advanceStep(route.params.id)
    ElMessage.success('流程已推进')
    const nextTab = allTabs[updated.currentStep - 1]?.name
    if (nextTab) {
      await nextTick()
      activeTab.value = nextTab
      router.push(`/project/${route.params.id}/${nextTab}`)
    }
  } finally {
    advancing.value = false
  }
}

onMounted(async () => {
  await projectStore.fetchOne(route.params.id)
  const currentTab = allTabs[(project.value?.currentStep || 1) - 1]?.name || 'overview'
  await nextTick()
  activeTab.value = currentTab
  router.replace(`/project/${route.params.id}/${currentTab}`)
})
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  justify-content: space-between;
}

.project-no {
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

.tab-content {
  margin-top: 16px;
}

:deep(.el-tabs--card > .el-tabs__header .el-tabs__item.is-active) {
  background-color: var(--el-color-primary);
  color: #ffffff;
  border-bottom-color: var(--el-color-primary);
  font-weight: 600;
}

:deep(.el-tabs--card > .el-tabs__header .el-tabs__item:not(.is-active):hover) {
  color: var(--el-color-primary);
}
</style>
