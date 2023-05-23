/*
 * @Author: cloudyi.li
 * @Date: 2023-04-14 09:52:49
 * @LastEditTime: 2023-05-22 12:20:15
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/hooks/useLanguage.ts
 */
import { computed } from 'vue'
import { enUS, zhCN } from 'naive-ui'
import { useAppStore } from '@/store'
import { setLocale } from '@/locales'

export function useLanguage() {
  const appStore = useAppStore()

  const language = computed(() => {
    switch (appStore.getLanguage) {
      case 'en-US':
        setLocale('en-US')
        return enUS
      case 'zh-CN':
        setLocale('zh-CN')
        return zhCN
      default:
        setLocale('zh-CN')
        return zhCN
    }
  })

  return { language }
}
