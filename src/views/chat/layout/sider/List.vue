<script lang='ts' setup>
import { computed } from 'vue'
import { NInput, NPopconfirm, NScrollbar } from 'naive-ui'
import { useChat } from '../../hooks/useChat'
import { SvgIcon } from '@/components/common'
import { useAppStore, useChatStore, usePresetStore } from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { debounce } from '@/utils/functions/debounce'
import { fetchChatDelete, fetchChatUpdate } from '@/api'
import { router } from '@/router'
import type { Chat } from '@/typings/chat'

const { isMobile } = useBasicLayout()
const { fetchActiveHistoryRecord } = useChat()

const appStore = useAppStore()
const chatStore = useChatStore()
const presetStore = usePresetStore()

const dataSources = computed(() => chatStore.history)
const currentChatHistory = computed(() => chatStore.getChatHistoryByCurrentActive)

async function handleSelect({ uuid }: Chat.History) {
  if (isActive(uuid))
    return
  if (chatStore.active)
    chatStore.updateHistory(chatStore.active, { isEdit: false })
  await chatStore.setActive(uuid)
  presetStore.setActive(currentChatHistory.value?.presetid ?? '')
  await fetchActiveHistoryRecord()
  if (isMobile.value)
    appStore.setSiderCollapsed(true)
}

async function handleEditUpdate({ uuid, title }: Chat.History, isEdit: boolean, event?: MouseEvent) {
  event?.stopPropagation()
  const result = await fetchChatUpdate({ chat_id: uuid, chat_name: title, preset_id: undefined })
  if (result.err_code === 0)
    chatStore.updateHistory(uuid, { isEdit })
}

function handleEdit({ uuid }: Chat.History, isEdit: boolean, event?: MouseEvent) {
  event?.stopPropagation()
  chatStore.updateHistory(uuid, { isEdit })
}

async function handleDelete(index: number, { uuid }: Chat.History, event?: MouseEvent | TouchEvent) {
  event?.stopPropagation()
  const result = await fetchChatDelete({ chat_id: uuid })
  if (result.err_code === 0)
    chatStore.deleteHistory(index)
  if (isMobile.value)
    appStore.setSiderCollapsed(true)
  router.push('/')
}

const handleDeleteDebounce = debounce(handleDelete, 600)

async function handleEnter({ uuid, title }: Chat.History, isEdit: boolean, event: KeyboardEvent) {
  event?.stopPropagation()
  if (event.key === 'Enter') {
    const result = await fetchChatUpdate({ chat_id: uuid, chat_name: title, preset_id: undefined })

    if (result.err_code === 0)
      chatStore.updateHistory(uuid, { isEdit })
  }
}

function isActive(uuid: string) {
  return chatStore.active === uuid
}
</script>

<template>
  <NScrollbar class="pt-6 px-2">
    <div class="flex flex-col gap-2 text-sm ">
      <template v-if="!dataSources.length">
        <div class="flex flex-col items-center mt-4 text-center text-neutral-300">
          <SvgIcon icon="ri:inbox-line" class="mb-2 text-3xl" />
          <span>{{ $t('common.noData') }}</span>
        </div>
      </template>
      <template v-else>
        <div v-for="(item, index) of dataSources" :key="index">
          <a
            class="relative flex items-center gap-3 px-3 py-3 break-all border rounded-md cursor-pointer hover:bg-neutral-100 group dark:border-neutral-800 dark:hover:bg-[#24272e]"
            :class="isActive(item.uuid) && ['border-[#4b9e5f]', 'bg-neutral-100', 'text-[#4b9e5f]', 'dark:bg-[#24272e]', 'dark:border-[#4b9e5f]', 'pr-14']"
            @click="handleSelect(item)"
          >
            <span>
              <SvgIcon icon="ri:message-3-line" />
            </span>
            <div class="relative flex-1 w-24 overflow-hidden break-all text-ellipsis whitespace-nowrap">
              <NInput
                v-if="item.isEdit"
                v-model:value="item.title" size="tiny"
                @keypress="handleEnter(item, false, $event)"
              />
              <span v-else>{{ item.title }}</span>
            </div>
            <div v-if="isActive(item.uuid)" class="absolute z-10 flex visible right-1">
              <template v-if="item.isEdit">
                <button class="p-1" @click="handleEditUpdate(item, false, $event)">
                  <SvgIcon icon="ri:save-line" />
                </button>
              </template>
              <template v-else>
                <button class="p-1">
                  <SvgIcon icon="ri:edit-line" @click="handleEdit(item, true, $event)" />
                </button>
                <NPopconfirm placement="bottom" @positive-click="handleDeleteDebounce(index, item, $event)">
                  <template #trigger>
                    <button class="p-1">
                      <SvgIcon icon="ri:delete-bin-line" />
                    </button>
                  </template>
                  {{ $t('chat.deleteHistoryConfirm') }}
                </NPopconfirm>
              </template>
            </div>
          </a>
        </div>
      </template>
    </div>
  </NScrollbar>
</template>
