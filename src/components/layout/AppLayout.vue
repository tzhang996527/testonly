<template>
  <el-container class="app-layout">
    <!-- Sidebar -->
    <el-aside :width="sidebarWidth" class="app-aside">
      <div class="logo-area">
        <el-icon class="logo-icon"><DataAnalysis /></el-icon>
        <span v-if="!appStore.sidebarCollapsed" class="logo-text">资产评估系统</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        :collapse="appStore.sidebarCollapsed"
        :router="true"
        class="sidebar-menu"
        background-color="#001529"
        text-color="#ffffffa6"
        active-text-color="#ffffff"
      >
        <el-menu-item index="/dashboard">
          <el-icon><Odometer /></el-icon>
          <template #title>{{ t('nav.dashboard') }}</template>
        </el-menu-item>

        <el-sub-menu index="project">
          <template #title>
            <el-icon><Document /></el-icon>
            <span>{{ t('nav.project') }}</span>
          </template>
          <el-menu-item index="/project">{{ t('nav.projectList') }}</el-menu-item>
          <el-menu-item index="/project/create">{{ t('nav.projectCreate') }}</el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/assets">
          <el-icon><Box /></el-icon>
          <template #title>{{ t('nav.assets') }}</template>
        </el-menu-item>

        <el-menu-item index="/reports">
          <el-icon><TrendCharts /></el-icon>
          <template #title>{{ t('nav.reports') }}</template>
        </el-menu-item>

        <el-sub-menu index="admin">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>{{ t('nav.admin') }}</span>
          </template>
          <el-menu-item index="/admin/users">{{ t('nav.userManage') }}</el-menu-item>
          <el-menu-item index="/admin/roles">{{ t('nav.roleManage') }}</el-menu-item>
          <el-menu-item index="/admin/flow-config">{{ t('nav.flowConfig') }}</el-menu-item>
          <el-menu-item index="/admin/config">配置中心</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>

    <el-container class="main-container">
      <!-- Header -->
      <el-header class="app-header">
        <div class="header-left">
          <el-icon class="collapse-btn" @click="appStore.toggleSidebar()">
            <Fold v-if="!appStore.sidebarCollapsed" />
            <Expand v-else />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">{{ t('nav.dashboard') }}</el-breadcrumb-item>
            <el-breadcrumb-item v-for="crumb in breadcrumbs" :key="crumb.path">
              {{ crumb.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-select
            v-model="currentLocale"
            size="small"
            style="width:110px;margin-right:16px"
            @change="changeLocale"
          >
            <el-option label="中文" value="zh-CN" />
            <el-option label="English" value="en-US" />
          </el-select>
          <el-badge :value="3" class="notification-badge">
            <el-icon style="font-size:20px;cursor:pointer"><Bell /></el-icon>
          </el-badge>
          <el-dropdown class="user-dropdown" @command="handleCommand">
            <div class="user-info">
              <el-avatar :size="32" style="background:#1677ff">{{ authStore.userName.slice(0,1) }}</el-avatar>
              <span class="user-name">{{ authStore.userName }}</span>
              <el-icon><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">{{ t('nav.profile') }}</el-dropdown-item>
                <el-dropdown-item command="logout" divided>{{ t('nav.logout') }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- Main Content -->
      <el-main class="app-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app.js'
import { useAuthStore } from '@/stores/auth.js'
import {
  Odometer, Document, Box, TrendCharts, Setting, Fold, Expand,
  Bell, ArrowDown, DataAnalysis,
} from '@element-plus/icons-vue'

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const authStore = useAuthStore()

const sidebarWidth = computed(() => appStore.sidebarCollapsed ? '64px' : '220px')
const activeMenu = computed(() => '/' + route.path.split('/').slice(1, 3).join('/') || '/dashboard')
const currentLocale = ref(appStore.locale)

const routeTitleMap = {
  dashboard: '工作台',
  project: '评估立项',
  assets: '资产台账',
  reports: '报表中心',
  admin: '系统管理',
}

const breadcrumbs = computed(() => {
  const parts = route.path.split('/').filter(Boolean)
  return parts.slice(0, 2).map(p => ({ path: '/' + p, title: routeTitleMap[p] || p }))
})

function changeLocale(val) {
  locale.value = val
  appStore.setLocale(val)
}

function handleCommand(cmd) {
  if (cmd === 'logout') {
    authStore.logout()
    router.push('/login')
  }
}
</script>

<style scoped>
.app-layout {
  height: 100vh;
  overflow: hidden;
}

.app-aside {
  background: #001529;
  transition: width 0.3s;
  overflow: hidden;
}

.logo-area {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  color: white;
  overflow: hidden;
}

.logo-icon {
  font-size: 24px;
  color: #1677ff;
  flex-shrink: 0;
}

.logo-text {
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
}

.sidebar-menu {
  border-right: none;
  height: calc(100vh - 64px);
  overflow-y: auto;
  overflow-x: hidden;
}

.app-header {
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 64px;
  box-shadow: 0 1px 4px rgba(0,21,41,0.08);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.collapse-btn {
  font-size: 20px;
  cursor: pointer;
  color: #595959;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.notification-badge :deep(.el-badge__content) {
  top: 4px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.user-name {
  font-size: 14px;
  color: #262626;
}

.main-container {
  flex: 1;
  overflow: hidden;
}

.app-main {
  background: #f5f7fa;
  overflow-y: auto;
  padding: 20px;
}
</style>
