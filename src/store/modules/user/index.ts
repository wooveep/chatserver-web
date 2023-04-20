/*
 * @Author: cloudyi.li
 * @Date: 2023-03-23 13:51:37
 * @LastEditTime: 2023-04-16 17:53:34
 * @LastEditors: cloudyi.li
 * @FilePath: /whatserver-web/src/store/modules/user/index.ts
 */
import { defineStore } from 'pinia'
import type { UserState } from './helper'
// import jwt_decode from 'jwt-decode'
import { defaultSetting, getLocalState, setLocalState } from './helper'
import { fetchUserInfo } from '@/api'
import type { UserInfoRes } from '@/models'

export const useUserStore = defineStore('user-store', {
  state: (): UserState => getLocalState(),
  actions: {
    async getUserInfo() {
      const result = await fetchUserInfo<UserInfoRes>()
      const userinfo = result.data
      this.userInfo = {
        username: userinfo.username,
        nickname: userinfo.nickname,
        email: userinfo.email,
        phone: userinfo.phone,
        avatar_url: userinfo.avatar_url,
        balance: userinfo.balance,
        expired_at: new Date(userinfo.expired_at).getTime(),
      }
      this.recordState()
    },

    resetUserInfo() {
      this.userInfo = { ...defaultSetting().userInfo }
      this.recordState()
    },

    recordState() {
      setLocalState(this.$state)
    },
  },
})
