<template>
  <div class="estimation-tab">
    <el-row :gutter="20">
      <el-col :span="14">
        <!-- 评估方法选择 -->
        <el-card shadow="never" style="margin-top: 16px">
          <template #header>资产评估基本方法</template>
          <el-checkbox-group v-model="selectedMethods" :disabled="locked">
            <el-checkbox value="assetBase">资产基础法</el-checkbox>
            <el-checkbox value="income">收益法</el-checkbox>
            <el-checkbox value="market">市场法</el-checkbox>
          </el-checkbox-group>
        </el-card>

        <!-- 底稿文件确认 -->
        <el-card
          v-if="selectedMethods.length"
          shadow="never"
          style="margin-top: 16px"
        >
          <template #header>
            <div
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;
              "
            >
              <span>底稿文件确认</span>
              <el-button
                size="small"
                type="primary"
                :loading="savingMethods"
                :disabled="locked"
                @click="saveMethodChecks"
                >保存</el-button
              >
            </div>
          </template>
          <el-tabs
            type="border-card"
            class="method-tabs"
            v-model="activeMethodTab"
          >
            <el-tab-pane
              v-if="selectedMethods.includes('assetBase')"
              label="资产基础法"
              name="assetBase"
            >
              <div class="form-sheet">
                <table class="form-table">
                  <colgroup>
                    <col style="width: 44px" />
                    <col />
                    <col style="width: 90px" />
                    <col style="width: 72px" />
                  </colgroup>
                  <thead>
                    <tr>
                      <th class="label-cell" style="text-align: center">
                        序号
                      </th>
                      <th class="label-cell">表名称</th>
                      <th class="label-cell" style="text-align: center">
                        文件编号
                      </th>
                      <th class="label-cell" style="text-align: center">
                        文件存在
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, i) in COST_ITEMS" :key="i">
                      <td class="no-cell">{{ item.no }}</td>
                      <td class="name-cell">{{ item.name }}</td>
                      <td class="code-cell">{{ item.code }}</td>
                      <td class="check-cell">
                        <input
                          type="checkbox"
                          v-model="fileChecks.assetBase[i]"
                          :disabled="locked"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </el-tab-pane>

            <el-tab-pane
              v-if="selectedMethods.includes('income')"
              label="收益法"
              name="income"
            >
              <div class="form-sheet">
                <table class="form-table">
                  <colgroup>
                    <col style="width: 44px" />
                    <col />
                    <col style="width: 90px" />
                    <col style="width: 72px" />
                  </colgroup>
                  <thead>
                    <tr>
                      <th class="label-cell" style="text-align: center">
                        序号
                      </th>
                      <th class="label-cell">表名称</th>
                      <th class="label-cell" style="text-align: center">
                        文件编号
                      </th>
                      <th class="label-cell" style="text-align: center">
                        文件存在
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, i) in INCOME_ITEMS" :key="i">
                      <td class="no-cell">{{ item.no }}</td>
                      <td class="name-cell">{{ item.name }}</td>
                      <td class="code-cell">{{ item.code }}</td>
                      <td class="check-cell">
                        <input
                          type="checkbox"
                          v-model="fileChecks.income[i]"
                          :disabled="locked"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </el-tab-pane>

            <el-tab-pane
              v-if="selectedMethods.includes('market')"
              label="市场法"
              name="market"
            >
              <div class="form-sheet">
                <table class="form-table">
                  <colgroup>
                    <col style="width: 44px" />
                    <col />
                    <col style="width: 90px" />
                    <col style="width: 72px" />
                  </colgroup>
                  <thead>
                    <tr>
                      <th class="label-cell" style="text-align: center">
                        序号
                      </th>
                      <th class="label-cell">表名称</th>
                      <th class="label-cell" style="text-align: center">
                        文件编号
                      </th>
                      <th class="label-cell" style="text-align: center">
                        文件存在
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, i) in MARKET_ITEMS" :key="i">
                      <td class="no-cell">{{ item.no }}</td>
                      <td class="name-cell">{{ item.name }}</td>
                      <td class="code-cell">{{ item.code }}</td>
                      <td class="check-cell">
                        <input
                          type="checkbox"
                          v-model="fileChecks.market[i]"
                          :disabled="locked"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>

        <el-card shadow="never" style="margin-top: 16px">
          <template #header>ERP 状态确认</template>
          <el-checkbox-group v-model="erpStatus" :disabled="locked">
            <div class="erp-status-list">
              <el-checkbox value="estimationDone">初步评估完成</el-checkbox>
            </div>
          </el-checkbox-group>
          <div style="margin-top: 16px">
            <PermGuard
              :perm="PERM.PROJECT_EDIT"
              mode="disable"
              disabled-tip="无编辑权限"
            >
              <template #default="{ disabled }">
                <el-button
                  type="primary"
                  :loading="saving"
                  :disabled="disabled || locked"
                  @click="saveEstimation"
                  >保存</el-button
                >
              </template>
            </PermGuard>
          </div>
        </el-card>
      </el-col>
      <el-col :span="10">
        <ApprovalFlowCard
          header="评定估算审批"
          :approvals="stageApprovals"
          :on-submit="handleApprove"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
