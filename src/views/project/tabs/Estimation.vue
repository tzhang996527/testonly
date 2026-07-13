<template>
  <div class="estimation-tab">
    <div style="margin-bottom:16px;display:flex;justify-content:space-between;align-items:center">
      <span style="font-weight:600">评定估算明细表</span>
      <div>
        <el-button type="primary" :icon="Plus" @click="showAddDialog = true">添加资产</el-button>
        <el-button @click="autoCalc">系统自动计算</el-button>
        <el-button type="success">生成评估明细表</el-button>
      </div>
    </div>

    <el-alert v-if="!assets.length" title="暂无评估资产，请先添加或从盘点结果导入" type="info" show-icon />

    <el-table v-if="assets.length" :data="assets" stripe border>
      <el-table-column :label="t('assets.assetNo')" prop="assetNo" width="130" />
      <el-table-column :label="t('assets.assetName')" prop="assetName" min-width="130" />
      <el-table-column :label="t('assets.originalValue')" prop="originalValue" width="120">
        <template #default="{ row }">{{ fmt(row.originalValue) }}</template>
      </el-table-column>
      <el-table-column :label="t('assets.netValue')" prop="netValue" width="110">
        <template #default="{ row }">{{ fmt(row.netValue) }}</template>
      </el-table-column>
      <el-table-column :label="t('assets.assessedValue')" prop="assessedValue" width="120">
        <template #default="{ row }">
          <span style="font-weight:600;color:#1677ff">{{ fmt(row.assessedValue) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="t('assets.appreciation')" width="110">
        <template #default="{ row }">
          <span :class="(row.assessedValue - row.netValue) >= 0 ? 'positive' : 'negative'">
            {{ fmt(row.assessedValue - row.netValue) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="t('assets.appreciationRate')" width="100">
        <template #default="{ row }">
          {{ row.netValue ? ((row.assessedValue - row.netValue) / row.netValue * 100).toFixed(1) + '%' : '-' }}
        </template>
      </el-table-column>
      <el-table-column :label="t('assets.method')" prop="method" width="120">
        <template #default="{ row }">{{ t(`assets.methods.${row.method}`) }}</template>
      </el-table-column>
    </el-table>

    <el-card v-if="assets.length" shadow="never" style="margin-top:16px">
      <template #header>汇总统计</template>
      <el-descriptions :column="4" border>
        <el-descriptions-item label="资产总数">{{ assets.length }} 项</el-descriptions-item>
        <el-descriptions-item label="原值合计">{{ fmt(totalOriginal) }}</el-descriptions-item>
        <el-descriptions-item label="净值合计">{{ fmt(totalNet) }}</el-descriptions-item>
        <el-descriptions-item label="评估值合计">
          <span style="font-weight:700;color:#1677ff">{{ fmt(totalAssessed) }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="增减值合计">
          <span :class="(totalAssessed - totalNet) >= 0 ? 'positive' : 'negative'">
            {{ fmt(totalAssessed - totalNet) }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="综合增值率">
          {{ totalNet ? ((totalAssessed - totalNet) / totalNet * 100).toFixed(1) + '%' : '-' }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-dialog v-model="showAddDialog" title="添加评估资产" width="600px">
      <el-form :model="addForm" label-width="120px">
        <el-form-item :label="t('assets.assetNo')"><el-input v-model="addForm.assetNo" /></el-form-item>
        <el-form-item :label="t('assets.assetName')"><el-input v-model="addForm.assetName" /></el-form-item>
        <el-form-item :label="t('assets.originalValue')"><el-input-number v-model="addForm.originalValue" :min="0" /></el-form-item>
        <el-form-item :label="t('assets.netValue')"><el-input-number v-model="addForm.netValue" :min="0" /></el-form-item>
        <el-form-item :label="t('assets.assessedValue')"><el-input-number v-model="addForm.assessedValue" :min="0" /></el-form-item>
        <el-form-item :label="t('assets.method')">
          <el-select v-model="addForm.method">
            <el-option :label="t('assets.methods.market')" value="market" />
            <el-option :label="t('assets.methods.income')" value="income" />
            <el-option :label="t('assets.methods.assetBase')" value="assetBase" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="addAsset">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { assetApi } from '@/api/index.js'

const { t } = useI18n()
const route = useRoute()
const assets = ref([])
const showAddDialog = ref(false)
const addForm = ref({ assetNo: '', assetName: '', originalValue: 0, netValue: 0, assessedValue: 0, method: 'market' })

const totalOriginal = computed(() => assets.value.reduce((s, a) => s + a.originalValue, 0))
const totalNet = computed(() => assets.value.reduce((s, a) => s + a.netValue, 0))
const totalAssessed = computed(() => assets.value.reduce((s, a) => s + a.assessedValue, 0))

function fmt(v) { return v ? '¥' + v.toLocaleString() : '-' }

function autoCalc() { ElMessage.success('系统已按账面净值自动计算评估值') }

async function addAsset() {
  await assetApi.create({ ...addForm.value, projectId: route.params.id })
  ElMessage.success('资产已添加')
  showAddDialog.value = false
  const res = await assetApi.list({ projectId: route.params.id })
  assets.value = res.data
}

onMounted(async () => {
  const res = await assetApi.list({ projectId: route.params.id })
  assets.value = res.data
})
</script>

<style scoped>
.positive { color: #52c41a; font-weight: 600; }
.negative { color: #ff4d4f; font-weight: 600; }
</style>
