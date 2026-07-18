<template>
  <el-tooltip
    :disabled="hasPermission || !disabledTip"
    :content="disabledTip"
    placement="top"
  >
    <!-- wrap in span so tooltip works on disabled buttons -->
    <span :style="spanStyle">
      <slot v-if="hasPermission || mode === 'disable'" v-bind="{ disabled: !hasPermission }" />
    </span>
  </el-tooltip>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth.js'

const props = defineProps({
  perm:        { type: Number,  required: true },
  mode:        { type: String,  default: 'hide' },   // 'hide' | 'disable'
  disabledTip: { type: String,  default: '暂无操作权限' },
})

const authStore   = useAuthStore()
const hasPermission = computed(() => authStore.hasPerm(props.perm))

// when disabled, pointer-events off so tooltip still fires on the wrapper span
const spanStyle = computed(() =>
  !hasPermission.value && props.mode === 'disable'
    ? 'display:inline-block;cursor:not-allowed'
    : ''
)
</script>
