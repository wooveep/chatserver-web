<!--
 * @Author: cloudyi.li
 * @Date: 2023-03-24 09:20:29
 * @LastEditTime: 2023-06-14 14:50:13
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/views/chat/components/Header/index.vue
-->
<script lang="ts" setup>
import { computed, defineAsyncComponent, nextTick, ref } from 'vue'
import { AddOutline as AddIcon, MenuSharp as MenuIcon } from '@vicons/ionicons5'
import { History16Filled as HistoryIcon } from '@vicons/fluent'
import { NButton, NIcon } from 'naive-ui'
import { useChat } from '../../hooks/useChat'
import { useAppStore, useChatStore, usePresetStore } from '@/store'
import { fetchChatCreateNew } from '@/api'
import type { ChatCreateNewReq, ChatCreateNewRes } from '@/models'

interface Props {
  usingMemory: number
  showMemoryLevel: boolean
  showPreset: boolean
}
// interface Emit {
//   (ev: 'export'): void
//   (ev: 'toggleUsingContext'): void
// }
defineProps<Props>()
// const chatStore = useChatStore()
const presetStore = usePresetStore()
const appStore = useAppStore()
const chatStore = useChatStore()
const collapsed = computed(() => appStore.siderCollapsed)
const currentChatHistory = computed(() => chatStore.getChatHistoryByCurrentActive)

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
}

// const emit = defineEmits<Emit>()

const MemoryLevel = defineAsyncComponent(() => import('@/components/common/MemoryLevel/index.vue'))
// const PresetStore = defineAsyncComponent(() => import('@/components/common/PresetStore/index.vue'))

const showMemoryMoblie = ref(false)
// const showPresetMoblie = ref(false)

function handleUpdateCollapsed(): void {
  appStore.setSiderCollapsed(!collapsed.value)
}

function onScrollToTop() {
  const scrollRef = document.querySelector('#scrollRef')
  if (scrollRef)
    nextTick(() => scrollRef.scrollTop = 0)
}

// function handleExport() {
//   emit('export')
// }
</script>

<template>
  <header
    class="sticky top-0 left-0 right-0 z-30 border-b dark:border-neutral-800 bg-white/50 dark:bg-black/20 backdrop-blur"
  >
    <div class="relative flex items-center justify-between min-w-0 overflow-hidden h-14">
      <div class="flex items-center ml-2">
        <NButton text style="font-size: 24px" @click="handleUpdateCollapsed">
          <NIcon>
            <MenuIcon />
          </NIcon>
        </NButton>
        <!-- <SvgIcon v-if="collapsed" class="text-2xl" icon="ri:align-justify" />
          <SvgIcon v-else class="text-2xl" icon="ri:align-right" /> -->
      </div>
      <h1
        class="flex-1 px-4 pr-6 overflow-hidden cursor-pointer select-none text-ellipsis whitespace-nowrap"
        @dblclick="onScrollToTop"
      >
        {{ currentChatHistory?.title ?? '' }}
      </h1>
      <div class="flex items-center justify-around space-x-2 mr-4">
        <NButton ghost round @click="showMemoryMoblie = true">
          <template #icon>
            <NIcon color="#0e7a0d">
              <HistoryIcon />
            </NIcon>
          </template>记忆度
        </NButton>
        <MemoryLevel v-if="showMemoryMoblie" v-model:visible="showMemoryMoblie" :mobile="true" />
        <NButton ghost round @click="handleAdd">
          <template #icon>
            <NIcon>
              <AddIcon />
            </NIcon>
          </template>
          新会话
        </NButton>
        <!-- <HoverButton tooltip="角色切换" @click="showPresetMoblie = true">
          <span class="text-xl text-[#4f555e] dark:text-white">
            <SvgIcon icon="ri:store-3-line" />
          </span>
        </HoverButton>
        <PresetStore v-if="showPresetMoblie" v-model:visible="showPresetMoblie" :mobile="true" />
        <HoverButton tooltip="记忆度" @click="showMemoryMoblie = true">
          <span class="text-xl" :class="{ 'text-[#4b9e5f]': usingMemory, 'text-[#a8071a]': !usingMemory }">
            <SvgIcon icon="ri:chat-history-line" />
          </span>
        </HoverButton>
        <MemoryLevel v-if="showMemoryMoblie" v-model:visible="showMemoryMoblie" :mobile="true" /> -->
        <!-- <HoverButton tooltip="保存会话" @click="handleExport">
          <span class="text-xl text-[#4f555e] dark:text-white">
            <SvgIcon icon="ri:download-2-line" />
          </span>
        </HoverButton> -->
      </div>
    </div>
  </header>
</template>
