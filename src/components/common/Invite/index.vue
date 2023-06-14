<!--
 * @Author: cloudyi.li
 * @Date: 2023-05-20 19:31:00
 * @LastEditTime: 2023-06-12 20:26:29
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/components/common/Invite/index.vue
-->
<script lang='ts' setup>
import { computed, onMounted, ref } from 'vue'
import { CopyOutline as CopyIcon, ShareSocial as LinkIcon, MedalSharp as MedalIcon, PersonAddSharp as PersonIcon } from '@vicons/ionicons5'
import { NButton, NIcon, NModal, NSpin, useMessage } from 'naive-ui'
import copy from 'copy-to-clipboard'
import { useInviteStore } from '@/store'

// import { fetchChatConfig } from '@/api'

const props = defineProps<Props>()

const emit = defineEmits<Emit>()
interface Props {
  visible: boolean
}
interface Emit {
  (e: 'update:visible', visible: boolean): void
}
const show = computed({
  get() {
    return props.visible
  },
  set(visible: boolean) {
    emit('update:visible', visible)
  },
})

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
  <NModal
    v-model:show="show" :auto-focus="true" preset="card" embedded
    style="width: 95%; max-width: 640px"
  >
    <div class="p-4 space-y-5 min-h-[200px]">
      <NSpin :show="loading">
        <div class="p-4 space-y-5 min-h-[200px]">
          <div class="space-y-6">
            <h2 class="text-xl font-bold">
              {{ $t('invite.title') }}
            </h2>
            <div class="flex items-center space-x-4">
              <span class="flex-shrink-0 w-[120px]">
                <NIcon>
                  <LinkIcon />
                </NIcon>
                {{ $t('invite.link') }}
              </span>
              <div class="w-[400px]">
                {{ inviteInfo.inviteLink }}
                <NButton ghost style="font-size: 16px" @click="handleCopyClick">
                  <NIcon>
                    <CopyIcon />
                  </NIcon>
                  点击复制
                </NButton>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <span class="flex-shrink-0 w-[120px]">
                <NIcon>
                  <PersonIcon />
                </NIcon>
                {{ $t('invite.number') }}</span>
              <div class="w-[400px]">
                {{ inviteInfo.inviteNumber }}
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <span class="flex-shrink-0 w-[120px]">
                <NIcon>
                  <MedalIcon />
                </NIcon>
                {{ $t('invite.reward') }}</span>
              <div class="w-[400px]">
                {{ inviteInfo.inviteReward }}
              </div>
            </div>
          </div>
        </div>
      </NSpin>
    </div>
  </NModal>
</template>
