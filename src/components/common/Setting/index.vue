<!--
 * @Author: cloudyi.li
 * @Date: 2023-03-23 13:51:37
 * @LastEditTime: 2023-04-23 16:18:08
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/components/common/Setting/index.vue
-->
<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
import { NCard, NModal, NTabPane, NTabs } from 'naive-ui'
import General from './General.vue'
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

const reload = ref(false)

const show = computed({
  get() {
    return props.visible
  },
  set(visible: boolean) {
    emit('update:visible', visible)
  },
})

function handleReload() {
  reload.value = true
  setTimeout(() => {
    reload.value = false
  }, 0)
}
async function refreshUserInfo() {
  const userStore = useUserStore()
  await userStore.getUserInfo()
}

onMounted(() => {
  refreshUserInfo()
})
</script>

<template>
  <NModal v-model:show="show" :auto-focus="false">
    <NCard role="dialog" aria-modal="true" :bordered="false" style="width: 100%; max-width: 640px">
      <NTabs v-model:value="active" type="line" animated>
        <NTabPane name="General" tab="General">
          <template #tab>
            <SvgIcon class="text-lg" icon="ri:file-user-line" />
            <span class="ml-2">{{ $t('setting.general') }}</span>
          </template>
          <div class="min-h-[100px]">
            <General v-if="!reload" @update="handleReload" />
          </div>
        </NTabPane>
        <!-- <NTabPane name="Config" tab="Config">
          <template #tab>
            <SvgIcon class="text-lg" icon="ri:list-settings-line" />
            <span class="ml-2">{{ $t('setting.config') }}</span>
          </template>
          <About />
        </NTabPane> -->
      </NTabs>
    </NCard>
  </NModal>
</template>
