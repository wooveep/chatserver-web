/*
 * @Author: cloudyi.li
 * @Date: 2023-03-23 15:31:53
 * @LastEditTime: 2023-04-16 17:49:57
 * @LastEditors: cloudyi.li
 * @FilePath: /whatserver-web/src/store/modules/auth/index.ts
 */
import { defineStore } from 'pinia'
import { getToken, removeToken, setToken } from './helper'
import { store, useUserStore } from '@/store'

export interface AuthState {
  token: string | undefined
}

export const useAuthStore = defineStore('auth-store', {
  state: (): AuthState => ({
    token: getToken(),
  }),

  actions: {
    async setToken(token: string, expire_at: string) {
      this.token = token
      // const decoded = jwt_decode(token) as UserInfo
      const userStore = useUserStore()
      await userStore.getUserInfo()
      setToken(token, new Date(expire_at).getTime())
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
