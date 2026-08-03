<template>
  <div class="expert-page">
    <!-- Toolbar -->
    <div class="expert-toolbar">
      <div class="toolbar-left">
        <span class="page-title">G-7 聘请专家（专业人员）申请表</span>
        <el-tag type="info" size="small" style="margin-left:8px">索引号：G-7</el-tag>
      </div>
      <div class="toolbar-right">
        <el-button size="small" :icon="Plus" type="primary" @click="openNew('drawer')">新增申请（样式一）</el-button>
        <el-button size="small" :icon="Plus" @click="openNew('dialog')" style="margin-left:8px">新增申请（样式二）</el-button>
        <el-input
          v-model="searchText"
          placeholder="搜索专家姓名 / 项目名称"
          clearable
          size="small"
          style="width:220px;margin-left:8px"
          :prefix-icon="Search"
        />
      </div>
    </div>

    <!-- Record list -->
    <div class="expert-list-wrap">
      <table class="excel-table">
        <thead>
          <tr>
            <th style="width:46px">序号</th>
            <th style="width:130px">项目名称</th>
            <th style="width:80px">专家姓名</th>
            <th style="width:52px">性别</th>
            <th style="width:100px">技术职称</th>
            <th style="width:130px">工作单位</th>
            <th style="width:110px">联系电话</th>
            <th style="width:80px">费用预算</th>
            <th style="width:80px">批准人</th>
            <th style="width:100px">批准日期</th>
            <th style="width:80px">填表人</th>
            <th style="width:100px">填表日期</th>
            <th style="width:100px">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredList.length === 0">
            <td colspan="13" class="empty-cell">暂无数据，请点击「新增申请」添加记录</td>
          </tr>
          <tr
            v-for="(item, idx) in filteredList"
            :key="item.id"
            :class="{ 'row-selected': selected?.id === item.id }"
            @click="openEdit(item, 'drawer')"
          >
            <td class="cell-center">{{ idx + 1 }}</td>
            <td>{{ item.projectName || '-' }}</td>
            <td class="cell-center">{{ item.name || '-' }}</td>
            <td class="cell-center">{{ item.gender || '-' }}</td>
            <td>{{ item.techTitle || '-' }}</td>
            <td>{{ item.workUnit || '-' }}</td>
            <td>{{ item.phone || '-' }}</td>
            <td class="cell-center">{{ item.budget || '-' }}</td>
            <td class="cell-center">{{ item.approver || '-' }}</td>
            <td class="cell-center">{{ item.approveDate || '-' }}</td>
            <td class="cell-center">{{ item.filledBy || '-' }}</td>
            <td class="cell-center">{{ item.fillDate || '-' }}</td>
            <td class="cell-center cell-actions" @click.stop>
              <el-button link type="primary" size="small" @click="openEdit(item, 'drawer')">样式一</el-button>
              <el-button link size="small" @click="openEdit(item, 'dialog')">样式二</el-button>
              <el-button link type="danger" size="small" @click="deleteRecord(item)">删除</el-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ══════════════════════════════════════════════════════
         样式一：右侧抽屉 — 蓝灰色表头，紧凑表格
         ══════════════════════════════════════════════════════ -->
    <el-drawer
      v-model="drawerVisible"
      :title="isNew ? '新增聘请专家申请（样式一）' : '编辑聘请专家申请（样式一）'"
      size="780px"
      direction="rtl"
      destroy-on-close
    >
      <div class="form-sheet">
        <div class="sheet-org">xxxxx</div>
        <div class="sheet-title">聘请专家（专业人员）申请表</div>
        <div class="sheet-index">索引号：G-7</div>

        <table class="form-table">
          <colgroup>
            <col style="width:90px"><col><col style="width:70px"><col style="width:140px">
          </colgroup>
          <tbody>
            <tr>
              <td class="label-cell">项目名称</td>
              <td colspan="3"><input v-model="form.projectName" class="cell-input" placeholder="请输入项目名称" /></td>
            </tr>
            <tr>
              <td class="label-cell">拟解决问题</td>
              <td colspan="3"><textarea v-model="form.problemToSolve" class="cell-textarea" rows="3" placeholder="请描述拟解决的问题" /></td>
            </tr>
            <tr>
              <td class="label-cell">费用预算</td>
              <td colspan="3"><input v-model="form.budget" class="cell-input" placeholder="请输入费用预算（元）" /></td>
            </tr>
            <tr>
              <td class="label-cell">批准人</td>
              <td><input v-model="form.approver" class="cell-input" placeholder="批准人姓名" /></td>
              <td class="label-cell">日期</td>
              <td><input v-model="form.approveDate" type="date" class="cell-input" /></td>
            </tr>
          </tbody>
        </table>

        <div class="section-header">专家（专业人员）简况</div>
        <table class="form-table">
          <colgroup>
            <col style="width:90px"><col style="width:100px"><col style="width:70px">
            <col style="width:80px"><col style="width:80px"><col>
          </colgroup>
          <tbody>
            <tr>
              <td class="label-cell">姓名</td>
              <td><input v-model="form.name" class="cell-input" placeholder="姓名" /></td>
              <td class="label-cell">性别</td>
              <td>
                <select v-model="form.gender" class="cell-select">
                  <option value="">请选择</option>
                  <option>男</option><option>女</option>
                </select>
              </td>
              <td class="label-cell">出生年月</td>
              <td><input v-model="form.birthDate" type="date" class="cell-input" /></td>
            </tr>
            <tr>
              <td class="label-cell">学历</td>
              <td>
                <select v-model="form.education" class="cell-select">
                  <option value="">请选择</option>
                  <option>高中/中专</option><option>大专</option><option>本科</option>
                  <option>硕士</option><option>博士</option>
                </select>
              </td>
              <td class="label-cell">学位</td>
              <td>
                <select v-model="form.degree" class="cell-select">
                  <option value="">请选择</option>
                  <option>学士</option><option>硕士</option><option>博士</option>
                </select>
              </td>
              <td class="label-cell">技术职称</td>
              <td><input v-model="form.techTitle" class="cell-input" placeholder="技术职称" /></td>
            </tr>
            <tr>
              <td class="label-cell">地址</td>
              <td colspan="5"><input v-model="form.address" class="cell-input" placeholder="通讯地址" /></td>
            </tr>
            <tr>
              <td class="label-cell">电话/手机</td>
              <td colspan="2"><input v-model="form.phone" class="cell-input" placeholder="联系电话" /></td>
              <td class="label-cell">电子邮件</td>
              <td colspan="2"><input v-model="form.email" class="cell-input" placeholder="电子邮件" /></td>
            </tr>
            <tr>
              <td class="label-cell">单位</td>
              <td colspan="2"><input v-model="form.workUnit" class="cell-input" placeholder="所在单位" /></td>
              <td class="label-cell">单位电话</td>
              <td colspan="2"><input v-model="form.workPhone" class="cell-input" placeholder="单位电话" /></td>
            </tr>
            <tr>
              <td class="label-cell">专业或专长<br>及学术文献</td>
              <td colspan="5"><textarea v-model="form.expertise" class="cell-textarea" rows="3" placeholder="请填写专业领域、专长方向及代表性学术文献" /></td>
            </tr>
            <tr>
              <td class="label-cell">主要经历<br>及职务</td>
              <td colspan="5"><textarea v-model="form.experience" class="cell-textarea" rows="3" placeholder="请填写主要工作经历及担任职务" /></td>
            </tr>
            <tr>
              <td class="label-cell">备注</td>
              <td colspan="5"><textarea v-model="form.remark" class="cell-textarea" rows="2" placeholder="备注信息" /></td>
            </tr>
          </tbody>
        </table>

        <table class="form-table" style="margin-top:8px">
          <colgroup>
            <col style="width:70px"><col style="width:160px"><col style="width:70px"><col>
          </colgroup>
          <tbody>
            <tr>
              <td class="label-cell">填表人</td>
              <td><input v-model="form.filledBy" class="cell-input" placeholder="填表人姓名" /></td>
              <td class="label-cell">日期</td>
              <td><input v-model="form.fillDate" type="date" class="cell-input" /></td>
            </tr>
          </tbody>
        </table>
      </div>

      <template #footer>
        <div style="display:flex;justify-content:flex-end;gap:10px">
          <el-button @click="drawerVisible = false">取消</el-button>
          <el-button type="primary" :loading="saving" @click="saveForm('drawer')">保存</el-button>
        </div>
      </template>
    </el-drawer>

    <!-- ══════════════════════════════════════════════════════
         样式二：居中对话框 — Excel 绿色主题 + 行号/列号 + 公式栏
         ══════════════════════════════════════════════════════ -->
    <el-dialog
      v-model="dialogVisible"
      :title="isNew ? '新增聘请专家申请（样式二）' : '编辑聘请专家申请（样式二）'"
      :width="dlgFullscreen ? '100%' : dlgWidth + 'px'"
      :close-on-click-modal="false"
      destroy-on-close
      :class="['xls-dialog', { 'xls-dialog-fullscreen': dlgFullscreen }]"
      :style="dlgFullscreen ? {} : { marginTop: dlgTop + 'px', marginLeft: dlgLeft + 'px', marginRight: '0', marginBottom: '0' }"
    >
      <!-- 全屏 + 调整大小的操作按钮覆盖在 header 上 -->
      <template #header="{ titleId, titleClass }">
        <div class="xls-dialog-header" ref="dlgHeaderRef" @mousedown="onDlgDragStart">
          <span :id="titleId" :class="titleClass">
            {{ isNew ? '新增聘请专家申请（样式二）' : '编辑聘请专家申请（样式二）' }}
          </span>
          <button class="xls-header-btn" @click.stop="dlgFullscreen = !dlgFullscreen" :title="dlgFullscreen ? '还原' : '最大化'">
            <svg v-if="!dlgFullscreen" viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
              <path d="M1 1h5v1H2v4H1V1zm9 0h5v5h-1V2h-4V1zM1 10h1v4h4v1H1v-5zm13 4h-4v1h5v-5h-1v4z"/>
            </svg>
            <svg v-else viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
              <path d="M5 1H1v4h1V2h3V1zm6 0v1h3v3h1V1h-4zM1 11v4h4v-1H2v-3H1zm13 3h-3v1h4v-4h-1v3z"/>
            </svg>
          </button>
        </div>
      </template>
      <div class="xls-app">
        <!-- 公式栏 -->
        <div class="xls-formulabar">
          <div class="xls-namebox">{{ activeCell }}</div>
          <div class="xls-fx">fx</div>
          <input class="xls-formula-input" :value="activeCellValue" readonly />
        </div>

        <!-- 列标 -->
        <div class="xls-colheader-row">
          <div class="xls-corner"></div>
          <div class="xls-colheader" v-for="c in cols" :key="c">{{ c }}</div>
        </div>

        <!-- 电子表格主体 -->
        <div class="xls-grid-scroll" :style="gridScrollStyle">
          <table class="xls-grid">
            <colgroup>
              <col class="xls-rownum-col">
              <col v-for="c in colWidths" :key="c" :style="{ width: c }">
            </colgroup>
            <tbody>

              <!-- 行 1: 单位名称 -->
              <tr>
                <td class="xls-rownum">1</td>
                <td colspan="6" class="xls-cell xls-merged xls-bold xls-center">xxxxx</td>
              </tr>

              <!-- 行 2: 表单标题 -->
              <tr>
                <td class="xls-rownum">2</td>
                <td colspan="6" class="xls-cell xls-merged xls-title xls-center">
                  聘请专家（专业人员）申请表
                </td>
              </tr>

              <!-- 行 3: 索引号 -->
              <tr>
                <td class="xls-rownum">3</td>
                <td colspan="5" class="xls-cell xls-merged"></td>
                <td class="xls-cell xls-small xls-right xls-gray">索引号：G-7</td>
              </tr>

              <!-- 行 4: 项目名称 -->
              <tr @click="setActive('B4', form.projectName)">
                <td class="xls-rownum">4</td>
                <td class="xls-cell xls-label">项目名称</td>
                <td colspan="5" class="xls-cell xls-merged xls-editable" :class="{ 'xls-active': activeCell==='B4' }">
                  <input v-model="form.projectName" class="xls-input"
                    @focus="setActive('B4', form.projectName)"
                    @input="activeCellValue = form.projectName"
                    placeholder="请输入项目名称" />
                </td>
              </tr>

              <!-- 行 5: 拟解决问题 -->
              <tr @click="setActive('B5', form.problemToSolve)">
                <td class="xls-rownum">5</td>
                <td class="xls-cell xls-label xls-tall-label">拟解决问题</td>
                <td colspan="5" class="xls-cell xls-merged xls-editable" :class="{ 'xls-active': activeCell==='B5' }">
                  <textarea v-model="form.problemToSolve" class="xls-textarea" rows="3"
                    @focus="setActive('B5', form.problemToSolve)"
                    @input="activeCellValue = form.problemToSolve"
                    placeholder="请描述拟解决的问题" />
                </td>
              </tr>

              <!-- 行 6: 费用预算 -->
              <tr @click="setActive('B6', form.budget)">
                <td class="xls-rownum">6</td>
                <td class="xls-cell xls-label">费用预算</td>
                <td colspan="5" class="xls-cell xls-merged xls-editable" :class="{ 'xls-active': activeCell==='B6' }">
                  <input v-model="form.budget" class="xls-input"
                    @focus="setActive('B6', form.budget)"
                    @input="activeCellValue = form.budget"
                    placeholder="请输入费用预算（元）" />
                </td>
              </tr>

              <!-- 行 7: 批准人 + 日期 -->
              <tr>
                <td class="xls-rownum">7</td>
                <td class="xls-cell xls-label">批准人</td>
                <td colspan="2" class="xls-cell xls-merged xls-editable" :class="{ 'xls-active': activeCell==='B7' }">
                  <input v-model="form.approver" class="xls-input"
                    @focus="setActive('B7', form.approver)"
                    @input="activeCellValue = form.approver"
                    placeholder="批准人姓名" />
                </td>
                <td class="xls-cell xls-label">日期</td>
                <td colspan="2" class="xls-cell xls-merged xls-editable" :class="{ 'xls-active': activeCell==='E7' }">
                  <input v-model="form.approveDate" type="date" class="xls-input"
                    @focus="setActive('E7', form.approveDate)"
                    @input="activeCellValue = form.approveDate" />
                </td>
              </tr>

              <!-- 行 8: 专家简况 分区标题 -->
              <tr>
                <td class="xls-rownum">8</td>
                <td colspan="6" class="xls-cell xls-merged xls-section-header xls-center">
                  专家（专业人员）简况
                </td>
              </tr>

              <!-- 行 9: 姓名 / 性别 / 出生年月 -->
              <tr>
                <td class="xls-rownum">9</td>
                <td class="xls-cell xls-label">姓名</td>
                <td class="xls-cell xls-editable" :class="{ 'xls-active': activeCell==='B9' }">
                  <input v-model="form.name" class="xls-input"
                    @focus="setActive('B9', form.name)"
                    @input="activeCellValue = form.name" placeholder="姓名" />
                </td>
                <td class="xls-cell xls-label">性别</td>
                <td class="xls-cell xls-editable" :class="{ 'xls-active': activeCell==='D9' }">
                  <select v-model="form.gender" class="xls-select"
                    @focus="setActive('D9', form.gender)"
                    @change="activeCellValue = form.gender">
                    <option value="">请选择</option>
                    <option>男</option><option>女</option>
                  </select>
                </td>
                <td class="xls-cell xls-label">出生年月</td>
                <td class="xls-cell xls-editable" :class="{ 'xls-active': activeCell==='F9' }">
                  <input v-model="form.birthDate" type="date" class="xls-input"
                    @focus="setActive('F9', form.birthDate)"
                    @input="activeCellValue = form.birthDate" />
                </td>
              </tr>

              <!-- 行 10: 学历 / 学位 / 技术职称 -->
              <tr>
                <td class="xls-rownum">10</td>
                <td class="xls-cell xls-label">学历</td>
                <td class="xls-cell xls-editable" :class="{ 'xls-active': activeCell==='B10' }">
                  <select v-model="form.education" class="xls-select"
                    @focus="setActive('B10', form.education)"
                    @change="activeCellValue = form.education">
                    <option value="">请选择</option>
                    <option>高中/中专</option><option>大专</option><option>本科</option>
                    <option>硕士</option><option>博士</option>
                  </select>
                </td>
                <td class="xls-cell xls-label">学位</td>
                <td class="xls-cell xls-editable" :class="{ 'xls-active': activeCell==='D10' }">
                  <select v-model="form.degree" class="xls-select"
                    @focus="setActive('D10', form.degree)"
                    @change="activeCellValue = form.degree">
                    <option value="">请选择</option>
                    <option>学士</option><option>硕士</option><option>博士</option>
                  </select>
                </td>
                <td class="xls-cell xls-label">技术职称</td>
                <td class="xls-cell xls-editable" :class="{ 'xls-active': activeCell==='F10' }">
                  <input v-model="form.techTitle" class="xls-input"
                    @focus="setActive('F10', form.techTitle)"
                    @input="activeCellValue = form.techTitle" placeholder="技术职称" />
                </td>
              </tr>

              <!-- 行 11: 地址 -->
              <tr>
                <td class="xls-rownum">11</td>
                <td class="xls-cell xls-label">地址</td>
                <td colspan="5" class="xls-cell xls-merged xls-editable" :class="{ 'xls-active': activeCell==='B11' }">
                  <input v-model="form.address" class="xls-input"
                    @focus="setActive('B11', form.address)"
                    @input="activeCellValue = form.address" placeholder="通讯地址" />
                </td>
              </tr>

              <!-- 行 12: 电话 / 邮件 -->
              <tr>
                <td class="xls-rownum">12</td>
                <td class="xls-cell xls-label">电话/手机</td>
                <td colspan="2" class="xls-cell xls-merged xls-editable" :class="{ 'xls-active': activeCell==='B12' }">
                  <input v-model="form.phone" class="xls-input"
                    @focus="setActive('B12', form.phone)"
                    @input="activeCellValue = form.phone" placeholder="联系电话" />
                </td>
                <td class="xls-cell xls-label">电子邮件</td>
                <td colspan="2" class="xls-cell xls-merged xls-editable" :class="{ 'xls-active': activeCell==='E12' }">
                  <input v-model="form.email" class="xls-input"
                    @focus="setActive('E12', form.email)"
                    @input="activeCellValue = form.email" placeholder="电子邮件" />
                </td>
              </tr>

              <!-- 行 13: 单位 / 单位电话 -->
              <tr>
                <td class="xls-rownum">13</td>
                <td class="xls-cell xls-label">单位</td>
                <td colspan="2" class="xls-cell xls-merged xls-editable" :class="{ 'xls-active': activeCell==='B13' }">
                  <input v-model="form.workUnit" class="xls-input"
                    @focus="setActive('B13', form.workUnit)"
                    @input="activeCellValue = form.workUnit" placeholder="所在单位" />
                </td>
                <td class="xls-cell xls-label">单位电话</td>
                <td colspan="2" class="xls-cell xls-merged xls-editable" :class="{ 'xls-active': activeCell==='E13' }">
                  <input v-model="form.workPhone" class="xls-input"
                    @focus="setActive('E13', form.workPhone)"
                    @input="activeCellValue = form.workPhone" placeholder="单位电话" />
                </td>
              </tr>

              <!-- 行 14: 专业专长 -->
              <tr>
                <td class="xls-rownum">14</td>
                <td class="xls-cell xls-label xls-tall-label">专业或专长<br>及学术文献</td>
                <td colspan="5" class="xls-cell xls-merged xls-editable" :class="{ 'xls-active': activeCell==='B14' }">
                  <textarea v-model="form.expertise" class="xls-textarea" rows="3"
                    @focus="setActive('B14', form.expertise)"
                    @input="activeCellValue = form.expertise"
                    placeholder="请填写专业领域、专长方向及代表性学术文献" />
                </td>
              </tr>

              <!-- 行 15: 主要经历 -->
              <tr>
                <td class="xls-rownum">15</td>
                <td class="xls-cell xls-label xls-tall-label">主要经历<br>及职务</td>
                <td colspan="5" class="xls-cell xls-merged xls-editable" :class="{ 'xls-active': activeCell==='B15' }">
                  <textarea v-model="form.experience" class="xls-textarea" rows="3"
                    @focus="setActive('B15', form.experience)"
                    @input="activeCellValue = form.experience"
                    placeholder="请填写主要工作经历及担任职务" />
                </td>
              </tr>

              <!-- 行 16: 备注 -->
              <tr>
                <td class="xls-rownum">16</td>
                <td class="xls-cell xls-label">备注</td>
                <td colspan="5" class="xls-cell xls-merged xls-editable" :class="{ 'xls-active': activeCell==='B16' }">
                  <textarea v-model="form.remark" class="xls-textarea" rows="2"
                    @focus="setActive('B16', form.remark)"
                    @input="activeCellValue = form.remark"
                    placeholder="备注信息" />
                </td>
              </tr>

              <!-- 行 17: 空行 -->
              <tr>
                <td class="xls-rownum">17</td>
                <td colspan="6" class="xls-cell xls-merged"></td>
              </tr>

              <!-- 行 18: 空行 -->
              <tr>
                <td class="xls-rownum">18</td>
                <td colspan="6" class="xls-cell xls-merged"></td>
              </tr>

              <!-- 行 19: 填表人 + 日期 -->
              <tr>
                <td class="xls-rownum">19</td>
                <td class="xls-cell xls-label">填表人</td>
                <td colspan="2" class="xls-cell xls-merged xls-editable" :class="{ 'xls-active': activeCell==='B19' }">
                  <input v-model="form.filledBy" class="xls-input"
                    @focus="setActive('B19', form.filledBy)"
                    @input="activeCellValue = form.filledBy" placeholder="填表人姓名" />
                </td>
                <td class="xls-cell xls-label">日期</td>
                <td colspan="2" class="xls-cell xls-merged xls-editable" :class="{ 'xls-active': activeCell==='E19' }">
                  <input v-model="form.fillDate" type="date" class="xls-input"
                    @focus="setActive('E19', form.fillDate)"
                    @input="activeCellValue = form.fillDate" />
                </td>
              </tr>

            </tbody>
          </table>
        </div>

        <!-- sheet 标签栏 -->
        <div class="xls-sheettab-bar">
          <div class="xls-sheettab xls-sheettab-active">G-7专家</div>
          <div class="xls-sheettab">Sheet1</div>
        </div>
      </div>

      <!-- resize handles（非全屏时显示） -->
      <template v-if="!dlgFullscreen">
        <div class="dlg-resize dlg-resize-e"  @mousedown.stop="onResizeStart($event,'e')"></div>
        <div class="dlg-resize dlg-resize-s"  @mousedown.stop="onResizeStart($event,'s')"></div>
        <div class="dlg-resize dlg-resize-w"  @mousedown.stop="onResizeStart($event,'w')"></div>
        <div class="dlg-resize dlg-resize-se" @mousedown.stop="onResizeStart($event,'se')"></div>
        <div class="dlg-resize dlg-resize-sw" @mousedown.stop="onResizeStart($event,'sw')"></div>
      </template>

      <template #footer>
        <div style="display:flex;justify-content:flex-end;gap:10px">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="success" :loading="saving" @click="saveForm('dialog')">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'