import { scratchApi } from "@/api/index.js";
import { useProjectStore } from "@/stores/project.js";
import ApprovalFlowCard from "@/components/common/ApprovalFlowCard.vue";
import PermGuard from "@/components/common/PermGuard.vue";
import { PERM } from "@/constants/permissions.js";

const { t } = useI18n();
const route = useRoute();
const saving = ref(false);
const erpStatus = ref([]);

const projectStore = useProjectStore();
const locked = computed(() => (projectStore.current?.currentStep ?? 1) > 5);
const stageApprovals = computed(
  () => projectStore.current?.approvalsByStage?.["estimation"] || [],
);

async function handleApprove(payload) {
  await projectStore.approveStage(route.params.id, "estimation", payload);
  ElMessage.success(payload.action === "approved" ? "已审批通过" : "已驳回");
}

async function saveEstimation() {
  saving.value = true;
  try {
    await projectStore.saveEstimationInfo?.(route.params.id, {
      erpStatus: erpStatus.value,
    });
    ElMessage.success("初步评估信息已保存");
  } finally {
    saving.value = false;
  }
}

onMounted(async () => {
  await loadMethodChecks();
});

// ── 评估方法选择 ──────────────────────────────────────────────────────────────
const selectedMethods = ref([]);
const activeMethodTab = ref("");
const savingMethods = ref(false);

watch(selectedMethods, (val) => {
  if (!val.includes(activeMethodTab.value)) {
    activeMethodTab.value = val[0] || "";
  }
});

async function saveMethodChecks() {
  savingMethods.value = true;
  try {
    await scratchApi.saveEstimationMethods(route.params.id, "estimation", {
      selectedMethods: selectedMethods.value,
      checksAssetBase: fileChecks.assetBase,
      checksIncome: fileChecks.income,
      checksMarket: fileChecks.market,
    });
    ElMessage.success("底稿文件确认已保存");
  } catch {
    ElMessage.error("保存失败");
  } finally {
    savingMethods.value = false;
  }
}

async function loadMethodChecks() {
  const { data } = await scratchApi.getEstimationMethods(
    route.params.id,
    "estimation",
  );
  if (!data) return;
  selectedMethods.value = JSON.parse(data.selectedMethods || "[]");
  const ab = JSON.parse(data.checksAssetBase || "[]");
  const ic = JSON.parse(data.checksIncome || "[]");
  const mk = JSON.parse(data.checksMarket || "[]");
  ab.forEach((v, i) => {
    fileChecks.assetBase[i] = v;
  });
  ic.forEach((v, i) => {
    fileChecks.income[i] = v;
  });
  mk.forEach((v, i) => {
    fileChecks.market[i] = v;
  });
}

