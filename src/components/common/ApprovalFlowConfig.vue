<template>
  <div class="flow-config-wrap">
    <div v-if="!readonly" style="margin-bottom:12px">
      <el-radio-group v-model="flowTemplate" @change="applyTemplate">
        <el-radio value="standard">标准四级审批</el-radio>
        <el-radio value="simple">简易审批</el-radio>
        <el-radio value="custom">自定义</el-radio>
      </el-radio-group>
    </div>

    <div class="flow-config">
      <div class="flow-nodes">
        <div
          v-for="(node, idx) in flowNodes"
          :key="node.key"
          class="flow-node-card"
          :class="{ disabled: !node.enabled }"
        >
          <div class="node-header">
            <el-checkbox v-model="node.enabled" @change="onNodeChange" :disabled="readonly">
              <b>{{ node.label }}</b>
              <span class="node-role-hint">{{ node.role }}</span>
            </el-checkbox>
            <div v-if="!readonly" class="node-sort">
              <el-button link :icon="ArrowUp" :disabled="idx === 0" @click="moveNode(idx, -1)" />
              <el-button link :icon="ArrowDown" :disabled="idx === flowNodes.length - 1" @click="moveNode(idx, 1)" />
            </div>
          </div>

          <div v-if="node.enabled" class="approvers-edit">
            <div
              v-for="(person, pIdx) in node.approvers"
              :key="pIdx"
              class="approver-edit-row"
            >
              <el-select
                v-model="person.username"
                placeholder="选择审批人"
                size="small"
                style="width:150px"
                :disabled="readonly"
                @change="val => onPersonChange(node, pIdx, val)"
              >
                <el-option
                  v-for="u in users"
                  :key="u.username"
                  :label="u.name"
                  :value="u.username"
                />
              </el-select>
              <el-button
                v-if="!readonly"
                link
                type="danger"
                :icon="Close"
                :disabled="node.approvers.length === 1"
                @click="removePerson(node, pIdx)"
              />
            </div>
            <el-button v-if="!readonly" link type="primary" :icon="Plus" size="small" @click="addPerson(node)">
              添加并行审批人
            </el-button>
            <div v-if="node.approvers.length > 1" class="parallel-tip">
              <el-icon><InfoFilled /></el-icon> 任意一人通过即节点通过
            </div>
          </div>
        </div>
      </div>

      <div class="flow-preview">
        <div class="preview-label">流程预览</div>
        <div class="preview-chain">
          <template v-for="(node, idx) in enabledNodes" :key="node.key">
            <div class="preview-node">
              <div class="preview-node-title">{{ node.label }}</div>
              <div class="preview-node-persons">
                <el-tag
                  v-for="(p, pi) in node.approvers"
                  :key="pi"
                  size="small"
                  type="info"
                  style="margin:2px"
                >
                  {{ p.name || '待选' }}
                </el-tag>
              </div>
            </div>
            <el-icon v-if="idx < enabledNodes.length - 1" class="preview-arrow">
              <ArrowRight />
            </el-icon>
          </template>
          <span v-if="enabledNodes.length === 0" class="no-node">请至少选择一个审批节点</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ArrowUp, ArrowDown, ArrowRight, Plus, Close, InfoFilled } from '@element-plus/icons-vue'
import { mockUsers } from '@/api/mockData.js'

