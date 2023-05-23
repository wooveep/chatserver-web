/*
 * @Author: cloudyi.li
 * @Date: 2023-03-23 13:51:37
 * @LastEditTime: 2023-05-22 09:23:30
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/store/modules/user/index.ts
 */
import { defineStore } from 'pinia'
import { getLocalState, setLocalState } from './helper'
import type { User } from '@/typings/user'
// import jwt_decode from 'jwt-decode'
import { fetchUserAvatar, fetchUserInfo } from '@/api'
import type { UserAvatarRes, UserInfoRes } from '@/models'

export const useUserStore = defineStore('user-store', {
  state: (): User.UserStore => getLocalState(),
  getters: {
    getUserAvatar(state: User.UserStore) {
      return state.avatar
    },
    getUserEmail(state: User.UserStore) {
      return state.email
    },
    getUserNickname(state: User.UserStore) {
      return state.nickname
    },
    getUser(state: User.UserStore) {
      return state
    },
  },
  actions: {

    async setUserInfo() {
      const userresult = await fetchUserInfo<UserInfoRes>()
      const userinfo = userresult.data
      this.username = userinfo.username
      this.nickname = userinfo.nickname
      this.email = userinfo.email
      this.phone = userinfo.phone
      this.balance = userinfo.balance
      this.role = userinfo.role
      this.recordState()
    },

    async setUserAvatar() {
      const result = await fetchUserAvatar<UserAvatarRes>()
      const avatar = result.data
      const binaryData = atob(avatar.avatar) // 将base64字符串转换为二进制数据
      const arrayBuffer = new ArrayBuffer(binaryData.length)
      const uint8Array = new Uint8Array(arrayBuffer)
      for (let i = 0; i < binaryData.length; i++)
        uint8Array[i] = binaryData.charCodeAt(i)

      const blob = new Blob([uint8Array], { type: 'image/png' }) // 假设是PNG格式的图片
      this.avatar = URL.createObjectURL(blob) // 生成图片的URL
      this.recordState()
    },

    resetUserInfo() {
      this.username = ''
      this.nickname = ''
      this.email = ''
      this.phone = ''
      this.balance = 0
      this.role = ''
      this.recordState()
    },

    recordState() {
      setLocalState(this.$state)
    },
  },
})