const COST_ITEMS = [
  { no: 1, name: "流动资产、其他资产评估分类汇总表", code: "C3/1" },
  { no: 2, name: "被评估单位会计环境调查表", code: "C3/2" },
  { no: 3, name: "货币资金评估汇总表", code: "C3-1/1" },
  { no: 4, name: "货币资金—库存库存现金评估步骤及复核表", code: "C3-1-1" },
  { no: 5, name: "货币资金—银行存款评估步骤及复核表", code: "C3-1-2" },
  { no: 6, name: "货币资金—其他货币资金评估步骤及复核表", code: "C3-1-3" },
  { no: 7, name: "交易性金融资产评估步骤及复核表", code: "C3-2" },
  { no: 8, name: "交易性金融资产评估汇总表", code: "C3-2/1" },
  { no: 9, name: "应收票据评估步骤及复核表", code: "C3-3" },
  { no: 10, name: "应收账款评估步骤及复核表", code: "C3-4" },
  { no: 11, name: "预付账款评估步骤及复核表", code: "C3-5" },
  { no: 12, name: "应收股利评估步骤及复核表", code: "C3-6" },
  { no: 13, name: "应收利息评估步骤及复核表", code: "C3-7" },
  { no: 14, name: "其他应收款评估步骤及复核表", code: "C3-8" },
  { no: 15, name: "代理业务资产评估步骤及复核表", code: "C3-9" },
  { no: 16, name: "存货评估步骤及复核表", code: "C3-10" },
  { no: 17, name: "存货评估汇总表", code: "C3-10/1" },
  { no: 18, name: "一年内到期非流动资产评估步骤及复核表", code: "C3-11" },
  { no: 19, name: "其他流动资产评估步骤及复核表", code: "C3-12" },
  { no: 20, name: "持有至到期投资评估步骤及复核表", code: "C4-1" },
  { no: 21, name: "可供出售金融资产评估步骤及复核表", code: "C4-2" },
  { no: 22, name: "长期股权投资评估步骤及复核表", code: "C4-3" },
  { no: 23, name: "投资性房地产评估步骤及复核表", code: "C4-4" },
  { no: 24, name: "长期应收款评估步骤及复核表", code: "C4-5" },
  { no: 25, name: "未实现融资收益评估步骤及复核表", code: "C4-6" },
  { no: 26, name: "固定资产评估增减值分析汇总表", code: "C5" },
  { no: 27, name: "房屋建筑物/构筑物评估步骤及复核表", code: "C5-1" },
  { no: 28, name: "固定资产—机器设备评估步骤及复核表", code: "C5-2" },
  { no: 29, name: "在建工程—土建评估步骤及复核表", code: "C5-3-1" },
  { no: 30, name: "在建工程—设备安装评估步骤及审核表", code: "C5-3-2" },
  { no: 31, name: "工程物资评估步骤及复核表", code: "C5-4" },
  { no: 32, name: "固定资产清理评估步骤及审核表", code: "C5-5" },
  { no: 33, name: "土地使用权评估步骤及复核表", code: "C6-1" },
  { no: 34, name: "其他无形资产评估步骤及复核表", code: "C6-2" },
  { no: 35, name: "开发支出评估步骤及复核表", code: "C6-3" },
  { no: 36, name: "长期待摊费用评估步骤及复核表", code: "C7-1" },
  { no: 37, name: "递延所得税资产评估步骤及复核表", code: "C7-2" },
  { no: 38, name: "其他非流动资产评估步骤及复核表", code: "C7-3" },
  { no: 39, name: "负债评估汇总表", code: "C8" },
  { no: 40, name: "短期借款评估步骤及复核表", code: "C8-1" },
  { no: 41, name: "交易性金融负债评估步骤及复核表", code: "C8-2" },
  { no: 42, name: "应付票据评估步骤及复核表", code: "C8-3" },
  { no: 43, name: "应付账款评估步骤及复核表", code: "C8-4" },
  { no: 44, name: "预收账款评估步骤及复核表", code: "C8-5" },
  { no: 45, name: "应付职工薪酬评估步骤及复核表", code: "C8-6" },
  { no: 46, name: "应交税费评估步骤及复核表", code: "C8-7" },
  { no: 47, name: "应付利息评估步骤及复核表", code: "C8-8" },
  { no: 48, name: "应付股利评估步骤及复核表", code: "C8-9" },
  { no: 49, name: "其他应付款评估步骤及复核表", code: "C8-10" },
  { no: 50, name: "代理业务负债评估步骤及复核表", code: "C8-11" },
  { no: 51, name: "递延收益评估步骤及复核表", code: "C8-12" },
  { no: 52, name: "一年内到期的非流动负债评估步骤及复核表", code: "C8-13" },
  { no: 53, name: "其他流动负债评估步骤及复核表", code: "C8-14" },
  { no: 54, name: "长期借款评估步骤及复核表", code: "C8-15" },
  { no: 55, name: "应付债券评估步骤及复核表", code: "C8-16" },
  { no: 56, name: "长期应付款评估步骤及复核表", code: "C8-17" },
  { no: 57, name: "未确认融资费用评估步骤及复核表", code: "C8-18" },
  { no: 58, name: "专项应付款评估步骤及复核表", code: "C8-19" },
  { no: 59, name: "预计负债评估步骤及复核表", code: "C8-20" },
  { no: 60, name: "递延所得税负债评估步骤及复核表", code: "C8-21" },
  { no: 61, name: "其他非流动负债评估步骤及复核表", code: "C8-22" },
];

