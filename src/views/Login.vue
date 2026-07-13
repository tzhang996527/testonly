<template>
  <div class="login-page">
    <div class="login-box">
      <div class="login-header">
        <el-icon class="app-icon"><DataAnalysis /></el-icon>
        <h2>{{ t('login.title') }}</h2>
        <p class="subtitle">{{ t('login.subtitle') }}</p>
      </div>

      <el-form :model="form" :rules="rules" ref="formRef" label-position="top">
        <el-form-item :label="t('login.username')" prop="username">
          <el-input
            v-model="form.username"
            :placeholder="t('login.usernamePlaceholder')"
            prefix-icon="User"
            size="large"
          />
        </el-form-item>
        <el-form-item :label="t('login.password')" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            :placeholder="t('login.passwordPlaceholder')"
            prefix-icon="Lock"
            size="large"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <div class="login-options">
          <el-checkbox v-model="rememberMe">{{ t('login.rememberMe') }}</el-checkbox>
          <el-link type="primary">{{ t('login.forgotPassword') }}</el-link>
        </div>
        <el-button
          type="primary"
          size="large"
          :loading="loading"
          style="width:100%"
          @click="handleLogin"
        >
          {{ t('login.loginBtn') }}
        </el-button>
      </el-form>

      <el-divider>演示账号</el-divider>
      <div class="demo-accounts">
        <el-tag
          v-for="acc in demoAccounts"
          :key="acc.username"
          class="demo-tag"
          @click="fillDemo(acc)"
        >
          {{ acc.name }} ({{ acc.username }}/123456)
        </el-tag>
      </div>

      <div class="locale-switch">
        <el-radio-group v-model="currentLocale" size="small" @change="changeLocale">
          <el-radio-button value="zh-CN">中文</el-radio-button>
          <el-radio-button value="en-US">English</el-radio-button>
        </el-radio-group>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth.js'
import { useAppStore } from '@/stores/app.js'
import { DataAnalysis } from '@element-plus/icons-vue'

const { t, locale } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const appStore = useAppStore()

const formRef = ref()
const loading = ref(false)
const rememberMe = ref(true)
const currentLocale = ref(appStore.locale)

const form = ref({ username: 'admin', password: '123456' })
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

const demoAccounts = [
  { username: 'admin', name: '管理员' },
  { username: 'zhang.wei', name: '张伟(评估师)' },
  { username: 'chen.ceo', name: '陈总(总经理)' },
]

function fillDemo(acc) {
  form.value.username = acc.username
  form.value.password = '123456'
}

async function handleLogin() {
  await formRef.value.validate()
  loading.value = true
  try {
    await authStore.login(form.value.username, form.value.password)
    ElMessage.success('登录成功')
    router.push('/dashboard')
  } catch (e) {
    ElMessage.error(e.message || '登录失败')
  } finally {
    loading.value = false
  }
}

function changeLocale(val) {
  locale.value = val
  appStore.setLocale(val)
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #001529 0%, #0d2b4e 50%, #1677ff22 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-box {
  background: white;
  border-radius: 12px;
  padding: 40px 48px;
  width: 420px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.app-icon {
  font-size: 48px;
  color: #1677ff;
}

.login-header h2 {
  margin: 12px 0 8px;
  font-size: 22px;
  color: #262626;
}

.subtitle {
  color: #8c8c8c;
  font-size: 13px;
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.demo-accounts {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.demo-tag {
  cursor: pointer;
  font-size: 12px;
}

.locale-switch {
  text-align: center;
  margin-top: 24px;
}
</style>
