<!--
 * @Author: cloudyi.li
 * @Date: 2023-06-10 22:19:17
 * @LastEditTime: 2023-06-11 13:43:34
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/views/admin/layout/Layout.vue
-->
<script setup lang='ts'>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { NLayout, NLayoutContent } from 'naive-ui'
import Sider from './sider/index.vue'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { useAppStore } from '@/store'
// const Permission = defineAsyncComponent(() => import('./Permission.vue'))
const router = useRouter()
const route = useRoute()
const appStore = useAppStore()

const { isMobile } = useBasicLayout()

const collapsed = computed(() => appStore.siderCollapsed)

const getMobileClass = computed(() => {
  if (isMobile.value)
    return ['rounded-none', 'shadow-none']
  return ['border', 'rounded-md', 'shadow-md', 'dark:border-neutral-800']
})

function useTitle(title: string) {
  document.title = `Admin|${title}`
}

const getContainerClass = computed(() => {
  return [
    'h-full',
    { 'pl-[260px]': !isMobile.value && !collapsed.value },
  ]
})
router.afterEach(() => {
  useTitle(route.meta.title as string)
})
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
  </div>
</template>