const INCOME_ITEMS = [
  { no: 1, name: "经营情况前（  ）年分析表", code: "SY-1" },
  { no: 2, name: "经营情况未来（  ）年预测表及评估结果表", code: "SY-2" },
  { no: 3, name: "资产、负债情况前（  ）年分析表", code: "SY-3" },
  { no: 4, name: "资产、负债情况未来（  ）年预测表", code: "SY-4" },
  { no: 5, name: "营业收入分析表", code: "SY-5" },
  { no: 6, name: "营业收入调整依据", code: "SY-5-1" },
  { no: 7, name: "营业收入预测表", code: "SY-6" },
  { no: 8, name: "营业收入预测依据", code: "SY-6-1" },
  { no: 9, name: "营业成本分析表", code: "SY-7" },
  { no: 10, name: "营业成本调整依据", code: "SY-7-1" },
  { no: 11, name: "营业成本预测表", code: "SY-8" },
  { no: 12, name: "营业成本预测依据", code: "SY-8-1" },
  { no: 13, name: "营业税金及附加分析表", code: "SY-9" },
  { no: 14, name: "营业税金及附加调整依据", code: "SY-9-1" },
  { no: 15, name: "营业税金及附加预测表", code: "SY-10" },
  { no: 16, name: "营业税金及附加预测依据", code: "SY-10-1" },
  { no: 17, name: "销售费用分析表", code: "SY-11" },
  { no: 18, name: "销售费用调整依据", code: "SY-11-1" },
  { no: 19, name: "销售费用预测表", code: "SY-12" },
  { no: 20, name: "销售费用预测依据", code: "SY-12-1" },
  { no: 21, name: "管理费用分析表", code: "SY-13" },
  { no: 22, name: "管理费用调整依据", code: "SY-13-1" },
  { no: 23, name: "管理费用预测表", code: "SY-14" },
  { no: 24, name: "管理费用预测依据", code: "SY-14-1" },
  { no: 25, name: "财务费用分析表", code: "SY-15" },
  { no: 26, name: "财务费用调整依据", code: "SY-15-1" },
  { no: 27, name: "财务费用预测表", code: "SY-16" },
  { no: 28, name: "财务费用预测依据", code: "SY-16-1" },
  { no: 29, name: "投资收益分析表", code: "SY-17" },
  { no: 30, name: "投资收益调整依据", code: "SY-17-1" },
  { no: 31, name: "投资收益预测表", code: "SY-18" },
  { no: 32, name: "投资收益预测依据", code: "SY-18-1" },
  { no: 33, name: "营业外收入分析表", code: "SY-19" },
  { no: 34, name: "营业外收入调整依据", code: "SY-19-1" },
  { no: 35, name: "营业外收入预测表", code: "SY-20" },
  { no: 36, name: "营业外收入预测依据", code: "SY-20-1" },
  { no: 37, name: "营业外支出分析表", code: "SY-21" },
  { no: 38, name: "营业外支出调整依据", code: "SY-21-1" },
  { no: 39, name: "营业外支出预测表", code: "SY-22" },
  { no: 40, name: "营业外支出预测依据", code: "SY-22-1" },
  { no: 41, name: "折旧及摊销预测表", code: "SY-23" },
  { no: 42, name: "折旧与摊销依据", code: "SY-23-1" },
  { no: 43, name: "资本性支出预测表", code: "SY-24" },
  { no: 44, name: "资本性支出预测依据", code: "SY-24-1" },
  { no: 45, name: "主要资产状况调查表", code: "SY-25" },
  { no: 46, name: "折现率测算表", code: "SY-26" },
  { no: 47, name: "营运资金分析表", code: "SY-27" },
  { no: 48, name: "营运资金情况依据", code: "SY-27-1" },
  { no: 49, name: "营运资金预测表", code: "SY-28" },
  { no: 50, name: "营运资金预测依据", code: "SY-28-1" },
  { no: 51, name: "历年财务指标分析表", code: "SY-29" },
  { no: 52, name: "历年财务指标分析依据", code: "SY-29-1" },
  { no: 53, name: "股东部分权益价值测算表", code: "SY-30" },
  { no: 54, name: "企业综合能力调查表", code: "SY-31" },
  { no: 55, name: "行业状况调查表", code: "SY-32" },
];

