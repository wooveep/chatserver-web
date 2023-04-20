/*
 * @Author: cloudyi.li
 * @Date: 2023-03-23 15:31:53
 * @LastEditTime: 2023-04-15 17:55:27
 * @LastEditors: cloudyi.li
 * @FilePath: /whatserver-web/src/store/modules/auth/helper.ts
 */
import { ls } from '@/utils/storage'

const LOCAL_NAME = 'SECRET_TOKEN'
export function getToken() {
  return ls.get(LOCAL_NAME)
}
export function getNewToken() {
  // const {data, expire} = ls.getRaw(LOCAL_NAME)

  // return data,expire
}

export function setToken(token: string, expire: number) {
  return ls.setWithExpire(LOCAL_NAME, token, expire)
}

export function removeToken() {
  return ls.remove(LOCAL_NAME)
}
