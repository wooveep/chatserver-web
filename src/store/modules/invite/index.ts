/*
 * @Author: cloudyi.li
 * @Date: 2023-05-20 19:15:27
 * @LastEditTime: 2023-05-20 19:30:18
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/store/modules/invite/index.ts
 */
import { defineStore } from 'pinia'
import type { InviteState } from './helper'
// import jwt_decode from 'jwt-decode'
import { defaultSetting, getLocalState, setLocalState } from './helper'
import { fetchInviteLink } from '@/api'
import type { UserInviteLinkRes } from '@/models'

export const useInviteStore = defineStore('invite-store', {
  state: (): InviteState => getLocalState(),
  actions: {
    async getUserInvite() {
      const result = await fetchInviteLink<UserInviteLinkRes>()
      const inviteInfo = result.data
      this.inviteInfo = {
        inviteLink: inviteInfo.invite_link,
        inviteNumber: inviteInfo.invite_number,
        inviteReward: inviteInfo.invite_reward,
      }
      this.recordState()
    },

    resetUserInfo() {
      this.inviteInfo = { ...defaultSetting().inviteInfo }
      this.recordState()
    },

    recordState() {
      setLocalState(this.$state)
    },
  },
})
