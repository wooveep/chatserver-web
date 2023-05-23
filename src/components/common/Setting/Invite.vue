<!--
 * @Author: cloudyi.li
 * @Date: 2023-05-20 19:31:00
 * @LastEditTime: 2023-05-22 12:24:10
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/components/common/Setting/Invite.vue
-->
<script lang='ts' setup>
import { computed, onMounted, ref } from 'vue'
import { CopyOutline as CopyIcon } from '@vicons/ionicons5'
import { NButton, NIcon, NSpin, useMessage } from 'naive-ui'
import copy from 'copy-to-clipboard'
import { useInviteStore } from '@/store'

// import { fetchChatConfig } from '@/api'

const loading = ref(false)
const inviteStore = useInviteStore()

// const ms = useMessage()

const inviteInfo = computed(() => inviteStore.inviteInfo)
async function fetchInvite() {
  try {
    loading.value = true
    await inviteStore.getUserInvite()
  }
  finally {
    loading.value = false
  }
}
const message = useMessage()

function handleCopyClick() {
  copy(inviteInfo.value.inviteLink)
  message.success('链接复制成功')
}
onMounted(() => {
  fetchInvite()
})
</script>

<template>
  <NSpin :show="loading">
    <div class="p-4 space-y-4">
      <h2 class="text-xl font-bold">
        {{ $t('invite.title') }}
      </h2>
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[80px]">{{ $t('invite.link') }}</span>
        <div class="w-[400px]">
          {{ inviteInfo.inviteLink }}
          <NButton text style="font-size: 18px" @click="handleCopyClick">
            <NIcon>
              <CopyIcon />
            </NIcon>
          </NButton>
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]">{{ $t('invite.number') }}</span>
        <div class="w-[400px]">
          {{ inviteInfo.inviteNumber }}
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]"> {{ $t('invite.reward') }}</span>
        <div class="w-[400px]">
          {{ inviteInfo.inviteReward }}
        </div>
      </div>
    </div>
  </NSpin>
</template>
