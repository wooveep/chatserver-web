<!--
 * @Author: cloudyi.li
 * @Date: 2023-03-23 13:51:37
 * @LastEditTime: 2023-05-22 12:24:40
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/components/common/Setting/General.vue
-->
<script lang='ts' setup>
import { computed } from 'vue'
import { NAvatar } from 'naive-ui'
import defaultAvatar from '@/assets/avatar.jpg'
import { useUserStore } from '@/store'

const userStore = useUserStore()

// const ms = useMessage()

const userInfo = computed(() => userStore.getUser)
</script>

<template>
  <div class="p-4 space-y-5 min-h-[200px]">
    <div class="space-y-6">
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[120px]">{{ $t('setting.avatar') }}</span>
        <div class="w-[200px]">
          <NAvatar
            round
            size="medium"
            :src="userInfo.avatar"
            :fallback-src="defaultAvatar"
          />
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[120px]">{{ $t('setting.username') }}</span>
        <div class="w-[200px]">
          {{ userInfo.username }}
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[120px]">{{ $t('setting.nickname') }}</span>
        <div class="w-[200px]">
          {{ userInfo.nickname }}
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[120px]">{{ $t('setting.email') }}</span>
        <div class="flex-1">
          {{ userInfo.email }}
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[120px]">{{ $t('setting.userrole') }}</span>
        <div class="flex-1">
          {{ userInfo.role }}
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[120px]">{{ $t('setting.balance') }}</span>
        <div class="flex-1">
          {{ userInfo.balance }}
        </div>
      </div>
    </div>
  </div>
</template>
