<template>
  <div class="form-sheet">
    <!-- 抬头 -->
    <table class="form-table">
      <tbody>
        <tr><td :colspan="titleSpan" class="form-title">{{ config.company }}</td></tr>
        <tr><td :colspan="titleSpan" class="form-title-en">{{ config.companyEn }}</td></tr>
        <tr><td :colspan="titleSpan" class="form-title">{{ config.title }}</td></tr>
        <tr><td :colspan="titleSpan" class="form-index">索引号：{{ config.code }}</td></tr>
      </tbody>
    </table>

    <!-- 基本信息 -->
    <table class="form-table" style="margin-top: 8px">
      <tbody>
        <tr>
          <td class="label-cell">被评估单位:</td>
          <td><input v-model="state.unitName" class="cell-input" :disabled="locked" /></td>
          <td class="label-cell">评估基准日:</td>
          <td><input v-model="state.baseDate" type="date" class="cell-input" :disabled="locked" /></td>
          <td class="label-cell">页次:</td>
          <td>
            共 <input v-model="state.pageTotal" class="page-inline" :disabled="locked" /> 页
            第 <input v-model="state.pageNo" class="page-inline" :disabled="locked" /> 页
          </td>
        </tr>
        <tr v-if="config.kind === 'review'">
          <td class="label-cell">评估人员:</td>
          <td><input v-model="state.evalStaff" class="cell-input" :disabled="locked" /></td>
          <td class="label-cell">现场工作日期:</td>
          <td colspan="3"><input v-model="state.fieldWorkDate" type="date" class="cell-input" :disabled="locked" /></td>
        </tr>
      </tbody>
    </table>

    <!-- ── 明细表 / 作业分析表 ── -->
    <table v-if="config.kind === 'detail'" class="form-table sheet-grid" style="margin-top: 8px">
      <colgroup>
        <col v-for="(lc, i) in leaves" :key="i" :style="lc.width ? { width: lc.width + 'px' } : null" />
        <col style="width: 52px" />
      </colgroup>
      <thead>
        <tr>
          <template v-for="(c, i) in config.cols" :key="'h1-' + i">
            <th v-if="Array.isArray(c)" class="label-cell" rowspan="2">{{ c[0] }}</th>
            <th v-else class="label-cell" :colspan="c.c.length">{{ c.g }}</th>
          </template>
          <th class="label-cell" rowspan="2">操作</th>
        </tr>
        <tr>
          <template v-for="(c, i) in config.cols" :key="'h2-' + i">
            <template v-if="!Array.isArray(c)">
              <th v-for="(child, j) in c.c" :key="j" class="label-cell">{{ child[0] }}</th>
            </template>
          </template>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, ri) in state.rows" :key="ri">
          <td v-for="(lc, ci) in leaves" :key="ci" :class="{ 'no-cell': lc.field === 'no' }">
            <span v-if="lc.field === 'no'">{{ ri + 1 }}</span>
            <input v-else v-model="row[lc.field]" class="cell-input" :disabled="locked" />
          </td>
          <td class="action-cell">
            <el-button
              v-if="!locked"
              link
              type="danger"
              size="small"
              @click="removeRow(ri)"
            >删除</el-button>
          </td>
        </tr>
        <tr v-if="!locked">
          <td :colspan="leaves.length + 1" class="addrow-cell">
            <el-button link type="primary" size="small" @click="addRow">＋ 添加行</el-button>
          </td>
        </tr>
        <tr v-for="label in config.summary" :key="label">
          <td class="label-cell" :colspan="summarySpan">{{ label }}</td>
          <template v-for="(lc, ci) in leaves.slice(summarySpan)" :key="ci">
            <td v-if="sumFields.includes(lc.field)" class="sum-cell">
              {{ state.summary[label][lc.field] }}
            </td>
            <td v-else>
              <input v-model="state.summary[label][lc.field]" class="cell-input" :disabled="locked" />
            </td>
          </template>
          <td class="action-cell"></td>
        </tr>
        <tr>
          <td :colspan="leaves.length + 1" class="disclosure-cell">
            {{ config.disclosureLabel || '披露及调整事项说明：' }}
            <textarea v-model="state.disclosure" class="cell-textarea" rows="2" :disabled="locked" />
          </td>
        </tr>
      </tbody>
    </table>

    <!-- ── 汇总表 ── -->
    <table v-else-if="config.kind === 'summary'" class="form-table sheet-grid" style="margin-top: 8px">
      <colgroup>
        <col style="width: 200px" />
        <col v-for="(lc, i) in leaves" :key="i" :style="lc.width ? { width: lc.width + 'px' } : null" />
      </colgroup>
      <thead>
        <tr>
          <th class="label-cell">{{ config.firstColLabel }}</th>
          <th v-for="(lc, i) in leaves" :key="i" class="label-cell">{{ lc.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(fr, ri) in config.fixedRows" :key="ri">
          <td class="name-cell" :style="fr.indent ? { paddingLeft: 16 * fr.indent + 12 + 'px' } : null">{{ fr.label }}</td>
          <td v-for="(lc, ci) in leaves" :key="ci">
            <input v-model="state.rows[ri][lc.field]" class="cell-input" :disabled="locked" />
          </td>
        </tr>
        <tr>
          <td :colspan="leaves.length + 1" class="disclosure-cell">
            披露及调整事项说明：
            <textarea v-model="state.disclosure" class="cell-textarea" rows="2" :disabled="locked" />
          </td>
        </tr>
      </tbody>
    </table>

    <!-- ── 评估步骤及复核表 ── -->
    <table v-else-if="config.kind === 'review'" class="form-table" style="margin-top: 8px">
      <colgroup>
        <col />
        <col style="width: 60px" />
        <col style="width: 72px" />
      </colgroup>
      <thead>
        <tr>
          <th class="label-cell">操作步骤与要求</th>
          <th class="label-cell">是</th>
          <th class="label-cell">不适用</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(step, si) in config.steps" :key="si">
          <td class="name-cell">{{ step }}</td>
          <td class="check-cell"><input type="checkbox" v-model="state.steps[si].yes" :disabled="locked" /></td>
          <td class="check-cell"><input type="checkbox" v-model="state.steps[si].na" :disabled="locked" /></td>
        </tr>
        <tr>
          <td colspan="3" class="disclosure-cell">
            说明与备注：
            <textarea v-model="state.note" class="cell-textarea" rows="3" :disabled="locked" />
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 页脚 -->
    <table class="form-table" style="margin-top: 8px">
      <tbody>
        <tr v-if="config.kind === 'review'">
          <td class="label-cell">复核人签名:</td>
          <td><input v-model="state.reviewerSign" class="cell-input" :disabled="locked" /></td>
          <td class="label-cell">日期:</td>
          <td><input v-model="state.reviewDate" type="date" class="cell-input" :disabled="locked" /></td>
        </tr>
        <tr v-else>
          <template v-for="(f, i) in footerFields" :key="i">
            <td class="label-cell">{{ f[0] }}:</td>
            <td><input v-model="state[f[1]]" :type="f[2] === 'date' ? 'date' : 'text'" class="cell-input" :disabled="locked" /></td>
          </template>
        </tr>
      </tbody>
    </table>

    <div class="scratch-save-row">
      <PermGuard :perm="PERM.PROJECT_EDIT" mode="disable" disabled-tip="无编辑权限">
        <template #default="{ disabled }">
          <el-button
            size="small"
            type="primary"
            :loading="saving"
            :disabled="disabled || locked"
            @click="$emit('save')"
          >保存 {{ config.code }}</el-button>
        </template>
      </PermGuard>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, watch, nextTick } from 'vue'
import PermGuard from '@/components/common/PermGuard.vue'
import { PERM } from '@/constants/permissions.js'
import { leafCols } from './inventorySheets.js'

const props = defineProps({
  config: { type: Object, required: true },
  modelValue: { type: Object, default: () => ({}) },
  locked: { type: Boolean, default: false },
  saving: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue', 'save'])

const leaves = computed(() => (props.config.cols ? leafCols(props.config.cols) : []))
const summarySpan = computed(() =>
  Math.min(props.config.summarySpan ?? 3, Math.max(leaves.value.length - 1, 1)),
)
const titleSpan = computed(() => Math.max(leaves.value.length, 6))
const footerFields = computed(
  () => props.config.footerFields || [['清查日期', 'checkDate', 'date'], ['评估人员', 'appraiser'], ['复核人', 'reviewer']],
)

// 需要自动求和的列（账面价值 / 评估价值 等金额列）
const sumFields = computed(() => {
  if (Array.isArray(props.config.sumFields)) return props.config.sumFields
  return leaves.value
    .filter((f) => /Amt$/.test(f.field) || f.field === 'bookValue' || f.field === 'evalValue')
    .map((f) => f.field)
})

function computeSum(field) {
  let seen = false
  let sum = 0
  for (const r of state.rows) {
    const n = parseFloat(r[field])
    if (Number.isFinite(n)) {
      seen = true
      sum += n
    }
  }
  return seen ? Math.round(sum * 100) / 100 : ''
}

function addRow() {
  state.rows.push(blankRow())
}
function removeRow(i) {
  state.rows.splice(i, 1)
  if (!state.rows.length) state.rows.push(blankRow())
}

function blankRow() {
  const o = {}
  leaves.value.forEach((lc) => { o[lc.field] = '' })
  return o
}

function buildState() {
  const src = props.modelValue || {}
  const s = {
    unitName: src.unitName || '',
    baseDate: src.baseDate || '',
    pageTotal: src.pageTotal || '',
    pageNo: src.pageNo || '',
    disclosure: src.disclosure || '',
  }
  footerFields.value.forEach((f) => { s[f[1]] = src[f[1]] || '' })

  if (props.config.kind === 'detail') {
    const saved = Array.isArray(src.rows) && src.rows.length ? src.rows : null
    s.rows = saved
      ? saved.map((r) => ({ ...blankRow(), ...r }))
      : Array.from({ length: Math.max(props.config.rows || 1, 1) }, () => blankRow())
    s.summary = {}
    ;(props.config.summary || []).forEach((label) => {
      s.summary[label] = { ...blankRow(), ...((src.summary && src.summary[label]) || {}) }
    })
  } else if (props.config.kind === 'summary') {
    const saved = Array.isArray(src.rows) ? src.rows : []
    s.rows = props.config.fixedRows.map((_, i) => ({ ...blankRow(), ...(saved[i] || {}) }))
  } else if (props.config.kind === 'review') {
    const saved = Array.isArray(src.steps) ? src.steps : []
    s.steps = props.config.steps.map((_, i) => ({ yes: !!(saved[i] && saved[i].yes), na: !!(saved[i] && saved[i].na) }))
    s.note = src.note || ''
    s.evalStaff = src.evalStaff || ''
    s.fieldWorkDate = src.fieldWorkDate || ''
    s.reviewerSign = src.reviewerSign || ''
    s.reviewDate = src.reviewDate || ''
  }
  return s
}

const state = reactive(buildState())

let lastEmitted = JSON.stringify(state)
let applying = false

// 外部数据（如异步加载完成）变化时重建，忽略自身回写造成的变化
watch(
  () => props.modelValue,
  (nv) => {
    if (JSON.stringify(nv || {}) === lastEmitted) return
    applying = true
    Object.assign(state, buildState())
    nextTick(() => { applying = false })
  },
)

// 自动小计 / 合计：sumFields 各列 = 所有数据行之和；合计 = 小计
watch(
  () => JSON.stringify(state.rows),
  () => {
    if (props.config.kind !== 'detail' || !state.summary) return
    for (const label of props.config.summary || []) {
      if (!state.summary[label]) continue
      for (const f of sumFields.value) {
        const v = computeSum(f)
        if (state.summary[label][f] !== v) state.summary[label][f] = v
      }
    }
  },
  { immediate: true },
)

// 本地编辑同步回父组件
watch(
  state,
  (val) => {
    if (applying) return
    lastEmitted = JSON.stringify(val)
    emit('update:modelValue', JSON.parse(lastEmitted))
  },
  { deep: true },
)
</script>

<style scoped>
.form-sheet {
  padding: 12px 16px 16px;
  font-family: "SimSun", "Microsoft YaHei", sans-serif;
  font-size: 13px;
  overflow-x: auto;
}
.form-table {
  width: 100%;
  border-collapse: collapse;
}
.sheet-grid {
  table-layout: fixed;
  min-width: 900px;
}
.form-table td,
.form-table th {
  border: 1px solid #bcc8d4;
  padding: 3px 5px;
  vertical-align: middle;
}
.label-cell {
  background: #dce6f0;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
  font-size: 12px;
  padding: 4px 6px;
  line-height: 1.4;
}
.name-cell {
  font-size: 12px;
  color: #262626;
  line-height: 1.5;
  padding: 4px 8px;
}
.check-cell {
  text-align: center;
}
.no-cell {
  text-align: center;
  font-size: 12px;
  color: #595959;
  background: #f7f9fb;
}
.action-cell {
  text-align: center;
  padding: 2px;
}
.addrow-cell {
  text-align: center;
  padding: 4px;
  background: #fafafa;
}
.sum-cell {
  text-align: right;
  font-size: 12px;
  padding: 3px 6px;
  background: #f4f7fb;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.disclosure-cell {
  font-size: 12px;
  color: #595959;
  text-align: left;
  padding: 4px 6px;
}
.form-title {
  text-align: center;
  font-weight: 700;
  font-size: 17px;
  letter-spacing: 3px;
  padding: 6px 8px;
  color: #262626;
}
.form-title-en {
  text-align: center;
  font-size: 11px;
  letter-spacing: 1px;
  color: #595959;
  padding: 2px 8px 4px;
}
.form-index {
  text-align: right;
  font-size: 12px;
  color: #595959;
  padding: 2px 8px 4px;
}
.cell-input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 13px;
  font-family: inherit;
  padding: 2px 4px;
  box-sizing: border-box;
}
.cell-input:focus {
  background: #fffbe6;
  outline: 2px solid #4096ff;
  outline-offset: -1px;
  border-radius: 2px;
}
.cell-input:disabled {
  color: #595959;
  cursor: default;
}
.cell-textarea {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 13px;
  font-family: inherit;
  padding: 2px 4px;
  box-sizing: border-box;
  resize: vertical;
  line-height: 1.5;
}
.cell-textarea:focus {
  background: #fffbe6;
  outline: 2px solid #4096ff;
  outline-offset: -1px;
  border-radius: 2px;
}
.cell-textarea:disabled {
  color: #595959;
  cursor: default;
}
.page-inline {
  width: 38px;
  border: none;
  border-bottom: 1px solid #bcc8d4;
  outline: none;
  background: transparent;
  font-size: 13px;
  text-align: center;
  font-family: inherit;
  padding: 1px 2px;
}
.page-inline:disabled {
  color: #595959;
  cursor: default;
}
.scratch-save-row {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}
</style>
