/*
 * @Author: cloudyi.li
 * @Date: 2023-03-23 13:51:37
 * @LastEditTime: 2023-05-22 11:57:15
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/locales/index.ts
 */
import type { App } from 'vue'
import { createI18n } from 'vue-i18n'
import enUS from './en-US'
// import koKR from './ko-KR'
import zhCN from './zh-CN'
// import zhTW from './zh-TW'
import { useAppStoreWithOut } from '@/store/modules/app'
import type { Language } from '@/store/modules/app/helper'

const appStore = useAppStoreWithOut()

const defaultLocale = appStore.getLanguage || 'zh-CN'

const i18n = createI18n({
  locale: defaultLocale,
  fallbackLocale: 'en-US',
  allowComposition: true,
  messages: {
    'en-US': enUS,
    // 'ko-KR': koKR,
    'zh-CN': zhCN,
    // 'zh-TW': zhTW,
  },
})

export const t = i18n.global.t

export function setLocale(locale: Language) {
  i18n.global.locale = locale
}

export function setupI18n(app: App) {
  app.use(i18n)
}

export default i18n
