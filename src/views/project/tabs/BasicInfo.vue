<template>
  <div>
    <el-card shadow="never">
      <template #header>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span>基本信息</span>
          <div style="display:flex;gap:8px">
            <template v-if="!editing">
              <el-button size="small" :icon="Edit" @click="startEdit">编辑</el-button>
            </template>
            <template v-else>
              <el-button size="small" type="primary" :loading="saving" @click="saveEdit">保存</el-button>
              <el-button size="small" @click="cancelEdit">取消</el-button>
            </template>
          </div>
        </div>
      </template>

      <div class="form-sheet">
        <table class="form-table">
          <colgroup>
            <col style="width:130px" />
            <col style="width:100px" />
            <col />
            <col style="width:80px" />
            <col style="width:160px" />
          </colgroup>
          <tbody>
            <!-- 基本信息 -->
            <tr>
              <td class="label-cell" rowspan="10">基本信息</td>
              <td class="label-cell">报告编号</td>
              <td class="readonly-cell">{{ project?.projectNo }}</td>
              <td class="label-cell">合同指令号</td>
              <td>
                <span v-if="!editing" class="cell-text">{{ form.contractNo }}</span>
                <input v-else v-model="form.contractNo" class="cell-input" />
              </td>
            </tr>
            <tr>
              <td class="label-cell">评估基准日</td>
              <td>
                <span v-if="!editing" class="cell-text">{{ form.baseDate }}</span>
                <input v-else v-model="form.baseDate" type="date" class="cell-input" />
              </td>
              <td class="label-cell">评估报告日</td>
              <td>
                <span v-if="!editing" class="cell-text">{{ form.reportDate }}</span>
                <input v-else v-model="form.reportDate" type="date" class="cell-input" />
              </td>
            </tr>
            <tr>
              <td class="label-cell">评估目的</td>
              <td colspan="3">
                <span v-if="!editing" class="cell-text">{{ form.purpose }}</span>
                <el-select v-else v-model="form.purpose" size="small" style="width:100%" filterable allow-create>
                  <el-option v-for="p in purposeOptions" :key="p.id" :label="p.name" :value="p.name" />
                </el-select>
              </td>
            </tr>
            <tr>
              <td class="label-cell">评估对象</td>
              <td>
                <span v-if="!editing" class="cell-text">{{ form.assessmentObject }}</span>
                <input v-else v-model="form.assessmentObject" class="cell-input" />
              </td>
              <td class="label-cell">评估范围</td>
              <td>
                <span v-if="!editing" class="cell-text">{{ form.assessmentScope }}</span>
                <input v-else v-model="form.assessmentScope" class="cell-input" />
              </td>
            </tr>
            <tr>
              <td class="label-cell">价值类型</td>
              <td colspan="3">
                <span v-if="!editing" class="cell-text">{{ form.valueType }}</span>
                <input v-else v-model="form.valueType" class="cell-input" />
              </td>
            </tr>
            <tr>
              <td class="label-cell">委托人</td>
              <td colspan="3">
                <span v-if="!editing" class="cell-text">{{ form.client }}</span>
                <input v-else v-model="form.client" class="cell-input" />
              </td>
            </tr>
            <tr>
              <td class="label-cell">被评估单位</td>
              <td colspan="3">
                <span v-if="!editing" class="cell-text">{{ form.unitName }}</span>
                <input v-else v-model="form.unitName" class="cell-input" />
              </td>
            </tr>
            <tr>
              <td class="label-cell">收益法适用</td>
              <td>
                <span v-if="!editing" class="cell-text">{{ form.useIncomeMethod ? '是' : '否' }}</span>
                <el-radio-group v-else v-model="form.useIncomeMethod" size="small">
                  <el-radio :value="1">是</el-radio><el-radio :value="0">否</el-radio>
                </el-radio-group>
              </td>
              <td class="label-cell">市场法适用</td>
              <td>
                <span v-if="!editing" class="cell-text">{{ form.useMarketMethod ? '是' : '否' }}</span>
                <el-radio-group v-else v-model="form.useMarketMethod" size="small">
                  <el-radio :value="1">是</el-radio><el-radio :value="0">否</el-radio>
                </el-radio-group>
              </td>
            </tr>
            <tr>
              <td class="label-cell">资产基础法适用</td>
              <td colspan="3">
                <span v-if="!editing" class="cell-text">{{ form.useAssetMethod ? '是' : '否' }}</span>
                <el-radio-group v-else v-model="form.useAssetMethod" size="small">
                  <el-radio :value="1">是</el-radio><el-radio :value="0">否</el-radio>
                </el-radio-group>
              </td>
            </tr>
            <tr>
              <td class="label-cell">是否备案或核准</td>
              <td colspan="3">
                <span v-if="!editing" class="cell-text">{{ form.approvalRequired }}</span>
                <el-radio-group v-else v-model="form.approvalRequired" size="small">
                  <el-radio value="是">是</el-radio><el-radio value="否">否</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <!-- 综合进度 -->
            <tr>
              <td class="label-cell" :rowspan="schedule.length + 1">综合进度</td>
              <td class="label-cell">项目</td>
              <td class="label-cell">责任人</td>
              <td class="label-cell">开始时间</td>
              <td class="label-cell">完成时间</td>
            </tr>
            <tr v-for="(task, i) in schedule" :key="'s' + i">
              <td class="label-cell-q">{{ task.task }}</td>
              <td>
                <span v-if="!editing" class="cell-text">{{ task.responsible }}</span>
                <el-select v-else v-model="task.responsible" size="small" style="width:100%" clearable filterable>
                  <el-option v-for="u in userOptions" :key="u.id" :label="u.name" :value="u.name" />
                </el-select>
              </td>
              <td>
                <span v-if="!editing" class="cell-text">{{ task.startDate }}</span>
                <input v-else v-model="task.startDate" type="date" class="cell-input" />
              </td>
              <td>
                <span v-if="!editing" class="cell-text">{{ task.endDate }}</span>
                <input v-else v-model="task.endDate" type="date" class="cell-input" />
              </td>
            </tr>

            <!-- 评估人员安排 -->
            <tr v-for="(role, i) in PERSONNEL_ROLES" :key="'p' + i">
              <td v-if="i === 0" class="label-cell" :rowspan="PERSONNEL_ROLES.length">评估人员安排</td>
              <td class="label-cell-q">{{ role }}</td>
              <td colspan="3">
                <span v-if="!editing" class="cell-text">{{ personnel[role] }}</span>
                <el-select v-else v-model="personnel[role]" size="small" style="width:100%" clearable filterable>
                  <el-option v-for="u in userOptions" :key="u.id" :label="u.name" :value="u.name" />
                </el-select>
              </td>
            </tr>

            <!-- 收费情况 -->
            <tr>
              <td class="label-cell" rowspan="2">收费情况</td>
              <td class="label-cell">约定收费</td>
              <td>
                <span v-if="!editing" class="cell-text">{{ form.agreedFee }}</span>
                <input v-else v-model.number="form.agreedFee" type="number" class="cell-input" />
              </td>
              <td class="label-cell">万元</td>
              <td></td>
            </tr>
            <tr>
              <td class="label-cell">实际收费</td>
              <td>
                <span v-if="!editing" class="cell-text">{{ form.actualFee }}</span>
                <input v-else v-model.number="form.actualFee" type="number" class="cell-input" />
              </td>
              <td class="label-cell">万元</td>
              <td></td>
            </tr>

            <!-- 委托人联系 -->
            <tr>
              <td class="label-cell">委托人</td>
              <td class="label-cell">联系人</td>
              <td>
                <span v-if="!editing" class="cell-text">{{ form.clientContact }}</span>
                <input v-else v-model="form.clientContact" class="cell-input" />
              </td>
              <td class="label-cell">电话</td>
              <td>
                <span v-if="!editing" class="cell-text">{{ form.clientPhone }}</span>
                <input v-else v-model="form.clientPhone" class="cell-input" />
              </td>
            </tr>

            <!-- 被评估单位详情 -->
            <tr>
              <td class="label-cell" rowspan="4">被评估单位</td>
              <td class="label-cell">注册资金</td>
              <td>
                <span v-if="!editing" class="cell-text">{{ form.unitRegisteredCapital }}</span>
                <input v-else v-model="form.unitRegisteredCapital" class="cell-input" />
              </td>
              <td class="label-cell">地址</td>
              <td>
                <span v-if="!editing" class="cell-text">{{ form.unitAddress }}</span>
                <input v-else v-model="form.unitAddress" class="cell-input" />
              </td>
            </tr>
            <tr>
              <td class="label-cell">法定代表人</td>
              <td>
                <span v-if="!editing" class="cell-text">{{ form.unitLegalRep }}</span>
                <input v-else v-model="form.unitLegalRep" class="cell-input" />
              </td>
              <td class="label-cell">企业性质</td>
              <td>
                <span v-if="!editing" class="cell-text">{{ form.unitEnterpriseType }}</span>
                <input v-else v-model="form.unitEnterpriseType" class="cell-input" />
              </td>
            </tr>
            <tr>
              <td class="label-cell">联系人</td>
              <td>
                <span v-if="!editing" class="cell-text">{{ form.unitContact }}</span>
                <input v-else v-model="form.unitContact" class="cell-input" />
              </td>
              <td class="label-cell">电话</td>
              <td>
                <span v-if="!editing" class="cell-text">{{ form.unitPhone }}</span>
                <input v-else v-model="form.unitPhone" class="cell-input" />
              </td>
            </tr>
            <tr>
              <td class="label-cell">经营范围</td>
              <td colspan="3">
                <span v-if="!editing" class="cell-text" style="white-space:pre-wrap">{{ form.unitBusinessScope }}</span>
                <textarea v-else v-model="form.unitBusinessScope" class="cell-textarea" rows="2" />
              </td>
            </tr>

            <!-- 其他信息 -->
            <tr>
              <td class="label-cell long-label">其他报告使用人</td>
              <td colspan="4">
                <span v-if="!editing" class="cell-text">{{ form.otherReportUsers }}</span>
                <input v-else v-model="form.otherReportUsers" class="cell-input" />
              </td>
            </tr>
            <tr>
              <td class="label-cell long-label">委托人、被评估单位、其他报告使用人的关系</td>
              <td colspan="4">
                <span v-if="!editing" class="cell-text">{{ form.relationship }}</span>
                <input v-else v-model="form.relationship" class="cell-input" />
              </td>
            </tr>
            <tr>
              <td class="label-cell long-label">委托人及相关当事人工作配合和协助等需要明确的重要事项</td>
              <td colspan="4">
                <span v-if="!editing" class="cell-text" style="white-space:pre-wrap">{{ form.importantMatters }}</span>
                <textarea v-else v-model="form.importantMatters" class="cell-textarea" rows="2" />
              </td>
            </tr>
            <tr>
              <td class="label-cell long-label">评估假设和限制条件</td>
              <td colspan="4">
                <span v-if="!editing" class="cell-text" style="white-space:pre-wrap">{{ form.assumptions }}</span>
                <textarea v-else v-model="form.assumptions" class="cell-textarea" rows="2" />
              </td>
            </tr>
            <tr>
              <td class="label-cell long-label">业务变更</td>
              <td colspan="4">
                <span v-if="!editing" class="cell-text">{{ form.businessChanges }}</span>
                <input v-else v-model="form.businessChanges" class="cell-input" />
              </td>
            </tr>
            <tr>
              <td class="label-cell long-label">聘请专家</td>
              <td colspan="4">
                <span v-if="!editing" class="cell-text">{{ form.expertHired }}</span>
                <input v-else v-model="form.expertHired" class="cell-input" />
              </td>
            </tr>
            <tr>
              <td class="label-cell long-label">重大问题</td>
              <td colspan="4">
                <span v-if="!editing" class="cell-text">{{ form.majorIssues }}</span>
                <input v-else v-model="form.majorIssues" class="cell-input" />
              </td>
            </tr>
            <tr>
              <td class="label-cell long-label">现场勘查人员</td>
              <td colspan="4">
                <span v-if="!editing" class="cell-text">{{ form.siteInspectors }}</span>
                <input v-else v-model="form.siteInspectors" class="cell-input" />
              </td>
            </tr>
            <tr>
              <td class="label-cell long-label">现场勘查接洽人员</td>
              <td colspan="4">
                <span v-if="!editing" class="cell-text">{{ form.siteContacts }}</span>
                <input v-else v-model="form.siteContacts" class="cell-input" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Edit } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import { useProjectStore } from '@/stores/project.js'