import { expertApi } from '@/api/index.js'

const list        = ref([])
const searchText  = ref('')
const isNew       = ref(false)
const saving      = ref(false)
const selected    = ref(null)
const drawerVisible = ref(false)
const dialogVisible = ref(false)

// 样式二：全屏 & 尺寸/位置
const dlgFullscreen = ref(false)
const dlgWidth  = ref(860)
const dlgHeight = ref(0)   // 0 = auto (由内容撑开)
const dlgTop    = ref(0)   // marginTop (px), 0 = el-dialog 默认居中
const dlgLeft   = ref(0)   // marginLeft (px)，0 = el-dialog 默认居中

// 拖动对话框标题栏移动
const dlgHeaderRef = ref(null)
let dragState = null

function onDlgDragStart(e) {
  if (dlgFullscreen.value) return
  // 找到实际的 .el-dialog 元素
  const dlgEl = e.currentTarget.closest('.el-dialog')
  if (!dlgEl) return
  const rect = dlgEl.getBoundingClientRect()
  dragState = {
    type: 'move',
    startX: e.clientX, startY: e.clientY,
    origLeft: rect.left, origTop: rect.top,
  }
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
  e.preventDefault()
}

// resize handle 拖动
function onResizeStart(e, dir) {
  if (dlgFullscreen.value) return
  const dlgEl = e.target.closest('.el-dialog')
  if (!dlgEl) return
  const rect = dlgEl.getBoundingClientRect()
  dragState = {
    type: 'resize', dir,
    startX: e.clientX, startY: e.clientY,
    origW: rect.width, origH: rect.height,
    origLeft: rect.left, origTop: rect.top,
  }
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
  e.preventDefault()
}

