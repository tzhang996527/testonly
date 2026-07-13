<template>
  <div class="project-form">
    <div class="page-header">
      <el-button :icon="ArrowLeft" @click="$router.back()">{{ t('common.back') }}</el-button>
      <h3>{{ t('project.createProject') }}</h3>
    </div>

    <el-card shadow="never">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" style="max-width:700px">
        <el-form-item :label="t('project.purpose')" prop="purpose">
          <el-input v-model="form.purpose" placeholder="请输入评估目的" />
        </el-form-item>
        <el-form-item :label="t('project.baseDate')" prop="baseDate">
          <el-date-picker v-model="form.baseDate" type="date" value-format="YYYY-MM-DD" placeholder="选择评估基准日" />
        </el-form-item>
        <el-form-item :label="t('project.assetCategory')" prop="assetCategory">
          <el-select v-model="form.assetCategory" placeholder="请选择资产类别">
            <el-option :label="t('project.assetCategories.fixed')" value="fixed" />
            <el-option :label="t('project.assetCategories.intangible')" value="intangible" />
            <el-option :label="t('project.assetCategories.inventory')" value="inventory" />
            <el-option :label="t('project.assetCategories.whole')" value="whole" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('project.responsible')" prop="responsible">
          <el-select v-model="form.responsible" placeholder="请选择负责人">
            <el-option label="张伟" value="张伟" />
            <el-option label="李娜" value="李娜" />
            <el-option label="王磊" value="王磊" />
            <el-option label="赵敏" value="赵敏" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('project.department')" prop="department">
          <el-input v-model="form.department" placeholder="所属部门" />
        </el-form-item>
        <el-form-item :label="t('common.remark')">
          <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="备注说明" />
        </el-form-item>

        <el-divider>底稿上传（选填）</el-divider>
        <el-form-item
          v-for="doc in scratchDocs"
          :key="doc.key"
          :label="doc.label"
        >
          <div class="upload-area">
            <el-upload
              v-model:file-list="attachments[doc.key]"
              action="#"
              :auto-upload="false"
              :limit="3"
              accept=".pdf,.doc,.docx,.xlsx,.xls,.jpg,.png"
              :on-exceed="() => ElMessage.warning('最多上传3个文件')"
            >
              <el-button size="small" :icon="Upload">选择文件</el-button>
              <template #tip>
                <div class="upload-tip">支持 PDF、Word、Excel、图片，单个文件不超过 20MB</div>
              </template>
            </el-upload>
          </div>
        </el-form-item>

        <el-divider>审批流配置</el-divider>
        <el-form-item label="审批模板">
          <el-radio-group v-model="flowTemplate" @change="applyTemplate">
            <el-radio value="standard">标准四级审批</el-radio>
            <el-radio value="simple">简易审批</el-radio>
            <el-radio value="custom">自定义</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审批节点">
          <div class="flow-config">
            <div class="flow-nodes">
              <div
                v-for="(node, idx) in flowNodes"
                :key="node.key"
                class="flow-node-card"
                :class="{ disabled: !node.enabled }"
              >
                <!-- 节点头部：勾选 + 排序 -->
                <div class="node-header">
                  <el-checkbox v-model="node.enabled" @change="onNodeChange">
                    <b>{{ node.label }}</b>
                    <span class="node-role-hint">{{ node.role }}</span>
                  </el-checkbox>
                  <div class="node-sort">
                    <el-button link :icon="ArrowUp" :disabled="idx === 0" @click="moveNode(idx, -1)" />
                    <el-button link :icon="ArrowDown" :disabled="idx === flowNodes.length - 1" @click="moveNode(idx, 1)" />
                  </div>
                </div>

                <!-- 审批人列表（仅节点启用时展示） -->
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
                      @change="val => onPersonChange(node, pIdx, val)"
                    >
                      <el-option
                        v-for="u in candidateUsers"
                        :key="u.username"
                        :label="u.name"
                        :value="u.username"
                      />
                    </el-select>
                    <el-button
                      link
                      type="danger"
                      :icon="Close"
                      :disabled="node.approvers.length === 1"
                      @click="removePerson(node, pIdx)"
                    />
                  </div>
                  <el-button
                    link
                    type="primary"
                    :icon="Plus"
                    size="small"
                    @click="addPerson(node)"
                  >
                    添加并行审批人
                  </el-button>
                  <div v-if="node.approvers.length > 1" class="parallel-tip">
                    <el-icon><InfoFilled /></el-icon> 任意一人通过即节点通过
                  </div>
                </div>
              </div>
            </div>

            <!-- 预览 -->
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
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="submitting" @click="handleSubmit">
            {{ t('common.submit') }}
          </el-button>
          <el-button @click="$router.back()">{{ t('common.cancel') }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Upload, Plus, Close, InfoFilled } from '@element-plus/icons-vue'
