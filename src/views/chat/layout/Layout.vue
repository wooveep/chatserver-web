<!--
 * @Author: cloudyi.li
 * @Date: 2023-03-23 13:51:37
 * @LastEditTime: 2023-06-14 19:45:29
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/views/chat/layout/Layout.vue
-->
<script setup lang='ts'>
import { computed, onMounted } from 'vue'
import { NLayout, NLayoutContent } from 'naive-ui'
import { useRouter } from 'vue-router'
import { useChat } from '../hooks/useChat'
import Sider from './sider/index.vue'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { useAppStore, useAuthStore, useChatStore } from '@/store'
// const Permission = defineAsyncComponent(() => import('./Permission.vue'))

const router = useRouter()
const appStore = useAppStore()
const chatStore = useChatStore()
const authStore = useAuthStore()
const { fetchChatHistoryList, resetChat } = useChat()

router.replace({ name: 'Chat', params: { chat_uuid: chatStore.active } })

const { isMobile } = useBasicLayout()

const collapsed = computed(() => appStore.siderCollapsed)

const needPermission = computed(() => !authStore.token)

const getMobileClass = computed(() => {
  if (isMobile.value)
    return ['rounded-none', 'shadow-none']
  return ['border', 'rounded-md', 'shadow-md', 'dark:border-neutral-800']
})

const getContainerClass = computed(() => {
  return [
    'h-full',
    { 'pl-[320px]': !isMobile.value && !collapsed.value },
  ]
})

onMounted(async () => {
  if (!needPermission.value)
    await fetchChatHistoryList()
  else
    window.location.replace('/#/login')
})

window.onbeforeunload = function (e) {
  e = e || window.event
  if (e)
    resetChat()
  resetChat()
}
</script>

<template>
  <div class="h-full dark:bg-[#24272e] transition-all" :class="[isMobile ? 'p-0' : 'p-4']">
    <div class="h-full overflow-hidden" :class="getMobileClass">
      <NLayout class="z-40 transition" :class="getContainerClass" has-sider>
        <Sider />
        <NLayoutContent class="h-full">
          <RouterView v-slot="{ Component, route }">
            <component :is="Component" :key="route.fullPath" />
          </RouterView>
        </NLayoutContent>
      </NLayout>
    </div>
    <!-- <Permission :visible="needPermission" /> -->
  </div>
</template>
