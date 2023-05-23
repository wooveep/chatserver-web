/*
 * @Author: cloudyi.li
 * @Date: 2023-03-23 13:51:37
 * @LastEditTime: 2023-05-21 22:00:06
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/store/modules/user/helper.ts
 */
import type { User } from '@/typings/user'
import { ss } from '@/utils/storage'

const LOCAL_NAME = 'userStorage'

export function defaultState(): User.UserStore {
  return {
    username: '',
    nickname: '',
    email: '',
    phone: '',
    avatar: '',
    balance: 0,
    role: '',
  }
}

export function getLocalState(): User.UserStore {
  const localState = ss.get(LOCAL_NAME)
  return { ...defaultState(), ...localState }
}

export function setLocalState(state: User.UserStore) {
  ss.set(LOCAL_NAME, state)
}

export function removeLocalState() {
  return ss.remove(LOCAL_NAME)
}
