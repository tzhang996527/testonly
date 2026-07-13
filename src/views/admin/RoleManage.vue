<template>
  <div>
    <div class="page-header">
      <h3>角色管理</h3>
    </div>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="never" header="角色列表">
          <el-menu :default-active="selectedRole" @select="selectedRole = $event">
            <el-menu-item v-for="role in roles" :key="role.key" :index="role.key">
              <el-tag :type="role.tagType" size="small" style="margin-right:8px">{{ role.label }}</el-tag>
            </el-menu-item>
          </el-menu>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card shadow="never" :header="'权限配置: ' + (roles.find(r=>r.key===selectedRole)?.label || '')">
          <el-tree :data="permTree" show-checkbox node-key="id" :default-checked-keys="defaultChecked" :props="{ label: 'label', children: 'children' }" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const selectedRole = ref('assessor')

const roles = [
  { key: 'admin', label: '系统管理员', tagType: 'danger' },
  { key: 'assessor', label: '评估专业人员', tagType: 'primary' },
  { key: 'deptManager', label: '部门负责人', tagType: 'warning' },
  { key: 'chiefEngineer', label: '总师室', tagType: 'warning' },
  { key: 'ceo', label: '总经理', tagType: 'success' },
  { key: 'riskControl', label: '风控', tagType: '' },
]

const permTree = [
  { id: 1, label: '评估立项', children: [
    { id: 11, label: '查看' }, { id: 12, label: '创建' }, { id: 13, label: '编辑' }, { id: 14, label: '提交审批' },
  ]},
  { id: 2, label: '清查盘点', children: [
    { id: 21, label: '查看' }, { id: 22, label: '录入盘点数据' }, { id: 23, label: '处理差异' },
  ]},
  { id: 3, label: '资料收集', children: [
    { id: 31, label: '查看' }, { id: 32, label: '上传资料' }, { id: 33, label: '删除资料' },
  ]},
  { id: 4, label: '评定估算', children: [
    { id: 41, label: '查看' }, { id: 42, label: '录入估算' }, { id: 43, label: '修改估算' },
  ]},
  { id: 5, label: '审核审批', children: [
    { id: 51, label: '查看' }, { id: 52, label: '一级审核' }, { id: 53, label: '二级审核' }, { id: 54, label: '最终审批' },
  ]},
  { id: 6, label: '资产台账', children: [
    { id: 61, label: '查看' }, { id: 62, label: '编辑' }, { id: 63, label: '导出' },
  ]},
  { id: 7, label: '系统管理', children: [
    { id: 71, label: '用户管理' }, { id: 72, label: '角色管理' }, { id: 73, label: '流程配置' },
  ]},
]

const defaultChecked = [11, 12, 13, 14, 21, 22, 23, 31, 32, 41, 42, 61, 63]
</script>

<style scoped>
.page-header { display: flex; align-items: center; margin-bottom: 16px; }
.page-header h3 { margin: 0; font-size: 20px; font-weight: 600; }
</style>
