<!--
 * @Author: cloudyi.li
 * @Date: 2023-06-11 11:44:17
 * @LastEditTime: 2023-06-11 21:56:17
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/views/admin/layout/sider/index.vue
-->
<script lang='ts' setup>
import type { CSSProperties } from 'vue'
import { computed, watch } from 'vue'
import { NLayoutSider } from 'naive-ui'
import List from './list.vue'
import { useAppStore } from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'

// import { router } from '@/router'

const appStore = useAppStore()
const { isMobile } = useBasicLayout()
// const show = ref(false)

const collapsed = computed(() => appStore.siderCollapsed)

function handleUpdateCollapsed() {
  appStore.setSiderCollapsed(!collapsed.value)
}

const getMobileClass = computed<CSSProperties>(() => {
  if (isMobile.value) {
    return {
      position: 'fixed',
      zIndex: 50,
    }
  }
  return {}
})

const mobileSafeArea = computed(() => {
  if (isMobile.value) {
    return {
      paddingBottom: 'env(safe-area-inset-bottom)',
    }
  }
  return {}
})

watch(
  isMobile,
  (val) => {
    appStore.setSiderCollapsed(val)
  },
  {
    immediate: true,
    flush: 'post',
  },
)
</script>

<template>
  <NLayoutSider
    :collapsed="collapsed"
    :collapsed-width="0"
    :width="260"
    :show-trigger="isMobile ? false : 'arrow-circle'"
    collapse-mode="transform"
    position="absolute"
    bordered
    :style="getMobileClass"
    @update-collapsed="handleUpdateCollapsed"
  >
    <div class="flex flex-col h-full" :style="mobileSafeArea">
      <main class="flex flex-col flex-1 min-h-0">
        <div class="flex-1 min-h-0 pb-4 overflow-hidden">
          <List :collapsed="collapsed" />
        </div>
      </main>
    </div>
  </NLayoutSider>
  <template v-if="isMobile">
    <div v-show="!collapsed" class="fixed inset-0 z-40 w-full h-full bg-black/40" @click="handleUpdateCollapsed" />
  </template>
  <!-- <PromptStore v-model:visible="show" /> -->
</template>
