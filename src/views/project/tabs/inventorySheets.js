// 存货底稿表配置（来源：basic 2022.xlsx）
// 每个条目会在 Inventory.vue 中渲染成一个 tab，由 InventorySheet.vue 统一渲染。
//
// 列 DSL：
//   叶子列  ['列名', 'field', 宽度?]
//   分组列  { g: '组名', c: [ 叶子列, ... ] }
//
// kind:
//   'detail'  明细表 / 作业分析表：两级表头 + 可增删数据行 + 小计/合计 + 披露说明 + 页脚
//   'summary' 汇总表：固定行标签 + 数值列
//   'review'  评估步骤及复核表：步骤清单 + 是/不适用 勾选 + 说明与备注
//
// detail 表说明：
//   · 字段名为 'no' 的列自动按行号显示（不可编辑）
//   · 数据行可「＋添加行」「删除」，行数不固定，rows 仅为初始空行数
//   · sumFields：需要自动求和的金额列，小计 = 所有数据行之和，合计 = 小计（只读）
//     不填时自动取字段名以 Amt 结尾或为 bookValue / evalValue 的列

const COMPANY = '上海城乡资产评估有限责任公司'
const COMPANY_EN = 'SHANGHAI URBAN & RURAL ASSETS APPRAISAL CO.,LTD'

// 常见「账面价值 数量/单价/金额」分组
const BOOK_QPA = {
  g: '账面价值',
  c: [
    ['数量', 'bookQty', 64],
    ['单价', 'bookPrice', 64],
    ['金额', 'bookAmt', 88],
  ],
}
// 评估单价测算过程（市场法：购买市价 …… 单价小计）
const MARKET_CALC = {
  g: '评估单价测算过程',
  c: [
    ['购买市价', 'mp1', 70],
    ['', 'mp2', 60],
    ['', 'mp3', 60],
    ['', 'mp4', 60],
    ['单价小计', 'unitSubtotal', 72],
  ],
}
// 参数测算过程（成本法作业分析表1）
const PARAM_CALC = {
  g: '参数测算过程',
  c: [
    ['不含税售价', 'priceExTax', 76],
    ['销售费(％)', 'sellingExpPct', 72],
    ['税、费(％)', 'taxFeePct', 72],
    ['所得税(％)', 'incomeTaxPct', 72],
    ['净利润折减率(％)', 'netProfitDiscPct', 92],
    ['小计', 'calcSubtotal', 64],
  ],
}

