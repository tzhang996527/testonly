import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

// ── 样式（G-2 / G-28 代码生成时使用）────────────────────────────────────────
const LABEL_FILL = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FFdce6f0' },
}
const BORDER_STYLE = { style: 'thin', color: { argb: 'FFbcc8d4' } }
const ALL_BORDERS = {
  top: BORDER_STYLE,
  left: BORDER_STYLE,
  bottom: BORDER_STYLE,
  right: BORDER_STYLE,
}
const LABEL_FONT = { name: 'SimSun', size: 10, bold: true }
const DATA_FONT = { name: 'SimSun', size: 10 }

function label(ws, addr, value) {
  const cell = ws.getCell(addr)
  cell.value = value
  cell.font = LABEL_FONT
  cell.fill = LABEL_FILL
  cell.border = ALL_BORDERS
  cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
}

function data(ws, addr, value) {
  const cell = ws.getCell(addr)
  cell.value = value ?? ''
  cell.font = DATA_FONT
  cell.border = ALL_BORDERS
  cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true }
}

function merge(ws, range) {
  ws.mergeCells(range)
}

function rowH(ws, row, height) {
  ws.getRow(row).height = height
}

// 写入单元格（用于模版填充，只覆盖值，保留模版原有样式）
function fill(ws, addr, value) {
  ws.getCell(addr).value = value ?? ''
}

async function loadTemplate() {
  const resp = await fetch('/templates/template.xlsx')
  return resp.arrayBuffer()
}

// ── G-1（使用模版 template.xlsx → G-1 sheet）────────────────────────────────
// 单元格映射（见模版结构，合并区写主格）：
//   C5       → projectName       C6  → client       E6  → clientContact   G6  → clientPhone
//   C7       → unitName          E7  → unitAddress   C8  → legalRep        E8  → enterpriseType
//   C9       → registeredCapital E9  → unitContact   G9  → unitPhone       C10 → businessScope
//   C11      → otherReportUsers  C12 → relationship  C13 → approvalStatus  C14 → importantMatters
//   C15      → assessmentPurpose C16 → assessmentScope C17 → assetStatus   C18 → valueType
//   E18      → baseDate          C19 → assumptions   C20 → reportUsage     D21 → serviceFee
//   C22      → negotiator        E22 → approver      G22 → approveDate
export async function exportG1(g1) {
  const buf = await loadTemplate()
  const wb = new ExcelJS.Workbook()
  await wb.xlsx.load(buf)
  const ws = wb.getWorksheet('G-1')

  fill(ws, 'C5',  g1.projectName)
  fill(ws, 'C6',  g1.client)
  fill(ws, 'E6',  g1.clientContact)
  fill(ws, 'G6',  g1.clientPhone)
  fill(ws, 'C7',  g1.unitName)
  fill(ws, 'E7',  g1.unitAddress)
  fill(ws, 'C8',  g1.legalRep)
  fill(ws, 'E8',  g1.enterpriseType)
  fill(ws, 'C9',  g1.registeredCapital)
  fill(ws, 'E9',  g1.unitContact)
  fill(ws, 'G9',  g1.unitPhone)
  fill(ws, 'C10', g1.businessScope)
  fill(ws, 'C11', g1.otherReportUsers)
  fill(ws, 'C12', g1.relationship)
  fill(ws, 'C13', g1.approvalStatus)
  fill(ws, 'C14', g1.importantMatters)
  fill(ws, 'C15', g1.assessmentPurpose)
  fill(ws, 'C16', g1.assessmentScope)
  fill(ws, 'C17', g1.assetStatus)
  fill(ws, 'C18', g1.valueType)
  fill(ws, 'E18', g1.baseDate)
  fill(ws, 'C19', g1.assumptions)
  fill(ws, 'C20', g1.reportUsage)
  fill(ws, 'D21', g1.serviceFee)
  fill(ws, 'C22', g1.negotiator)
  fill(ws, 'E22', g1.approver)
  fill(ws, 'G22', g1.approveDate)

  await download(wb, `G1_${g1.projectName || '基本事项调查表'}.xlsx`)
}

// ── G-2 ──────────────────────────────────────────────────────────────────────
const G2_SECTION_TITLES = [
  '一、对委托人综合评价',
  '二、对被评估单位综合评价',
  '三、对评估对象的综合评价',
  '四、对本机构及评估人员的综合评价',
  '五、评估报告使用对项目风险的影响',
]

