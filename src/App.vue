<!--
 * @Author: cloudyi.li
 * @Date: 2023-03-23 13:51:37
 * @LastEditTime: 2023-04-24 16:58:51
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/App.vue
-->
<script setup lang="ts">
import { NConfigProvider } from 'naive-ui'
import { computed, onMounted } from 'vue'
import { useAuthStore, useUserStore } from './store'
import { NaiveProvider } from '@/components/common'
import { useTheme } from '@/hooks/useTheme'
import { useLanguage } from '@/hooks/useLanguage'

const { theme, themeOverrides } = useTheme()
const { language } = useLanguage()
const authStore = useAuthStore()
async function refreshUserInfo() {
  const userStore = useUserStore()
  await userStore.getUserInfo()
}
const needPermission = computed(() => !authStore.token)

onMounted(async () => {
  if (!needPermission.value)
    await refreshUserInfo()
})
</script>

<template>
  <NConfigProvider
    class="h-full"
    :theme="theme"
    :theme-overrides="themeOverrides"
    :locale="language"
  >
    <NaiveProvider>
      <RouterView />
    </NaiveProvider>
  </NConfigProvider>
</template>
