<template>
  <div class="project-form">
    <div class="page-header">
      <el-button :icon="ArrowLeft" @click="$router.back()">返回</el-button>
      <h3>新建项目立项</h3>
    </div>

    <el-card shadow="never" style="margin-bottom: 16px">
      <div class="form-sheet">
        <table class="form-table">
          <colgroup>
            <col style="width: 130px" />
            <col style="width: 100px" />
            <col />
            <col style="width: 80px" />
            <col style="width: 140px" />
          </colgroup>
          <tbody>
            <!-- ─── 基本信息 (rows 1-10) ───────────────────────── -->
            <tr>
              <td class="label-cell" rowspan="10">基本信息</td>
              <td class="label-cell">报告编号</td>
              <td class="readonly-cell">（提交后自动生成）</td>
              <td class="label-cell">合同指令号</td>
              <td><input v-model="form.contractNo" class="cell-input" /></td>
            </tr>
            <tr>
              <td class="label-cell required-label">评估基准日</td>
              <td><input v-model="form.baseDate" type="date" class="cell-input" /></td>
              <td class="label-cell">评估报告日</td>
              <td><input v-model="form.reportDate" type="date" class="cell-input" /></td>
            </tr>
            <tr>
              <td class="label-cell required-label">评估目的</td>
              <td colspan="3">
                <el-select
                  v-model="form.purpose"
                  placeholder="请选择"
                  size="small"
                  style="width: 100%"
                  filterable
                  allow-create
                >
                  <el-option
                    v-for="p in purposeOptions"
                    :key="p.id"
                    :label="p.name"
                    :value="p.name"
                  />
                </el-select>
              </td>
            </tr>
            <tr>
              <td class="label-cell">评估对象</td>
              <td><input v-model="form.assessmentObject" class="cell-input" /></td>
              <td class="label-cell">评估范围</td>
              <td><input v-model="form.assessmentScope" class="cell-input" /></td>
            </tr>
            <tr>
              <td class="label-cell">价值类型</td>
              <td colspan="3"><input v-model="form.valueType" class="cell-input" /></td>
            </tr>
            <tr>
              <td class="label-cell">委托人</td>
              <td colspan="3"><input v-model="form.client" class="cell-input" /></td>
            </tr>
            <tr>
              <td class="label-cell">被评估单位</td>
              <td colspan="3"><input v-model="form.unitName" class="cell-input" /></td>
            </tr>
            <tr>
              <td class="label-cell">收益法适用</td>
              <td>
                <el-radio-group v-model="form.useIncomeMethod" size="small">
                  <el-radio :value="1">是</el-radio>
                  <el-radio :value="0">否</el-radio>
                </el-radio-group>
              </td>
              <td class="label-cell">市场法适用</td>
              <td>
                <el-radio-group v-model="form.useMarketMethod" size="small">
                  <el-radio :value="1">是</el-radio>
                  <el-radio :value="0">否</el-radio>
                </el-radio-group>
              </td>
            </tr>
            <tr>
              <td class="label-cell">资产基础法适用</td>
              <td colspan="3">
                <el-radio-group v-model="form.useAssetMethod" size="small">
                  <el-radio :value="1">是</el-radio>
                  <el-radio :value="0">否</el-radio>
                </el-radio-group>
              </td>
            </tr>
            <tr>
              <td class="label-cell">是否备案或核准</td>
              <td colspan="3">
                <el-radio-group v-model="form.approvalRequired" size="small">
                  <el-radio value="是">是</el-radio>
                  <el-radio value="否">否</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <!-- ─── 综合进度 (rows 11-26) ──────────────────────── -->
            <tr>
              <td class="label-cell" :rowspan="SCHEDULE_TASKS.length + 1">综合进度</td>
              <td class="label-cell">项目</td>
              <td class="label-cell">责任人</td>
              <td class="label-cell">开始时间</td>
              <td class="label-cell">完成时间</td>
            </tr>
            <tr v-for="(task, i) in schedule" :key="'s' + i">
              <td class="label-cell-q">{{ task.task }}</td>
              <td>
                <el-select v-model="task.responsible" size="small" style="width:100%" clearable filterable>
                  <el-option v-for="u in userOptions" :key="u.id" :label="u.name" :value="u.name" />
                </el-select>
              </td>
              <td><input v-model="task.startDate" type="date" class="cell-input" /></td>
              <td><input v-model="task.endDate" type="date" class="cell-input" /></td>
            </tr>

            <!-- ─── 评估人员安排 (rows 27-35) ─────────────────── -->
            <tr v-for="(role, i) in PERSONNEL_ROLES" :key="'p' + i">
              <td v-if="i === 0" class="label-cell" :rowspan="PERSONNEL_ROLES.length">评估人员安排</td>
              <td class="label-cell-q">{{ role }}</td>
              <td colspan="3">
                <el-select v-model="personnel[role]" size="small" style="width:100%" clearable filterable>
                  <el-option v-for="u in userOptions" :key="u.id" :label="u.name" :value="u.name" />
                </el-select>
              </td>
            </tr>

            <!-- ─── 收费情况 (rows 36-37) ─────────────────────── -->
            <tr>
              <td class="label-cell" rowspan="2">收费情况</td>
              <td class="label-cell">约定收费</td>
              <td>
                <input v-model.number="form.agreedFee" type="number" class="cell-input" placeholder="0" />
              </td>
              <td class="label-cell">万元</td>
              <td></td>
            </tr>
            <tr>
              <td class="label-cell">实际收费</td>
              <td>
                <input v-model.number="form.actualFee" type="number" class="cell-input" placeholder="0" />
              </td>
              <td class="label-cell">万元</td>
              <td></td>
            </tr>

            <!-- ─── 委托人联系 (row 38) ───────────────────────── -->
            <tr>
              <td class="label-cell">委托人</td>
              <td class="label-cell">联系人</td>
              <td><input v-model="form.clientContact" class="cell-input" /></td>
              <td class="label-cell">电话</td>
              <td><input v-model="form.clientPhone" class="cell-input" /></td>
            </tr>

            <!-- ─── 被评估单位 (rows 39-42) ───────────────────── -->
            <tr>
              <td class="label-cell" rowspan="4">被评估单位</td>
              <td class="label-cell">注册资金</td>
              <td><input v-model="form.unitRegisteredCapital" class="cell-input" /></td>
              <td class="label-cell">地址</td>
              <td><input v-model="form.unitAddress" class="cell-input" /></td>
            </tr>
            <tr>
              <td class="label-cell">法定代表人</td>
              <td><input v-model="form.unitLegalRep" class="cell-input" /></td>
              <td class="label-cell">企业性质</td>
              <td><input v-model="form.unitEnterpriseType" class="cell-input" /></td>
            </tr>
            <tr>
              <td class="label-cell">联系人</td>
              <td><input v-model="form.unitContact" class="cell-input" /></td>
              <td class="label-cell">电话</td>
              <td><input v-model="form.unitPhone" class="cell-input" /></td>
            </tr>
            <tr>
              <td class="label-cell">经营范围</td>
              <td colspan="3">
                <textarea v-model="form.unitBusinessScope" class="cell-textarea" rows="2" />
              </td>
            </tr>

            <!-- ─── 其他信息 (rows 43-55) ────────────────────── -->
            <tr>
              <td class="label-cell long-label">其他报告使用人</td>
              <td colspan="4"><input v-model="form.otherReportUsers" class="cell-input" /></td>
            </tr>
            <tr>
              <td class="label-cell long-label">委托人、被评估单位、其他报告使用人的关系</td>
              <td colspan="4"><input v-model="form.relationship" class="cell-input" /></td>
            </tr>
            <tr>
              <td class="label-cell long-label">委托人及相关当事人工作配合和协助等需要明确的重要事项</td>
              <td colspan="4">
                <textarea v-model="form.importantMatters" class="cell-textarea" rows="2" />
              </td>
            </tr>
            <tr>
              <td class="label-cell long-label">评估假设和限制条件</td>
              <td colspan="4">
                <textarea v-model="form.assumptions" class="cell-textarea" rows="2" />
              </td>
            </tr>
            <tr>
              <td class="label-cell long-label">业务变更</td>
              <td colspan="4"><input v-model="form.businessChanges" class="cell-input" /></td>
            </tr>
            <tr>
              <td class="label-cell long-label">聘请专家</td>
              <td colspan="4"><input v-model="form.expertHired" class="cell-input" /></td>
            </tr>
            <tr>
              <td class="label-cell long-label">重大问题</td>
              <td colspan="4"><input v-model="form.majorIssues" class="cell-input" /></td>
            </tr>
            <tr>
              <td class="label-cell long-label">现场勘查人员</td>
              <td colspan="4"><input v-model="form.siteInspectors" class="cell-input" /></td>
            </tr>
            <tr>
              <td class="label-cell long-label">现场勘查接洽人员</td>
              <td colspan="4"><input v-model="form.siteContacts" class="cell-input" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </el-card>

    <!-- 审批流配置 -->
    <el-card shadow="never" style="margin-bottom: 20px">
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <span>审批流配置</span>
          <el-select
            v-model="selectedTemplate"
            placeholder="选择预设模板快速填充"
            clearable
            style="width: 240px"
            @change="applyFlowTemplate"
          >
            <el-option
              v-for="tpl in flowTemplates"
              :key="tpl.id"
              :label="tpl.name"
              :value="tpl.id"
            >
              <span>{{ tpl.name }}</span>
              <span style="color: #8c8c8c; font-size: 12px; margin-left: 8px">{{ tpl.scene }}</span>
            </el-option>
          </el-select>
        </div>
      </template>
      <ApprovalFlowConfig ref="flowConfigRef" v-model="approvalFlow" />
    </el-card>

    <div style="display: flex; gap: 12px; justify-content: flex-end">
      <el-button type="primary" :loading="submitting" @click="handleSubmit">提交立项</el-button>
      <el-button @click="$router.back()">取消</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { ArrowLeft } from "@element-plus/icons-vue";
