<!--
 * @Author: cloudyi.li
 * @Date: 2023-03-23 13:51:37
 * @LastEditTime: 2023-06-14 21:34:41
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/views/chat/layout/sider/Footer.vue
-->
<script lang='ts' setup>
import { computed, defineAsyncComponent, ref } from 'vue'
import { NButton, NIcon } from 'naive-ui'
import { DocumentBulletList24Regular as BillIcon, GiftCardMoney24Regular as GiftIcon, Share16Regular as ShareIcon } from '@vicons/fluent'
import { UserAvatar } from '@/components/common'
const props = defineProps<Props>()
const emit = defineEmits<Emit>()

interface Props {
  mobile: boolean
}
interface Emit {
  (e: 'update:mobile', mobile: boolean): void

}
const isMobile = computed({
  get(): boolean {
    return props.mobile
  },
  set(visible: boolean) {
    emit('update:mobile', visible)
  },
})
// import { HoverButton, SvgIcon } from '@/components/common'
const inviteShow = ref(false)
const rechargeShow = ref(false)
const billShow = ref(false)
// const presetShow = ref(false)
const Invite = defineAsyncComponent(() => import('@/components/common/Invite/index.vue'))
// const PresetStore = defineAsyncComponent(() => import('@/components/common/PresetStore/index.vue'))
const Bills = defineAsyncComponent(() => import('@/components/common/Bills/index.vue'))
const Recharge = defineAsyncComponent(() => import('@/components/common/Recharge/index.vue'))
</script>

<template>
  <div
    v-if="!isMobile"
    class="grid grid-cols-3 gap-4 p-1 border-t dark:border-neutral-800 bg-white/80 dark:bg-black/20"
  >
    <div>
      <NButton ghost strong :bordered="false" @click="billShow = true">
        <template #icon>
          <NIcon>
            <BillIcon />
          </NIcon>
        </template>账单
      </NButton>
      <Bills v-if="billShow" v-model:visible="billShow" />
    </div>
    <div>
      <NButton ghost strong :bordered="false" @click="rechargeShow = true">
        <template #icon>
          <NIcon>
            <GiftIcon />
          </NIcon>
        </template>充值
      </NButton>
      <Recharge v-if="rechargeShow" v-model:visible="rechargeShow" />
    </div>
    <div>
      <NButton ghost strong :bordered="false" @click="inviteShow = true">
        <template #icon>
          <NIcon>
            <ShareIcon />
          </NIcon>
        </template>分享
      </NButton>
      <Invite v-if="inviteShow" v-model:visible="inviteShow" />
    </div>
  </div>
  <div v-if="isMobile" class="grid grid-cols-3 gap-4  p-1 border-t dark:border-neutral-800 bg-white/80 dark:bg-black/20">
    <UserAvatar />
  </div>
</template>
