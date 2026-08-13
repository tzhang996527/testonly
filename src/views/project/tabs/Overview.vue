<template>
  <div class="overview-tab">
    <el-row :gutter="20">
      <el-col :span="14">
        <el-card shadow="never">
          <template #header>
            <div
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;
              "
            >
              <span>基本信息</span>
              <div v-if="isDraft">
                <template v-if="!editing">
                  <PermGuard
                    :perm="PERM.PROJECT_EDIT"
                    mode="disable"
                    disabled-tip="无编辑权限"
                  >
                    <template #default="{ disabled }">
                      <el-button
                        size="small"
                        type="primary"
                        :icon="Edit"
                        :disabled="disabled"
                        @click="startEdit"
                        >编辑</el-button
                      >
                    </template>
                  </PermGuard>
                </template>
                <template v-else>
                  <PermGuard
                    :perm="PERM.PROJECT_SUBMIT"
                    mode="disable"
                    disabled-tip="无提交审批权限"
                  >
                    <template #default="{ disabled }">
                      <el-button
                        size="small"
                        :loading="saving"
                        type="primary"
                        :disabled="disabled"
                        @click="saveEdit"
                        >保存</el-button
                      >
                    </template>
                  </PermGuard>
                  <el-button size="small" @click="cancelEdit">取消</el-button>
                </template>
              </div>
            </div>
          </template>

          <!-- view mode -->
          <el-descriptions v-if="!editing" :column="2" border>
            <el-descriptions-item :label="t('project.projectNo')">{{
              project?.projectNo
            }}</el-descriptions-item>
            <el-descriptions-item :label="t('project.purpose')">{{
              project?.purpose
            }}</el-descriptions-item>
            <el-descriptions-item :label="t('project.baseDate')">{{
              project?.baseDate
            }}</el-descriptions-item>
            <el-descriptions-item :label="t('project.assetCategory')">
              {{
                project
                  ? t(`project.assetCategories.${project.assetCategory}`)
                  : ""
              }}
            </el-descriptions-item>
            <el-descriptions-item :label="t('project.responsible')">{{
              project?.responsible
            }}</el-descriptions-item>
            <el-descriptions-item :label="t('project.department')">{{
              project?.department
            }}</el-descriptions-item>
            <el-descriptions-item :label="t('common.status')">
              <StatusTag :status="project?.status" />
            </el-descriptions-item>
            <el-descriptions-item :label="t('common.createdAt')">{{
              project?.createdAt
            }}</el-descriptions-item>
            <el-descriptions-item :label="t('common.remark')" :span="2">{{
              project?.remark
            }}</el-descriptions-item>
            <el-descriptions-item label="预算工时">
              {{
                project?.budgetHours ? project.budgetHours + " 小时" : "未设置"
              }}
            </el-descriptions-item>
            <el-descriptions-item label="实际用时">
              {{ project?.actualHours ? project.actualHours + " 小时" : "—" }}
            </el-descriptions-item>
          </el-descriptions>

          <!-- edit mode -->
          <el-form v-else :model="editForm" label-width="110px">
            <el-form-item :label="t('project.purpose')">
              <el-select
                v-model="editForm.purpose"
                filterable
                allow-create
                placeholder="请选择或输入评估目的"
              >
                <el-option
                  v-for="opt in purposeOptions"
                  :key="opt.id"
                  :label="opt.name"
                  :value="opt.name"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="t('project.baseDate')">
              <el-date-picker
                v-model="editForm.baseDate"
                type="date"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
            <el-form-item :label="t('project.assetCategory')">
              <el-select v-model="editForm.assetCategory">
                <el-option
                  :label="t('project.assetCategories.fixed')"
                  value="fixed"
                />
                <el-option
                  :label="t('project.assetCategories.intangible')"
                  value="intangible"
                />
                <el-option
                  :label="t('project.assetCategories.inventory')"
                  value="inventory"
                />
                <el-option
                  :label="t('project.assetCategories.whole')"
                  value="whole"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="t('project.responsible')">
              <el-select v-model="editForm.responsible">
                <el-option label="张伟" value="张伟" />
                <el-option label="李娜" value="李娜" />
                <el-option label="王磊" value="王磊" />
                <el-option label="赵敏" value="赵敏" />
              </el-select>
            </el-form-item>
            <el-form-item :label="t('project.department')">
              <el-input v-model="editForm.department" />
            </el-form-item>
            <el-form-item :label="t('common.remark')">
              <el-input v-model="editForm.remark" type="textarea" :rows="3" />
            </el-form-item>
            <el-form-item label="预算工时">
              <el-input-number
                v-model="editForm.budgetHours"
                :min="0"
                :step="4"
                style="width: 160px"
              />
              <span style="margin-left: 8px; color: #9ca3af; font-size: 13px"
                >小时</span
              >
            </el-form-item>
          </el-form>
        </el-card>

        <el-card
          shadow="never"
          class="scratch-tabs-card"
          style="margin-top: 16px"
        >
          <el-tabs type="border-card" class="scratch-tabs" model-value="g1">
            <!-- G-1 评估业务基本事项调查表 -->
            <el-tab-pane label="G-1 基本事项调查表" name="g1">
              <div class="form-sheet">
                <table class="form-table">
                  <colgroup>
                    <col style="width: 120px" />
                    <col style="width: 80px" />
                    <col />
                    <col style="width: 80px" />
                    <col />
                    <col style="width: 50px" />
                    <col style="width: 100px" />
                  </colgroup>
                  <tbody>
                    <!-- 项目名称 -->
                    <tr>
                      <td class="label-cell" colspan="2">项目名称</td>
                      <td colspan="5">
                        <input
                          v-model="g1.projectName"
                          class="cell-input"
                          :disabled="!editing"
                        />
                      </td>
                    </tr>
                    <!-- 委托人 / 联系人 / 电话 -->
                    <tr>
                      <td class="label-cell" colspan="2">委托人</td>
                      <td>
                        <input
                          v-model="g1.client"
                          class="cell-input"
                          :disabled="!editing"
                        />
                      </td>
                      <td class="label-cell">联系人</td>
                      <td>
                        <input
                          v-model="g1.clientContact"
                          class="cell-input"
                          :disabled="!editing"
                        />
                      </td>
                      <td class="label-cell">电话</td>
                      <td>
                        <input
                          v-model="g1.clientPhone"
                          class="cell-input"
                          :disabled="!editing"
                        />
                      </td>
                    </tr>
                    <!-- 被评估单位：名称 + 地址 -->
                    <tr>
                      <td class="label-cell" rowspan="4">被评估单位</td>
                      <td class="label-cell">名称</td>
                      <td>
                        <input
                          v-model="g1.unitName"
                          class="cell-input"
                          :disabled="!editing"
                        />
                      </td>
                      <td class="label-cell">地址</td>
                      <td colspan="3">
                        <input
                          v-model="g1.unitAddress"
                          class="cell-input"
                          :disabled="!editing"
                        />
                      </td>
                    </tr>
                    <!-- 被评估单位：法定代表人 + 企业性质 -->
                    <tr>
                      <td class="label-cell">法定代表人</td>
                      <td>
                        <input
                          v-model="g1.legalRep"
                          class="cell-input"
                          :disabled="!editing"
                        />
                      </td>
                      <td class="label-cell">企业性质</td>
                      <td colspan="3">
                        <input
                          v-model="g1.enterpriseType"
                          class="cell-input"
                          :disabled="!editing"
                        />
                      </td>
                    </tr>
                    <!-- 被评估单位：注册资金 + 联系人 + 电话 -->
                    <tr>
                      <td class="label-cell">注册资金</td>
                      <td>
                        <input
                          v-model="g1.registeredCapital"
                          class="cell-input"
                          :disabled="!editing"
                        />
                      </td>
                      <td class="label-cell">联系人</td>
                      <td>
                        <input
                          v-model="g1.unitContact"
                          class="cell-input"
                          :disabled="!editing"
                        />
                      </td>
                      <td class="label-cell">电话</td>
                      <td>
                        <input
                          v-model="g1.unitPhone"
                          class="cell-input"
                          :disabled="!editing"
                        />
                      </td>
                    </tr>
                    <!-- 被评估单位：经营范围 -->
                    <tr>
                      <td class="label-cell">经营范围</td>
                      <td colspan="5">
                        <textarea
                          v-model="g1.businessScope"
                          class="cell-textarea"
                          rows="2"
                          :disabled="!editing"
                        />
                      </td>
                    </tr>
                    <!-- 其他报告使用人 -->
                    <tr>
                      <td class="label-cell" colspan="2">其他报告使用人</td>
                      <td colspan="5">
                        <input
                          v-model="g1.otherReportUsers"
                          class="cell-input"
                          :disabled="!editing"
                        />
                      </td>
                    </tr>
                    <!-- 委托人、被评估单位、其他报告使用人的关系 -->
                    <tr>
                      <td class="label-cell" colspan="2">
                        委托人、被评估单位、其他报告使用人的关系
                      </td>
                      <td colspan="5">
                        <textarea
                          v-model="g1.relationship"
                          class="cell-textarea"
                          rows="2"
                          :disabled="!editing"
                        />
                      </td>
                    </tr>
                    <!-- 项目涉及的经济行为的审批情况 -->
                    <tr>
                      <td class="label-cell" colspan="2">
                        项目涉及的经济行为的审批情况
                      </td>
                      <td colspan="5">
                        <input
                          v-model="g1.approvalStatus"
                          class="cell-input"
                          :disabled="!editing"
                        />
                      </td>
                    </tr>
                    <!-- 委托人及相关当事人工作配合和协助等需要明确的重要事项 -->
                    <tr>
                      <td class="label-cell" colspan="2">
                        委托人及相关当事人工作配合和协助等需要明确的重要事项
                      </td>
                      <td colspan="5">
                        <textarea
                          v-model="g1.importantMatters"
                          class="cell-textarea"
                          rows="2"
                          :disabled="!editing"
                        />
                      </td>
                    </tr>
                    <!-- 评估目的 -->
                    <tr>
                      <td class="label-cell" colspan="2">评估目的</td>
                      <td colspan="5">
                        <input
                          v-model="g1.assessmentPurpose"
                          class="cell-input"
                          :disabled="!editing"
                        />
                      </td>
                    </tr>
                    <!-- 评估对象和评估范围 -->
                    <tr>
                      <td class="label-cell" colspan="2">评估对象和评估范围</td>
                      <td colspan="5">
                        <textarea
                          v-model="g1.assessmentScope"
                          class="cell-textarea"
                          rows="2"
                          :disabled="!editing"
                        />
                      </td>
                    </tr>
                    <!-- 主要资产状况 -->
                    <tr>
                      <td class="label-cell" colspan="2">主要资产状况</td>
                      <td colspan="5">
                        <input
                          v-model="g1.assetStatus"
                          class="cell-input"
                          :disabled="!editing"
                        />
                      </td>
                    </tr>
                    <!-- 价值类型 + 评估基准日 -->
                    <tr>
                      <td class="label-cell" colspan="2">价值类型</td>
                      <td>
                        <input
                          v-model="g1.valueType"
                          class="cell-input"
                          :disabled="!editing"
                        />
                      </td>
                      <td class="label-cell">评估基准日</td>
                      <td colspan="3">
                        <input
                          v-model="g1.baseDate"
                          type="date"
                          class="cell-input"
                          :disabled="!editing"
                        />
                      </td>
                    </tr>
                    <!-- 评估假设和限制条件 -->
                    <tr>
                      <td class="label-cell" colspan="2">评估假设和限制条件</td>
                      <td colspan="5">
                        <textarea
                          v-model="g1.assumptions"
                          class="cell-textarea"
                          rows="2"
                          :disabled="!editing"
                        />
                      </td>
                    </tr>
                    <!-- 评估报告的使用范围、提交时间和方式 -->
                    <tr>
                      <td class="label-cell" colspan="2">
                        评估报告的使用范围、提交时间和方式
                      </td>
                      <td colspan="5">
                        <input
                          v-model="g1.reportUsage"
                          class="cell-input"
                          placeholder="详见资产评估委托合同"
                          :disabled="!editing"
                        />
                      </td>
                    </tr>
                    <!-- 评估服务费总额、支付时间和方式 -->
                    <tr>
                      <td class="label-cell" colspan="2">
                        评估服务费总额、支付时间和方式
                      </td>
                      <td></td>
                      <td>
                        <input
                          v-model="g1.serviceFee"
                          type="number"
                          class="cell-input"
                          placeholder="0"
                          :disabled="!editing"
                        />
                      </td>
                      <td class="label-cell">万元</td>
                      <td colspan="2"></td>
                    </tr>
                    <!-- 洽谈人 + 审批人 + 日期 -->
                    <tr>
                      <td class="label-cell" colspan="2">洽谈人：</td>
                      <td>
                        <input
                          v-model="g1.negotiator"
                          class="cell-input"
                          :disabled="!editing"
                        />
                      </td>
                      <td class="label-cell">审批人：</td>
                      <td>
                        <input
                          v-model="g1.approver"
                          class="cell-input"
                          :disabled="!editing"
                        />
                      </td>
                      <td class="label-cell">日期：</td>
                      <td>
                        <input
                          v-model="g1.approveDate"
                          type="date"
                          class="cell-input"
                          :disabled="!editing"
                        />
                      </td>
                    </tr>
                    <!-- 填表人 -->
                    <tr>
                      <td class="label-cell" colspan="2">填表人：</td>
                      <td colspan="5">
                        <input
                          v-model="g1.formFiller"
                          class="cell-input"
                          :disabled="!editing"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div v-if="editing" class="scratch-save-row">
                  <el-button
                    size="small"
                    type="primary"
                    :loading="savingG1"
                    @click="saveG1"
                    >保存 G-1</el-button
                  >
                </div>
              </div>
            </el-tab-pane>

            <!-- G-2 评估项目综合评价表 -->
            <el-tab-pane label="G-2 综合评价表" name="g2">
              <div class="form-sheet">
                <table class="form-table">
                  <colgroup>
                    <col style="width: 36px" />
                    <col />
                    <col style="width: 160px" />
                  </colgroup>
                  <tbody>
                    <tr>
                      <td colspan="3" class="section-header">
                        一、对委托人综合评价
                      </td>
                    </tr>
                    <tr v-for="(item, i) in g2.section1" :key="'s1-' + i">
                      <td class="label-cell" style="text-align: center">
                        {{ i + 1 }}
                      </td>
                      <td class="label-cell-q">{{ item.q }}</td>
                      <td>
                        <input
                          v-model="item.a"
                          class="cell-input"
                          :disabled="!editing"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td colspan="3" class="section-header">
                        二、对被评估单位综合评价
                      </td>
                    </tr>
                    <tr v-for="(item, i) in g2.section2" :key="'s2-' + i">
                      <td class="label-cell" style="text-align: center">
                        {{ i + 1 }}
                      </td>
                      <td class="label-cell-q">{{ item.q }}</td>
                      <td>
                        <input
                          v-model="item.a"
                          class="cell-input"
                          :disabled="!editing"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td colspan="3" class="section-header">
                        三、对评估对象的综合评价
                      </td>
                    </tr>
                    <tr v-for="(item, i) in g2.section3" :key="'s3-' + i">
                      <td class="label-cell" style="text-align: center">
                        {{ i + 1 }}
                      </td>
                      <td class="label-cell-q">{{ item.q }}</td>
                      <td>
                        <input
                          v-model="item.a"
                          class="cell-input"
                          :disabled="!editing"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td colspan="3" class="section-header">
                        四、对本机构及评估人员的综合评价
                      </td>
                    </tr>
                    <tr v-for="(item, i) in g2.section4" :key="'s4-' + i">
                      <td class="label-cell" style="text-align: center">
                        {{ i + 1 }}
                      </td>
                      <td class="label-cell-q">{{ item.q }}</td>
                      <td>
                        <input
                          v-model="item.a"
                          class="cell-input"
                          :disabled="!editing"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td colspan="3" class="section-header">
                        五、评估报告使用对项目风险的影响
                      </td>
                    </tr>
                    <tr v-for="(item, i) in g2.section5" :key="'s5-' + i">
                      <td class="label-cell" style="text-align: center">
                        {{ i + 1 }}
                      </td>
                      <td class="label-cell-q">{{ item.q }}</td>
                      <td>
                        <input
                          v-model="item.a"
                          class="cell-input"
                          :disabled="!editing"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td
                        colspan="3"
                        class="label-cell"
                        style="text-align: left; padding: 6px 8px"
                      >
                        结论：风险水平
                        <template v-if="editing">
                          <el-radio-group
                            v-model="g2.riskLevel"
                            size="small"
                            style="margin-left: 8px"
                          >
                            <el-radio-button label="很低" value="很低" />
                            <el-radio-button label="低" value="低" />
                            <el-radio-button label="一般" value="一般" />
                            <el-radio-button label="较高" value="较高" />
                            <el-radio-button label="很高" value="很高" />
                          </el-radio-group>
                        </template>
                        <template v-else>
                          <strong style="margin-left: 8px">{{
                            g2.riskLevel
                          }}</strong>
                        </template>
                      </td>
                    </tr>
                    <tr>
                      <td class="label-cell">主要风险及措施</td>
                      <td colspan="2">
                        <textarea
                          v-model="g2.riskDesc"
                          class="cell-textarea"
                          rows="3"
                          :disabled="!editing"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td class="label-cell">是否接受委托</td>
                      <td colspan="2">
                        <template v-if="editing">
                          <el-radio-group v-model="g2.accepted" size="small">
                            <el-radio :value="1">是</el-radio>
                            <el-radio :value="0">否</el-radio>
                          </el-radio-group>
                        </template>
                        <template v-else>{{
                          g2.accepted ? "是" : "否"
                        }}</template>
                      </td>
                    </tr>
                    <tr>
                      <td class="label-cell">洽谈人</td>
                      <td>
                        <input
                          v-model="g2.negotiator"
                          class="cell-input"
                          :disabled="!editing"
                        />
                      </td>
                      <td>
                        <input
                          v-model="g2.negotiateDate"
                          type="date"
                          class="cell-input"
                          :disabled="!editing"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td class="label-cell">负责人评价及批示</td>
                      <td colspan="2">
                        <textarea
                          v-model="g2.supervisorNote"
                          class="cell-textarea"
                          rows="3"
                          :disabled="!editing"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td class="label-cell">负责人签字日期</td>
                      <td colspan="2">
                        <input
                          v-model="g2.supervisorDate"
                          type="date"
                          class="cell-input"
                          :disabled="!editing"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div v-if="editing" class="scratch-save-row">
                  <el-button
                    size="small"
                    type="primary"
                    :loading="savingG2"
                    @click="saveG2"
                    >保存 G-2</el-button
                  >
                </div>
              </div>
            </el-tab-pane>

            <!-- G-28 项目组成员独立性调查问卷 -->
            <el-tab-pane label="G-28 独立性调查问卷" name="g28">
              <div class="form-sheet">
                <table class="form-table" style="margin-bottom: 8px">
                  <colgroup>
                    <col style="width: 80px" />
                    <col style="width: 200px" />
                    <col style="width: 80px" />
                    <col />
                  </colgroup>
                  <tbody>
                    <tr>
                      <td class="label-cell">资产评估专业人员</td>
                      <td>
                        <input
                          v-model="g28.memberName"
                          class="cell-input"
                          placeholder="签名人姓名"
                          :disabled="!editing"
                        />
                      </td>
                      <td class="label-cell">签名日期</td>
                      <td>
                        <input
                          v-model="g28.signDate"
                          type="date"
                          class="cell-input"
                          :disabled="!editing"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table class="form-table">
                  <colgroup>
                    <col style="width: 36px" />
                    <col />
                    <col style="width: 52px" />
                    <col style="width: 52px" />
                    <col style="width: 62px" />
                  </colgroup>
                  <thead>
                    <tr>
                      <th class="label-cell" style="text-align: center">
                        序号
                      </th>
                      <th class="label-cell">调查项目</th>
                      <th class="label-cell" style="text-align: center">是</th>
                      <th class="label-cell" style="text-align: center">否</th>
                      <th class="label-cell" style="text-align: center">
                        不适用
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(q, qi) in G28_QUESTIONS" :key="qi">
                      <td class="label-cell" style="text-align: center">
                        {{ qi + 1 }}
                      </td>
                      <td
                        style="
                          padding: 4px 8px;
                          font-size: 12px;
                          border: 1px solid #bcc8d4;
                        "
                      >
                        {{ q }}
                      </td>
                      <td style="text-align: center; border: 1px solid #bcc8d4">
                        <input
                          type="radio"
                          :name="`g28-${qi}`"
                          value="yes"
                          :checked="g28.answers[qi] === 'yes'"
                          :disabled="!editing"
                          @change="g28.answers[qi] = 'yes'"
                        />
                      </td>
                      <td style="text-align: center; border: 1px solid #bcc8d4">
                        <input
                          type="radio"
                          :name="`g28-${qi}`"
                          value="no"
                          :checked="g28.answers[qi] === 'no'"
                          :disabled="!editing"
                          @change="g28.answers[qi] = 'no'"
                        />
                      </td>
                      <td style="text-align: center; border: 1px solid #bcc8d4">
                        <input
                          type="radio"
                          :name="`g28-${qi}`"
                          value="na"
                          :checked="g28.answers[qi] === 'na'"
                          :disabled="!editing"
                          @change="g28.answers[qi] = 'na'"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div v-if="editing" class="scratch-save-row">
                  <el-button
                    size="small"
                    type="primary"
                    :loading="savingG28"
                    @click="saveG28"
                    >保存 G-28</el-button
                  >
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>

        <el-card shadow="never" style="margin-top: 16px">
          <template #header>审批流配置</template>
          <template v-if="!editing">
            <ApprovalFlowConfig :model-value="approvalFlow" :readonly="true" />
          </template>
          <template v-else-if="!approvalStarted">
            <ApprovalFlowConfig ref="flowConfigRef" v-model="approvalFlow" />
          </template>
          <template v-else>
            <ApprovalFlowConfig :model-value="approvalFlow" :readonly="true" />
            <el-alert
              type="info"
              :closable="false"
              show-icon
              title="审批已开始，审批流配置不可修改"
              style="margin-top: 8px"
            />
          </template>
        </el-card>
      </el-col>

      <el-col :span="10">
        <ApprovalFlowCard
          :approvals="stageApprovals"
          :on-submit="handleApprove"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { Edit, Upload } from "@element-plus/icons-vue";