function onMouseMove(e) {
  if (!dragState) return
  const dx = e.clientX - dragState.startX
  const dy = e.clientY - dragState.startY

  if (dragState.type === 'move') {
    dlgLeft.value = dragState.origLeft + dx
    dlgTop.value  = dragState.origTop  + dy
  } else {
    const { dir, origW, origH, origLeft, origTop } = dragState
    if (dir.includes('e'))  dlgWidth.value  = Math.max(560, origW + dx)
    if (dir.includes('s'))  dlgHeight.value = Math.max(400, origH + dy)
    if (dir.includes('w')) {
      const newW = Math.max(560, origW - dx)
      dlgWidth.value = newW
      dlgLeft.value  = origLeft + (origW - newW)
    }
  }
}

function onMouseUp() {
  dragState = null
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
}

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
})

// 样式二公式栏状态
const activeCell      = ref('B4')
const activeCellValue = ref('')

const cols      = ['A','B','C','D','E','F']
const colWidths = ['90px','120px','90px','90px','90px','120px']

function setActive(ref, val) {
  activeCell.value      = ref
  activeCellValue.value = val || ''
}

const emptyForm = () => ({
  projectName: '', problemToSolve: '', budget: '', approver: '', approveDate: '',
  name: '', gender: '', birthDate: '', education: '', degree: '', techTitle: '',
  address: '', phone: '', email: '', workUnit: '', workPhone: '',
  expertise: '', experience: '', remark: '', filledBy: '', fillDate: '',
})
const form = ref(emptyForm())

