<template>
  <div class="archive-tab">
    <el-row :gutter="20">
      <el-col :span="16">
        <!-- 底稿表单（G-12） -->
        <el-card shadow="never" style="margin-bottom:16px" class="scratch-tabs-card">
          <el-tabs type="border-card" class="scratch-tabs">
            <!-- G-12 评估报告签收单 -->
            <el-tab-pane label="G-12 评估报告签收单">
              <div class="form-sheet">
                <table class="form-table">
                  <colgroup>
                    <col style="width: 110px" />
                    <col style="width: 50px" />
                    <col />
                    <col style="width: 90px" />
                  </colgroup>
                  <tbody>
                    <tr>
                      <td colspan="4" class="form-title">上海城乡资产评估有限责任公司</td>
                    </tr>
                    <tr>
                      <td colspan="4" class="form-title-en">SHANGHAI URBAN &amp; RURAL ASSETS APPRAISAL CO.,LTD</td>
                    </tr>
                    <tr>
                      <td colspan="4" class="form-title">评估报告签收单</td>
                    </tr>
                    <tr>
                      <td colspan="2"></td>
                      <td colspan="2" class="form-index">索引号：G-12</td>
                    </tr>
                    <tr>
                      <td class="label-cell-left">收文名称：</td>
                      <td colspan="3">
                        <input v-model="g12.docName" class="cell-input" :disabled="locked" />
                      </td>
                    </tr>
                    <tr>
                      <td class="label-cell-left">文号字：</td>
                      <td colspan="3">
                        <input v-model="g12.docNo" class="cell-input" :disabled="locked" />
                      </td>
                    </tr>
                    <tr>
                      <td class="label-cell" rowspan="10">文件名称</td>
                      <td class="label-cell">序号</td>
                      <td class="label-cell">内　　容</td>
                      <td class="label-cell">收到份数</td>
                    </tr>
                    <tr v-for="(item, i) in g12.items" :key="i">
                      <td class="label-cell">{{ i + 1 }}</td>
                      <td>
                        <input v-model="item.content" class="cell-input" :disabled="locked" />
                      </td>
                      <td>
                        <input v-model="item.count" class="cell-input" :disabled="locked" />
                      </td>
                    </tr>
                    <tr>
                      <td class="label-cell-left" colspan="4">收到单位：</td>
                    </tr>
                    <tr>
                      <td colspan="4">
                        <textarea v-model="g12.receiveUnit" class="cell-textarea" rows="4" :disabled="locked" />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table class="form-table" style="margin-top:-1px">
                  <colgroup>
                    <col style="width: 50%" />
                    <col style="width: 50%" />
                  </colgroup>
                  <tbody>
                    <tr>
                      <td class="label-cell-left">收文日期：</td>
                      <td class="label-cell-left">
                        送达人签字：<input v-model="g12.delivererSign" class="cell-input-inline" :disabled="locked" />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <input v-model="g12.receiveDate" type="date" class="cell-input" :disabled="locked" />
                      </td>
                      <td>
                        日期：<input v-model="g12.deliverDate" type="date" class="cell-input-inline" :disabled="locked" />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div class="scratch-save-row">
                  <PermGuard :perm="PERM.PROJECT_EDIT" mode="disable" disabled-tip="无编辑权限">
                    <template #default="{ disabled }">
                      <el-button
                        size="small"
                        type="primary"
                        :loading="savingG12"
                        :disabled="disabled || locked"
                        @click="saveG12"
                        >保存 G-12</el-button
                      >
                    </template>
                  </PermGuard>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>

        <el-card shadow="never" header="归档文档清单">
          <el-table :data="archiveDocs" stripe>
            <el-table-column label="文档名称" prop="name" min-width="200" />
            <el-table-column label="类型" prop="type" width="120">
              <template #default="{ row }">
                <el-tag size="small" type="info">{{ row.type }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="归档状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.archived ? 'success' : 'warning'" size="small">
                  {{ row.archived ? '已归档' : '待归档' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="130">
              <template #default="{ row }">
                <el-button link type="primary" size="small">查看</el-button>
                <el-button v-if="row.archived" link type="primary" size="small">导出</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="never" header="报告生成">
          <div style="display:flex;flex-direction:column;gap:12px">
            <el-button type="primary" block :disabled="locked" @click="generateReport">
              <el-icon><Document /></el-icon> 生成评估报告
            </el-button>
            <el-button type="default" block :disabled="locked" @click="ElMessage.info('正在生成...')">
              <el-icon><Printer /></el-icon> 打印评估报告
            </el-button>
            <el-button type="success" block :disabled="locked" @click="doArchive">
              <el-icon><FolderAdd /></el-icon> 完成归档
            </el-button>
          </div>
        </el-card>

        <el-card shadow="never" header="归档信息" style="margin-top:16px">
          <el-descriptions :column="1" size="small">
            <el-descriptions-item label="归档编号">ARC-2024-001</el-descriptions-item>
            <el-descriptions-item label="归档人">张伟</el-descriptions-item>
            <el-descriptions-item label="归档日期">2024-06-15</el-descriptions-item>
            <el-descriptions-item label="保存期限">10年</el-descriptions-item>
            <el-descriptions-item label="存储位置">电子档案系统</el-descriptions-item>
          </el-descriptions>
          <el-alert type="warning" show-icon :closable="false" style="margin-top:12px"
            title="归档后不可删除，仅可查阅/导出" />
        </el-card>
        <ApprovalFlowCard
          header="报告归档审批"
          :approvals="stageApprovals"
          :on-submit="handleApprove"
          style="margin-top:16px"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Document, Printer, FolderAdd } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import { useProjectStore } from '@/stores/project.js'
import { scratchApi } from '@/api/index.js'
import ApprovalFlowCard from '@/components/common/ApprovalFlowCard.vue'
import PermGuard from '@/components/common/PermGuard.vue'
import { PERM } from '@/constants/permissions.js'

const route = useRoute()
const projectStore = useProjectStore()
const locked = computed(() => (projectStore.current?.currentStep ?? 1) > 8)
const stageApprovals = computed(() => projectStore.current?.approvalsByStage?.['archive'] || [])
async function handleApprove(payload) {
  await projectStore.approveStage(route.params.id, 'archive', payload)
  ElMessage.success(payload.action === 'approved' ? '已审批通过' : '已驳回')
}

const archiveDocs = ref([
  { name: '评估立项单', type: '立项文件', archived: true },
  { name: '业务委托合同', type: '合同', archived: true },
  { name: '资料清单', type: '工作文件', archived: true },
  { name: '现场盘点表', type: '盘点记录', archived: true },
  { name: '盘点差异表', type: '盘点记录', archived: true },
  { name: '权属资料汇总', type: '权属证明', archived: true },
  { name: '评估计算表', type: '工作底稿', archived: false },
  { name: '内审记录', type: '审核记录', archived: false },
  { name: '评估结果确认单', type: '正式单据', archived: false },
  { name: '评估报告（正式版）', type: '报告', archived: false },
  { name: '委托方签收单', type: '交付记录', archived: false },
])

function generateReport() { ElMessage.success('评估报告已生成，请核验后归档') }
function doArchive() {
  archiveDocs.value.forEach(d => d.archived = true)
  ElMessage.success('全部资料已归档完成')
}

// ── G-12 评估报告签收单 ────────────────────────────────────────────
const savingG12 = ref(false)
const g12 = reactive({
  docName: '',
  docNo: '',
  items: Array.from({ length: 9 }, () => ({ content: '', count: '' })),
  receiveUnit: '',
  receiveDate: '',
  delivererSign: '',
  deliverDate: '',
})

async function loadG12() {
  try {
    const { data } = await scratchApi.getG12(route.params.id, 'archive')
    if (data) {
      let items = []
      try { items = JSON.parse(data.items || '[]') } catch { items = [] }
      if (!Array.isArray(items) || !items.length) {
        items = Array.from({ length: 9 }, () => ({ content: '', count: '' }))
      }
      Object.assign(g12, {
        docName: data.docName || '',
        docNo: data.docNo || '',
        items,
        receiveUnit: data.receiveUnit || '',
        receiveDate: data.receiveDate || '',
        delivererSign: data.delivererSign || '',
        deliverDate: data.deliverDate || '',
      })
    }
  } catch {
    ElMessage.error('G-12 加载失败')
  }
}

async function saveG12() {
  savingG12.value = true
  try {
    await scratchApi.saveG12(route.params.id, 'archive', {
      ...g12,
      items: g12.items.map(it => ({ content: it.content || '', count: it.count || '' })),
    })
    ElMessage.success('G-12 已保存')
  } catch {
    ElMessage.error('保存失败')
  } finally {
    savingG12.value = false
  }
}

onMounted(loadG12)
</script>

<style scoped>
/* ── G-12 底稿表单（样式同 Inventory） ── */
.form-sheet {
  padding: 12px 16px 16px;
  font-family: "SimSun", "Microsoft YaHei", sans-serif;
  font-size: 13px;
}

.form-table {
  width: 100%;
  border-collapse: collapse;
}
.form-table td,
.form-table th {
  border: 1px solid #bcc8d4;
  padding: 3px 5px;
  vertical-align: middle;
}

.label-cell {
  background: #dce6f0;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
  font-size: 12px;
  padding: 4px 6px;
  line-height: 1.4;
}

.label-cell-left {
  background: #dce6f0;
  font-weight: 600;
  text-align: left;
  white-space: nowrap;
  font-size: 12px;
  padding: 4px 8px;
  line-height: 1.4;
}

.form-title {
  text-align: center;
  font-weight: 700;
  font-size: 17px;
  letter-spacing: 3px;
  padding: 6px 8px;
  color: #262626;
}

.form-title-en {
  text-align: center;
  font-size: 11px;
  letter-spacing: 1px;
  color: #595959;
  padding: 2px 8px 4px;
}

.form-index {
  text-align: right;
  font-size: 12px;
  color: #595959;
  padding: 2px 8px 4px;
}

.cell-input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 13px;
  font-family: inherit;
  padding: 2px 4px;
  box-sizing: border-box;
}
.cell-input:focus {
  background: #fffbe6;
  outline: 2px solid #4096ff;
  outline-offset: -1px;
  border-radius: 2px;
}
.cell-input:disabled {
  color: #595959;
  cursor: default;
}

.cell-input-inline {
  width: 62%;
  border: none;
  border-bottom: 1px solid #bcc8d4;
  outline: none;
  background: transparent;
  font-size: 13px;
  font-family: inherit;
  padding: 1px 4px;
  box-sizing: border-box;
}
.cell-input-inline:disabled {
  color: #595959;
  cursor: default;
}

.cell-textarea {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 13px;
  font-family: inherit;
  padding: 2px 4px;
  box-sizing: border-box;
  resize: vertical;
  line-height: 1.5;
}
.cell-textarea:focus {
  background: #fffbe6;
  outline: 2px solid #4096ff;
  outline-offset: -1px;
  border-radius: 2px;
}
.cell-textarea:disabled {
  color: #595959;
  cursor: default;
}

.scratch-save-row {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}

/* ── 底稿 Tabs ── */
:deep(.scratch-tabs.el-tabs--border-card > .el-tabs__header) {
  background: #f7f8fa;
}
:deep(
  .scratch-tabs.el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active
) {
  color: #1677ff;
  font-weight: 600;
}
:deep(.scratch-tabs.el-tabs--border-card > .el-tabs__content) {
  padding: 0;
}
.scratch-tabs-card {
  padding: 0;
}
:deep(.scratch-tabs-card > .el-card__body) {
  padding: 0;
}
</style>
