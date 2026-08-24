<template>
  <div class="prework-tab">
    <el-row :gutter="20">
      <el-col :span="14">
        <!-- G-4 / G-5 -->
        <el-card
          shadow="never"
          style="margin-top: 16px"
          class="scratch-tabs-card"
        >
          <template #header>底稿（工作计划与资料清单）</template>
          <el-tabs type="border-card" class="scratch-tabs" model-value="g4">
            <!-- G-4 工作计划表 -->
            <el-tab-pane label="G-4 工作计划表" name="g4">
              <div class="form-sheet">
                <table class="form-table">
                  <colgroup>
                    <col style="width: 80px" />
                    <col style="width: 100px" />
                    <col />
                    <col style="width: 50px" />
                    <col style="width: 110px" />
                    <col style="width: 50px" />
                    <col style="width: 110px" />
                  </colgroup>
                  <tbody>
                    <tr>
                      <td
                        colspan="7"
                        class="section-header"
                        style="text-align: center; font-size: 13px"
                      >
                        评估项目工作计划表
                      </td>
                    </tr>
                    <tr>
                      <td class="label-cell" colspan="2">项目名称</td>
                      <td colspan="5">
                        <input
                          v-model="g4.projectName"
                          class="cell-input"
                          :disabled="locked"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td class="label-cell" colspan="2">评估目的</td>
                      <td colspan="5">
                        <input
                          v-model="g4.purpose"
                          class="cell-input"
                          :disabled="locked"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td class="label-cell" colspan="2">评估基准日</td>
                      <td>
                        <input
                          v-model="g4.baseDate"
                          type="date"
                          class="cell-input"
                          :disabled="locked"
                        />
                      </td>
                      <td class="label-cell" colspan="2">价值类型</td>
                      <td colspan="2">
                        <input
                          v-model="g4.valueType"
                          class="cell-input"
                          :disabled="locked"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td class="label-cell" colspan="2">评估范围</td>
                      <td colspan="5">
                        <textarea
                          v-model="g4.scope"
                          class="cell-textarea"
                          rows="2"
                          :disabled="locked"
                        />
                      </td>
                    </tr>
                    <!-- Schedule header -->
                    <tr>
                      <td class="label-cell" colspan="2">综合进度</td>
                      <td class="label-cell">责任人</td>
                      <td
                        class="label-cell"
                        colspan="2"
                        style="text-align: center"
                      >
                        开始日期
                      </td>
                      <td
                        class="label-cell"
                        colspan="2"
                        style="text-align: center"
                      >
                        结束日期
                      </td>
                    </tr>
                    <tr v-for="(row, i) in g4.schedule" :key="'s' + i">
                      <td class="label-cell" colspan="2">{{ row.name }}</td>
                      <td>
                        <input
                          v-model="row.responsible"
                          class="cell-input"
                          :disabled="locked"
                        />
                      </td>
                      <td colspan="2">
                        <input
                          v-model="row.startDate"
                          type="date"
                          class="cell-input"
                          :disabled="locked"
                        />
                      </td>
                      <td colspan="2">
                        <input
                          v-model="row.endDate"
                          type="date"
                          class="cell-input"
                          :disabled="locked"
                        />
                      </td>
                    </tr>
                    <!-- Staff section -->
                    <tr>
                      <td class="label-cell" colspan="2">人员安排</td>
                      <td
                        class="label-cell"
                        colspan="5"
                        style="text-align: center"
                      >
                        评估人员
                      </td>
                    </tr>
                    <tr v-for="(row, i) in g4.staff" :key="'st' + i">
                      <td class="label-cell" colspan="2">{{ row.name }}</td>
                      <td colspan="5">
                        <input
                          v-model="row.person"
                          class="cell-input"
                          :disabled="locked"
                        />
                      </td>
                    </tr>
                    <!-- Budget section -->
                    <tr>
                      <td class="label-cell" rowspan="2">费用预算</td>
                      <td class="label-cell">项目</td>
                      <td class="label-cell">劳务费</td>
                      <td class="label-cell">差旅费</td>
                      <td class="label-cell">外勤费</td>
                      <td class="label-cell">加班费</td>
                      <td class="label-cell">招待费/其他</td>
                    </tr>
                    <tr>
                      <td class="label-cell">金额</td>
                      <td>
                        <input
                          v-model="g4.budget.labor"
                          class="cell-input"
                          :disabled="locked"
                        />
                      </td>
                      <td>
                        <input
                          v-model="g4.budget.travel"
                          class="cell-input"
                          :disabled="locked"
                        />
                      </td>
                      <td>
                        <input
                          v-model="g4.budget.field"
                          class="cell-input"
                          :disabled="locked"
                        />
                      </td>
                      <td>
                        <input
                          v-model="g4.budget.overtime"
                          class="cell-input"
                          :disabled="locked"
                        />
                      </td>
                      <td>
                        <input
                          v-model="g4.budget.other"
                          class="cell-input"
                          :disabled="locked"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td class="label-cell" colspan="2">批准人</td>
                      <td>
                        <input
                          v-model="g4.approver"
                          class="cell-input"
                          :disabled="locked"
                        />
                      </td>
                      <td class="label-cell" colspan="2">日期</td>
                      <td colspan="2">
                        <input
                          v-model="g4.approveDate"
                          type="date"
                          class="cell-input"
                          :disabled="locked"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td class="label-cell" colspan="2">计划调整</td>
                      <td colspan="5">
                        <textarea
                          v-model="g4.adjustment"
                          class="cell-textarea"
                          rows="2"
                          :disabled="locked"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td class="label-cell" colspan="2">批准人</td>
                      <td>
                        <input
                          v-model="g4.adjustApprover"
                          class="cell-input"
                          :disabled="locked"
                        />
                      </td>
                      <td class="label-cell" colspan="2">日期</td>
                      <td colspan="2">
                        <input
                          v-model="g4.adjustDate"
                          type="date"
                          class="cell-input"
                          :disabled="locked"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td class="label-cell" colspan="2">备注</td>
                      <td colspan="5">
                        <textarea
                          v-model="g4.remark"
                          class="cell-textarea"
                          rows="2"
                          :disabled="locked"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td class="label-cell" colspan="2">编制人</td>
                      <td>
                        <input
                          v-model="g4.preparer"
                          class="cell-input"
                          :disabled="locked"
                        />
                      </td>
                      <td class="label-cell" colspan="2">复核</td>
                      <td colspan="2">
                        <input
                          v-model="g4.reviewer"
                          class="cell-input"
                          :disabled="locked"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div v-if="!locked" class="scratch-save-row">
                  <el-button
                    size="small"
                    type="primary"
                    :loading="savingG4"
                    @click="saveG4"
                    >保存 G-4</el-button
                  >
                </div>
              </div>
            </el-tab-pane>

            <!-- G-5 资料清单 -->
            <el-tab-pane label="G-5 资料清单" name="g5">
              <div
                class="form-sheet"
                style="max-height: 600px; overflow-y: auto"
              >
                <table class="form-table">
                  <colgroup>
                    <col style="width: 40px" />
                    <col />
                    <col style="width: 100px" />
                    <col style="width: 100px" />
                    <col style="width: 80px" />
                    <col style="width: 80px" />
                  </colgroup>
                  <thead>
                    <tr>
                      <th class="label-cell" style="text-align: center">
                        序号
                      </th>
                      <th class="label-cell">资料名称</th>
                      <th class="label-cell" style="text-align: center">
                        需要提供（日期）
                      </th>
                      <th class="label-cell" style="text-align: center">
                        已提供（日期）
                      </th>
                      <th class="label-cell" style="text-align: center">
                        提供人签字
                      </th>
                      <th class="label-cell" style="text-align: center">
                        备注
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="(row, i) in G5_LIST" :key="i">
                      <tr v-if="row.type === 'section'">
                        <td colspan="6" class="section-header">
                          {{ row.label }}
                        </td>
                      </tr>
                      <tr v-else-if="row.type === 'subsection'">
                        <td
                          colspan="6"
                          class="section-header"
                          style="background: #e8eff5; padding-left: 16px"
                        >
                          {{ row.label }}
                        </td>
                      </tr>
                      <tr v-else-if="row.type === 'subsubsection'">
                        <td
                          colspan="6"
                          class="label-cell"
                          style="
                            text-align: left;
                            background: #f0f5fa;
                            padding-left: 24px;
                          "
                        >
                          {{ row.label }}
                        </td>
                      </tr>
                      <tr v-else>
                        <td class="label-cell" style="text-align: center">
                          {{ row.no }}
                        </td>
                        <td
                          style="
                            padding: 4px 8px;
                            font-size: 12px;
                            border: 1px solid #bcc8d4;
                            line-height: 1.4;
                          "
                        >
                          {{ row.label }}
                        </td>
                        <td>
                          <input
                            v-model="g5Items[row.idx].needDate"
                            type="date"
                            class="cell-input"
                            :disabled="locked"
                          />
                        </td>
                        <td>
                          <input
                            v-model="g5Items[row.idx].providedDate"
                            type="date"
                            class="cell-input"
                            :disabled="locked"
                          />
                        </td>
                        <td>
                          <input
                            v-model="g5Items[row.idx].signer"
                            class="cell-input"
                            :disabled="locked"
                          />
                        </td>
                        <td>
                          <input
                            v-model="g5Items[row.idx].remark"
                            class="cell-input"
                            :disabled="locked"
                          />
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </table>
                <div v-if="!locked" class="scratch-save-row">
                  <el-button
                    size="small"
                    type="primary"
                    :loading="savingG5"
                    @click="saveG5"
                    >保存 G-5</el-button
                  >
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>

        <el-card shadow="never" header="上传底稿" style="margin-top: 16px">
          <div class="scratch-docs">
            <div
              v-for="doc in scratchDocTypes"
              :key="doc.key"
              class="scratch-doc-item"
            >
              <div class="scratch-doc-label">
                <el-icon><Document /></el-icon>
                {{ doc.label }}
              </div>
              <el-upload
                v-model:file-list="attachments[doc.key]"
                action="#"
                :auto-upload="false"
                :limit="3"
                accept=".pdf,.doc,.docx,.xlsx,.xls,.jpg,.png"
                :disabled="locked"
                :on-exceed="() => ElMessage.warning('最多上传3个文件')"
                :on-remove="(file) => markForDelete(file)"
              >
                <el-button size="small" :icon="Upload" :disabled="locked"
                  >上传文件</el-button
                >
              </el-upload>
            </div>
          </div>
        </el-card>
        <el-card
          v-if="!locked"
          shadow="never"
          header="审批流配置"
          style="margin-top: 16px"
        >
          <ApprovalFlowConfig ref="flowConfigRef" v-model="approvalFlow" />
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
                  :disabled="disabled"
                  @click="savePreWork"
                  >保存并发送审批</el-button
                >
              </template>
            </PermGuard>
          </div>
        </el-card>
      </el-col>

      <el-col :span="10">
        <ApprovalFlowCard
          header="前期工作审批"
          :approvals="stageApprovals"
          :on-submit="handleApprove"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { Document, Upload } from "@element-plus/icons-vue";