import { useProjectStore } from "@/stores/project.js";
import { documentApi, configApi, scratchApi } from "@/api/index.js";
import StatusTag from "@/components/common/StatusTag.vue";
import ApprovalFlowCard from "@/components/common/ApprovalFlowCard.vue";
import ApprovalFlowConfig from "@/components/common/ApprovalFlowConfig.vue";
import PermGuard from "@/components/common/PermGuard.vue";
import { PERM } from "@/constants/permissions.js";

const { t } = useI18n();
const route = useRoute();
const projectStore = useProjectStore();

const project = computed(() => projectStore.current);
const isDraft = computed(() => project.value?.status === "draft");
const stageApprovals = computed(
  () => project.value?.approvalsByStage?.["overview"] || [],
);
const editing = ref(false);
const saving = ref(false);
const pendingDeletes = ref([]);
const approvalFlow = ref([]);
const flowConfigRef = ref();
const purposeOptions = ref([]);

// whether any overview approval has been acted on — locks the flow config
const approvalStarted = computed(() =>
  stageApprovals.value.some(
    (n) =>
      n.nodeStatus !== "pending" ||
      n.approvers.some((a) => a.status !== "pending"),
  ),
);

const attachments = reactive({});

const editForm = reactive({
  purpose: "",
  baseDate: "",
  assetCategory: "",
  responsible: "",
  department: "",
  remark: "",
  budgetHours: 0,
});

