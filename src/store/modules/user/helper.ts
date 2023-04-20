/*
 * @Author: cloudyi.li
 * @Date: 2023-03-23 13:51:37
 * @LastEditTime: 2023-04-17 12:51:14
 * @LastEditors: cloudyi.li
 * @FilePath: /whatserver-web/src/store/modules/user/helper.ts
 */
import { ls } from '@/utils/storage'

const LOCAL_NAME = 'userStorage'

export interface UserInfo {
  username: string
  nickname: string
  email: string
  phone: string
  avatar_url: string
  balance: number
  expired_at: number
}

export interface UserState {
  userInfo: UserInfo
}

export function defaultSetting(): UserState {
  return {
    userInfo: {
      username: '',
      nickname: '',
      email: '',
      phone: '',
      avatar_url: '',
      balance: 0,
      expired_at: 0,
    },
  }
}

export function getLocalState(): UserState {
  const localSetting: UserState | undefined = ls.get(LOCAL_NAME)
  return { ...defaultSetting(), ...localSetting }
}

export function setLocalState(setting: UserState): void {
  ls.set(LOCAL_NAME, setting)
}
