<!--
 * @Author: cloudyi.li
 * @Date: 2023-04-14 09:52:13
 * @LastEditTime: 2023-05-06 22:21:15
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/components/common/UserAvatar/index.vue
-->
<script setup lang='ts'>
import { computed } from 'vue'
import { NAvatar, NButton, useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'
import { SvgIcon } from '@/components/common'
import { useAuthStore, useChatStore, useUserStore } from '@/store'
import defaultAvatar from '@/assets/avatar.jpg'
import { isString } from '@/utils/is'
import { fetchLogOut } from '@/api'
const router = useRouter()
const authStore = useAuthStore()
const chatStore = useChatStore()
const message = useMessage()
const userStore = useUserStore()

const userInfo = computed(() => userStore.userInfo)

async function handleLogoutButtonClick(e: MouseEvent) {
  e.preventDefault()
  try {
    const result = await fetchLogOut()
    if (result.err_code !== 0)
      throw new Error(result.message)
    authStore.removeToken()
    chatStore.resetChatState()
    message.success('success')
    router.push('/login')
  }
  catch (error: any) {
    message.error(error.message)
  }
}
</script>

<template>
  <div class="flex items-center overflow-hidden">
    <div class="w-15 h-15 overflow-hidden rounded-full grow-1 shrink-1 basis-auto">
      <template v-if="isString(userInfo.avatar_url) && userInfo.avatar_url.length > 0">
        <NAvatar
          size="large"
          round
          :src="userInfo.avatar_url"
          :fallback-src="defaultAvatar"
        />
      </template>
      <template v-else>
        <NAvatar size="large" round :src="defaultAvatar" />
      </template>
    </div>
    <div class="flex-1 min-w-0 ml-2">
      <h2 class="overflow-hidden font-bold text-lg text-ellipsis whitespace-nowrap">
        {{ userInfo.nickname }}
      </h2>
      <!-- <p class="overflow-hidden text-xs text-gray-500 text-ellipsis whitespace-nowrap">
        <span
          v-if="isString(userInfo.email) && userInfo.email !== ''"
          v-html="userInfo.email"
        />
      </p> -->
      <NButton
        :text="true"
        @click="handleLogoutButtonClick"
      >
        <span class="text-xl text-[#4f555e] dark:text-white">
          <SvgIcon icon="ri:logout-box-r-line" />
        </span>
        <h4 class="overflow-hidden text-gray-500  text-md text-ellipsis whitespace-nowrap">
          退出
        </h4>
      </NButton>
    </div>
  </div>
</template>
