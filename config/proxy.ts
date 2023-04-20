/*
 * @Author: cloudyi.li
 * @Date: 2023-03-23 14:13:06
 * @LastEditTime: 2023-03-28 22:42:16
 * @LastEditors: cloudyi.li
 * @FilePath: /whatserver-web/config/proxy.ts
 */
import type { ProxyOptions } from 'vite'

export function createViteProxy(isOpenProxy: boolean, viteEnv: ImportMetaEnv) {
  if (!isOpenProxy)
    return

  const proxy: Record<string, string | ProxyOptions> = {
    '/api': {
      target: viteEnv.VITE_APP_API_BASE_URL,
      changeOrigin: true,
      rewrite: path => path.replace('/api/', '/'),
    },
  }

  return proxy
}