import { useProjectStore } from '@/stores/project.js'
import { mockUsers } from '@/api/mockData.js'

const { t } = useI18n()
const router = useRouter()
const projectStore = useProjectStore()
const formRef = ref()
const submitting = ref(false)

const form = reactive({
  purpose: '',
  baseDate: '',
  assetCategory: '',
  responsible: '',
  department: '资产评估部',
  remark: '',
})

const scratchDocs = [
  { key: 'basicInfo', label: '基本情况表' },
  { key: 'independence', label: '独立性审核' },
  { key: 'riskAssessment', label: '风险评价表' },
]

const attachments = reactive({
  basicInfo: [],
  independence: [],
  riskAssessment: [],
})

// 候选审批人（排除 assessor）
const candidateUsers = mockUsers.filter(u => u.role !== 'assessor')

// ── 审批流配置 ──────────────────────────────────────
const flowTemplate = ref('standard')

const defaultApproverMap = {
  dept:   { name: '李经理', username: 'li.manager' },
  risk:   { name: '王风控', username: 'wang.riskctrl' },
  office: { name: '办公室主任', username: 'office.chief' },
  ceo:    { name: '陈总', username: 'chen.ceo' },
}

const allNodes = [
  { key: 'dept',   label: '部门负责人', role: '数据准确性审核', enabled: true, approvers: [{ ...defaultApproverMap.dept }] },
  { key: 'risk',   label: '风控',       role: '风险评估',       enabled: true, approvers: [{ ...defaultApproverMap.risk }] },
  { key: 'office', label: '办公室',     role: '合规性审核',     enabled: true, approvers: [{ ...defaultApproverMap.office }] },
  { key: 'ceo',    label: '总经理',     role: '最终审批',       enabled: true, approvers: [{ ...defaultApproverMap.ceo }] },
]

const flowNodes = ref(allNodes.map(n => ({ ...n, approvers: n.approvers.map(a => ({ ...a })) })))

const enabledNodes = computed(() => flowNodes.value.filter(n => n.enabled))

const templates = {
  standard: ['dept', 'risk', 'office', 'ceo'],
  simple:   ['dept', 'ceo'],
}

function applyTemplate(val) {
  if (val === 'custom') return
  const keys = templates[val]
  flowNodes.value.forEach(n => {
    n.enabled = keys.includes(n.key)
    // 重置为默认单人
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
  const user = candidateUsers.find(u => u.username === username)
  if (user) node.approvers[pIdx].name = user.name
  flowTemplate.value = 'custom'
}

const rules = {
  purpose: [{ required: true, message: '请输入评估目的', trigger: 'blur' }],
  baseDate: [{ required: true, message: '请选择评估基准日', trigger: 'change' }],
  assetCategory: [{ required: true, message: '请选择资产类别', trigger: 'change' }],
  responsible: [{ required: true, message: '请选择负责人', trigger: 'change' }],
}

async function handleSubmit() {
  await formRef.value.validate()
  if (enabledNodes.value.length === 0) {
    ElMessage.warning('请至少选择一个审批节点')
    return
  }
  const emptyPerson = enabledNodes.value.some(n => n.approvers.some(p => !p.username))
  if (emptyPerson) {
    ElMessage.warning('请为每个审批节点选择审批人')
    return
  }
  submitting.value = true
  try {
    const project = await projectStore.create({
      ...form,
      attachments,
      approvalFlow: enabledNodes.value.map(n => ({
        role: n.label,
        approvers: n.approvers.map(p => ({ name: p.name, username: p.username })),
      })),
    })
    await ElMessageBox.alert(
      `<div style="text-align:center;padding:8px 0">
        <div style="font-size:13px;color:#8c8c8c;margin-bottom:8px">评估单号已生成</div>
        <div style="font-size:24px;font-weight:700;color:#1677ff;letter-spacing:2px">${project.projectNo}</div>
        <div style="font-size:12px;color:#8c8c8c;margin-top:12px">立项已提交，即将跳转到项目详情页</div>
      </div>`,
      '立项创建成功',
      { dangerouslyUseHTMLString: true, confirmButtonText: '查看项目详情', type: 'success' }
    )
    router.push(`/project/${project.id}/overview`)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.page-header { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
.page-header h3 { margin: 0; font-size: 20px; }
.upload-tip { font-size: 12px; color: #8c8c8c; margin-top: 4px; }
.upload-area :deep(.el-upload-list) { max-width: 400px; }

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

.approvers-edit { margin-top: 10px; padding-top: 10px; border-top: 1px dashed #f0f0f0; display: flex; flex-direction: column; gap: 8px; }

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
