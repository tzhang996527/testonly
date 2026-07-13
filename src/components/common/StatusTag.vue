<template>
  <el-tag :type="tagType" size="small">{{ label }}</el-tag>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({ status: String })
const { t } = useI18n()

const statusConfig = {
  draft: { type: 'info', key: 'status.draft' },
  approved: { type: 'success', key: 'status.approved' },
  inProgress: { type: 'primary', key: 'status.inProgress' },
  completed: { type: 'success', key: 'status.completed' },
  rejected: { type: 'danger', key: 'status.rejected' },
  reviewing: { type: 'warning', key: 'status.reviewing' },
  confirmed: { type: 'success', key: 'status.confirmed' },
  effective: { type: 'success', key: 'status.effective' },
  archived: { type: '', key: 'status.archived' },
  contractSigned: { type: 'primary', key: 'status.contractSigned' },
  inventoryDone: { type: 'success', key: 'status.inventoryDone' },
  diffPending: { type: 'warning', key: 'status.diffPending' },
  collectionDone: { type: 'success', key: 'status.collectionDone' },
  estimationDone: { type: 'primary', key: 'status.estimationDone' },
  reportIssued: { type: 'success', key: 'status.reportIssued' },
}

const tagType = computed(() => statusConfig[props.status]?.type || 'info')
const label = computed(() => {
  const cfg = statusConfig[props.status]
  return cfg ? t(cfg.key) : props.status
})
</script>