const filteredList = computed(() => {
  const q = searchText.value.trim().toLowerCase()
  if (!q) return list.value
  return list.value.filter(r =>
    (r.name || '').toLowerCase().includes(q) ||
    (r.projectName || '').toLowerCase().includes(q)
  )
})

// xls-grid-scroll 高度：全屏时撑满，有指定高度时动态计算，否则 auto
const gridScrollStyle = computed(() => {
  if (dlgFullscreen.value) return { maxHeight: 'calc(100vh - 170px)' }
  if (dlgHeight.value > 0) {
    // header≈46 formulabar≈26 colheader≈20 sheettab≈26 footer≈60 padding≈10
    const h = dlgHeight.value - 188
    return { maxHeight: Math.max(150, h) + 'px' }
  }
  return { maxHeight: '420px' }
})

async function loadList() {
  const res = await expertApi.list()
  list.value = res.data
}

function openNew(mode) {
  isNew.value   = true
  form.value    = emptyForm()
  selected.value = null
  activeCell.value = 'B4'
  activeCellValue.value = ''
  dlgFullscreen.value = false
  dlgWidth.value = 860; dlgHeight.value = 0; dlgTop.value = 0; dlgLeft.value = 0
  if (mode === 'drawer') drawerVisible.value = true
  else                   dialogVisible.value  = true
}

