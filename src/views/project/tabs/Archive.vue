<template>
  <div class="archive-tab">
    <el-row :gutter="20">
      <el-col :span="16">
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
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Document, Printer, FolderAdd } from '@element-plus/icons-vue'
import { useProjectStore } from '@/stores/project.js'

const projectStore = useProjectStore()
const locked = computed(() => (projectStore.current?.currentStep ?? 1) > 8)

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
</script>