const props = defineProps({
  modelValue:     { type: Array,   default: () => [] },
  candidateUsers: { type: Array,   default: null },
  readonly:       { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

const users = computed(() => props.candidateUsers ?? mockUsers.filter(u => u.role !== 'assessor'))

const defaultApproverMap = {
  dept:   { name: '李经理',    username: 'li.manager' },
  risk:   { name: '王风控',    username: 'wang.riskctrl' },
  office: { name: '办公室主任', username: 'office.chief' },
  ceo:    { name: '陈总',      username: 'chen.ceo' },
}

const allNodeDefs = [
  { key: 'dept',   label: '部门负责人', role: '数据准确性审核' },
  { key: 'risk',   label: '风控',       role: '风险评估' },
  { key: 'office', label: '办公室',     role: '合规性审核' },
  { key: 'ceo',    label: '总经理',     role: '最终审批' },
]

const templates = {
  standard: ['dept', 'risk', 'office', 'ceo'],
  simple:   ['dept', 'ceo'],
}

function buildNodes(initialFlow) {
  // 如果有初始值，按照传入的 role 顺序重建节点
  if (initialFlow?.length) {
    const byLabel = Object.fromEntries(initialFlow.map(n => [n.role, n]))
    return allNodeDefs.map(def => {
      const incoming = byLabel[def.label]
      return {
        ...def,
        enabled: !!incoming,
        approvers: incoming
          ? incoming.approvers.map(a => ({ ...a }))
          : [{ ...defaultApproverMap[def.key] }],
      }
    })
  }
  return allNodeDefs.map(def => ({
    ...def,
    enabled: true,
    approvers: [{ ...defaultApproverMap[def.key] }],
  }))
}

const flowTemplate = ref('standard')
const flowNodes = ref(buildNodes(props.modelValue))

// rebuild when parent loads async data (e.g. after fetching saved flow from API)
watch(() => props.modelValue, (val) => {
  if (!val?.length) return
  const current = enabledNodes.value.map(n => ({
    role: n.label,
    approvers: n.approvers.map(p => ({ name: p.name, username: p.username })),
  }))
  if (JSON.stringify(current) === JSON.stringify(val)) return
  flowNodes.value = buildNodes(val)
}, { deep: true })

const enabledNodes = computed(() => flowNodes.value.filter(n => n.enabled))

// 每次内部状态变化都向父组件同步
watch(
  enabledNodes,
  (nodes) => {
    emit('update:modelValue', nodes.map(n => ({
      role: n.label,
      approvers: n.approvers.map(p => ({ name: p.name, username: p.username })),
    })))
  },
  { deep: true, immediate: true }
)

function applyTemplate(val) {
  if (val === 'custom') return
  const keys = templates[val]
  flowNodes.value.forEach(n => {
    n.enabled = keys.includes(n.key)
    n.approvers = [{ ...defaultApproverMap[n.key] }]
  })
}

function onNodeChange() {
  flowTemplate.value = 'custom'
}

function moveNode(idx, dir) {
  const target = idx + dir
  if (target < 0 || target >= flowNodes.value.length) return
  ;[flowNodes.value[idx], flowNodes.value[target]] = [flowNodes.value[target], flowNodes.value[idx]]
  flowTemplate.value = 'custom'
}

function addPerson(node) {
  node.approvers.push({ name: '', username: '' })
  flowTemplate.value = 'custom'
}

function removePerson(node, pIdx) {
  node.approvers.splice(pIdx, 1)
  flowTemplate.value = 'custom'
}

function onPersonChange(node, pIdx, username) {
  const user = users.value.find(u => u.username === username)
  if (user) node.approvers[pIdx].name = user.name
  flowTemplate.value = 'custom'
}

// 暴露校验方法供父组件调用
function validate() {
  if (enabledNodes.value.length === 0) return '请至少选择一个审批节点'
  const empty = enabledNodes.value.some(n => n.approvers.some(p => !p.username))
  if (empty) return '请为每个审批节点选择审批人'
  return null
}

defineExpose({ validate })
</script>

<style scoped>
.flow-config { display: flex; gap: 24px; align-items: flex-start; flex-wrap: wrap; width: 100%; }

.flow-nodes { display: flex; flex-direction: column; gap: 10px; min-width: 300px; flex: 1; }

.flow-node-card {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 12px 14px;
  background: #fff;
  transition: border-color 0.2s;
}

.flow-node-card:not(.disabled) { border-color: #1677ff40; }

.flow-node-card.disabled { background: #fafafa; opacity: 0.7; }

.node-header { display: flex; align-items: center; justify-content: space-between; }

.node-role-hint { font-size: 12px; color: #8c8c8c; margin-left: 8px; font-weight: normal; }

.node-sort { display: flex; gap: 2px; }

.approvers-edit {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed #f0f0f0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.approver-edit-row { display: flex; align-items: center; gap: 8px; }

.parallel-tip { font-size: 12px; color: #8c8c8c; display: flex; align-items: center; gap: 4px; margin-top: 2px; }

.flow-preview {
  min-width: 180px;
  flex: 0 0 auto;
  padding: 14px 16px;
  background: #f5f7fa;
  border-radius: 8px;
  border: 1px dashed #d9d9d9;
  align-self: stretch;
}

.preview-label { font-size: 12px; color: #8c8c8c; margin-bottom: 12px; }

.preview-chain { display: flex; align-items: flex-start; flex-wrap: wrap; gap: 6px; }

.preview-node {
  padding: 6px 12px;
  background: #fff;
  border: 1px solid #1677ff;
  border-radius: 6px;
  font-size: 13px;
  min-width: 80px;
  text-align: center;
}

.preview-node-title { color: #1677ff; font-weight: 600; margin-bottom: 4px; }

.preview-arrow { color: #bfbfbf; margin-top: 12px; flex-shrink: 0; }

.no-node { font-size: 13px; color: #ff4d4f; }
</style>