import { useProjectStore } from "@/stores/project.js";
import { flowConfigApi, configApi, userApi } from "@/api/index.js";
import ApprovalFlowConfig from "@/components/common/ApprovalFlowConfig.vue";

const router = useRouter();
const projectStore = useProjectStore();
const flowConfigRef = ref();
const submitting = ref(false);
const flowTemplates = ref([]);
const selectedTemplate = ref(null);
const approvalFlow = ref([]);
const purposeOptions = ref([]);
const userOptions = ref([]);

const SCHEDULE_TASKS = [
  "基本情况调查", "风险判断", "委托合同签订", "评估计划", "前期准备",
  "现场勘查", "收集评估资料", "评定估算", "编制报告", "内部审核",
  "初稿", "评估报告日", "提交报告", "报告签收", "工作底稿归档",
];

const PERSONNEL_ROLES = [
  "签字评估师1", "签字评估师2", "流动资产及负债", "长期投资",
  "房地产", "机器设备", "其他无形资产", "整体收益法", "整体市场法",
];

const form = reactive({
  purpose: "",
  baseDate: "",
  reportDate: "",
  contractNo: "",
  assessmentObject: "",
  assessmentScope: "",
  valueType: "",
  client: "",
  unitName: "",
  agreedFee: 0,
  actualFee: 0,
  clientContact: "",
  clientPhone: "",
  unitRegisteredCapital: "",
  unitAddress: "",
  unitLegalRep: "",
  unitEnterpriseType: "",
  unitContact: "",
  unitPhone: "",
  unitBusinessScope: "",
  otherReportUsers: "",
  relationship: "",
  importantMatters: "",
  assumptions: "",
  approvalRequired: "否",
  businessChanges: "",
  expertHired: "",
  majorIssues: "",
  siteInspectors: "",
  siteContacts: "",
  useAssetMethod: 0,
  useIncomeMethod: 1,
  useMarketMethod: 1,
  department: "资产评估部",
  responsible: "",
  budgetHours: 0,
});