import { configApi, userApi } from '@/api/index.js'

const route = useRoute()
const projectStore = useProjectStore()
const { current: project } = storeToRefs(projectStore)

const editing = ref(false)
const saving = ref(false)
const purposeOptions = ref([])
const userOptions = ref([])

const SCHEDULE_TASKS = [
  '基本情况调查', '风险判断', '委托合同签订', '评估计划', '前期准备',
  '现场勘查', '收集评估资料', '评定估算', '编制报告', '内部审核',
  '初稿', '评估报告日', '提交报告', '报告签收', '工作底稿归档',
]
const PERSONNEL_ROLES = [
  '签字评估师1', '签字评估师2', '流动资产及负债', '长期投资',
  '房地产', '机器设备', '其他无形资产', '整体收益法', '整体市场法',
]

const form = reactive({
  purpose: '', baseDate: '', reportDate: '', contractNo: '',
  assessmentObject: '', assessmentScope: '', valueType: '',
  client: '', unitName: '',
  agreedFee: 0, actualFee: 0,
  clientContact: '', clientPhone: '',
  unitRegisteredCapital: '', unitAddress: '',
  unitLegalRep: '', unitEnterpriseType: '',
  unitContact: '', unitPhone: '', unitBusinessScope: '',
  otherReportUsers: '', relationship: '', importantMatters: '',
  assumptions: '', approvalRequired: '否',
  businessChanges: '', expertHired: '', majorIssues: '',
  siteInspectors: '', siteContacts: '',
  useAssetMethod: 0, useIncomeMethod: 1, useMarketMethod: 1,
})