import { useProjectStore } from "@/stores/project.js";
import { documentApi, stagesApi, scratchApi } from "@/api/index.js";
import ApprovalFlowCard from "@/components/common/ApprovalFlowCard.vue";
import ApprovalFlowConfig from "@/components/common/ApprovalFlowConfig.vue";
import PermGuard from "@/components/common/PermGuard.vue";
import { PERM } from "@/constants/permissions.js";

const route = useRoute();
const projectStore = useProjectStore();

const project = computed(() => projectStore.current);
const currentStep = computed(() => projectStore.current?.currentStep ?? 1);
const stageApprovals = computed(
  () => project.value?.approvalsByStage?.["pre-work"] || [],
);
const preWorkApproved = computed(
  () =>
    stageApprovals.value.length > 0 &&
    stageApprovals.value.every((n) => n.nodeStatus === "approved"),
);
const locked = computed(() => preWorkApproved.value || currentStep.value > 2);

const flowConfigRef = ref();
const saving = ref(false);
const approvalFlow = ref([]);
const erpStatus = ref([]);
const pendingDeletes = ref([]);

const form = reactive({
  contractNo: "",
  clientName: "",
  signDate: "",
  amount: 0,
  planStart: "",
  planEnd: "",
  members: [],
});

const scratchDocTypes = [
  { key: "G-4", label: "G-4 工作计划表" },
  { key: "G-5", label: "G-5 资料清单" },
];

