<template>
  <div class="review-tab">
    <el-row :gutter="20">
      <el-col :span="14">
        <el-card shadow="never" header="审核流程">
          <el-steps :active="activeReviewStep" direction="vertical" finish-status="success">
            <el-step
              v-for="(step, idx) in reviewSteps"
              :key="idx"
              :title="step.role"
              :description="step.status === 'approved' ? '审批通过: ' + step.comment : step.status === 'rejected' ? '已驳回: ' + step.comment : '待审批'"
              :status="stepStatus(step.status)"
            />
          </el-steps>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card shadow="never" header="审批操作" v-if="canReview">
          <el-form label-position="top">
            <el-form-item label="审批意见">
              <el-input v-model="reviewComment" type="textarea" :rows="4" placeholder="请输入审批意见..." />
            </el-form-item>
            <el-form-item label="相关底稿">
              <el-upload action="#" :auto-upload="false">
                <el-button size="small">上传底稿</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <el-button type="success" :loading="submitting" @click="doReview('approved')">
                <el-icon><Check /></el-icon> 审核通过
              </el-button>
              <el-button type="danger" :loading="submitting" @click="doReview('rejected')">
                <el-icon><Close /></el-icon> 驳回修改
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
        <el-card shadow="never" header="涉及底稿" style="margin-top:16px">
          <div class="scratch-docs">
            <div v-for="doc in scratchDocs" :key="doc" class="scratch-doc-item">
              <el-icon style="color:#1677ff;margin-right:6px"><Document /></el-icon>{{ doc }}
            </div>
          </div>
          <div style="margin-top:12px">
            <el-button size="small" type="primary">上传底稿</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { Check, Close, Document } from '@element-plus/icons-vue'
import { useProjectStore } from '@/stores/project.js'
import { useAuthStore } from '@/stores/auth.js'

const route = useRoute()
const { t } = useI18n()
const projectStore = useProjectStore()
const authStore = useAuthStore()

const reviewComment = ref('')
const submitting = ref(false)

const reviewSteps = ref([
  { role: '一级审核：部门负责人（数据准确性）', status: 'approved', comment: '数据核实无误' },
  { role: '二级审核：总师室', status: 'pending', comment: '' },
  { role: '三级审核：总经理/授权人', status: 'pending', comment: '' },
])

const activeReviewStep = computed(() => reviewSteps.value.findIndex(s => s.status === 'pending'))
const canReview = computed(() => activeReviewStep.value !== -1)

const scratchDocs = ['评估报告（初稿）', '评估说明', '三审单', '重大问题处理结果']

function stepStatus(s) {
  return { approved: 'finish', rejected: 'error', pending: 'wait' }[s] || 'wait'
}

async function doReview(action) {
  submitting.value = true
  try {
    const step = reviewSteps.value[activeReviewStep.value]
    if (step) {
      step.status = action
      step.comment = reviewComment.value || (action === 'approved' ? '审核通过' : '需要修改')
    }
    ElMessage.success(action === 'approved' ? '审核通过' : '已驳回，请修改后重提')
    reviewComment.value = ''
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.scratch-docs { display: flex; flex-direction: column; gap: 10px; }
.scratch-doc-item { display: flex; align-items: center; color: #595959; font-size: 14px; }
</style>