const schedule = reactive(
  SCHEDULE_TASKS.map(task => ({ task, responsible: '', startDate: '', endDate: '' }))
)
const personnel = reactive(
  Object.fromEntries(PERSONNEL_ROLES.map(role => [role, '']))
)

// snapshot for cancel
let snapshot = null

function loadFromProject(p) {
  if (!p) return
  Object.keys(form).forEach(k => { if (k in p) form[k] = p[k] })
  const saved = (() => { try { return JSON.parse(p.schedule || '[]') } catch { return [] } })()
  schedule.forEach((row, i) => {
    const src = saved[i]
    row.responsible = src?.responsible ?? ''
    row.startDate   = src?.startDate   ?? ''
    row.endDate     = src?.endDate     ?? ''
  })
  const savedP = (() => { try { return JSON.parse(p.personnel || '{}') } catch { return {} } })()
  PERSONNEL_ROLES.forEach(role => { personnel[role] = savedP[role] ?? '' })
}

watch(project, loadFromProject, { immediate: true })

onMounted(async () => {
  const [{ data: purposes }, { data: users }] = await Promise.all([
    configApi.listPurposes(),
    userApi.list(),
  ])
  purposeOptions.value = purposes.filter(p => p.enabled)
  userOptions.value = users.filter(u => u.status === 'active')
})

