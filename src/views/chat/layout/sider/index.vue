<!--
 * @Author: cloudyi.li
 * @Date: 2023-03-23 13:51:37
 * @LastEditTime: 2023-05-12 09:16:46
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/views/chat/layout/sider/index.vue
-->
<script setup lang='ts'>
import type { CSSProperties } from 'vue'
import { computed, ref, watch } from 'vue'
import { NButton, NLayoutSider, NPopconfirm } from 'naive-ui'
import { useChat } from '../../hooks/useChat'
import List from './List.vue'
import Footer from './Footer.vue'
import { useAppStore, useChatStore, usePresetStore } from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { SvgIcon } from '@/components/common'
import type { ChatCreateNewReq, ChatCreateNewRes } from '@/models'
import { fetchChatCreateNew, fetchChatDelete } from '@/api'
import { debounce } from '@/utils/functions/debounce'
import { router } from '@/router'

const appStore = useAppStore()
const presetStore = usePresetStore()
const { isMobile } = useBasicLayout()
// const show = ref(false)
const chatStore = useChatStore()
const { fetchChatUUIDNew } = useChat()

const collapsed = computed(() => appStore.siderCollapsed)
const { addHistory } = useChat()

async function handleAdd() {
  const chatnewreq = ref<ChatCreateNewReq>({
    chat_name: 'New Chat',
    preset_id: presetStore.getActiveUuid,
  })
  const result = await fetchChatCreateNew<ChatCreateNewRes>(chatnewreq.value)
  const chat_id = result.data.chat_id
  addHistory(
    {
      uuid: chat_id,
      title: chatnewreq.value.chat_name,
      isEdit: false,
      presetid: presetStore.getActiveUuid,
    },
    [],
  )
  if (isMobile.value)
    appStore.setSiderCollapsed(true)
}

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
async function handleDelete(event?: MouseEvent | TouchEvent) {
  event?.stopPropagation()
  const result = await fetchChatDelete({ chat_id: '-1' })
  if (result.err_code === 0)
    chatStore.resetChatState()
  if (isMobile.value)
    appStore.setSiderCollapsed(true)
  // window.location.reload()
  await fetchChatUUIDNew()
  router.push('/')
}

const handleDeleteDebounce = debounce(handleDelete, 600)
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
        <div class="p-4">
          <NButton dashed block @click="handleAdd">
            {{ $t('chat.newChatButton') }}
          </NButton>
        </div>
        <div class="flex-1 min-h-0 pb-4 overflow-hidden">
          <List />
        </div>
        <div class="p-4">
          <NPopconfirm placement="bottom" @positive-click="handleDeleteDebounce()">
            <template #trigger>
              <NButton block>
                <SvgIcon icon="ri:delete-bin-line" />
                {{ $t('chat.clearChat') }}
              </NButton>
            </template>
            {{ $t('chat.clearChatConfirm') }}
          </NPopconfirm>
        </div>
      </main>
      <Footer />
    </div>
  </NLayoutSider>
  <template v-if="isMobile">
    <div v-show="!collapsed" class="fixed inset-0 z-40 w-full h-full bg-black/40" @click="handleUpdateCollapsed" />
  </template>
  <!-- <PromptStore v-model:visible="show" /> -->
</template>
