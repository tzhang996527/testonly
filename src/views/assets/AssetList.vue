<template>
  <div class="asset-list">
    <div class="page-header">
      <h3>{{ t('assets.title') }}</h3>
      <el-button type="primary" :icon="Plus">新增资产</el-button>
    </div>

    <el-card shadow="never" style="margin-bottom:16px">
      <el-form :model="filters" inline>
        <el-form-item label="关键字">
          <el-input v-model="filters.keyword" placeholder="资产编号/名称" clearable style="width:220px" />
        </el-form-item>
        <el-form-item label="评估方法">
          <el-select v-model="filters.method" clearable style="width:140px" placeholder="全部">
            <el-option :label="t('assets.methods.market')" value="market" />
            <el-option :label="t('assets.methods.income')" value="income" />
            <el-option :label="t('assets.methods.assetBase')" value="assetBase" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="fetchData">搜索</el-button>
          <el-button @click="resetFilter">重置</el-button>
          <el-button type="success" :icon="Download">导出</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never">
      <el-table :data="filtered" stripe border v-loading="loading">
        <el-table-column :label="t('assets.assetNo')" prop="assetNo" width="140" />
        <el-table-column :label="t('assets.assetName')" prop="assetName" min-width="130" />
        <el-table-column :label="t('assets.spec')" prop="spec" min-width="130" show-overflow-tooltip />
        <el-table-column :label="t('assets.location')" prop="location" width="130" />
        <el-table-column :label="t('assets.originalValue')" prop="originalValue" width="120" align="right">
          <template #default="{ row }">{{ fmt(row.originalValue) }}</template>
        </el-table-column>
        <el-table-column :label="t('assets.netValue')" prop="netValue" width="110" align="right">
          <template #default="{ row }">{{ fmt(row.netValue) }}</template>
        </el-table-column>
        <el-table-column :label="t('assets.assessedValue')" prop="assessedValue" width="120" align="right">
          <template #default="{ row }">
            <span style="font-weight:600;color:#1677ff">{{ fmt(row.assessedValue) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="t('assets.appreciationRate')" width="100" align="right">
          <template #default="{ row }">
            <span :class="(row.assessedValue - row.netValue) >= 0 ? 'pos' : 'neg'">
              {{ row.netValue ? ((row.assessedValue - row.netValue) / row.netValue * 100).toFixed(1) + '%' : '-' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="t('assets.method')" prop="method" width="120">
          <template #default="{ row }">{{ t(`assets.methods.${row.method}`) }}</template>
        </el-table-column>
        <el-table-column :label="t('common.operation')" width="100" fixed="right">
          <template #default>
            <el-button link type="primary" size="small">查看</el-button>
            <el-button link type="primary" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- Summary Row -->
      <div class="summary-bar" v-if="assets.length">
        <span>共 {{ assets.length }} 项资产</span>
        <span>原值合计: <b>{{ fmt(sum('originalValue')) }}</b></span>
        <span>净值合计: <b>{{ fmt(sum('netValue')) }}</b></span>
        <span>评估值合计: <b style="color:#1677ff">{{ fmt(sum('assessedValue')) }}</b></span>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Plus, Search, Download } from '@element-plus/icons-vue'
import { assetApi } from '@/api/index.js'

const { t } = useI18n()
const assets = ref([])
const loading = ref(false)
const filters = ref({ keyword: '', method: '' })

const filtered = computed(() => {
  let d = assets.value
  if (filters.value.keyword) d = d.filter(a => a.assetNo.includes(filters.value.keyword) || a.assetName.includes(filters.value.keyword))
  if (filters.value.method) d = d.filter(a => a.method === filters.value.method)
  return d
})

function fmt(v) { return v ? '¥' + v.toLocaleString() : '-' }
function sum(key) { return assets.value.reduce((s, a) => s + (a[key] || 0), 0) }
function fetchData() {}
function resetFilter() { filters.value = { keyword: '', method: '' } }

onMounted(async () => {
  loading.value = true
  try {
    const res = await assetApi.list()
    assets.value = res.data
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.page-header h3 { margin: 0; font-size: 20px; font-weight: 600; }
.summary-bar { display: flex; gap: 32px; padding: 12px 16px; background: #fafafa; border-top: 1px solid #f0f0f0; font-size: 14px; color: #595959; }
.pos { color: #52c41a; font-weight: 600; }
.neg { color: #ff4d4f; font-weight: 600; }
</style>
