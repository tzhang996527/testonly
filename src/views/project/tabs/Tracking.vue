<template>
  <div class="tracking-tab">
    <el-row :gutter="20">
      <el-col :span="14">
        <el-card shadow="never" header="后续跟踪记录">
          <div style="margin-bottom:12px;display:flex;justify-content:flex-end">
            <el-button type="primary" :icon="Plus" @click="showAddDialog = true">新增跟踪记录</el-button>
          </div>
          <el-timeline>
            <el-timeline-item
              v-for="item in trackings"
              :key="item.id"
              :timestamp="item.date"
              placement="top"
              type="primary"
            >
              <el-card shadow="never" class="tracking-card">
                <div class="tracking-header">
                  <span class="tracking-type">
                    <el-tag :type="typeColors[item.type]" size="small">{{ item.typeLabel }}</el-tag>
                  </span>
                  <span class="tracking-user">{{ item.recorder }}</span>
                </div>
                <div class="tracking-content">{{ item.content }}</div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card shadow="never" header="报告使用情况">
          <el-table :data="usages" size="small">
            <el-table-column label="使用单位" prop="org" />
            <el-table-column label="使用目的" prop="purpose" />
            <el-table-column label="使用日期" prop="date" width="110" />
          </el-table>
        </el-card>
        <el-card shadow="never" header="后续跟踪统计" style="margin-top:16px">
          <el-descriptions :column="1" size="small" border>
            <el-descriptions-item label="跟踪次数">3 次</el-descriptions-item>
            <el-descriptions-item label="最近跟踪">2024-07-01</el-descriptions-item>
            <el-descriptions-item label="下次跟踪">2024-10-01</el-descriptions-item>
            <el-descriptions-item label="跟踪状态">
              <el-tag type="success" size="small">正常</el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="showAddDialog" title="新增跟踪记录" width="500px">
      <el-form :model="addForm" label-width="100px">
        <el-form-item label="跟踪类型">
          <el-select v-model="addForm.type">
            <el-option label="报告使用反馈" value="usage" />
            <el-option label="价值变化监控" value="valueChange" />
            <el-option label="法律诉讼变化" value="legal" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="跟踪日期">
          <el-date-picker v-model="addForm.date" type="date" value-format="YYYY-MM-DD" />
        </el-form-item>
        <el-form-item label="跟踪内容">
          <el-input v-model="addForm.content" type="textarea" :rows="4" placeholder="详细描述跟踪情况" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="addTracking">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const showAddDialog = ref(false)
const addForm = ref({ type: 'usage', date: '', content: '' })

const typeColors = { usage: 'primary', valueChange: 'warning', legal: 'danger', other: 'info' }

const trackings = ref([
  { id: 1, date: '2024-07-01', type: 'usage', typeLabel: '报告使用反馈', recorder: '张伟', content: '委托方已将评估报告提交至银行，银行已接受评估结论，抵押贷款已顺利办理。' },
  { id: 2, date: '2024-06-15', type: 'valueChange', typeLabel: '价值变化监控', recorder: '李娜', content: '对评估资产进行定期复核，市场整体价格较评估基准日上涨约3%，评估结论仍具参考价值。' },
  { id: 3, date: '2024-06-01', type: 'usage', typeLabel: '报告使用反馈', recorder: '张伟', content: '评估报告已正式出具并移交委托方，委托方确认签收。' },
])

const usages = ref([
  { org: '某科技股份有限公司', purpose: '股权转让', date: '2024-06-05' },
  { org: '某商业银行', purpose: '抵押担保', date: '2024-07-03' },
])

function addTracking() {
  if (!addForm.value.content) { ElMessage.warning('请填写跟踪内容'); return }
  const typeLabels = { usage: '报告使用反馈', valueChange: '价值变化监控', legal: '法律诉讼变化', other: '其他' }
  trackings.value.unshift({
    id: Date.now(),
    date: addForm.value.date || new Date().toISOString().slice(0, 10),
    type: addForm.value.type,
    typeLabel: typeLabels[addForm.value.type],
    recorder: '当前用户',
    content: addForm.value.content,
  })
  showAddDialog.value = false
  addForm.value = { type: 'usage', date: '', content: '' }
  ElMessage.success('跟踪记录已保存')
}
</script>

<style scoped>
.tracking-card { margin-bottom: 4px; }
.tracking-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.tracking-user { color: #8c8c8c; font-size: 13px; }
.tracking-content { color: #595959; line-height: 1.6; }
</style>
