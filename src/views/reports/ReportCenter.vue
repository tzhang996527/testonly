<template>
  <div class="report-center">
    <h3>报表中心</h3>
    <el-row :gutter="20">
      <el-col :span="8" v-for="rpt in reports" :key="rpt.key">
        <el-card shadow="hover" class="report-card" @click="openReport(rpt)">
          <div class="report-icon" :style="{ color: rpt.color }">
            <el-icon :size="40"><component :is="rpt.icon" /></el-icon>
          </div>
          <div class="report-title">{{ rpt.title }}</div>
          <div class="report-desc">{{ rpt.desc }}</div>
          <el-button type="primary" link style="margin-top:12px">生成报表</el-button>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never" style="margin-top:24px">
      <template #header>最近生成报表</template>
      <el-table :data="recentReports" stripe>
        <el-table-column label="报表名称" prop="name" min-width="200" />
        <el-table-column label="关联项目" prop="project" width="160" />
        <el-table-column label="生成时间" prop="generatedAt" width="165" />
        <el-table-column label="生成人" prop="generatedBy" width="100" />
        <el-table-column label="操作" width="120">
          <template #default>
            <el-button link type="primary" size="small">查看</el-button>
            <el-button link type="primary" size="small">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { DataAnalysis, Document, Histogram, PieChart, List } from '@element-plus/icons-vue'

const reports = [
  { key: 'summary', title: '评估汇总报表', desc: '各项目评估结果汇总统计', icon: DataAnalysis, color: '#1677ff' },
  { key: 'asset', title: '资产明细报表', desc: '资产台账及评估值明细', icon: List, color: '#52c41a' },
  { key: 'comparison', title: '价值比较分析', desc: '原值/净值/评估值对比分析', icon: Histogram, color: '#faad14' },
  { key: 'distribution', title: '资产类别分布', desc: '按资产类别统计分布', icon: PieChart, color: '#722ed1' },
  { key: 'workflow', title: '流程统计报表', desc: '评估项目流程时效统计', icon: Document, color: '#13c2c2' },
  { key: 'compliance', title: '合规性检查报告', desc: '评估流程合规性审查', icon: Document, color: '#eb2f96' },
]

const recentReports = [
  { name: '2024年Q1评估汇总报表', project: 'PJ-2024-0001', generatedAt: '2024-04-05 10:00:00', generatedBy: '张伟' },
  { name: '固定资产评估明细表', project: 'PJ-2024-0002', generatedAt: '2024-04-10 14:30:00', generatedBy: '李娜' },
  { name: '存货清算评估报告', project: 'PJ-2024-0004', generatedAt: '2024-05-01 09:00:00', generatedBy: '赵敏' },
]

function openReport(rpt) { ElMessage.info('正在生成: ' + rpt.title) }
</script>

<style scoped>
h3 { margin: 0 0 20px; font-size: 20px; font-weight: 600; }
.report-card { cursor: pointer; text-align: center; padding: 8px 0; transition: transform 0.2s; }
.report-card:hover { transform: translateY(-4px); }
.report-icon { margin-bottom: 12px; }
.report-title { font-size: 16px; font-weight: 600; color: #262626; }
.report-desc { font-size: 13px; color: #8c8c8c; margin-top: 6px; }
</style>