async function startEdit() {
  const p = project.value;
  editForm.purpose = p.purpose || "";
  editForm.baseDate = p.baseDate || "";
  editForm.assetCategory = p.assetCategory || "";
  editForm.responsible = p.responsible || "";
  editForm.department = p.department || "";
  editForm.remark = p.remark || "";
  editForm.budgetHours = p.budgetHours ?? 0;
  pendingDeletes.value = [];

  const nodes = await projectStore.fetchStageApprovals(
    route.params.id,
    "overview",
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

  editing.value = true;
}

function cancelEdit() {
  editing.value = false;
  pendingDeletes.value = [];
  approvalFlow.value = [];
}

async function saveEdit() {
  saving.value = true;
  try {
    await projectStore.update(route.params.id, { ...editForm });
    if (!approvalStarted.value && approvalFlow.value.length) {
      await projectStore.saveStageFlow(
        route.params.id,
        "overview",
        approvalFlow.value,
      );
    }
    await projectStore.fetchOne(route.params.id);
    await projectStore.fetchStageApprovals(route.params.id, "overview");
    editing.value = false;
    ElMessage.success("已保存");
  } catch (e) {
    ElMessage.error(
      "保存失败：" + (e?.response?.data?.message || e?.message || "请重试"),
    );
  } finally {
    saving.value = false;
  }
}

function markForDelete(file) {
  if (file._docId) pendingDeletes.value.push(file._docId);
}

// ── G-1 ──────────────────────────────────────────────────────────────────────
const savingG1 = ref(false);
const g1 = reactive({
  projectName: "",
  client: "",
  clientContact: "",
  clientPhone: "",
  unitName: "",
  unitAddress: "",
  legalRep: "",
  enterpriseType: "",
  registeredCapital: "",
  unitContact: "",
  unitPhone: "",
  businessScope: "",
  otherReportUsers: "",
  relationship: "",
  approvalStatus: "",
  importantMatters: "",
  assessmentPurpose: "",
  assessmentScope: "",
  assetStatus: "",
  valueType: "",
  baseDate: "",
  assumptions: "",
  reportUsage: "",
  serviceFee: 0,
  negotiator: "",
  approver: "",
  approveDate: "",
  formFiller: "",
});

async function loadG1() {
  const { data } = await scratchApi.getG1(route.params.id, "overview");
  if (data) Object.assign(g1, data);
}

async function saveG1() {
  savingG1.value = true;
  try {
    await scratchApi.saveG1(route.params.id, "overview", { ...g1 });
    ElMessage.success("G-1 已保存");
  } catch {
    ElMessage.error("G-1 保存失败");
  } finally {
    savingG1.value = false;
  }
}

// ── G-2 ──────────────────────────────────────────────────────────────────────
const savingG2 = ref(false);

const G2_SECTIONS = {
  section1: [
    "1、委托评估目的是否明确？是否存在风险？",
    "2、委托人对时间要求是否紧迫？",
    "3、委托人对估值是否有特殊要求？或估值预期是否合理？",
    "4、委托人与被评估单位的关系如何？",
    "5、委托人有无非诚信记录？",
    "6、委托人及主要负责人社会地位如何？",
  ],
  section2: [
    "1、相关人员对评估工作是否配合？",
    "2、被评估单位是否面临财务危机？",
    "3、被评估单位的产权是否明晰？",
    "4、被评估单位所处行业环境是否稳定？",
    "5、被评估单位内部组织机构是否稳定？",
    "6、被评估单位内部管理和控制制度是否健全、有效？",
    "7、被评估单位基础资料档案管理是否健全？",
    "8、被评估单位财务状况是否稳定？",
    "9、被评估单位及主要负责人社会地位如何？",
  ],
  section3: [
    "1、待估资产法律权属资料是否完整、清晰？",
    "2、有无特殊而本机构没有评估经验的资产？",
    "3、有无抵押、质押、诉讼、抵债等安全与完整保证程度低的资产？",
  ],
  section4: [
    "1、是否具备承接该项目的资质要求？是否存在利害关系？",
    "2、承接该项目是否影响本机构的独立性？",
    "3、评估项目组成人员是否具备承接该项目的能力？",
    "4、拟承接该项目的评估专业人员是否符合独立性的要求？",
    "5、拟聘请的专家或工作人员是否符合独立性的要求？",
  ],
  section5: [
    "1、是否需公诸于公开媒体？是否已明确报告使用人？",
    "2、评估报告是否可能被其他文件、资料引用？",
    "3、评估报告是否提交国资监管部门备案或核准？",
    "4、是否存在两个或两个以上利益对立的评估报告使用人？",
  ],
};

function makeSection(questions) {
  return questions.map((q) => ({ q, a: "" }));
}

const g2 = reactive({
  section1: makeSection(G2_SECTIONS.section1),
  section2: makeSection(G2_SECTIONS.section2),
  section3: makeSection(G2_SECTIONS.section3),
  section4: makeSection(G2_SECTIONS.section4),
  section5: makeSection(G2_SECTIONS.section5),
  riskLevel: "一般",
  riskDesc: "",
  accepted: 1,
  negotiator: "",
  negotiateDate: "",
  supervisorNote: "",
  supervisorDate: "",
});

function mergeSection(target, saved) {
  if (!Array.isArray(saved)) return;
  saved.forEach((item, i) => {
    if (target[i]) target[i].a = item.a || "";
  });
}

async function loadG2() {
  const { data } = await scratchApi.getG2(route.params.id, "overview");
  if (data) {
    mergeSection(g2.section1, JSON.parse(data.section1 || "[]"));
    mergeSection(g2.section2, JSON.parse(data.section2 || "[]"));
    mergeSection(g2.section3, JSON.parse(data.section3 || "[]"));
    mergeSection(g2.section4, JSON.parse(data.section4 || "[]"));
    mergeSection(g2.section5, JSON.parse(data.section5 || "[]"));
    g2.riskLevel = data.riskLevel || "一般";
    g2.riskDesc = data.riskDesc || "";
    g2.accepted = data.accepted ?? 1;
    g2.negotiator = data.negotiator || "";
    g2.negotiateDate = data.negotiateDate || "";
    g2.supervisorNote = data.supervisorNote || "";
    g2.supervisorDate = data.supervisorDate || "";
  }
}

async function saveG2() {
  savingG2.value = true;
  try {
    await scratchApi.saveG2(route.params.id, "overview", {
      section1: JSON.stringify(g2.section1),
      section2: JSON.stringify(g2.section2),
      section3: JSON.stringify(g2.section3),
      section4: JSON.stringify(g2.section4),
      section5: JSON.stringify(g2.section5),
      riskLevel: g2.riskLevel,
      riskDesc: g2.riskDesc,
      accepted: g2.accepted,
      negotiator: g2.negotiator,
      negotiateDate: g2.negotiateDate,
      supervisorNote: g2.supervisorNote,
      supervisorDate: g2.supervisorDate,
    });
    ElMessage.success("G-2 已保存");
  } catch {
    ElMessage.error("G-2 保存失败");
  } finally {
    savingG2.value = false;
  }
}

// ── G-28 ─────────────────────────────────────────────────────────────────────
const G28_QUESTIONS = [
  "您是否清楚所在公司质量控制制度及独立性制度中有关独立性的规定？",
  "您及您亲属是否在委托人或相关当事方中拥有直接经济利益或重大间接利益？是否存在提供直接影响该项业务对象的其他服务？",
  "您及您亲属是否拥有委托人或相关当事方的股权、债权、有价证券、债务，或者存在担保等可能影响独立性的经济利益关系？",
  "您及您亲属是否与委托人或相关当事方从事的业务之间可能存在的其他利益输送或者利益冲突关系情形？",
  "您及您亲属是否从委托人或相关当事方取得未按照正常的程序、条款和条件的贷款？",
  "您是否与委托人或相关当事方的董事、监事、高级管理人员或者其他可能对评估施加重大影响的特定人员有近亲关系？",
  "您及您亲属是否存在在委托人或相关当事方担任董事、监事、高级管理人员或者其他可能对评估施加重大影响的特定职务？",
  "您及您亲属是否曾在委托人或者相关当事方担任主要职务（如：董事、监事、经理、主管、财务负责人等），离任后未满两年？",
  "您及您亲属是否存在为委托人或者相关当事人编制属于该项业务对象的数据或其他记录？",
  "您及您亲属是否与委托人或者相关当事方或其控股股东、董事、高级管理人员共同开办企业？",
  "您及您亲属是否从委托人或者相关当事方购买商品或服务，且未按照正常的商品程序交易？",
  "您及您亲属是否接受委托人或者相关当事方的款待超出业务活动中的正常往来或款待？",
  "您及您亲属是否向委托人或者相关当事人收取除业务费以外的其他费用？",
  "您及您亲属是否为委托人或者相关当事人提供直接影响当前业务项目的其他业务？",
  "您是否曾在评估重大问题上与委托人存在分歧而受到解聘或降低收费威胁时而放弃原则？",
  "您是否收到有关单位或个人不恰当的干预或降低收费的压力而不恰当地缩小工作范围？",
  "评估专业人员是否有兼营或兼任与其执行的评估或其他鉴证业务不相容的其他业务或职务的情形？",
  "当您在执行评估或其他鉴证业务时遇到可能损害独立性的情形时，是否主动向本公司声明并申请回避？",
];

const savingG28 = ref(false);
const g28 = reactive({
  _id: null,
  memberName: "",
  signDate: "",
  answers: Array(G28_QUESTIONS.length).fill(""),
});

async function loadG28() {
  const { data } = await scratchApi.listG28(route.params.id, "overview");
  const row = data[0] || null;
  if (row) {
    g28._id = row.id;
    g28.memberName = row.memberName || "";
    g28.signDate = row.signDate || "";
    const saved = JSON.parse(row.answers || "[]");
    g28.answers = Array(G28_QUESTIONS.length)
      .fill("")
      .map((_, i) => saved[i] || "");
  }
}

async function saveG28() {
  savingG28.value = true;
  try {
    const payload = {
      memberName: g28.memberName,
      signDate: g28.signDate,
      answers: JSON.stringify(g28.answers),
    };
    if (g28._id) {
      await scratchApi.updateG28(g28._id, payload);
    } else {
      const { data } = await scratchApi.addG28(
        route.params.id,
        "overview",
        payload,
      );
      g28._id = data.id;
    }
    ElMessage.success("G-28 已保存");
  } catch {
    ElMessage.error("G-28 保存失败");
  } finally {
    savingG28.value = false;
  }
}

onMounted(async () => {
  const nodes = await projectStore.fetchStageApprovals(
    route.params.id,
    "overview",
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
  const { data } = await configApi.listPurposes();
  purposeOptions.value = data.filter((p) => p.enabled);
  await Promise.all([loadG1(), loadG2(), loadG28()]);
});

async function handleApprove(payload) {
  await projectStore.approveStage(route.params.id, "overview", payload);
  ElMessage.success(payload.action === "approved" ? "已审批通过" : "已驳回");
}
</script>

<style scoped>
/* ── Tabs ────────────────────────────────────────── */
:deep(.scratch-tabs.el-tabs--border-card > .el-tabs__header) {
  background: #f7f8fa;
}
:deep(
  .scratch-tabs.el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active
) {
  color: #1677ff;
  font-weight: 600;
}
:deep(.scratch-tabs.el-tabs--border-card > .el-tabs__content) {
  padding: 0;
}
.scratch-tabs-card {
  padding: 0;
}
:deep(.scratch-tabs-card > .el-card__body) {
  padding: 0;
}

/* ── Shared form styles (样式一 from ExpertManage) ── */
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

.label-cell-sub {
  background: #e8eff5;
  font-weight: 600;
  text-align: center;
  font-size: 12px;
  padding: 4px 6px;
  border: 1px solid #bcc8d4;
  white-space: nowrap;
}

.label-cell-q {
  padding: 4px 8px;
  font-size: 12px;
  color: #333;
  line-height: 1.5;
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

.scratch-empty {
  padding: 12px;
  font-size: 13px;
  color: #bfbfbf;
}
</style>
