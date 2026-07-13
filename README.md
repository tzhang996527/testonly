# 资产评估管理系统

基于 Vue 3 + Vite + Element Plus 的资产评估全流程 ERP Web 应用，支持中英文 i18n，数据采用 Mock API。

## 技术栈

| 技术 | 说明 |
|------|------|
| Vue 3 | 前端框架（Composition API） |
| Vite 5 | 构建工具 |
| Element Plus | UI 组件库 |
| Pinia | 状态管理 |
| Vue Router 4 | 路由 |
| Vue I18n 9 | 国际化（默认中文） |
| Day.js | 日期处理 |

## 快速开始

```bash
npm install
npm run dev      # 开发服务器 http://localhost:5173
npm run build    # 生产构建
npm run preview  # 预览构建产物
```

### 演示账号

| 用户名 | 密码 | 角色 |
|--------|------|------|
| admin | 123456 | 系统管理员 |
| zhang.wei | 123456 | 评估专业人员 |
| chen.ceo | 123456 | 总经理（可审批） |
| li.manager | 123456 | 部门负责人 |
| wang.riskctrl | 123456 | 风控 |

## 评估流程

系统实现完整的 9 步资产评估流程：

```
评估立项 → 前期工作 → 清查盘点 → 资料收集 → 评定估算
         → 内部审核 → 结果确认 → 报告归档 → 后续跟踪
```

## 项目结构

```
erp2/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── favicon.svg
└── src/
    ├── main.js                         # 应用入口，注册插件
    ├── App.vue                         # 根组件
    │
    ├── api/
    │   ├── mockData.js                 # Mock 数据（项目、资产、用户等）
    │   └── index.js                    # Mock API（模拟网络延迟，后续替换为真实接口）
    │
    ├── i18n/
    │   ├── zh-CN.js                    # 中文翻译（默认）
    │   ├── en-US.js                    # 英文翻译
    │   └── index.js                    # i18n 初始化
    │
    ├── router/
    │   └── index.js                    # 路由配置（含路由守卫）
    │
    ├── stores/
    │   ├── auth.js                     # 登录/用户信息（持久化到 localStorage）
    │   ├── project.js                  # 评估项目状态
    │   └── app.js                      # 全局 UI 状态（侧边栏折叠、语言）
    │
    ├── components/
    │   ├── layout/
    │   │   └── AppLayout.vue           # 整体布局（侧边栏 + Header + 主内容区）
    │   └── common/
    │       ├── StatusTag.vue           # 状态标签（自动映射颜色和 i18n 文本）
    │       ├── WorkflowProgress.vue    # 9 步流程进度条
    │       └── ApprovalFlow.vue        # 审批流时间轴
    │
    └── views/
        ├── Login.vue                   # 登录页（含演示账号快速填充）
        ├── Dashboard.vue               # 工作台（待办、统计、动态）
        │
        ├── project/
        │   ├── ProjectList.vue         # 立项列表（筛选、状态、进度）
        │   ├── ProjectForm.vue         # 新建立项表单
        │   ├── ProjectDetail.vue       # 项目详情容器（Tab 导航 + 流程进度）
        │   └── tabs/
        │       ├── Overview.vue        # 基本信息 + 审批流
        │       ├── PreWork.vue         # 前期工作（合同、资料清单、评估计划）
        │       ├── Inventory.vue       # 清查盘点（差异表、勘察记录）
        │       ├── Collection.vue      # 资料收集（分类上传、在线管理）
        │       ├── Estimation.vue      # 评定估算（资产明细、汇总统计）
        │       ├── ReviewApproval.vue  # 内部审核（三级串行审批）
        │       ├── Confirmation.vue    # 结果确认（锁定机制、变更流程入口）
        │       ├── Archive.vue         # 报告归档（文档清单、报告生成）
        │       └── Tracking.vue        # 后续跟踪（跟踪记录、报告使用情况）
        │
        ├── assets/
        │   └── AssetList.vue           # 资产台账（原值/净值/评估值/增值率）
        │
        ├── reports/
        │   └── ReportCenter.vue        # 报表中心（6 类报表入口 + 最近报表）
        │
        └── admin/
            ├── UserManage.vue          # 用户管理
            ├── RoleManage.vue          # 角色权限配置（权限树）
            └── FlowConfig.vue          # 审批流配置
```

## 替换真实 API

所有接口集中在 `src/api/index.js`，Mock 实现与接口签名一致，替换时只需修改对应方法的实现：

```js
// 示例：将 projectApi.list 替换为真实请求
export const projectApi = {
  async list(params) {
    const res = await axios.get('/api/projects', { params })
    return res.data
  },
  // ...
}
```

## 权限角色

| 角色 | 说明 |
|------|------|
| `admin` | 系统管理员，全部权限 |
| `assessor` | 评估专业人员，负责流程操作 |
| `deptManager` | 部门负责人，一级审批 |
| `riskControl` | 风控，立项审批节点 |
| `office` | 办公室，立项/前期工作审批节点 |
| `ceo` | 总经理，最终审批 |
| `chiefEngineer` | 总师室，评估报告二级审核 |