const attachments = reactive({
  entrustment: [],
  materialList: [],
  assessPlan: [],
});

// ── G-4 ──────────────────────────────────────────────────────────────────────
const G4_SCHEDULE = [
  "前期准备",
  "现场勘查",
  "收集评估资料",
  "评定估算",
  "编制报告",
  "内部审核",
  "提交报告",
  "工作底稿归档",
];
const G4_STAFF = [
  "流动资产及负债",
  "长期投资",
  "房地产",
  "机器设备",
  "其他无形资产",
  "整体收益法",
  "整体市场法",
];

const savingG4 = ref(false);
const g4 = reactive({
  projectName: "",
  purpose: "",
  baseDate: "",
  valueType: "",
  scope: "",
  schedule: G4_SCHEDULE.map((name) => ({
    name,
    responsible: "",
    startDate: "",
    endDate: "",
  })),
  staff: G4_STAFF.map((name) => ({ name, person: "" })),
  budget: { labor: "", travel: "", field: "", overtime: "", other: "" },
  approver: "",
  approveDate: "",
  adjustment: "",
  adjustApprover: "",
  adjustDate: "",
  remark: "",
  preparer: "",
  reviewer: "",
});

async function loadG4() {
  try {
    const { data } = await scratchApi.getG4(route.params.id, "pre-work");
    if (!data) return;
    Object.assign(g4, {
      projectName: data.projectName || "",
      purpose: data.purpose || "",
      baseDate: data.baseDate || "",
      valueType: data.valueType || "",
      scope: data.scope || "",
      approver: data.approver || "",
      approveDate: data.approveDate || "",
      adjustment: data.adjustment || "",
      adjustApprover: data.adjustApprover || "",
      adjustDate: data.adjustDate || "",
      remark: data.remark || "",
      preparer: data.preparer || "",
      reviewer: data.reviewer || "",
    });
    if (Array.isArray(data.schedule))
      data.schedule.forEach((s, i) => {
        if (g4.schedule[i]) Object.assign(g4.schedule[i], s);
      });
    if (Array.isArray(data.staff))
      data.staff.forEach((s, i) => {
        if (g4.staff[i]) g4.staff[i].person = s.person || "";
      });
    if (data.budget) Object.assign(g4.budget, data.budget);
  } catch {}
}

async function saveG4() {
  savingG4.value = true;
  try {
    await scratchApi.saveG4(route.params.id, "pre-work", {
      projectName: g4.projectName,
      purpose: g4.purpose,
      baseDate: g4.baseDate,
      valueType: g4.valueType,
      scope: g4.scope,
      schedule: g4.schedule.map(({ responsible, startDate, endDate }) => ({
        responsible,
        startDate,
        endDate,
      })),
      staff: g4.staff.map(({ person }) => ({ person })),
      budget: { ...g4.budget },
      approver: g4.approver,
      approveDate: g4.approveDate,
      adjustment: g4.adjustment,
      adjustApprover: g4.adjustApprover,
      adjustDate: g4.adjustDate,
      remark: g4.remark,
      preparer: g4.preparer,
      reviewer: g4.reviewer,
    });
    ElMessage.success("G-4 已保存");
  } catch {
    ElMessage.error("G-4 保存失败");
  } finally {
    savingG4.value = false;
  }
}

