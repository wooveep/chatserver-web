<!--
 * @Author: cloudyi.li
 * @Date: 2023-04-14 09:52:13
 * @LastEditTime: 2023-05-28 13:02:41
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/components/common/UserAvatar/index.vue
-->
<script setup lang='ts'>
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { NAvatar, useMessage } from 'naive-ui'
// import { useRouter } from 'vue-router'
import { HoverButton, SvgIcon } from '@/components/common'
import { useAuthStore, useChatStore, usePresetStore, useUserStore } from '@/store'
import defaultAvatar from '@/assets/avatar.jpg'
import { fetchLogOut } from '@/api'
// const router = useRouter()
const Invite = defineAsyncComponent(() => import('@/components/common/Invite/index.vue'))
const authStore = useAuthStore()
const chatStore = useChatStore()
const presetStore = usePresetStore()
const message = useMessage()
const userStore = useUserStore()
const inviteShow = ref(false)

const userNickname = computed(() => userStore.nickname)
const userAvatar = computed(() => userStore.getUserAvatar)
async function handleLogoutButtonClick() {
  try {
    const result = await fetchLogOut()
    if (result.err_code !== 0)
      throw new Error(result.message)
    authStore.removeToken()
    chatStore.resetChatState()
    presetStore.resetPresetStore()
    message.success('success')
    window.location.replace('/#/login')
  }
  catch (error: any) {
    message.error(error.message)
  }
}

const needPermission = computed(() => !authStore.token)

onMounted(async () => {
  if (!needPermission.value)
    await userStore.setUserAvatar()
})
</script>

<template>
  <div class="flex items-center overflow-hidden">
    <div class="w-15 h-15 overflow-hidden rounded-full grow-1 shrink-1 basis-auto">
      <template v-if="userAvatar">
        <NAvatar
          size="large"
          round
          :src="userAvatar"
          :fallback-src="defaultAvatar"
        />
      </template>
      <template v-else>
        <NAvatar size="large" round :src="defaultAvatar" />
      </template>
    </div>
    <div class="flex-1 min-w-0 ml-2">
      <h2 class="overflow-hidden font-bold text-lg text-ellipsis whitespace-nowrap">
        {{ userNickname }}
      </h2>
      <div class="flex grow-1 shrink-1 basis-auto ">
        <HoverButton tooltip="邀请" @click="inviteShow = true">
          <span class="text-2xl  text-[#4f555e] dark:text-white">
            <SvgIcon icon="ri:share-line" />
          </span>
        </HoverButton>
        <Invite v-if="inviteShow" v-model:visible="inviteShow" />
        <HoverButton tooltip="退出" @click="handleLogoutButtonClick">
          <span class="text-2xl  text-[#4f555e] dark:text-white">
            <SvgIcon icon="ri:logout-box-r-line" />
          </span>
        </HoverButton>
      </div>
    </div>
  </div>
</template>