const MARKET_ITEMS = [
  { no: 1, name: "可比公司股权价值", code: "SC-1" },
  { no: 2, name: "现金流量调整表", code: "SC-2" },
  { no: 3, name: "资产负债表--资产", code: "SC-3" },
  { no: 4, name: "资产负债表--负债", code: "SC-4" },
  { no: 5, name: "财务指标比率分析表", code: "SC-5" },
  { no: 6, name: "财务比率定义", code: "SC-6" },
  { no: 7, name: "价值比率计算表", code: "SC-7" },
  { no: 8, name: "价值比率定义", code: "SC-8" },
  { no: 9, name: "市场法--参考企业比较法调整因素描述表", code: "SC-9" },
  { no: 10, name: "市场法--参考企业比较法计算表", code: "SC-10" },
  { no: 11, name: "市场法-并购案例分析法因素描述表", code: "SC-11" },
  { no: 12, name: "市场法-并购案例分析法计算表", code: "SC-12" },
];

const fileChecks = reactive({
  assetBase: Array(COST_ITEMS.length).fill(false),
  income: Array(INCOME_ITEMS.length).fill(false),
  market: Array(MARKET_ITEMS.length).fill(false),
});
</script>

<style scoped>
.positive {
  color: #52c41a;
  font-weight: 600;
}
.negative {
  color: #ff4d4f;
  font-weight: 600;
}
.erp-status-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ── Method tabs ─────────────────────────────────── */
:deep(.method-tabs.el-tabs--border-card > .el-tabs__header) {
  background: #f7f8fa;
}
:deep(
  .method-tabs.el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active
) {
  color: #1677ff;
  font-weight: 600;
}
:deep(.method-tabs.el-tabs--border-card > .el-tabs__content) {
  padding: 0;
}

/* ── Excel-like table ────────────────────────────── */
.form-sheet {
  padding: 12px 16px 16px;
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
  white-space: nowrap;
  font-size: 12px;
  padding: 4px 6px;
  line-height: 1.4;
}

.no-cell {
  text-align: center;
  font-size: 12px;
  color: #595959;
  background: #f7f9fb;
}

.name-cell {
  padding: 4px 8px;
  font-size: 12px;
  color: #262626;
  line-height: 1.5;
}

.code-cell {
  text-align: center;
  font-size: 12px;
  color: #595959;
  font-family: monospace;
}

.check-cell {
  text-align: center;
}
</style>
