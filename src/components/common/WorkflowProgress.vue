<template>
  <div class="workflow-progress">
    <el-steps :active="currentStep - 1" align-center finish-status="success">
      <el-step
        v-for="(step, idx) in steps"
        :key="idx"
        :title="step.label"
        :description="currentStep === idx + 1 ? '进行中' : ''"
      />
    </el-steps>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({ currentStep: { type: Number, default: 1 } })
const { t } = useI18n()

const steps = computed(() => [
  { label: t('workflow.steps.project') },
  { label: t('workflow.steps.preWork') },
  { label: t('workflow.steps.inventory') },
  { label: t('workflow.steps.collection') },
  { label: t('workflow.steps.estimation') },
  { label: t('workflow.steps.review') },
  { label: t('workflow.steps.confirmation') },
  { label: t('workflow.steps.archive') },
  { label: t('workflow.steps.tracking') },
])
</script>

<style scoped>
.workflow-progress {
  padding: 16px 0;
  background: #fff;
  border-radius: 6px;
}
</style>