function openEdit(item, mode) {
  isNew.value    = false
  selected.value = item
  form.value     = { ...item }
  activeCell.value = 'B4'
  activeCellValue.value = item.projectName || ''
  dlgFullscreen.value = false
  dlgWidth.value = 860; dlgHeight.value = 0; dlgTop.value = 0; dlgLeft.value = 0
  if (mode === 'drawer') drawerVisible.value = true
  else                   dialogVisible.value  = true
}

async function saveForm(mode) {
  saving.value = true
  try {
    if (isNew.value) {
      await expertApi.create(form.value)
      ElMessage.success('新增成功')
    } else {
      await expertApi.update(form.value.id, form.value)
      ElMessage.success('保存成功')
    }
    if (mode === 'drawer') drawerVisible.value = false
    else                   dialogVisible.value  = false
    await loadList()
  } catch {
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

async function deleteRecord(item) {
  await ElMessageBox.confirm(`确定要删除 "${item.name || '该条记录'}" 的申请表吗？`, '确认删除', {
    type: 'warning', confirmButtonText: '删除', cancelButtonText: '取消',
  })
  await expertApi.remove(item.id)
  ElMessage.success('已删除')
  await loadList()
}

onMounted(loadList)
</script>

<style scoped>
/* ════════════════════════════════════════════
   通用页面 & 列表
   ════════════════════════════════════════════ */
.expert-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f0f2f5;
}

.expert-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: #fff;
  border-bottom: 1px solid #dde1e7;
  flex-shrink: 0;
}
.toolbar-left  { display: flex; align-items: center; }
.toolbar-right { display: flex; align-items: center; }
.page-title    { font-size: 15px; font-weight: 600; color: #1d2129; }

.expert-list-wrap { flex: 1; overflow: auto; padding: 12px 16px; }

.excel-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  font-size: 13px;
  table-layout: fixed;
  box-shadow: 0 1px 4px rgba(0,0,0,.08);
}
.excel-table th,
.excel-table td {
  border: 1px solid #d0d7de;
  padding: 6px 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.excel-table thead tr { background: #e8edf2; position: sticky; top: 0; z-index: 2; }
.excel-table th { font-weight: 600; color: #1d2129; text-align: center; }
.excel-table tbody tr:hover  { background: #f0f7ff; cursor: pointer; }
.excel-table tbody tr.row-selected { background: #d6e8ff; }
.cell-center  { text-align: center; }
.empty-cell   { text-align: center; color: #999; padding: 32px 0; }
.cell-actions { white-space: nowrap; }

/* ════════════════════════════════════════════
   样式一：抽屉 — 蓝灰色 Excel 表单
   ════════════════════════════════════════════ */
.form-sheet {
  padding: 8px 16px 16px;
  font-family: 'SimSun', 'Microsoft YaHei', sans-serif;
  font-size: 13px;
}
.sheet-org {
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  border-bottom: 2px solid #222;
  padding-bottom: 4px;
  margin-bottom: 2px;
}
.sheet-title {
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 2px;
  padding: 8px 0 2px;
}
.sheet-index  { text-align: right; font-size: 12px; color: #555; margin-bottom: 8px; }
.section-header {
  background: #dce6f0;
  text-align: center;
  font-weight: 600;
  font-size: 13px;
  border: 1px solid #bcc8d4;
  border-bottom: none;
  padding: 5px 0;
  letter-spacing: 1px;
}
.form-table { width: 100%; border-collapse: collapse; }
.form-table td { border: 1px solid #bcc8d4; padding: 3px 5px; vertical-align: middle; }
.label-cell {
  background: #dce6f0;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
  font-size: 12px;
  padding: 4px 6px;
  line-height: 1.4;
}
.cell-input {
  width: 100%; border: none; outline: none; background: transparent;
  font-size: 13px; font-family: inherit; padding: 2px 4px; box-sizing: border-box;
}
.cell-input:focus  { background: #fffbe6; outline: 2px solid #4096ff; outline-offset: -1px; border-radius: 2px; }
.cell-textarea {
  width: 100%; border: none; outline: none; background: transparent;
  font-size: 13px; font-family: inherit; padding: 2px 4px;
  box-sizing: border-box; resize: vertical; line-height: 1.5;
}
.cell-textarea:focus { background: #fffbe6; outline: 2px solid #4096ff; outline-offset: -1px; border-radius: 2px; }
.cell-select {
  width: 100%; border: none; outline: none; background: transparent;
  font-size: 13px; font-family: inherit; padding: 2px 4px; cursor: pointer; appearance: auto;
}
.cell-select:focus { background: #fffbe6; outline: 2px solid #4096ff; outline-offset: -1px; border-radius: 2px; }

/* ════════════════════════════════════════════
   样式二：对话框 — Excel 绿色主题 + 行号/列号
   ════════════════════════════════════════════ */
:deep(.xls-dialog .el-dialog__header) {
  background: #217346;
  color: #fff;
  padding: 0;
  margin-right: 0;
}
:deep(.xls-dialog .el-dialog__title) { color: #fff; font-size: 14px; }
:deep(.xls-dialog .el-dialog__headerbtn .el-dialog__close) { color: #fff; }
:deep(.xls-dialog .el-dialog__body)   { padding: 0; position: relative; overflow: visible; }
:deep(.xls-dialog .el-dialog)         { overflow: visible; }
:deep(.xls-dialog .el-dialog__footer) {
  padding: 10px 16px;
  background: #f2f2f2;
  border-top: 1px solid #ccc;
}

/* 全屏模式 */
:deep(.xls-dialog-fullscreen) {
  position: fixed !important;
  top: 0 !important; left: 0 !important;
  width: 100vw !important; height: 100vh !important;
  margin: 0 !important;
  border-radius: 0 !important;
  display: flex !important;
  flex-direction: column !important;
}
:deep(.xls-dialog-fullscreen .el-dialog__body) {
  flex: 1 !important;
  overflow: hidden !important;
}
:deep(.xls-dialog-fullscreen .xls-app) {
  height: 100% !important;
  display: flex !important;
  flex-direction: column !important;
}
:deep(.xls-dialog-fullscreen .xls-grid-scroll) {
  flex: 1 !important;
  max-height: none !important;
}

/* 自定义 header */
.xls-dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px 8px 16px;
  cursor: move;
  user-select: none;
}
.xls-header-btn {
  background: transparent;
  border: none;
  color: rgba(255,255,255,.85);
  cursor: pointer;
  padding: 3px 5px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  line-height: 1;
  margin-right: 28px; /* 让出 el-dialog 原生关闭按钮的空间 */
}
.xls-header-btn:hover { background: rgba(255,255,255,.15); color: #fff; }

/* resize handles */
.dlg-resize {
  position: absolute;
  z-index: 10;
}
.dlg-resize-e  { right: -4px;  top: 8px;  width: 8px;  bottom: 8px; cursor: e-resize; }
.dlg-resize-w  { left: -4px;   top: 8px;  width: 8px;  bottom: 8px; cursor: w-resize; }
.dlg-resize-s  { bottom: -4px; left: 8px; height: 8px; right: 8px;  cursor: s-resize; }
.dlg-resize-se { right: -4px;  bottom: -4px; width: 12px; height: 12px; cursor: se-resize; }
.dlg-resize-sw { left: -4px;   bottom: -4px; width: 12px; height: 12px; cursor: sw-resize; }

.xls-app {
  font-family: 'Calibri', 'Microsoft YaHei', sans-serif;
  font-size: 12px;
  background: #fff;
  user-select: none;
}

/* 公式栏 */
.xls-formulabar {
  display: flex;
  align-items: center;
  height: 26px;
  border-bottom: 1px solid #c8c8c8;
  background: #f2f2f2;
}
.xls-namebox {
  width: 62px;
  flex-shrink: 0;
  border-right: 1px solid #c8c8c8;
  padding: 0 6px;
  font-size: 12px;
  line-height: 26px;
  color: #1f1f1f;
  background: #fff;
  text-align: center;
  cursor: default;
}
.xls-fx {
  width: 28px;
  flex-shrink: 0;
  text-align: center;
  font-style: italic;
  font-size: 13px;
  color: #217346;
  border-right: 1px solid #c8c8c8;
  line-height: 26px;
}
.xls-formula-input {
  flex: 1;
  border: none;
  outline: none;
  background: #fff;
  font-size: 12px;
  font-family: 'Calibri', 'Microsoft YaHei', sans-serif;
  padding: 0 6px;
  color: #1f1f1f;
  cursor: default;
}

/* 列标头 */
.xls-colheader-row {
  display: flex;
  background: #f2f2f2;
  border-bottom: 1px solid #c8c8c8;
  height: 20px;
}
.xls-corner {
  width: 30px;
  flex-shrink: 0;
  border-right: 1px solid #c8c8c8;
  background: #f2f2f2;
}
.xls-colheader {
  flex: 1;
  text-align: center;
  line-height: 20px;
  font-size: 11px;
  color: #595959;
  border-right: 1px solid #d9d9d9;
  cursor: default;
}

/* 滚动区 */
.xls-grid-scroll { overflow: auto; max-height: 420px; }

/* 表格 */
.xls-grid {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.xls-rownum-col { width: 30px; }

/* 行号单元格 */
.xls-rownum {
  width: 30px;
  text-align: right;
  padding: 0 4px;
  font-size: 11px;
  color: #595959;
  background: #f2f2f2;
  border-right: 1px solid #c8c8c8;
  border-bottom: 1px solid #d9d9d9;
  cursor: default;
  vertical-align: middle;
  white-space: nowrap;
}

/* 普通单元格 */
.xls-cell {
  border: 1px solid #d9d9d9;
  padding: 0;
  vertical-align: middle;
  height: 22px;
  min-height: 22px;
}

/* 标签单元格 */
.xls-label {
  background: #e2efda;
  color: #1f1f1f;
  font-weight: 600;
  font-size: 12px;
  text-align: center;
  padding: 2px 4px;
  line-height: 1.3;
  white-space: nowrap;
}
.xls-tall-label { vertical-align: middle; }

/* 分区标题 */
.xls-section-header {
  background: #c6efce;
  color: #276221;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 1px;
  padding: 4px 0;
}

/* 可编辑单元格 */
.xls-editable { background: #fff; }
.xls-active   { background: #e8f4fd; outline: 2px solid #217346; outline-offset: -2px; z-index: 1; position: relative; }

/* 文本辅助 */
.xls-bold   { font-weight: bold; }
.xls-center { text-align: center; padding: 3px; }
.xls-right  { text-align: right; padding: 2px 6px; }
.xls-small  { font-size: 11px; }
.xls-gray   { color: #595959; }
.xls-title  { font-size: 14px; font-weight: bold; letter-spacing: 2px; padding: 4px; }

/* 输入控件 */
.xls-input {
  display: block;
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 12px;
  font-family: 'Calibri', 'Microsoft YaHei', sans-serif;
  color: #1f1f1f;
  padding: 2px 5px;
  box-sizing: border-box;
  height: 22px;
  line-height: 22px;
}
.xls-textarea {
  display: block;
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 12px;
  font-family: 'Calibri', 'Microsoft YaHei', sans-serif;
  color: #1f1f1f;
  padding: 3px 5px;
  box-sizing: border-box;
  resize: vertical;
  line-height: 1.5;
}
.xls-select {
  display: block;
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 12px;
  font-family: 'Calibri', 'Microsoft YaHei', sans-serif;
  color: #1f1f1f;
  padding: 1px 4px;
  height: 22px;
  cursor: pointer;
  appearance: auto;
}

/* Sheet 标签栏 */
.xls-sheettab-bar {
  display: flex;
  align-items: flex-end;
  height: 26px;
  background: #f2f2f2;
  border-top: 1px solid #c8c8c8;
  padding-left: 4px;
  gap: 2px;
}
.xls-sheettab {
  padding: 3px 12px;
  font-size: 12px;
  border: 1px solid #c8c8c8;
  border-bottom: none;
  background: #e0e0e0;
  color: #595959;
  cursor: pointer;
  border-radius: 3px 3px 0 0;
}
.xls-sheettab-active {
  background: #fff;
  color: #217346;
  font-weight: 600;
  border-bottom-color: #fff;
  margin-bottom: -1px;
}
</style>
