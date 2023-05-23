/*
 * @Author: cloudyi.li
 * @Date: 2023-05-20 19:15:21
 * @LastEditTime: 2023-05-20 19:22:02
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/store/modules/invite/helper.ts
 */
import { ls } from '@/utils/storage'

const LOCAL_NAME = 'inviteStorage'
export interface InviteInfo {
  inviteLink: string
  inviteNumber: number
  inviteReward: number
}

export interface InviteState {
  inviteInfo: InviteInfo
}

export function defaultSetting(): InviteState {
  return {
    inviteInfo: {
      inviteLink: '',
      inviteNumber: 0,
      inviteReward: 0.0,
    },
  }
}

export function getLocalState(): InviteState {
  const localSetting: InviteState | undefined = ls.get(LOCAL_NAME)
  return { ...defaultSetting(), ...localSetting }
}

export function setLocalState(setting: InviteState): void {
  ls.set(LOCAL_NAME, setting)
}