// ── G-5 ──────────────────────────────────────────────────────────────────────
let _g5i = 0;
const G5_LIST = [
  { type: "section", label: "一、企业基本情况" },
  { type: "item", no: 1, label: "委托人企业法人营业执照", idx: _g5i++ },
  {
    type: "item",
    no: 2,
    label: "被评估单位企业法人营业执照、税务登记证",
    idx: _g5i++,
  },
  { type: "item", no: 3, label: "被评估单位国有资产产权登记证", idx: _g5i++ },
  {
    type: "item",
    no: 4,
    label: "被评估单位的公司合同、章程、协议、验资报告",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 5,
    label: "被评估单位经营历史沿革以及目前的经营特点",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 6,
    label: "被评估单位股东构成及持有的股份、以及对于公司决策的影响",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 7,
    label:
      "被评估单位发生的实际和计划中的股权变动事宜，包括股权数量、变动形式、转让价格、价格确定的方式、以及其他与转让有关的特殊背景资料",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 8,
    label: "被评估单位下属机构的简况和框架图",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 9,
    label: "被评估单位的各类资质证书、采矿许可证、进出口许可证、专营权许可证",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 10,
    label: "被评估单位可行性研究报告、初步设计报告书",
    idx: _g5i++,
  },
  { type: "item", no: 11, label: "被评估单位总平面图", idx: _g5i++ },
  { type: "item", no: 12, label: "被评估单位生产工艺流程图", idx: _g5i++ },
  {
    type: "item",
    no: 13,
    label: "被评估资产中有关抵押、担保的合同、协议",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 14,
    label: "被评估资产中有关的融资、租赁凭证及合同",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 15,
    label:
      "被评估资产中已抵押、扣押、封存的车辆、机器设备、房屋、土地等相关资料",
    idx: _g5i++,
  },
  { type: "item", no: 16, label: "被评估单位保险合同", idx: _g5i++ },
  {
    type: "item",
    no: 17,
    label: "与被评估单位的经营产品、提供服务有关的新闻报道或荣誉证书",
    idx: _g5i++,
  },
  { type: "item", no: 18, label: "其他", idx: _g5i++ },
  { type: "section", label: "二、针对本次评估项目的具体资料" },
  {
    type: "item",
    no: 1,
    label:
      "与评估目的相对应的经济行为文件及上级批准文件；股东大会、董事会决议或合作协议等",
    idx: _g5i++,
  },
  { type: "item", no: 2, label: "董事会的决议和批准文件", idx: _g5i++ },
  { type: "item", no: 3, label: "资产重组方案、土地处置方案", idx: _g5i++ },
  {
    type: "item",
    no: 4,
    label: "关于进行资产评估有关事项的说明（具体内容详见样本）",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 5,
    label: "委托人及被评估单位的有关资产评估的承诺函",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 6,
    label: "被评估单位各类资产及负债的清查评估申报表",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 7,
    label:
      "委托人以外的其他评估报告使用者的说明，包括使用者名称及在本次经济行为中所处的地位",
    idx: _g5i++,
  },
  { type: "item", no: 8, label: "其他", idx: _g5i++ },
  { type: "section", label: "三、被评估单位财务资料" },
  {
    type: "item",
    no: 1,
    label:
      "目前所实行的主要财务、会计制度，尤其是固定资产的计价和折旧方法、无形资产和递延资产摊销政策、存货的计价方法",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 2,
    label:
      "目前所执行的税收政策，包括：资产方面的税收政策，如进口设备的关税、增值税等；损益方面的税收及费用政策：如销售环节及所得税环节的税种、税基等",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 3,
    label: "最近几个财政年度和评估基准日的财务报表、审计报告",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 4,
    label:
      "最近几个财政年度和评估基准日的销售费用、管理费用、财务费用明细表及各主要产品的生产成本和制造费用明细表",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 5,
    label: "已进行的清产核资、单项或整体资产评估报告及评估结果调账资料",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 6,
    label:
      "主要筹资渠道、筹资能力情况资料，近期短期和长期筹资的成本(利率)水平资料",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 7,
    label: "影响经营业绩的非经常项目的账务处理信息（如偶然的罚款、补贴收入等）",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 8,
    label:
      "有息负债方面资料（主要包括银行借款、应付债券、一年内到期的长期负债和长期负债）截止评估基准日的余额表，上述资金的主要使用情况介绍",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 9,
    label: "非经营性资产、负债，溢余资产与其相关的收入和支出的资料",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 10,
    label:
      "重要的会计政策及前几年变化资料，包括：存货的账务处理方式，折旧/摊销政策，存货变现损失及应收账款坏账准备计提政策，企业税收优惠政策说明及相应证明文件等",
    idx: _g5i++,
  },
  { type: "item", no: 11, label: "其他", idx: _g5i++ },
  { type: "section", label: "四、被评估单位主要产品的生产和销售资料" },
  {
    type: "item",
    no: 1,
    label:
      "主要产品介绍，包括主要产品的名称、用途、销售时所使用的商标、产品质量状况或性能等级；各主要产品历年的销售量、销售价格统计资料",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 2,
    label: "各主要产品目前在本身产品寿命周期中所处的位置及其发展趋势资料",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 3,
    label: "产品的价格是如何制定的、和哪些因素相关",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 4,
    label:
      "国内企业同类产品或替代产品的主要竞争厂家、各厂家历年的生产能力、销售量、销售价格、产品质量、性能和声誉比较；本企业该类产品历年的本地市场和国内市场占有率方面资料",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 5,
    label: "营销策略、销售网络、营销队伍素质和能力状况介绍资料",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 6,
    label: "主要产品的客户名单和各客户的销售额比例资料",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 7,
    label:
      "被评估单位近期所作的市场调查资料，包括市场容量及企业所占份额方面的资料",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 8,
    label:
      "主要产品历年的销售费用占销售收入比例的变化情况、同类产品行业的一般、正常水平(比例)",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 9,
    label:
      "主要产品历年广告费用、广告费用占销售收入比例的变化情况、同类产品行业的一般、正常水平(比例)",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 10,
    label: "主要产品所需原材料种类、历年的市场供给、需求状况",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 11,
    label:
      "主要生产设施，包括地点、规格和布局、功能、受到的限制、自有或租入的设施资料",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 12,
    label:
      "主要生产线的技术水平、维护状况、配套生产能力，有无增大配套生产能力的可能，如有，增产的瓶颈环节在哪里，解决瓶颈环节的技术改造投资为多少、时间为多长，如改造完成配套生产能力为多大",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 13,
    label:
      "技术开发能力、新产品研究和开发状况的描述及已开发的新产品前景分析资料",
    idx: _g5i++,
  },
  { type: "item", no: 14, label: "其他", idx: _g5i++ },
  { type: "section", label: "五、宏观经济形势的影响及行业竞争状况" },
  {
    type: "item",
    no: 1,
    label:
      "提供行业统计资料，包括：行业平均资金利税率、成本利润率、资产利润率、净资产利润率、基准收益率、企业主要产品行业平均销售利润率",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 2,
    label: "提供国家、地方及行业宏观经济发展情况介绍及相关经济数据分析资料",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 3,
    label:
      "提供政府对于该行业和地区发展的有关规定资料（包括行业发展政策、环保政策等）",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 4,
    label:
      "提供是否有可能影响公司业绩的政策限制资料（如：市场准入政策，特许经营政策、产品由国家或省、市政府定价等）",
    idx: _g5i++,
  },
  { type: "item", no: 5, label: "其他", idx: _g5i++ },
  { type: "section", label: "六、未来计划和预测资料" },
  {
    type: "item",
    no: 1,
    label:
      "评估基准日后几年主要产品国内市场总需求量、增长率的预测及影响市场总需求量、增长率变化资料",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 2,
    label:
      "评估基准日后几年主要产品国内市场总供给量(生产量)、增长率的预测及影响市场总供给量(生产量)、增长率变化的因素分析资料",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 3,
    label:
      "评估基准日后几年主要产品国内市场价格变化的预测及影响价格变化的因素分析资料",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 4,
    label:
      "评估基准日后几年企业主要产品所需原材料市场供求关系变化趋势、企业应付资源短缺的对策资料",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 5,
    label:
      "评估基准日后几年主要产品各年的销售量、销售价格、市场份额的预计，以及为实现这个目标所应采取的新增投资或技改计划等资料",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 6,
    label:
      "评估基准日后几年各财政年度的财务计划预测资料，包括资产负债表、损益表、利润分配表、财务状况变动表和现金流量表预测表",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 7,
    label:
      "提供在持续经营基础上对企业几年营运资金的合理预测指标，包括应收账款平均天数、应付账款平均天数、存货周转天数、预付费用及其他流动资产的合理比例、应付未付费用及其他流动负债的合理比例等",
    idx: _g5i++,
  },
  { type: "item", no: 8, label: "其他", idx: _g5i++ },
  { type: "section", label: "七、被评估单位提供的各单项资产评估所需资料" },
  { type: "subsection", label: "（一）流动资产及负债的资料清单" },
  {
    type: "item",
    no: 1,
    label: "评估基准日银行存款对账单及银行存款余额调节表",
    idx: _g5i++,
  },
  { type: "item", no: 2, label: "存款存单复印件", idx: _g5i++ },
  {
    type: "item",
    no: 3,
    label: "大额应收、应付票据复印件（注明利率）",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 4,
    label: "大额应收及预付、应付及预收购销合同复印件",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 5,
    label: "有关债权中的坏账（破产死亡）核销证明文件",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 6,
    label: "有关债权债务的询证函（询证函样本由本公司提供）",
    idx: _g5i++,
  },
  { type: "item", no: 7, label: "外购存货近期进货价格", idx: _g5i++ },
  {
    type: "item",
    no: 8,
    label: "存货盘点情况说明（盘盈、盘亏、报废要重点说明）",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 9,
    label: "产成品不含税单价、销售税金及附加税的税目、税率",
    idx: _g5i++,
  },
  { type: "item", no: 10, label: "委托加工的材料出库单", idx: _g5i++ },
  {
    type: "item",
    no: 11,
    label: "委托加工单位的加工利润、期间费用、成本核算说明",
    idx: _g5i++,
  },
  { type: "item", no: 12, label: "应收股利、利息合同复印件", idx: _g5i++ },
  { type: "item", no: 13, label: "应收补贴款证明文件", idx: _g5i++ },
  {
    type: "item",
    no: 14,
    label: "有价证券复印件及托管有价证券的证明文件",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 15,
    label: "企业长期、短期借款合同及付息情况说明",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 16,
    label: "短期、长期抵押、担保合同复印件",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 17,
    label: "主要购货发票、销货发票及相关转账凭单复印件",
    idx: _g5i++,
  },
  { type: "item", no: 18, label: "待处理流动资产净损失情况说明", idx: _g5i++ },
  { type: "item", no: 19, label: "部分有代表性的存货出、入库单", idx: _g5i++ },
  {
    type: "item",
    no: 20,
    label: "待摊费用、长期待摊费用的原始入账凭证",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 21,
    label: "评估基准日税金申报表及税单复印件",
    idx: _g5i++,
  },
  { type: "item", no: 22, label: "应付利润的相关文件复印件", idx: _g5i++ },
  { type: "item", no: 23, label: "预提费用的计提依据", idx: _g5i++ },
  { type: "item", no: 24, label: "产品生产量及销售报表复印件", idx: _g5i++ },
  { type: "item", no: 25, label: "有否诉讼、封存的流动资产事项", idx: _g5i++ },
  { type: "item", no: 26, label: "其他", idx: _g5i++ },
  { type: "subsection", label: "（二）长期投资的资料清单" },
  {
    type: "item",
    no: 1,
    label: "长期债券投资复印件及托管证明文件",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 2,
    label: "长期股票投资的股权证复印件及股权证明文件",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 3,
    label: "长期投资股票持股数量及变动情况表",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 4,
    label: "其他长期投资的合同、出资人协议复印件",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 5,
    label: "被投资单位的法人营业执照、公司章程、验资报告、长期投资原始凭证",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 6,
    label: "被投资单位评估基准日经审计后的财务报表",
    idx: _g5i++,
  },
  { type: "item", no: 7, label: "长期投资历年收益情况", idx: _g5i++ },
  {
    type: "item",
    no: 8,
    label: "控股的被投资单位整套评估所需资料及文件",
    idx: _g5i++,
  },
  { type: "item", no: 9, label: "其他", idx: _g5i++ },
  { type: "subsection", label: "（三）房屋建（构）筑物的资料清单" },
  {
    type: "item",
    no: 1,
    label: "房产的权属证明及能说明权属关系的证明材料原件及复印件",
    idx: _g5i++,
  },
  { type: "item", no: 2, label: "开工许可证、竣工验收证明", idx: _g5i++ },
  { type: "item", no: 3, label: "房屋购买合同协议及付款凭证", idx: _g5i++ },
  {
    type: "item",
    no: 4,
    label: "基本建设项目工程竣工决算书（审价资料）及工程验收报告",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 5,
    label: "主要房屋建（构）筑物的竣工决算书（审价资料）",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 6,
    label: "主要房屋建（构）筑物的概（预）算书",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 7,
    label: "当地现行的概（预）算指标或定额、取费文件",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 8,
    label: "当地现行的建筑材料价格、调价系数、调价文件",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 9,
    label: "目前当地工业与民用建筑物的市场交易价",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 10,
    label:
      "厂区室外管网图（包括：上下水、煤气、暖气、蒸汽、电缆、电线、通信等）",
    idx: _g5i++,
  },
  { type: "item", no: 11, label: "厂区道路图", idx: _g5i++ },
  {
    type: "item",
    no: 12,
    label:
      "房屋建（构）筑物的维修、改造情况的说明（包括：维修改造的次数、年月、投入的金额）",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 13,
    label: "租出或租入房屋的租赁合同及协议",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 14,
    label: "主要房屋建（构）筑物的图纸及技术资料",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 15,
    label: "主要房屋建（构）筑物的近期照片",
    idx: _g5i++,
  },
  { type: "item", no: 16, label: "待报废房屋的详细情况说明", idx: _g5i++ },
  { type: "item", no: 17, label: "周边房屋交易案例", idx: _g5i++ },
  { type: "item", no: 18, label: "工业场地总平面图", idx: _g5i++ },
  { type: "item", no: 19, label: "有腐蚀性建筑物情况说明", idx: _g5i++ },
  {
    type: "item",
    no: 20,
    label:
      "建筑物账面价值组成说明（原始购建价值、清产核资入账、前次评估后入账价）",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 21,
    label: "当地政府近期收取基础设施配套费的有关文件、规定",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 22,
    label: "当地建设工程前期费用的收取项目和收费标准",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 23,
    label: "权证或证明文件名称不符的，应要求企业权证单位出具有效证明",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 24,
    label: "提供是否诉讼、抵押、担保、封存的事宜",
    idx: _g5i++,
  },
  { type: "item", no: 25, label: "其他", idx: _g5i++ },
  { type: "subsection", label: "（四）机器设备及车辆的资料清单" },
  {
    type: "item",
    no: 1,
    label: "企业生产工艺流程图及相关技术文件说明",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 2,
    label: "企业设备情况说明（包括：使用情况、维修制度、执行情况等）",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 3,
    label: "企业设备检修、大修、技术改造等记录",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 4,
    label: "大型设备、进口设备技术资料、产品说明书等",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 5,
    label: "进口设备的合同、报关单、装箱单等",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 6,
    label: "大型设备、重要设备的购货发票或定货合同",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 7,
    label: "电梯、行车、压力容器、锅炉等设备的检验资料",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 8,
    label: "企业所在行业设备的安装定额、取费文件",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 9,
    label: "当地现行的设备安装指标或定额、取费文件",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 10,
    label: "当地现行的设备安装材料价格、调价系数",
    idx: _g5i++,
  },
  { type: "item", no: 11, label: "设备安装预（决）算资料", idx: _g5i++ },
  { type: "item", no: 12, label: "主要设备及进口设备的近期照片", idx: _g5i++ },
  { type: "item", no: 13, label: "车辆行驶证原件及复印件", idx: _g5i++ },
  { type: "item", no: 14, label: "设备、车辆的维护保养情况说明", idx: _g5i++ },
  {
    type: "item",
    no: 15,
    label: "设备及车辆的运行、检修、大修、事故记录",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 16,
    label: "待报废的机器设备、车辆的详细情况说明",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 17,
    label:
      "机器设备账面价值组成说明（原始购置价值、清产核资入账价值、前次评估入账价值）",
    idx: _g5i++,
  },
  { type: "item", no: 18, label: "租出、租入设备合同及协议", idx: _g5i++ },
  {
    type: "item",
    no: 19,
    label: "融资租赁设备的融资租赁合同、付款凭证等资料",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 20,
    label: "设备材料的单位材耗、单位能耗、单位煤耗统计表等经济技术指标报表",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 21,
    label: "提供是否诉讼、抵押、担保、封存的事宜",
    idx: _g5i++,
  },
  { type: "item", no: 22, label: "其他", idx: _g5i++ },
  { type: "subsection", label: "（五）在建工程资料清单" },
  {
    type: "item",
    no: 1,
    label:
      "单位在建工程管理体系（包括：项目审批立项，合同签订、执行、管理、决算等过程中管理部门的职权）说明",
    idx: _g5i++,
  },
  { type: "item", no: 2, label: "企业在建工程的项目情况说明", idx: _g5i++ },
  { type: "item", no: 3, label: "各项在建工程合同、中标通知书", idx: _g5i++ },
  { type: "item", no: 4, label: "各项在建工程的预算书或概算书", idx: _g5i++ },
  {
    type: "item",
    no: 5,
    label: "各项在建工程的工程进度表及付款进度",
    idx: _g5i++,
  },
  { type: "item", no: 6, label: "在建工程设备购置合同及付款凭证", idx: _g5i++ },
  { type: "item", no: 7, label: "有关工程实际费用支出凭证", idx: _g5i++ },
  {
    type: "item",
    no: 8,
    label:
      "在建工程的建设用地规划许可证、建设工程规划许可证、施工许可证、土地使用批复或建设工程批准文件",
    idx: _g5i++,
  },
  { type: "item", no: 9, label: "在建工程项目的施工图", idx: _g5i++ },
  {
    type: "item",
    no: 10,
    label: "在建工程可行性研究报告、立项批准文件",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 11,
    label: "土建工程、设备安装工程及技术服务合同",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 12,
    label: "工程物资采购合同或工程物资调拨单",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 13,
    label:
      "说明已使用但未办理竣工决算、由于某种原因已停工的在建工程项目的具体情况",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 14,
    label: "提供是否诉讼、抵押、担保、封存的事宜",
    idx: _g5i++,
  },
  { type: "item", no: 15, label: "其他", idx: _g5i++ },
  { type: "subsection", label: "（六）土地使用权的资料清单" },
  {
    type: "item",
    no: 1,
    label: "国有土地使用权证书、建设用地规划许可证复印件",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 2,
    label: "国有土地使用权出转（让）合同、协议复印件",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 3,
    label: "政府有关部门关于土地使用情况的批文",
    idx: _g5i++,
  },
  { type: "item", no: 4, label: "土地使用权获取费用的支付凭证", idx: _g5i++ },
  {
    type: "item",
    no: 5,
    label: "土地使用权获取的途径、方式、过程等背景资料",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 6,
    label: "土地位置图（在城市行政区划图中标出）",
    idx: _g5i++,
  },
  { type: "item", no: 7, label: "用地红线图", idx: _g5i++ },
  { type: "item", no: 8, label: "土地开发规划说明及规划图", idx: _g5i++ },
  {
    type: "item",
    no: 9,
    label: "土地规划用途、建筑面积、容积率、绿化标准及规划部门的批文",
    idx: _g5i++,
  },
  { type: "item", no: 10, label: "总平面布置图", idx: _g5i++ },
  { type: "item", no: 11, label: "工程地质状况资料", idx: _g5i++ },
  {
    type: "item",
    no: 12,
    label: "地貌状况资料（形状、坡度、障碍物等）",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 13,
    label: "自然环境状况资料（生态、景观等）",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 14,
    label: "地上建筑物情况资料（权属、数量、面积、结构、高度、建设年代等）",
    idx: _g5i++,
  },
  { type: "item", no: 15, label: "其他地上附着物情况资料", idx: _g5i++ },
  {
    type: "item",
    no: 16,
    label:
      "基础设施开发程度资料，即七通一平情况（包括：道路、电信、自来水、污水、煤气、热力）及其所花费用",
    idx: _g5i++,
  },
  { type: "item", no: 17, label: "商业服务设施配套情况说明", idx: _g5i++ },
  {
    type: "item",
    no: 18,
    label: "地产所在地区土地级别（基准地价文件及级别划分图）",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 19,
    label: "近年是否有土地取得时所支付的征地、拆迁及安置费",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 20,
    label:
      "地产周边土地出（转）让、出租案例（时间、位置、使用、性质、容积率、建筑密度、价格等）",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 21,
    label: "当地政府近期对基础设施建设配套费的有关规定",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 22,
    label: "当地土地主管部门的地价资料（土地基准地价及有关说明和解释）",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 23,
    label: "城市行政区划图、城市交通图（或旅游交通图）",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 24,
    label: "当地典型地价水平（最高、最低、均价）",
    idx: _g5i++,
  },
  { type: "item", no: 25, label: "地区宏观发展规划", idx: _g5i++ },
  { type: "item", no: 26, label: "城市建筑规划管理控制指标", idx: _g5i++ },
  {
    type: "item",
    no: 27,
    label:
      "地产所在地概况（包括：经济发展水平、基础设施、交通条件、人口规模、旅游资源、投资环境等）",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 28,
    label: "近期周边土地出让、转让交易实例",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 29,
    label: "提供是否诉讼、抵押、担保、封存的土地事宜",
    idx: _g5i++,
  },
  { type: "item", no: 30, label: "其他", idx: _g5i++ },
  { type: "subsection", label: "（七）专利权及专有技术资料清单" },
  {
    type: "item",
    no: 1,
    label: "专利权证书、专利权利要求及说明书、最近交费证明",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 2,
    label: "专有技术、申请专利权的相关文件资料",
    idx: _g5i++,
  },
  { type: "item", no: 3, label: "购买、转让专利权或合同复印件", idx: _g5i++ },
  {
    type: "item",
    no: 4,
    label:
      "专利权或专有技术的详细介绍（包括：技术来源、技术开发的起因、时间、解决的主要技术问题；主要的应用范围、所达到的技术经济指标，国内国际同类型技术的比较分析、该技术所处国内国际的水平分析）",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 5,
    label: "专利技术研制报告及项目可行性研究报告",
    idx: _g5i++,
  },
  { type: "item", no: 6, label: "有关政府批文、有关合同文件", idx: _g5i++ },
  { type: "item", no: 7, label: "专利技术的说明书、使用方式", idx: _g5i++ },
  {
    type: "item",
    no: 8,
    label: "企业近几年的收益状况（财务报表）、市场占有率统计、销售网络的分布图",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 9,
    label:
      "专有技术的实质内容是否可通过其产品轻易取得、该专有技术可被模仿的难易程度、转移性、是否会被新的专有技术替代",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 10,
    label:
      "企业获取该专利或专有技术的耗费明细，自研技术包括投入时间、人力（工作日及人员技术结构）、资金、物质材料的数量及价值等方面的凭证和情况介绍",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 11,
    label:
      "国内外市场分析与预测：企业面临市场竞争的形势（有利因素、不利因素）、未来竞争的格局、能占有市场的份额及开发的潜力",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 12,
    label:
      "国内外同行业的投资收益率、平均成本、利润率、销售税金、销售成本、销售费用、财务费用、销售收入占企业收入的比例、折旧占销售成本的比例",
    idx: _g5i++,
  },
  { type: "item", no: 13, label: "企业发展受相关行业的影响", idx: _g5i++ },
  {
    type: "item",
    no: 14,
    label: "企业今后五年的新增投资计划、各年固定资产净追加",
    idx: _g5i++,
  },
  { type: "item", no: 15, label: "企业的销售推销计划", idx: _g5i++ },
  {
    type: "item",
    no: 16,
    label: "企业的长期经营策略和远期战略部署",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 17,
    label: "企业未来五至十年发展的可行性研究报告",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 18,
    label: "是否得到政府的支持、享受何优惠政策",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 19,
    label: "掌握专有技术关键人员的劳动合同、专家网名单",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 20,
    label: "有关专家对该专利技术、专有技术自然寿命的评价",
    idx: _g5i++,
  },
  { type: "item", no: 21, label: "其他", idx: _g5i++ },
  { type: "subsection", label: "（八）其他无形资产资料清单" },
  { type: "subsubsection", label: "商标" },
  { type: "item", no: 1, label: "商标注册证书复印件", idx: _g5i++ },
  { type: "item", no: 2, label: "商标样式复印件", idx: _g5i++ },
  { type: "item", no: 3, label: "转让注册商标相关文件的复印件", idx: _g5i++ },
  { type: "item", no: 4, label: "商标的使用情况、使用方式的说明", idx: _g5i++ },
  {
    type: "item",
    no: 5,
    label:
      "使用商标产品的生产投资规模、成本费用、销售收入历史数据及未来预测数据",
    idx: _g5i++,
  },
  { type: "item", no: 6, label: "其他", idx: _g5i++ },
  { type: "subsubsection", label: "计算机软件" },
  { type: "item", no: 1, label: "软件登记证书复印件", idx: _g5i++ },
  { type: "item", no: 2, label: "软件研制开发报告复印件", idx: _g5i++ },
  { type: "item", no: 3, label: "软件研制开发人员状况", idx: _g5i++ },
  { type: "item", no: 4, label: "软件使用情况的说明", idx: _g5i++ },
  {
    type: "item",
    no: 5,
    label: "软件产品的生产成本费用、销售收入历史数据及未来预测数据",
    idx: _g5i++,
  },
  { type: "item", no: 6, label: "其他", idx: _g5i++ },
  { type: "subsubsection", label: "专营权类无形资产" },
  {
    type: "item",
    no: 1,
    label: "如为专营权，请提供专营权证书（申请文件及批准证书）",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 2,
    label: "为获得此项权利所投入的成本费用详细资料（包括专营开发、注册等费用）",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 3,
    label:
      "说明此专营权的产品经营范围、专营权的地域范围（全国总代理、省级总代理）、专营权限、经营方式、利润分成情况",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 4,
    label:
      "利用此项经营权销售的产品的规格、型号、售价、产品规模、投资及成本费用（主要原材料、燃料、辅助材料单耗和价格、材料费、人工费和制造费用测算、管理费、财务费和销售费用）",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 5,
    label: "企业采用此项专营权后的收益费用的详细资料",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 6,
    label:
      "专营权产品的市场反馈、市场占有率情况；应用该专营权的产品市场需求总量，与该产品有竞争力的同类产品和可替代产品的市场需求量",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 7,
    label: "未来几年采用专营权的收益费用情况预测",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 8,
    label: "相关的税法及法律性文件（同类企业经营的有关税费及其财经政策）",
    idx: _g5i++,
  },
  {
    type: "item",
    no: 9,
    label:
      "该专营权有无转让及许可使用的情况，若有转让，说明转让方式、已转让次数、已转让地区及技术研制成本、直接成本与追加成本和有无其他附带条件等",
    idx: _g5i++,
  },
  { type: "item", no: 10, label: "其他", idx: _g5i++ },
];

