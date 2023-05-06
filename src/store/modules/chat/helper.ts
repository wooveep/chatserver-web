/*
 * @Author: cloudyi.li
 * @Date: 2023-03-23 13:51:37
 * @LastEditTime: 2023-05-04 17:17:50
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/store/modules/chat/helper.ts
 */
import type { Chat } from '@/typings/chat'
import { ss } from '@/utils/storage'

const LOCAL_NAME = 'chatStorage'

export function defaultState(): Chat.ChatState {
  return {
    active: '',
    memory: 6,
    history: [],
    chat: [],
  }
}

export function getLocalState(): Chat.ChatState {
  const localState = ss.get(LOCAL_NAME)
  return { ...defaultState(), ...localState }
}

export function setLocalState(state: Chat.ChatState) {
  ss.set(LOCAL_NAME, state)
}

export function removeLocalState() {
  return ss.remove(LOCAL_NAME)
}
