/*
 * @Author: cloudyi.li
 * @Date: 2023-03-23 15:31:53
 * @LastEditTime: 2023-05-22 09:21:32
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/store/modules/auth/index.ts
 */
import { defineStore } from 'pinia'
import { getTime, getToken, removeToken, setToken } from './helper'
import { store, useUserStore } from '@/store'

export interface AuthState {
  token: string | undefined
  time: number | undefined
}

export const useAuthStore = defineStore('auth-store', {
  state: (): AuthState => ({
    token: getToken(),
    time: getTime(),
  }),
  getters: {
    getTokenTime(state: AuthState) {
      return state.time
    },
  },
  actions: {
    async setToken(token: string, expire_at: string) {
      removeToken()
      this.token = token
      setToken(token, new Date(expire_at).getTime())
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
