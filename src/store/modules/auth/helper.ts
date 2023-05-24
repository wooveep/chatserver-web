/*
 * @Author: cloudyi.li
 * @Date: 2023-03-23 15:31:53
 * @LastEditTime: 2023-05-24 21:32:50
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/store/modules/auth/helper.ts
 */
import { ls } from '@/utils/storage'

const LOCAL_NAME = 'SECRET_TOKEN'
export function getToken() {
  return ls.get(LOCAL_NAME)
}

export function getExprieTime() {
  return ls.getExprieTime(LOCAL_NAME) ?? 0
}

export function setToken(token: string, expire: number) {
  return ls.setWithExpire(LOCAL_NAME, token, expire)
}

export function removeToken() {
  return ls.remove(LOCAL_NAME)
}
