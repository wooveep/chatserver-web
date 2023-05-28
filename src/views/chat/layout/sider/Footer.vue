<!--
 * @Author: cloudyi.li
 * @Date: 2023-03-23 13:51:37
 * @LastEditTime: 2023-05-28 08:29:51
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/views/chat/layout/sider/Footer.vue
-->
<script lang='ts' setup>
import { defineAsyncComponent, ref } from 'vue'
import { HoverButton, SvgIcon, UserAvatar } from '@/components/common'

const Setting = defineAsyncComponent(() => import('@/components/common/Setting/index.vue'))
const Bills = defineAsyncComponent(() => import('@/components/common/Bills/index.vue'))
const show = ref(false)
const billShow = ref(false)
</script>

<template>
  <footer class="flex  items-center justify-between min-w-0 p-4 overflow-hidden border-t dark:border-neutral-800">
    <div class="flex-1 flex-shrink-0 overflow-hidden">
      <UserAvatar />
    </div>
    <HoverButton tooltip="账单" @click="billShow = true">
      <span class="text-2xl  text-[#4f555e] dark:text-white">
        <SvgIcon icon="ri:currency-line" />
      </span>
    </HoverButton>
    <HoverButton tooltip="设置" @click="show = true">
      <span class="text-2xl  text-[#4f555e] dark:text-white">
        <SvgIcon icon="ri:settings-4-line" />
      </span>
    </HoverButton>
    <Bills v-if="billShow" v-model:visible="billShow" />
    <Setting v-if="show" v-model:visible="show" />
  </footer>
</template>