const schedule = reactive(
  SCHEDULE_TASKS.map((task) => ({ task, responsible: "", startDate: "", endDate: "" }))
);

const personnel = reactive(
  Object.fromEntries(PERSONNEL_ROLES.map((role) => [role, ""]))
);

onMounted(async () => {
  const [{ data: flows }, { data: purposes }, { data: users }] = await Promise.all([
    flowConfigApi.listEnabled(),
    configApi.listPurposes(),
    userApi.list(),
  ]);
  flowTemplates.value = flows;
  purposeOptions.value = purposes.filter((p) => p.enabled);
  userOptions.value = users.filter((u) => u.status === "active");
});

function applyFlowTemplate(id) {
  if (!id) return;
  const tpl = flowTemplates.value.find((t) => t.id === id);
  if (tpl) approvalFlow.value = tpl.nodes.map((n) => ({ ...n }));
}

async function handleSubmit() {
  if (!form.purpose.trim()) {
    ElMessage.warning("请填写评估目的");
    return;
  }
  if (!form.baseDate) {
    ElMessage.warning("请选择评估基准日");
    return;
  }
  const flowError = flowConfigRef.value?.validate();
  if (flowError) {
    ElMessage.warning(flowError);
    return;
  }

  submitting.value = true;
  try {
    const project = await projectStore.create({
      ...form,
      schedule: JSON.stringify(schedule),
      personnel: JSON.stringify(personnel),
      approvalFlow: approvalFlow.value,
    });

    await ElMessageBox.alert(
      `<div style="text-align:center;padding:8px 0">
        <div style="font-size:13px;color:#8c8c8c;margin-bottom:8px">评估单号已生成</div>
        <div style="font-size:24px;font-weight:700;color:#1677ff;letter-spacing:2px">${project.projectNo}</div>
        <div style="font-size:12px;color:#8c8c8c;margin-top:12px">立项已提交，即将跳转到项目详情页</div>
      </div>`,
      "立项创建成功",
      { dangerouslyUseHTMLString: true, confirmButtonText: "查看项目详情", type: "success" }
    );
    router.push(`/project/${project.id}/overview`);
  } catch (e) {
    ElMessage.error(
      "提交失败：" + (e?.response?.data?.message || e?.message || "请重试")
    );
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}
.page-header h3 {
  margin: 0;
  font-size: 20px;
}

/* ── Excel 表格样式（与 Overview.vue 一致）── */
.form-sheet {
  padding: 0 4px 4px;
  font-family: "SimSun", "Microsoft YaHei", sans-serif;
  font-size: 13px;
}

.form-table {
  width: 100%;
  border-collapse: collapse;
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
  font-size: 12px;
  padding: 4px 6px;
  line-height: 1.4;
  white-space: nowrap;
}

/* 长标签允许换行 */
.long-label {
  white-space: normal;
  text-align: left;
  padding: 4px 8px;
}

.required-label::before {
  content: "* ";
  color: #f56c6c;
}

.label-cell-q {
  padding: 4px 8px;
  font-size: 12px;
  color: #333;
  line-height: 1.5;
}

.readonly-cell {
  color: #bfbfbf;
  font-size: 12px;
  padding: 4px 8px;
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
