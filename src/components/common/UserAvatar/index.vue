<!--
 * @Author: cloudyi.li
 * @Date: 2023-04-14 09:52:13
 * @LastEditTime: 2023-06-14 21:31:04
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/components/common/UserAvatar/index.vue
-->
<script setup lang='ts'>
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { NAvatar, NButton, NIcon, useMessage } from 'naive-ui'
// import { useRouter } from 'vue-router'
import { LogOutOutline as OutIcon, SettingsOutline as SetIcon } from '@vicons/ionicons5'
import { useAuthStore, useChatStore, usePresetStore, useUserStore } from '@/store'
import defaultAvatar from '@/assets/avatar.jpg'
import { fetchLogOut } from '@/api'
// const router = useRouter()
const authStore = useAuthStore()
const chatStore = useChatStore()
const presetStore = usePresetStore()
const message = useMessage()
const userStore = useUserStore()

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
const settingShow = ref(false)
const Setting = defineAsyncComponent(() => import('@/components/common/Setting/index.vue'))

const needPermission = computed(() => !authStore.token)

onMounted(async () => {
  if (!needPermission.value)
    await userStore.setUserAvatar()
})
</script>

<template>
  <div class="flex-1 content-center">
    <NAvatar
      round
      size="small"
      :src="userAvatar"
      :fallback-src="defaultAvatar"
    />
  </div>
  <div class="flex-1 content-center">
    <NButton text style="font-size: 26px" @click="settingShow = true">
      <NIcon>
        <SetIcon />
      </NIcon>
    </NButton>
  </div>
  <Setting v-if="settingShow" v-model:visible="settingShow" />
  <div class="order-last content-center">
    <NButton text style="font-size: 26px" @click="handleLogoutButtonClick">
      <NIcon>
        <OutIcon />
      </NIcon>
    </NButton>
  </div>
</template>
