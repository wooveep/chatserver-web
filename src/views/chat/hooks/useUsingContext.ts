/*
 * @Author: cloudyi.li
 * @Date: 2023-03-24 09:20:29
 * @LastEditTime: 2023-04-19 21:48:07
 * @LastEditors: cloudyi.li
 * @FilePath: /whatserver-web/src/views/chat/hooks/useUsingContext.ts
 */
import { computed } from 'vue'
import { useMessage } from 'naive-ui'
import { t } from '@/locales'
import { useChatStore } from '@/store'

export function useMemoryLevel() {
  const ms = useMessage()
  const chatStore = useChatStore()
  const usingMemory = computed<number>(() => chatStore.memory)

  function toggleUsingContext() {
    chatStore.setMemoryLevel(usingMemory.value)
    if (usingMemory.value)
      ms.success(t('chat.turnOnContext'))
    else
      ms.warning(t('chat.turnOffContext'))
  }

  return {
    usingMemory,
    toggleUsingContext,
  }
}
