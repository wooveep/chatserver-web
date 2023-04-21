/*
 * @Author: cloudyi.li
 * @Date: 2023-03-23 13:51:37
 * @LastEditTime: 2023-04-21 11:41:52
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/store/modules/user/helper.ts
 */
import { ss } from '@/utils/storage'

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
  const localSetting: UserState | undefined = ss.get(LOCAL_NAME)
  return { ...defaultSetting(), ...localSetting }
}

export function setLocalState(setting: UserState): void {
  ss.set(LOCAL_NAME, setting)
}
