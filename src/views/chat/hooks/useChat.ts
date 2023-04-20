/*
 * @Author: cloudyi.li
 * @Date: 2023-03-23 13:51:37
 * @LastEditTime: 2023-04-20 22:40:09
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/views/chat/hooks/useChat.ts
 */
import { fetchChatRecordHistory, fetchChatlist } from '@/api'
import type { ChatListRes, ChatRecordHistoryRes } from '@/models'
import { useChatStore } from '@/store'

export function useChat() {
  const chatStore = useChatStore()

  const getChatByUuidAndIndex = (uuid: string, index: number) => {
    return chatStore.getChatByUuidAndIndex(uuid, index)
  }

  const addChat = (uuid: string, chat: Chat.Chat) => {
    chatStore.addChatByUuid(uuid, chat)
  }
  const addHistory = (history: Chat.History, chat: Chat.Chat[]) => {
    chatStore.addHistory(history, chat)
  }
  const updateChat = (uuid: string, index: number, chat: Chat.Chat) => {
    chatStore.updateChatByUuid(uuid, index, chat)
  }

  const updateChatSome = (uuid: string, index: number, chat: Partial<Chat.Chat>) => {
    chatStore.updateChatSomeByUuid(uuid, index, chat)
  }
  const fetchChatHistoryRecord = async (uuid: string) => {
    try {
      const result = await fetchChatRecordHistory<ChatRecordHistoryRes>({ chat_id: uuid })
      const recordlist = result.data.record_list
      const chat_uuid = result.data.chat_id
      let inv = false
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

  const fetchChatHistoryList = async () => {
    try {
      const result = await fetchChatlist<ChatListRes>()
      const chatList = result.data.chat_list
      for (const i of chatList) {
        addHistory(
          {
            uuid: i.chat_id,
            title: i.chat_name,
            isEdit: false,
          },
          [],
        )
        await fetchChatHistoryRecord(i.chat_id)
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
  }
}
