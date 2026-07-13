<template>
  <div class="approval-flow">
    <el-timeline>
      <el-timeline-item
        v-for="(node, idx) in approvals"
        :key="idx"
        :type="timelineType(node.nodeStatus)"
        :timestamp="nodeTimestamp(node)"
        placement="top"
      >
        <el-card shadow="never" class="node-card">
          <div class="node-header">
            <span class="role">{{ node.role }}</span>
            <el-tag :type="tagType(node.nodeStatus)" size="small" style="margin-left:auto">
              {{ nodeStatusLabel(node) }}
            </el-tag>
          </div>

          <!-- 并行审批人列表 -->
          <div class="approvers-list">
            <div
              v-for="(person, pIdx) in node.approvers"
              :key="pIdx"
              class="approver-row"
              :class="{ 'passed': person.status === 'approved' }"
            >
              <el-avatar :size="24" class="approver-avatar">{{ person.name.slice(0, 1) }}</el-avatar>
              <span class="approver-name">{{ person.name }}</span>
              <el-tag :type="tagType(person.status)" size="small" class="person-tag">
                {{ personStatusLabel(person.status) }}
              </el-tag>
              <span v-if="person.comment" class="person-comment">{{ person.comment }}</span>
              <span v-if="person.time" class="person-time">{{ person.time }}</span>
            </div>
          </div>

          <div v-if="node.approvers.length > 1" class="parallel-hint">
            <el-icon><InfoFilled /></el-icon>
            并行审批 — 任意一人通过即视为节点通过
          </div>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { InfoFilled } from '@element-plus/icons-vue'

defineProps({ approvals: { type: Array, default: () => [] } })
const { t } = useI18n()

function timelineType(status) {
  return { approved: 'success', rejected: 'danger', pending: 'info' }[status] || 'info'
}

function tagType(status) {
  return { approved: 'success', rejected: 'danger', pending: 'warning' }[status] || 'info'
}

function personStatusLabel(status) {
  return { approved: '已通过', rejected: '已驳回', pending: '待审批' }[status] || status
}

function nodeStatusLabel(node) {
  if (node.nodeStatus === 'approved') return '节点通过'
  if (node.nodeStatus === 'rejected') return '节点驳回'
  const done = node.approvers.filter(a => a.status !== 'pending').length
  return done > 0 ? `审批中 (${done}/${node.approvers.length})` : '待审批'
}

function nodeTimestamp(node) {
  const passed = node.approvers.find(a => a.status === 'approved')
  return passed?.time || node.approvers.find(a => a.time)?.time || '待审批'
}
</script>

<style scoped>
.node-card { margin-bottom: 4px; }

.node-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.role { font-weight: 600; color: #262626; }

.approvers-list { display: flex; flex-direction: column; gap: 8px; }

.approver-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 4px;
  background: #fafafa;
  border: 1px solid #f0f0f0;
}

.approver-row.passed {
  background: #f6ffed;
  border-color: #b7eb8f;
}

.approver-avatar { background: #1677ff; color: #fff; flex-shrink: 0; font-size: 12px; }

.approver-name { font-size: 13px; font-weight: 500; color: #262626; min-width: 56px; }

.person-tag { flex-shrink: 0; }

.person-comment { flex: 1; font-size: 12px; color: #8c8c8c; }

.person-time { font-size: 12px; color: #bfbfbf; white-space: nowrap; }

.parallel-hint {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  font-size: 12px;
  color: #8c8c8c;
}
</style>
