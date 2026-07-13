<template>
  <div>
    <div class="page-header">
      <h3>流程配置</h3>
    </div>
    <el-card shadow="never">
      <template #header>审批流配置</template>
      <el-table :data="flowConfigs" stripe>
        <el-table-column label="流程名称" prop="name" width="160" />
        <el-table-column label="适用场景" prop="scene" min-width="160" />
        <el-table-column label="审批节点" min-width="300">
          <template #default="{ row }">
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
              <template v-for="(node, idx) in row.nodes" :key="idx">
                <el-tag size="small">{{ node }}</el-tag>
                <el-icon v-if="idx < row.nodes.length - 1" style="color:#bfbfbf"><ArrowRight /></el-icon>
              </template>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="是否启用" width="100">
          <template #default="{ row }">
            <el-switch v-model="row.enabled" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template #default>
            <el-button link type="primary" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'

const flowConfigs = ref([
  { name: '评估立项审批', scene: '新建评估立项', nodes: ['部门负责人', '风控', '办公室', '总经理'], enabled: true },
  { name: '前期工作审批', scene: '合同签订、计划制定', nodes: ['部门负责人', '办公室', '总经理'], enabled: true },
  { name: '评估结果审核', scene: '评估报告内部审核', nodes: ['一级:部门负责人', '二级:总师室', '三级:总经理'], enabled: true },
  { name: '结果确认审批', scene: '评估结果确认单', nodes: ['部门负责人', '总经理'], enabled: true },
  { name: '报告归档审批', scene: '报告归档', nodes: ['部门负责人', '总经理'], enabled: false },
])
</script>

<style scoped>
.page-header { display: flex; align-items: center; margin-bottom: 16px; }
.page-header h3 { margin: 0; font-size: 20px; font-weight: 600; }
</style>
