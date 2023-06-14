<!--
 * @Author: cloudyi.li
 * @Date: 2023-03-23 13:51:37
 * @LastEditTime: 2023-06-14 21:27:15
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/views/chat/layout/sider/index.vue
-->
<script lang='ts' setup>
import type { CSSProperties } from 'vue'
import { computed, ref, watch } from 'vue'
import { AddOutline as AddIcon, TrashBinOutline as DeleteIcon } from '@vicons/ionicons5'
import { NButton, NIcon, NLayoutSider, NPopconfirm, NThing } from 'naive-ui'
import { useChat } from '../../hooks/useChat'
import List from './List.vue'
import Footer from './Footer.vue'
import Sider from './Sider.vue'
import { useAppStore, useChatStore, usePresetStore } from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import type { ChatCreateNewReq, ChatCreateNewRes } from '@/models'
import { fetchChatCreateNew, fetchChatDelete } from '@/api'
import { debounce } from '@/utils/functions/debounce'
// import { router } from '@/router'

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
  if (result.err_code === 0) {
    chatStore.resetChatState()
    await fetchChatUUIDNew()
  }
  if (isMobile.value)
    appStore.setSiderCollapsed(true)
  window.location.reload()
  // router.push('/')
}

const handleDeleteDebounce = debounce(handleDelete, 600)
</script>

<template>
  <NLayoutSider
    :collapsed="collapsed"
    :collapsed-width="0"
    :width="isMobile ? 260 : 310"
    :show-trigger="isMobile ? false : 'bar'"
    content-style="padding: 0px;"
    collapse-mode="transform"
    position="absolute"
    bordered
    :style="getMobileClass"
    @update-collapsed="handleUpdateCollapsed"
  >
    <div class="flex flex-row  h-full" :style="mobileSafeArea">
      <div v-if="!isMobile" class="flex flex-col h-full border-r dark:border-neutral-800 bg-white/50 dark:bg-black/20 ">
        <Sider />
      </div>
      <div class="flex flex-col  h-full">
        <header class="p-1 ">
          <div v-if="!isMobile" class="p-4">
            <NButton dashed block @click="handleAdd">
              <template #icon>
                <NIcon>
                  <AddIcon />
                </NIcon>
              </template>
              {{ $t('chat.newChatButton') }}
            </NButton>
          </div>
          <div v-if="isMobile" class="p-1">
            <NThing>
              <template #header>
                会话记录
              </template>
            </NThing>
          </div>
        </header>
        <main class="flex-1 flex-col w-64 p-1 min-h-0">
          <div class="flex-auto min-h-0 pb-4 overflow-hidden border-t dark:border-neutral-800">
            <List />
          </div>
        </main>
        <div class="p-1 border-t dark:border-neutral-800">
          <div class="p-1">
            <!-- <NDivider /> -->
            <NPopconfirm placement="bottom" @positive-click="handleDeleteDebounce()">
              <template #trigger>
                <NButton dashed block>
                  <template #icon>
                    <NIcon>
                      <DeleteIcon />
                    </NIcon>
                  </template>
                  {{ $t('chat.clearChat') }}
                </NButton>
              </template>
              {{ $t('chat.clearChatConfirm') }}
            </NPopconfirm>
          </div>
          <Footer :mobile="isMobile" />
        </div>
      </div>
    </div>
  </NLayoutSider>
  <template v-if="isMobile">
    <div v-show="!collapsed" class="fixed inset-0 z-40 w-full h-full bg-black/40" @click="handleUpdateCollapsed" />
  </template>
  <!-- <PromptStore v-model:visible="show" /> -->
</template>
