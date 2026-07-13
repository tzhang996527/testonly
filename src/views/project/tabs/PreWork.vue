<template>
  <div class="prework-tab">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="never" header="业务委托合同">
          <el-form label-width="120px">
            <el-form-item label="合同编号">
              <el-input v-model="form.contractNo" placeholder="合同编号" />
            </el-form-item>
            <el-form-item label="委托单位">
              <el-input v-model="form.clientName" placeholder="委托单位名称" />
            </el-form-item>
            <el-form-item label="签订日期">
              <el-date-picker v-model="form.signDate" type="date" value-format="YYYY-MM-DD" />
            </el-form-item>
            <el-form-item label="合同金额">
              <el-input-number v-model="form.amount" :precision="2" :min="0" />
            </el-form-item>
            <el-form-item label="合同附件">
              <el-upload action="#" :auto-upload="false" accept=".pdf,.docx">
                <el-button size="small" type="primary">上传合同</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="savePreWork">保存</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never" header="资料清单">
          <div class="checklist">
            <div v-for="item in checklist" :key="item.id" class="check-item">
              <el-checkbox v-model="item.done">{{ item.label }}</el-checkbox>
              <el-tag v-if="item.done" type="success" size="small">已完成</el-tag>
              <el-tag v-else type="warning" size="small">待完成</el-tag>
            </div>
          </div>
        </el-card>

        <el-card shadow="never" header="评估计划" style="margin-top:16px">
          <el-form label-width="120px">
            <el-form-item label="计划开始日期">
              <el-date-picker v-model="form.planStart" type="date" value-format="YYYY-MM-DD" />
            </el-form-item>
            <el-form-item label="计划完成日期">
              <el-date-picker v-model="form.planEnd" type="date" value-format="YYYY-MM-DD" />
            </el-form-item>
            <el-form-item label="人员安排">
              <el-select v-model="form.members" multiple placeholder="选择参与人员">
                <el-option label="张伟" value="张伟" />
                <el-option label="李娜" value="李娜" />
                <el-option label="王磊" value="王磊" />
              </el-select>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'

const form = reactive({
  contractNo: 'HT-2024-001',
  clientName: '某科技股份有限公司',
  signDate: '2024-01-20',
  amount: 150000,
  planStart: '2024-02-01',
  planEnd: '2024-03-31',
  members: ['张伟', '李娜'],
})

const checklist = reactive([
  { id: 1, label: '签订业务委托合同', done: true },
  { id: 2, label: '提供资产清单', done: true },
  { id: 3, label: '制定评估计划', done: true },
  { id: 4, label: '完成人员安排', done: false },
  { id: 5, label: '预沟通确认', done: false },
])

function savePreWork() {
  ElMessage.success('前期工作信息已保存')
}
</script>

<style scoped>
.checklist { display: flex; flex-direction: column; gap: 12px; }
.check-item { display: flex; align-items: center; justify-content: space-between; padding: 4px 0; }
</style>