export const INVENTORY_SHEETS = [
  // ── C3-1-3/2 其他货币资金作业分析表 ───────────────────────────────
  {
    key: 'c3_1_3_2',
    tab: 'C3-1-3/2 其他货币作业',
    code: 'C3-1-3/2',
    title: '其他货币资金 (          ) 作业分析表',
    company: COMPANY,
    companyEn: COMPANY_EN,
    kind: 'detail',
    summarySpan: 1,
    sumFields: ['bookValue', 'evalValue'],
    cols: [
      ['序号', 'no', 44],
      ['名称及内容', 'name', 140],
      ['用途', 'usage', 90],
      ['币种', 'currency', 60],
      ['外汇账面金额', 'fcAmount', 100],
      ['基准日汇率', 'rate', 84],
      ['账面价值', 'bookValue', 96],
      ['函证结果', 'confirmResult', 90],
      ['调节表核对', 'reconCheck', 90],
      ['差异原因分析', 'diffReason', 120],
      ['约定存款利率', 'depositRate', 96],
      ['评估价值', 'evalValue', 96],
      ['交叉索引号', 'xref', 84],
      ['备注', 'remark', 80],
    ],
    rows: 9,
    summary: ['小计', '合计'],
  },

  // ── C3-10 存货评估步骤及复核表 ────────────────────────────────────
  {
    key: 'c3_10',
    tab: 'C3-10 存货复核表',
    code: 'C3-10',
    title: '存货评估步骤及复核表',
    company: COMPANY,
    companyEn: COMPANY_EN,
    kind: 'review',
    steps: [
      '1 获取存货申报表，明细账、总账、报表进行核对',
      '2 了解分析存货的构成、分布和企业内部控制管理制度，各类存货的核算方法。并抽查有关存货出入库记录，做好相应清查记录',
      '3 对错帐、漏帐、影响净资产的未达帐项、贷方余额等项目进行分析，并复印有关资料',
      '4 获取并检查被评估单位评估基准日或最近一次存货盘点记录，评价盘点的可信度',
      '5 抽查盘点重点存货，填写《盘点表》。盘点结果如有差异，必要时加大盘点比例或全面盘点。存放方式特殊的或存放在异地的，采取其他程序确定存货的存在性',
      '6 对盘盈、盘亏的存货，查明原因并作记录',
      '7 关注有无代他人保存和来料加工的存货，有无未作账务处理而置于异地的存货',
      '8 对失效、变质等待核销报废的存货，应要求企业首先作出相应处理与说明',
      '9 对正常外购存货，实施市场询价，计算其评估价值',
      '10 选择适当的存货评估方法，分别评估',
      '11 对特殊行业存货，应聘请有关专家进行咨询后确定评估值。对委托加工产品与受托加工产品、委托代销商品与受托代销商品，评估值的确定应当考虑结算方式的差异性',
      '12 核实其他需要说明的事项',
      '13 如有评估增减值，分析评估增减值的原因',
      '14 有无需要报告中特别说明的事项',
    ],
  },

  // ── C3-10/1 存货评估汇总表 ───────────────────────────────────────
  {
    key: 'c3_10_1',
    tab: 'C3-10/1 存货汇总',
    code: 'C3-10/1',
    title: '存货评估汇总表',
    company: COMPANY,
    companyEn: COMPANY_EN,
    kind: 'summary',
    firstColLabel: '存货名称',
    cols: [
      ['存货项数', 'itemCount', 72],
      ['账面价值', 'bookValue', 96],
      ['清查调整数', 'adjustment', 96],
      ['调整后账面值', 'adjustedValue', 104],
      ['评估价值', 'evalValue', 96],
      ['备注', 'remark', 110],
    ],
    fixedRows: [
      { label: '一、市场途径类存货' },
      { label: '其中：1、物资采购', indent: 1 },
      { label: '2、在途材料', indent: 1 },
      { label: '3、原材料', indent: 1 },
      { label: '4、库存商品', indent: 1 },
      { label: '5、发出商品', indent: 1 },
      { label: '6、周转材料', indent: 1 },
      { label: '7、低值易耗品', indent: 1 },
      { label: '二、成本途径类存货' },
      { label: '其中：1、产成品', indent: 1 },
      { label: '2、在产品', indent: 1 },
      { label: '三、其他途径类存货' },
      { label: '其中：1、委托加工物资', indent: 1 },
      { label: '减：存货跌价准备' },
      { label: '存货合计' },
    ],
  },

  // ── C3-10-1/1 材料采购清查评估明细表 ─────────────────────────────
  {
    key: 'c3_10_1_1',
    tab: 'C3-10-1/1 材料采购',
    code: 'C3-10-1/1',
    title: '存货——材料采购清查评估明细表',
    company: COMPANY,
    companyEn: COMPANY_EN,
    kind: 'detail',
    cols: [
      ['序号', 'no', 44],
      ['名称及规格型号', 'name', 150],
      ['供应单位', 'supplier', 110],
      ['计量单位', 'unit', 64],
      BOOK_QPA,
      ['调整后账面值', 'adjustedValue', 96],
      { g: '评估价值', c: [['数量', 'evalQty', 64], ['单价', 'evalPrice', 64], ['金额', 'evalAmt', 88]] },
      ['交叉索引号', 'xref', 84],
      ['备注', 'remark', 80],
    ],
    rows: 20,
    summary: ['本页小计', '合计'],
  },

  // ── C3-10-2/1 在途物资清查评估明细表 ────────────────────────────
  {
    key: 'c3_10_2_1',
    tab: 'C3-10-2/1 在途物资',
    code: 'C3-10-2/1',
    title: '存货——在途物资清查评估明细表',
    company: COMPANY,
    companyEn: COMPANY_EN,
    kind: 'detail',
    cols: [
      ['序号', 'no', 44],
      ['名称及规格型号', 'name', 150],
      ['供应单位', 'supplier', 110],
      ['计量单位', 'unit', 64],
      BOOK_QPA,
      ['调整后账面值', 'adjustedValue', 96],
      { g: '评估价值', c: [['数量', 'evalQty', 64], ['单价', 'evalPrice', 64], ['金额', 'evalAmt', 88]] },
      ['交叉索引号', 'xref', 84],
      ['备注', 'remark', 80],
    ],
    rows: 20,
    summary: ['本页小计', '合计'],
  },

  // ── C3-10-3/1 原材料清查评估明细表 ──────────────────────────────
  {
    key: 'c3_10_3_1',
    tab: 'C3-10-3/1 原材料明细',
    code: 'C3-10-3/1',
    title: '存货——原材料清查评估明细表',
    company: COMPANY,
    companyEn: COMPANY_EN,
    kind: 'detail',
    cols: [
      ['序号', 'no', 44],
      ['名称及规格型号', 'name', 150],
      ['计量单位', 'unit', 64],
      BOOK_QPA,
      ['存放地点', 'location', 90],
      ['外埠确认数量', 'offsiteQty', 96],
      ['盘存盈亏(金额)', 'inventoryDiff', 100],
      ['实际数量', 'actualQty', 80],
      ['调整后账面值', 'adjustedValue', 96],
      { g: '评估价值', c: [['单价', 'evalPrice', 64], ['金额', 'evalAmt', 88]] },
      ['交叉索引号', 'xref', 84],
      ['备注', 'remark', 80],
    ],
    rows: 13,
    summary: ['本页小计', '合计'],
  },

  // ── C3-10-3/2 （原材料）作业分析表 ──────────────────────────────
  {
    key: 'c3_10_3_2',
    tab: 'C3-10-3/2 原材料作业',
    code: 'C3-10-3/2',
    title: '存货——（原材料）作业分析表',
    company: COMPANY,
    companyEn: COMPANY_EN,
    kind: 'detail',
    cols: [
      ['序号', 'no', 44],
      ['名称及规格型号', 'name', 150],
      ['计量单位', 'unit', 64],
      BOOK_QPA,
      ['调整后账面值', 'adjustedValue', 96],
      MARKET_CALC,
      { g: '评估价值', c: [['数量', 'evalQty', 64], ['单价', 'evalPrice', 64], ['金额', 'evalAmt', 88]] },
      ['交叉索引号', 'xref', 84],
      ['备注', 'remark', 80],
    ],
    rows: 13,
    summary: ['本页小计', '合计'],
  },

  // ── C3-10-(  )/(  ) 存货抽查盘点表 ──────────────────────────────
  {
    key: 'c3_10_spot_check',
    tab: 'C3-10-(  ) 抽查盘点',
    code: 'C3-10-(  )/(  )',
    title: '存货--（          ）抽查盘点表',
    company: COMPANY,
    companyEn: COMPANY_EN,
    kind: 'detail',
    footerFields: [
      ['仓库保管', 'warehouseKeeper'],
      ['企业会计', 'companyAccountant'],
      ['评估人员', 'appraiser'],
      ['复核人', 'reviewer'],
      ['盘点日期', 'checkDate', 'date'],
    ],
    cols: [
      ['存货名称', 'invName', 90],
      ['明细表序号', 'detailNo', 72],
      ['品名及规格型号', 'name', 130],
      ['计量单位', 'unit', 56],
      { g: '申报（基准日）', c: [['单价', 'declPrice', 64], ['数量', 'declQty', 60], ['金额', 'declAmt', 84]] },
      { g: '基准日至盘点日', c: [['出库数量', 'outQty', 68], ['入库数量', 'inQty', 68]] },
      { g: '盘点日', c: [['应存数量', 'shouldQty', 68], ['实存数量', 'actualQty', 68]] },
      { g: '抽查盘盈(+)/亏(-)', c: [['数量', 'diffQty', 60], ['金额', 'diffAmt', 80]] },
      { g: '品质状况', c: [['正常', 'qNormal', 44], ['残次', 'qDefect', 44], ['毁损', 'qDamage', 44], ['滞销', 'qSlow', 44], ['非正常', 'qAbnormal', 48]] },
      ['交叉索引号', 'xref', 80],
      ['备注', 'remark', 72],
    ],
    rows: 20,
    summary: ['合计'],
    disclosureLabel: '1、盘点数量____项，占总数量的____％；盘点对应的金额____元，占总金额的____％。2、品质状况在相应的栏内打“√”。3、披露及调整事项说明：',
  },

  // ── C3-10-4/1 库存商品清查评估明细表 ────────────────────────────
  {
    key: 'c3_10_4_1',
    tab: 'C3-10-4/1 库存商品',
    code: 'C3-10-4/1',
    title: '存货——库存商品清查评估明细表',
    company: COMPANY,
    companyEn: COMPANY_EN,
    kind: 'detail',
    cols: [
      ['序号', 'no', 44],
      ['名称及规格型号', 'name', 150],
      ['计量单位', 'unit', 64],
      BOOK_QPA,
      ['存放地点', 'location', 90],
      ['外埠确认数量', 'offsiteQty', 96],
      ['盘存盈亏(金额)', 'inventoryDiff', 100],
      ['实际数量', 'actualQty', 80],
      ['调整后账面值', 'adjustedValue', 96],
      { g: '评估价值', c: [['单价', 'evalPrice', 64], ['金额', 'evalAmt', 88]] },
      ['交叉索引号', 'xref', 84],
      ['备注', 'remark', 80],
    ],
    rows: 12,
    summary: ['本页小计', '合计'],
  },

  // ── C3-10-(  )/6 存货询价记录表 ─────────────────────────────────
  {
    key: 'c3_10_inquiry',
    tab: 'C3-10-(  )/6 询价记录',
    code: 'C3-10-(  )/6',
    title: '存货--（          ）询价记录表',
    company: COMPANY,
    companyEn: COMPANY_EN,
    kind: 'detail',
    cols: [
      ['存货名称', 'invName', 90],
      ['明细表序号', 'detailNo', 72],
      ['名称及规格型号', 'name', 140],
      ['询价时间', 'inquiryTime', 96],
      { g: '被询价人或单位', c: [['名称', 'inquireeName', 110], ['询价途径', 'inquiryChannel', 96]] },
      ['询价结果', 'inquiryResult', 200],
      ['交叉索引号', 'xref', 84],
      ['备注', 'remark', 80],
    ],
    rows: 16,
    summary: [],
    disclosureLabel: '有关事项说明：',
  },

  // ── C3-10-5/1 发出商品清查评估明细表 ────────────────────────────
  {
    key: 'c3_10_5_1',
    tab: 'C3-10-5/1 发出商品明细',
    code: 'C3-10-5/1',
    title: '存货——发出商品清查评估明细表',
    company: COMPANY,
    companyEn: COMPANY_EN,
    kind: 'detail',
    cols: [
      ['序号', 'no', 44],
      ['名称及规格型号', 'name', 140],
      ['发往单位', 'sendTo', 100],
      ['计量单位', 'unit', 60],
      BOOK_QPA,
      ['存放地点', 'location', 88],
      ['外埠确认数量', 'offsiteQty', 92],
      ['盘存盈亏(金额)', 'inventoryDiff', 96],
      ['实际数量', 'actualQty', 76],
      ['调整后账面值', 'adjustedValue', 92],
      { g: '评估价值', c: [['数量', 'evalQty', 60], ['单价', 'evalPrice', 60], ['金额', 'evalAmt', 84]] },
      ['交叉索引号', 'xref', 80],
      ['备注', 'remark', 72],
    ],
    rows: 12,
    summary: ['本页小计', '合计'],
  },

  // ── C3-10-5/2 发出商品作业分析表 ───────────────────────────────
  {
    key: 'c3_10_5_2',
    tab: 'C3-10-5/2 发出商品作业',
    code: 'C3-10-5/2',
    title: '存货——发出商品作业分析表',
    company: COMPANY,
    companyEn: COMPANY_EN,
    kind: 'detail',
    cols: [
      ['序号', 'no', 44],
      ['名称及规格型号', 'name', 150],
      ['计量单位', 'unit', 64],
      BOOK_QPA,
      ['调整后账面值', 'adjustedValue', 96],
      MARKET_CALC,
      { g: '评估价值', c: [['数量', 'evalQty', 64], ['单价', 'evalPrice', 64], ['金额', 'evalAmt', 88]] },
      ['交叉索引号', 'xref', 84],
      ['备注', 'remark', 80],
    ],
    rows: 12,
    summary: ['本页小计', '合计'],
  },

  // ── C3-10-6/1 委托加工清查评估明细表 ────────────────────────────
  {
    key: 'c3_10_6_1',
    tab: 'C3-10-6/1 委托加工',
    code: 'C3-10-6/1',
    title: '存货——委托加工清查评估明细表',
    company: COMPANY,
    companyEn: COMPANY_EN,
    kind: 'detail',
    cols: [
      ['序号', 'no', 44],
      ['名称及规格型号', 'name', 150],
      ['加工单位', 'processUnit', 110],
      ['计量单位', 'unit', 64],
      BOOK_QPA,
      ['调整后账面值', 'adjustedValue', 96],
      ['实际数量', 'actualQty', 80],
      { g: '评估价值', c: [['单价', 'evalPrice', 64], ['金额', 'evalAmt', 88]] },
      ['交叉索引号', 'xref', 84],
      ['备注', 'remark', 80],
    ],
    rows: 12,
    summary: ['本页小计', '合计'],
  },

  // ── C3-10-7/1 周转材料清查评估明细表 ────────────────────────────
  {
    key: 'c3_10_7_1',
    tab: 'C3-10-7/1 周转材料明细',
    code: 'C3-10-7/1',
    title: '存货——周转材料清查评估明细表',
    company: COMPANY,
    companyEn: COMPANY_EN,
    kind: 'detail',
    cols: [
      ['序号', 'no', 44],
      ['名称及规格型号', 'name', 150],
      ['计量单位', 'unit', 64],
      BOOK_QPA,
      ['调整后账面值', 'adjustedValue', 96],
      ['存放地点', 'location', 90],
      ['盘存盈亏(金额)', 'inventoryDiff', 100],
      ['实际数量', 'actualQty', 80],
      { g: '评估价值', c: [['数量', 'evalQty', 64], ['单价', 'evalPrice', 64], ['金额', 'evalAmt', 88]] },
      ['交叉索引号', 'xref', 84],
      ['备注', 'remark', 80],
    ],
    rows: 12,
    summary: ['本页小计', '合计'],
  },

  // ── C3-10-7/2 周转材料作业分析表 ───────────────────────────────
  {
    key: 'c3_10_7_2',
    tab: 'C3-10-7/2 周转材料作业',
    code: 'C3-10-7/2',
    title: '存货——周转材料作业分析表',
    company: COMPANY,
    companyEn: COMPANY_EN,
    kind: 'detail',
    cols: [
      ['序号', 'no', 44],
      ['名称及规格型号', 'name', 150],
      ['计量单位', 'unit', 64],
      BOOK_QPA,
      ['调整后账面值', 'adjustedValue', 96],
      MARKET_CALC,
      { g: '评估价值', c: [['数量', 'evalQty', 64], ['单价', 'evalPrice', 64], ['金额', 'evalAmt', 88]] },
      ['交叉索引号', 'xref', 84],
      ['备注', 'remark', 80],
    ],
    rows: 11,
    summary: ['本页小计', '合计'],
  },

  // ── C3-10-(  )/2 市场途径存货作业分析表 ─────────────────────────
  {
    key: 'c3_10_market',
    tab: 'C3-10-(  )/2 市场途径',
    code: 'C3-10-(  )/2',
    title: '市场途径存货--（          ）作业分析表',
    company: COMPANY,
    companyEn: COMPANY_EN,
    kind: 'detail',
    cols: [
      ['序号', 'no', 44],
      ['名称及规格型号', 'name', 150],
      ['计量单位', 'unit', 64],
      BOOK_QPA,
      ['调整后账面值', 'adjustedValue', 96],
      MARKET_CALC,
      { g: '评估价值', c: [['实际数量', 'evalQty', 68], ['评估单价', 'evalPrice', 72], ['评估金额', 'evalAmt', 88]] },
      ['交叉索引号', 'xref', 84],
      ['备注', 'remark', 80],
    ],
    rows: 12,
    summary: ['本页小计', '合计'],
  },

  // ── C3-10-9/1 成本途径——产成品清查评估明细表 ───────────────────
  {
    key: 'c3_10_9_1',
    tab: 'C3-10-9/1 产成品明细',
    code: 'C3-10-9/1',
    title: '成本途径存货——产成品清查评估明细表',
    company: COMPANY,
    companyEn: COMPANY_EN,
    kind: 'detail',
    cols: [
      ['序号', 'no', 44],
      ['名称及规格型号', 'name', 150],
      ['计量单位', 'unit', 64],
      BOOK_QPA,
      ['存放地点', 'location', 90],
      ['外埠确认数量', 'offsiteQty', 96],
      ['盘存盈亏(金额)', 'inventoryDiff', 100],
      ['实际数量', 'actualQty', 80],
      ['调整后账面值', 'adjustedValue', 96],
      { g: '评估价值', c: [['单价', 'evalPrice', 64], ['金额', 'evalAmt', 88]] },
      ['交叉索引号', 'xref', 84],
      ['备注', 'remark', 80],
    ],
    rows: 12,
    summary: ['本页小计', '合计'],
  },

  // ── C3-10-9/2 成本途径——产成品作业分析表1 ──────────────────────
  {
    key: 'c3_10_9_2',
    tab: 'C3-10-9/2 产成品作业1',
    code: 'C3-10-9/2',
    title: '成本途径存货——产成品作业分析表1',
    company: COMPANY,
    companyEn: COMPANY_EN,
    kind: 'detail',
    cols: [
      ['序号', 'no', 44],
      ['名称及规格型号', 'name', 140],
      ['计量单位', 'unit', 60],
      BOOK_QPA,
      ['调整后账面值', 'adjustedValue', 92],
      ['畅销程度', 'salesLevel', 76],
      PARAM_CALC,
      { g: '评估价值', c: [['数量', 'evalQty', 60], ['单价', 'evalPrice', 60], ['金额', 'evalAmt', 84]] },
      ['交叉索引号', 'xref', 80],
      ['备注', 'remark', 72],
    ],
    rows: 14,
    summary: ['本页小计', '合计'],
  },

  // ── C3-10-9/3 成本途径——产成品作业分析表2 ──────────────────────
  {
    key: 'c3_10_9_3',
    tab: 'C3-10-9/3 产成品作业2',
    code: 'C3-10-9/3',
    title: '成本途径存货——产成品作业分析表2',
    company: COMPANY,
    companyEn: COMPANY_EN,
    kind: 'detail',
    cols: [
      ['序号', 'no', 44],
      ['名称及规格型号', 'name', 150],
      ['计量单位', 'unit', 64],
      BOOK_QPA,
      ['调整后账面值', 'adjustedValue', 96],
      ['畅销程度', 'salesLevel', 76],
      { g: '评估单价测算过程', c: [['账面成本', 'bookCost', 80], ['适当利润', 'properProfit', 80], ['小计', 'calcSubtotal', 64]] },
      { g: '评估价值', c: [['数量', 'evalQty', 64], ['单价', 'evalPrice', 64], ['金额', 'evalAmt', 88]] },
      ['交叉索引号', 'xref', 84],
      ['备注', 'remark', 80],
    ],
    rows: 13,
    summary: ['本页小计', '合计'],
  },

  // ── C3-10-10/1 成本途径——在产品清查评估明细表 ──────────────────
  {
    key: 'c3_10_10_1',
    tab: 'C3-10-10/1 在产品明细',
    code: 'C3-10-10/1',
    title: '成本途径存货——在产品清查评估明细表',
    company: COMPANY,
    companyEn: COMPANY_EN,
    kind: 'detail',
    cols: [
      ['序号', 'no', 44],
      ['名称及规格型号', 'name', 150],
      ['计量单位', 'unit', 64],
      BOOK_QPA,
      ['调整后账面值', 'adjustedValue', 96],
      ['存放地点', 'location', 90],
      ['盘存盈亏(金额)', 'inventoryDiff', 100],
      ['完工率％约当量', 'completionRate', 100],
      ['实际数量', 'actualQty', 80],
      { g: '评估价值', c: [['单价', 'evalPrice', 64], ['金额', 'evalAmt', 88]] },
      ['交叉索引号', 'xref', 84],
      ['备注', 'remark', 80],
    ],
    rows: 12,
    summary: ['本页小计', '合计'],
  },

  // ── C3-10-10/2 成本途径——在产品作业分析表1 ─────────────────────
  {
    key: 'c3_10_10_2',
    tab: 'C3-10-10/2 在产品作业1',
    code: 'C3-10-10/2',
    title: '成本途径存货——在产品作业分析表1',
    company: COMPANY,
    companyEn: COMPANY_EN,
    kind: 'detail',
    cols: [
      ['序号', 'no', 44],
      ['名称及规格型号', 'name', 140],
      ['计量单位', 'unit', 60],
      BOOK_QPA,
      ['调整后账面值', 'adjustedValue', 92],
      ['约当量', 'equivalentQty', 72],
      PARAM_CALC,
      { g: '评估价值', c: [['实际数量', 'evalQty', 68], ['单价', 'evalPrice', 60], ['金额', 'evalAmt', 84]] },
      ['交叉索引号', 'xref', 80],
      ['备注', 'remark', 72],
    ],
    rows: 13,
    summary: ['本页小计', '合计'],
  },

  // ── C3-10-10/3 成本途径——在产品作业分析表2 ─────────────────────
  {
    key: 'c3_10_10_3',
    tab: 'C3-10-10/3 在产品作业2',
    code: 'C3-10-10/3',
    title: '成本途径存货——在产品作业分析表2',
    company: COMPANY,
    companyEn: COMPANY_EN,
    kind: 'detail',
    cols: [
      ['序号', 'no', 44],
      ['名称及规格型号', 'name', 150],
      ['计量单位', 'unit', 64],
      BOOK_QPA,
      ['调整后账面值', 'adjustedValue', 96],
      ['约当量', 'equivalentQty', 72],
      { g: '评估单价测算过程', c: [['账面成本', 'bookCost', 80], ['适当利润', 'properProfit', 80], ['小计', 'calcSubtotal', 64]] },
      { g: '评估价值', c: [['实际数量', 'evalQty', 68], ['单价', 'evalPrice', 64], ['金额', 'evalAmt', 88]] },
      ['交叉索引号', 'xref', 84],
      ['备注', 'remark', 80],
    ],
    rows: 13,
    summary: ['本页小计', '合计'],
  },

  // ── C3-10-(  )/2 其他类存货作业分析表 ──────────────────────────
  {
    key: 'c3_10_other',
    tab: 'C3-10-(  )/2 其他类',
    code: 'C3-10-(  )/2',
    title: '其他类存货--（          ）作业分析表',
    company: COMPANY,
    companyEn: COMPANY_EN,
    kind: 'detail',
    cols: [
      ['序号', 'no', 44],
      ['名称及规格型号', 'name', 140],
      ['委（受）托加工/代销单位名称', 'partnerUnit', 150],
      ['计量单位', 'unit', 60],
      BOOK_QPA,
      ['调整后账面值', 'adjustedValue', 92],
      {
        g: '评估价值',
        c: [
          ['发出材料单价', 'materialPrice', 88],
          ['加工费', 'processFee', 72],
          ['委托加工单位成本', 'entrustedCost', 104],
          ['实际数量', 'evalQty', 68],
          ['单价', 'evalPrice', 60],
          ['金额', 'evalAmt', 84],
        ],
      },
      ['交叉索引号', 'xref', 80],
      ['备注', 'remark', 72],
    ],
    rows: 14,
    summary: ['合计'],
  },
]

// 把列 DSL 展平成叶子列数组
export function leafCols(cols) {
  const out = []
  for (const c of cols) {
    if (Array.isArray(c)) out.push({ label: c[0], field: c[1], width: c[2] || null })
    else for (const child of c.c) out.push({ label: child[0], field: child[1], width: child[2] || null })
  }
  return out
}
