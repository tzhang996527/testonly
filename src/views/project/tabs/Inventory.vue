<template>
  <div class="inventory-tab">
    <div style="margin-bottom:16px;display:flex;justify-content:space-between;align-items:center">
      <span style="font-weight:600">资产盘点明细</span>
      <div>
        <el-tag type="warning" style="margin-right:8px">差异待处理: {{ pendingCount }}</el-tag>
        <el-button type="primary" size="small" :icon="Plus">录入盘点数据</el-button>
        <el-button type="success" size="small" @click="exportDiff">导出差异表</el-button>
      </div>
    </div>

    <el-table :data="items" v-loading="loading" stripe border>
      <el-table-column :label="t('assets.assetNo')" prop="assetNo" width="140" />
      <el-table-column :label="t('assets.assetName')" prop="assetName" min-width="130" />
      <el-table-column label="账面净值" prop="bookValue" width="120">
        <template #default="{ row }">{{ formatMoney(row.bookValue) }}</template>
      </el-table-column>
      <el-table-column label="现场核查值" prop="fieldValue" width="130">
        <template #default="{ row }">{{ formatMoney(row.fieldValue) }}</template>
      </el-table-column>
      <el-table-column label="差异额" prop="diff" width="110">
        <template #default="{ row }">
          <span :class="row.diff < 0 ? 'negative' : row.diff > 0 ? 'positive' : ''">
            {{ row.diff === 0 ? '-' : formatMoney(row.diff) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="差异原因" prop="diffReason" min-width="120" />
      <el-table-column label="处理状态" width="110">
        <template #default="{ row }">
          <el-tag :type="row.status === 'handled' ? 'success' : row.status === 'done' ? 'success' : 'warning'" size="small">
            {{ row.status === 'handled' ? '已处理' : row.status === 'done' ? '无差异' : '待处理' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button v-if="row.diff !== 0 && row.status !== 'handled'" link type="warning" size="small" @click="handleDiff(row)">处理差异</el-button>
          <el-button link type="primary" size="small" @click="viewDetail(row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-card shadow="never" style="margin-top:16px">
      <template #header>现场勘察记录</template>
      <el-form label-width="120px">
        <el-form-item label="勘察日期"><el-date-picker value-format="YYYY-MM-DD" /></el-form-item>
        <el-form-item label="勘察人员"><el-input placeholder="参与勘察人员" /></el-form-item>
        <el-form-item label="勘察说明"><el-input type="textarea" :rows="3" placeholder="勘察现场情况描述" /></el-form-item>
        <el-form-item label="访谈记录">
          <el-upload action="#" :auto-upload="false"><el-button size="small" type="primary">上传访谈记录</el-button></el-upload>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { inventoryApi } from '@/api/index.js'

const { t } = useI18n()
const route = useRoute()
const items = ref([])
const loading = ref(false)

const pendingCount = computed(() => items.value.filter(i => i.diff !== 0 && i.status !== 'handled').length)

function formatMoney(v) {
  return v ? '¥' + v.toLocaleString() : '-'
}

function handleDiff(row) {
  row.status = 'handled'
  ElMessage.success('差异已标记处理')
}

function viewDetail(row) {
  ElMessage.info('查看资产: ' + row.assetName)
}

function exportDiff() {
  ElMessage.success('差异表已导出')
}

onMounted(async () => {
  loading.value = true
  try {
    const res = await inventoryApi.list(route.params.id)
    items.value = res.data
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.negative { color: #ff4d4f; }
.positive { color: #52c41a; }
</style>