export async function exportG2(g2) {
  const wb = new ExcelJS.Workbook()
  const ws = wb.addWorksheet('G-2 综合评价表')

  ws.columns = [
    { width: 6 },
    { width: 52 },
    { width: 22 },
  ]

  let r = 1

  // 标题
  merge(ws, `A${r}:C${r}`)
  const titleCell = ws.getCell(`A${r}`)
  titleCell.value = 'G-2 评估项目综合评价表'
  titleCell.font = { name: 'SimSun', size: 12, bold: true }
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' }
  rowH(ws, r, 24)
  r++

  const sections = [g2.section1, g2.section2, g2.section3, g2.section4, g2.section5]

  for (let si = 0; si < sections.length; si++) {
    // 分节标题
    merge(ws, `A${r}:C${r}`)
    const hCell = ws.getCell(`A${r}`)
    hCell.value = G2_SECTION_TITLES[si]
    hCell.font = LABEL_FONT
    hCell.fill = LABEL_FILL
    hCell.border = ALL_BORDERS
    hCell.alignment = { vertical: 'middle', horizontal: 'left' }
    rowH(ws, r, 18)
    r++

    for (let i = 0; i < sections[si].length; i++) {
      const item = sections[si][i]
      const numCell = ws.getCell(`A${r}`)
      numCell.value = i + 1
      numCell.font = DATA_FONT
      numCell.border = ALL_BORDERS
      numCell.alignment = { vertical: 'middle', horizontal: 'center' }

      const qCell = ws.getCell(`B${r}`)
      qCell.value = item.q
      qCell.font = DATA_FONT
      qCell.border = ALL_BORDERS
      qCell.alignment = { vertical: 'middle', wrapText: true }
      rowH(ws, r, 28)

      data(ws, `C${r}`, item.a)
      r++
    }
  }

  // 结论：风险水平
  merge(ws, `A${r}:C${r}`)
  const riskCell = ws.getCell(`A${r}`)
  riskCell.value = `结论：风险水平  ${g2.riskLevel}`
  riskCell.font = LABEL_FONT
  riskCell.fill = LABEL_FILL
  riskCell.border = ALL_BORDERS
  riskCell.alignment = { vertical: 'middle', horizontal: 'left' }
  r++

  // 主要风险及措施
  label(ws, `A${r}`, '主要风险及措施')
  merge(ws, `B${r}:C${r}`)
  data(ws, `B${r}`, g2.riskDesc)
  rowH(ws, r, 48)
  r++

  // 是否接受委托
  label(ws, `A${r}`, '是否接受委托')
  merge(ws, `B${r}:C${r}`)
  data(ws, `B${r}`, g2.accepted ? '是' : '否')
  r++

  // 洽谈人
  label(ws, `A${r}`, '洽谈人')
  data(ws, `B${r}`, g2.negotiator)
  data(ws, `C${r}`, g2.negotiateDate)
  r++

  // 负责人评价及批示
  label(ws, `A${r}`, '负责人评价及批示')
  merge(ws, `B${r}:C${r}`)
  data(ws, `B${r}`, g2.supervisorNote)
  rowH(ws, r, 48)
  r++

  // 负责人签字日期
  label(ws, `A${r}`, '负责人签字日期')
  merge(ws, `B${r}:C${r}`)
  data(ws, `B${r}`, g2.supervisorDate)

  await download(wb, 'G2_综合评价表.xlsx')
}

// ── G-28 ─────────────────────────────────────────────────────────────────────
export async function exportG28(g28, questions) {
  const wb = new ExcelJS.Workbook()
  const ws = wb.addWorksheet('G-28 独立性调查问卷')

  ws.columns = [
    { width: 6 },
    { width: 62 },
    { width: 8 },
    { width: 8 },
    { width: 10 },
  ]

  let r = 1

  // 标题
  merge(ws, `A${r}:E${r}`)
  const titleCell = ws.getCell(`A${r}`)
  titleCell.value = 'G-28 项目组成员独立性调查问卷'
  titleCell.font = { name: 'SimSun', size: 12, bold: true }
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' }
  rowH(ws, r, 24)
  r++

  // 资产评估专业人员 / 签名日期
  label(ws, `A${r}`, '资产评估专业人员')
  merge(ws, `B${r}:C${r}`)
  data(ws, `B${r}`, g28.memberName)
  label(ws, `D${r}`, '签名日期')
  data(ws, `E${r}`, g28.signDate)
  r++

  // 空行
  r++

  // 表头
  label(ws, `A${r}`, '序号')
  label(ws, `B${r}`, '调查项目')
  label(ws, `C${r}`, '是')
  label(ws, `D${r}`, '否')
  label(ws, `E${r}`, '不适用')
  r++

  // 问题行
  for (let i = 0; i < questions.length; i++) {
    const ans = g28.answers[i]

    const numCell = ws.getCell(`A${r}`)
    numCell.value = i + 1
    numCell.font = DATA_FONT
    numCell.border = ALL_BORDERS
    numCell.alignment = { vertical: 'middle', horizontal: 'center' }

    const qCell = ws.getCell(`B${r}`)
    qCell.value = questions[i]
    qCell.font = DATA_FONT
    qCell.border = ALL_BORDERS
    qCell.alignment = { vertical: 'middle', wrapText: true }
    rowH(ws, r, 36)

    for (const [col, val] of [['C', 'yes'], ['D', 'no'], ['E', 'na']]) {
      const cell = ws.getCell(`${col}${r}`)
      cell.value = ans === val ? '✓' : ''
      cell.font = DATA_FONT
      cell.border = ALL_BORDERS
      cell.alignment = { vertical: 'middle', horizontal: 'center' }
    }
    r++
  }

  await download(wb, 'G28_独立性调查问卷.xlsx')
}

// ── 公共下载 ──────────────────────────────────────────────────────────────────
async function download(wb, filename) {
  const buf = await wb.xlsx.writeBuffer()
  saveAs(
    new Blob([buf], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }),
    filename,
  )
}
