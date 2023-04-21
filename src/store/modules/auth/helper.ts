/*
 * @Author: cloudyi.li
 * @Date: 2023-03-23 15:31:53
 * @LastEditTime: 2023-04-21 11:41:17
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/store/modules/auth/helper.ts
 */
import { ls } from '@/utils/storage'

const LOCAL_NAME = 'SECRET_TOKEN'
export function getToken() {
  return ls.get(LOCAL_NAME)
}

export function getTime() {
  return ls.getTime(LOCAL_NAME) ?? 0
}

export function setToken(token: string, expire: number) {
  return ls.setWithExpire(LOCAL_NAME, token, expire)
}

export function removeToken() {
  return ls.remove(LOCAL_NAME)
}