const savingG5 = ref(false);
const g5Items = reactive(
  Array.from({ length: _g5i }, () => ({
    needDate: "",
    providedDate: "",
    signer: "",
    remark: "",
  })),
);

async function loadG5() {
  try {
    const { data } = await scratchApi.getG5(route.params.id, "pre-work");
    if (!data?.items) return;
    const saved = JSON.parse(data.items);
    saved.forEach((item, i) => {
      if (g5Items[i]) Object.assign(g5Items[i], item);
    });
  } catch {}
}

async function saveG5() {
  savingG5.value = true;
  try {
    await scratchApi.saveG5(route.params.id, "pre-work", {
      items: JSON.stringify(g5Items),
    });
    ElMessage.success("G-5 已保存");
  } catch {
    ElMessage.error("G-5 保存失败");
  } finally {
    savingG5.value = false;
  }
}

async function loadStageData() {
  // load form data
  const { data } = await stagesApi.get(route.params.id, "pre-work");
  if (data) {
    form.contractNo = data.contractNo || "";
    form.clientName = data.clientName || "";
    form.signDate = data.signDate || "";
    form.amount = data.amount || 0;
    form.planStart = data.planStart || "";
    form.planEnd = data.planEnd || "";
    form.members = Array.isArray(data.members) ? data.members : [];
    erpStatus.value = Array.isArray(data.erpStatus) ? data.erpStatus : [];
  }
  // load existing files into upload lists
  const { data: docs } = await documentApi.list(route.params.id, "pre-work");
  for (const key of Object.keys(attachments)) attachments[key] = [];
  for (const doc of docs) {
    if (attachments[doc.category] !== undefined) {
      attachments[doc.category].push({
        uid: doc.id,
        name: doc.name,
        size: doc.size,
        status: "success",
        _docId: doc.id,
      });
    }
  }
  // restore approval flow from saved nodes — fetch directly, not from store cache
  const nodes = await projectStore.fetchStageApprovals(
    route.params.id,
    "pre-work",
  );
  if (nodes?.length) {
    approvalFlow.value = nodes.map((n) => ({
      role: n.role,
      approvers: n.approvers.map((a) => ({
        name: a.name,
        username: a.username,
      })),
    }));
  }
}

