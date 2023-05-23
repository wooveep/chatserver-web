<!--
 * @Author: cloudyi.li
 * @Date: 2023-05-20 12:38:56
 * @LastEditTime: 2023-05-22 12:24:36
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/components/common/Setting/Config.vue
-->
<script lang='ts' setup>
import { computed } from 'vue'
import type { Language, Theme } from '@/store/modules/app/helper'
import { useAppStore } from '@/store'
import { SvgIcon } from '@/components/common'

const appStore = useAppStore()
const theme = computed(() => appStore.theme)
const language = computed({
  get() {
    return appStore.language
  },
  set(value: Language) {
    appStore.setLanguage(value)
  },
})

const themeOptions: { label: string; key: Theme; icon: string }[] = [
  {
    label: 'Auto',
    key: 'auto',
    icon: 'ri:contrast-line',
  },
  {
    label: 'Light',
    key: 'light',
    icon: 'ri:sun-foggy-line',
  },
  {
    label: 'Dark',
    key: 'dark',
    icon: 'ri:moon-foggy-line',
  },
]

const languageOptions: { label: string; key: Language; value: Language }[] = [
  { label: '中文', key: 'zh-CN', value: 'zh-CN' },
  { label: 'English', key: 'en-US', value: 'en-US' },
]
</script>

<template>
  <div class="p-4 space-y-5 min-h-[200px]">
    <div class="space-y-6">
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]">{{ $t('setting.theme') }}</span>
        <div class="flex items-center space-x-4">
          <template v-for="item of themeOptions" :key="item.key">
            <a
              class="flex items-center justify-center h-8 px-4 border rounded-md cursor-pointer dark:border-neutral-700"
              :class="item.key === theme && ['bg-[#4ca85e]', 'border-[#4ca85e]', 'text-white']"
              @click="appStore.setTheme(item.key)"
            >
              <span class="text-xl">
                <SvgIcon :icon="item.icon" />
              </span>
            </a>
          </template>
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]">{{ $t('setting.language') }}</span>
        <div class="flex items-center space-x-4">
          <template v-for="item of languageOptions" :key="item.key">
            <a
              class="flex items-center justify-center h-8 px-4 border rounded-md cursor-pointer dark:border-neutral-700"
              :class="item.key === language && ['bg-[#4ca85e]', 'border-[#4ca85e]', 'text-white']"
              @click="appStore.setLanguage(item.key)"
            >
              <span class="text-sm">
                {{ item.label }}
              </span>
            </a>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
