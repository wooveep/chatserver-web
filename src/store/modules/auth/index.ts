/*
 * @Author: cloudyi.li
 * @Date: 2023-03-23 15:31:53
 * @LastEditTime: 2023-05-24 21:32:57
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/store/modules/auth/index.ts
 */
import { defineStore } from 'pinia'
import { getExprieTime, getToken, removeToken, setToken } from './helper'
import { store, useUserStore } from '@/store'

export interface AuthState {
  token: string | undefined
  time: number | undefined
}

export const useAuthStore = defineStore('auth-store', {
  state: (): AuthState => ({
    token: getToken(),
    time: getExprieTime(),
  }),
  getters: {
    getTokenTime(state: AuthState) {
      return state.time
    },
  },
  actions: {
    async setToken(token: string, timeout: number) {
      removeToken()
      this.token = token
      const currentDate = new Date()
      const timestamp = currentDate.getTime() + timeout
      this.time = timestamp
      setToken(token, timestamp)
      const userStore = useUserStore()
      await userStore.setUserInfo()
      await userStore.setUserAvatar()
    },

    removeToken() {
      this.token = undefined
      const userStore = useUserStore()
      userStore.resetUserInfo()
      removeToken()
    },
  },
})

export function useAuthStoreWithout() {
  return useAuthStore(store)
}