function startEdit() {
  snapshot = {
    form: { ...form },
    schedule: schedule.map(r => ({ ...r })),
    personnel: { ...personnel },
  }
  editing.value = true
}

function cancelEdit() {
  Object.assign(form, snapshot.form)
  schedule.forEach((r, i) => Object.assign(r, snapshot.schedule[i]))
  PERSONNEL_ROLES.forEach(role => { personnel[role] = snapshot.personnel[role] })
  editing.value = false
}

async function saveEdit() {
  saving.value = true
  try {
    await projectStore.update(route.params.id, {
      ...form,
      schedule: JSON.stringify(schedule),
      personnel: JSON.stringify(personnel),
    })
    ElMessage.success('保存成功')
    editing.value = false
  } catch (e) {
    ElMessage.error('保存失败：' + (e?.message || '请重试'))
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.form-sheet {
  padding: 0 4px 4px;
  font-family: "SimSun", "Microsoft YaHei", sans-serif;
  font-size: 13px;
}
.form-table {
  width: 100%;
  border-collapse: collapse;
}
.form-table td {
  border: 1px solid #bcc8d4;
  padding: 3px 5px;
  vertical-align: middle;
}
.label-cell {
  background: #dce6f0;
  font-weight: 600;
  text-align: center;
  font-size: 12px;
  padding: 4px 6px;
  line-height: 1.4;
  white-space: nowrap;
}
.long-label {
  white-space: normal;
  text-align: left;
  padding: 4px 8px;
}
.label-cell-q {
  padding: 4px 8px;
  font-size: 12px;
  color: #333;
  line-height: 1.5;
}
.readonly-cell {
  color: #595959;
  font-size: 13px;
  padding: 4px 8px;
  font-weight: 600;
}
.cell-text {
  display: block;
  padding: 2px 4px;
  font-size: 13px;
  min-height: 22px;
  color: #262626;
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
</style>
