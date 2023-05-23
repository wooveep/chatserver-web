<!--
 * @Author: cloudyi.li
 * @Date: 2023-03-23 13:51:37
 * @LastEditTime: 2023-05-22 12:23:50
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/components/common/Setting/index.vue
-->
<script lang='ts' setup>
import { computed, onMounted, ref } from 'vue'
import { NModal, NTabPane, NTabs } from 'naive-ui'
import General from './General.vue'
import Password from './Password.vue'
import Recharge from './Recharge.vue'
import Config from './Config.vue'
import Invite from './Invite.vue'
import { SvgIcon } from '@/components/common'
import { useUserStore } from '@/store'

const props = defineProps<Props>()

const emit = defineEmits<Emit>()

interface Props {
  visible: boolean
}

interface Emit {
  (e: 'update:visible', visible: boolean): void
}

const active = ref('General')

// const reload = ref(false)

const show = computed({
  get() {
    return props.visible
  },
  set(visible: boolean) {
    emit('update:visible', visible)
  },
})

async function refreshUserInfo() {
  const userStore = useUserStore()
  await userStore.setUserInfo()
}

onMounted(() => {
  refreshUserInfo()
})
</script>

<template>
  <NModal v-model:show="show" :auto-focus="false" preset="card" style="width: 95%; max-width: 640px">
    <div>
      <NTabs v-model:value="active" type="line" justify-content="space-evenly" animated>
        <NTabPane name="General" tab="General">
          <template #tab>
            <SvgIcon class="text-lg" icon="ri:file-user-line" />
            <span class="ml-2">{{ $t('setting.general') }}</span>
          </template>
          <div class="min-h-[100px]">
            <General />
          </div>
        </NTabPane>
        <NTabPane name="Config" tab="Config">
          <template #tab>
            <SvgIcon class="text-lg" icon="ri:list-settings-line" />
            <span class="ml-2">{{ $t('setting.setting') }}</span>
          </template>
          <div class="min-h-[100px]">
            <Config />
          </div>
        </NTabPane>
        <NTabPane name="Recharge" tab="Recharge">
          <template #tab>
            <SvgIcon class="text-lg" icon="ri:money-cny-box-line" />
            <span class="ml-2">{{ $t('setting.recharge') }}</span>
          </template>
          <div class="min-h-[100px]">
            <Recharge />
          </div>
        </NTabPane>
        <NTabPane name="Invite" tab="Invite">
          <template #tab>
            <SvgIcon class="text-lg" icon="ri:links-line" />
            <span class="ml-2">{{ $t('setting.invite') }}</span>
          </template>
          <div class="min-h-[100px]">
            <Invite />
          </div>
        </NTabPane>
        <NTabPane name="Password" tab="Password">
          <template #tab>
            <SvgIcon class="text-lg" icon="ri:key-line" />
            <span class="ml-2">{{ $t('setting.password') }}</span>
          </template>
          <div class="min-h-[100px]">
            <Password />
          </div>
        </NTabPane>
      </NTabs>
    </div>
  </NModal>
</template>
