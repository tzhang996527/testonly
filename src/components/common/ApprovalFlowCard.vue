<template>
  <el-card shadow="never" :header="header">
    <ApprovalFlow :approvals="approvals" />
    <div v-if="pendingPerson" style="margin-top:16px">
      <el-divider>我的审批操作</el-divider>
      <div style="margin-bottom:8px;font-size:13px;color:#595959">
        节点：<b>{{ pendingPerson.role }}</b> &nbsp;·&nbsp; 审批人：<b>{{ pendingPerson.name }}</b>
      </div>
      <el-input
        v-model="approvalComment"
        type="textarea"
        placeholder="审批意见（选填）"
        :rows="2"
        style="margin-bottom:12px"
      />
      <el-button type="success" :loading="submitting" @click="doApprove('approved')">
        {{ t('common.approve') }}
      </el-button>
      <el-button type="danger" :loading="submitting" @click="doApprove('rejected')">
        {{ t('common.reject') }}
      </el-button>
    </div>
  </el-card>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth.js'
import ApprovalFlow from '@/components/common/ApprovalFlow.vue'

const props = defineProps({
  approvals: { type: Array, default: () => [] },
  header:    { type: String, default: '审批流程' },
  // 提交时回调，接收 { role, username, action, comment }，需返回 Promise
  onSubmit:  { type: Function, default: null },
})

const emit = defineEmits(['approved', 'rejected'])

const { t } = useI18n()
const authStore = useAuthStore()

const approvalComment = ref('')
const submitting = ref(false)

const pendingPerson = computed(() => {
  const username = authStore.user?.username
  for (const node of props.approvals) {
    if (node.nodeStatus === 'approved' || node.nodeStatus === 'rejected') continue
    const person = node.approvers.find(a => a.username === username && a.status === 'pending')
    if (person) return { role: node.role, name: person.name, username: person.username }
  }
  return null
})

async function doApprove(action) {
  if (!pendingPerson.value || !props.onSubmit) return
  submitting.value = true
  try {
    await props.onSubmit({
      role:     pendingPerson.value.role,
      username: pendingPerson.value.username,
      action,
      comment:  approvalComment.value,
    })
    approvalComment.value = ''
    emit(action === 'approved' ? 'approved' : 'rejected')
  } finally {
    submitting.value = false
  }
}
</script>
