/*
 * @Author: cloudyi.li
 * @Date: 2023-03-23 13:51:37
 * @LastEditTime: 2023-05-10 19:03:25
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/views/chat/hooks/useChat.ts
 */
import { ref } from 'vue'
import { usePreset } from './userPreset'
import { fetchChatCreateNew, fetchChatRecordHistory, fetchChatlist } from '@/api'
import type { ChatCreateNewReq, ChatCreateNewRes, ChatListRes, ChatRecordHistoryRes } from '@/models'
import { useChatStore, usePresetStore } from '@/store'
import type { Chat } from '@/typings/chat'

export function useChat() {
  const chatStore = useChatStore()
  const presetStore = usePresetStore()
  const { fetchPreset } = usePreset()

  const getChatByUuidAndIndex = (uuid: string, index: number) => {
    return chatStore.getChatByUuidAndIndex(uuid, index)
  }

  const addChat = (uuid: string, chat: Chat.Record) => {
    chatStore.addChatByUuid(uuid, chat)
  }

  const addHistory = (history: Chat.History, chat: Chat.Record[]) => {
    chatStore.addHistory(history, chat)
  }

  const updateChat = (uuid: string, index: number, chat: Chat.Record) => {
    chatStore.updateChatByUuid(uuid, index, chat)
  }

  const updateChatSome = (uuid: string, index: number, chat: Partial<Chat.Record>) => {
    chatStore.updateChatSomeByUuid(uuid, index, chat)
  }

  const fetchChatHistoryRecord = async (uuid: string) => {
    try {
      const result = await fetchChatRecordHistory<ChatRecordHistoryRes>({ chat_id: uuid })
      const chat_uuid = result.data.chat_id
      if (result.data.record_list === null)
        return
      let inv = false
      const recordlist = Array.from(result.data.record_list)
      for (const i of recordlist) {
        if (i.sender === 'user')
          inv = true

        else
          inv = false

        addChat(
          chat_uuid,
          {
            dateTime: i.created_at,
            text: i.message,
            inversion: inv,
            errmsg: '',
            error: false,
            msgid: i.record_id,
          },
        )
      }
    }
    catch (error: any) {
      throw new Error(error.message)
    }
  }

  const fetchChatUUIDNew = async () => {
    const chatnewreq = ref<ChatCreateNewReq>({
      chat_name: 'New Chat',
      preset_id: presetStore.getActiveUuid,
    })
    try {
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
    catch (error: any) {
    }
  }

  const fetchChatHistoryList = async () => {
    await fetchPreset()
    const presetlist = Array.from(presetStore.getPresetList)
    try {
      const result = await fetchChatlist<ChatListRes>()
      if (result.data.chat_list === null) {
        presetStore.setActive(presetlist[presetlist.length - 1].preset_id)
        await fetchChatUUIDNew()
        return
      }
      const chatList = Array.from(result.data.chat_list)
      //
      for (const i of chatList) {
        addHistory(
          {
            uuid: i.chat_id,
            title: i.chat_name,
            isEdit: false,
            presetid: i.preset_id,
          },
          [],
        )
        await fetchChatHistoryRecord(i.chat_id)
        presetStore.setActive(chatStore.getChatHistoryByCurrentActive?.presetid ?? '')
      }
    }
    catch (error: any) {
      throw new Error(error.message)
    }
  }

  const resetChat = () => {
    chatStore.resetChatState()
  }
  return {
    addChat,
    updateChat,
    updateChatSome,
    addHistory,
    getChatByUuidAndIndex,
    fetchChatHistoryList,
    resetChat,
    fetchChatUUIDNew,
  }
}
