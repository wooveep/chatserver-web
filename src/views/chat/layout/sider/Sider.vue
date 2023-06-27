<!--
 * @Author: cloudyi.li
 * @Date: 2023-06-14 17:02:38
 * @LastEditTime: 2023-06-14 21:31:08
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/views/chat/layout/sider/Sider.vue
-->

<script lang='ts' setup>
import { NButton, NIcon } from 'naive-ui'
import { Chat12Regular as ChatIcon } from '@vicons/fluent'
import { useRouter } from 'vue-router'
import { UserAvatar } from '@/components/common'
const router = useRouter()

function chatPage() {
  // 获取当前路由
  const currentRoute = router.currentRoute.value.path
  // 定义目标路由
  const targetRoute = '/chat/'
  // 判断当前路由是否与目标路由相同
  if (!currentRoute.includes('chat')) {
    // 跳转到目标路由
    router.push(targetRoute)
  }
}
</script>

<template>
  <div class="flex-1 p-2 py-8">
    <NButton text style="font-size: 24px" @click="chatPage">
      <NIcon>
        <ChatIcon />
      </NIcon>
    </NButton>
  </div>
  <div class="order-last p-2">
    <div class="grid grid-rows-3 gap-4">
      <UserAvatar />
    </div>
  </div>
</template>
