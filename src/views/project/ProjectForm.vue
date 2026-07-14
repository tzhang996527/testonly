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
        <el-form-item label="审批节点">
          <ApprovalFlowConfig ref="flowConfigRef" v-model="approvalFlow" />
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
import { ArrowLeft, Upload } from '@element-plus/icons-vue'
import { useProjectStore } from '@/stores/project.js'
import ApprovalFlowConfig from '@/components/common/ApprovalFlowConfig.vue'

const { t } = useI18n()
const router = useRouter()
const projectStore = useProjectStore()
const formRef = ref()
const flowConfigRef = ref()
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

const approvalFlow = ref([])

const rules = {
  purpose: [{ required: true, message: '请输入评估目的', trigger: 'blur' }],
  baseDate: [{ required: true, message: '请选择评估基准日', trigger: 'change' }],
  assetCategory: [{ required: true, message: '请选择资产类别', trigger: 'change' }],
  responsible: [{ required: true, message: '请选择负责人', trigger: 'change' }],
}

async function handleSubmit() {
  await formRef.value.validate()
  const flowError = flowConfigRef.value?.validate()
  if (flowError) {
    ElMessage.warning(flowError)
    return
  }
  submitting.value = true
  try {
    const project = await projectStore.create({
      ...form,
      attachments,
      approvalFlow: approvalFlow.value,
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
</style>