onMounted(async () => {
  await loadStageData();
  await Promise.all([loadG4(), loadG5()]);
});

function markForDelete(file) {
  if (file._docId) pendingDeletes.value.push(file._docId);
}

async function handleApprove(payload) {
  await projectStore.approveStage(route.params.id, "pre-work", payload);
  ElMessage.success(payload.action === "approved" ? "已审批通过" : "已驳回");
}

function downloadFile(file) {
  if (!file.storedName) return ElMessage.warning("该文件暂无下载");
  const a = document.createElement("a");
  a.href = documentApi.fileUrl(file.storedName);
  a.download = file.name;
  a.click();
}

async function savePreWork() {
  const flowError = flowConfigRef.value?.validate();
  if (flowError) {
    ElMessage.warning(flowError);
    return;
  }
  saving.value = true;
  try {
    await projectStore.savePreWorkInfo(route.params.id, {
      form: {
        ...form,
        members: [...form.members],
        erpStatus: [...erpStatus.value],
      },
      approvalFlow: approvalFlow.value,
    });

    // delete removed files
    if (pendingDeletes.value.length) {
      await Promise.all(
        pendingDeletes.value.map((id) => documentApi.remove(id)),
      );
      pendingDeletes.value = [];
    }
    // upload new files
    const uploads = [];
    for (const doc of scratchDocTypes) {
      for (const item of attachments[doc.key]) {
        if (item.raw)
          uploads.push(
            documentApi.upload(route.params.id, item.raw, "pre-work", doc.key),
          );
      }
    }
    if (uploads.length) await Promise.all(uploads);

    await loadStageData();
    ElMessage.success("前期工作已保存，审批请求已发送");
  } catch (e) {
    const msg = e?.response?.data?.message || e?.message || "请重试";
    ElMessage.error("保存失败：" + msg);
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.scratch-docs {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.scratch-doc-item {
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.scratch-doc-item:last-child {
  border-bottom: none;
}

.scratch-doc-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 8px;
}

.erp-status-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ── Form table (shared with Overview) ── */
.scratch-tabs-card {
  padding: 0;
}
:deep(.scratch-tabs-card > .el-card__body) {
  padding: 0;
}
:deep(.scratch-tabs.el-tabs--border-card > .el-tabs__header) {
  background: #f7f8fa;
}
:deep(.scratch-tabs.el-tabs--border-card > .el-tabs__content) {
  padding: 0;
}

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
.section-header {
  background: #dce6f0;
  text-align: left;
  font-weight: 600;
  font-size: 12px;
  border: 1px solid #bcc8d4;
  padding: 5px 8px;
  letter-spacing: 1px;
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
.scratch-save-row {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}
</style>
