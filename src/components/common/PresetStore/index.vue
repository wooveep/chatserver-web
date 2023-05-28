<!--
 * @Author: cloudyi.li
 * @Date: 2023-04-20 18:57:17
 * @LastEditTime: 2023-05-28 12:55:18
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/components/common/PresetStore/index.vue
-->
<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
import { NButton, NCard, NModal, NRadio, NRadioGroup, useMessage } from 'naive-ui'
import { useChatStore, usePresetStore } from '@/store'
import { fetchChatClear, fetchChatUpdate } from '@/api'
import { usePreset } from '@/views/chat/hooks/userPreset'

const props = defineProps<Props>()

const emit = defineEmits<Emit>()

interface Props {
  visible: boolean
  mobile: boolean
}

interface Emit {
  (e: 'update:visible', visible: boolean): void

}
const message = useMessage()
const chatStore = useChatStore()
const presetStore = usePresetStore()
const currentPreset = computed(() => presetStore.getPresetList)
const activePreset = computed(() => presetStore.getActiveUuid)
const checkPreset = ref('')
const show = computed({
  get() {
    return props.visible
  },
  set(visible: boolean) {
    emit('update:visible', visible)
  },
})
const { fetchPreset } = usePreset()

// function updateActivePreset(UUID: string) {
//   presetStore.setActive(UUID)
//   // 访问更新会话Preset ID接口
//   // 更新chatstore中的preset值
// }
async function updateChatpreset() {
  if (activePreset.value !== checkPreset.value) {
    presetStore.setActive(checkPreset.value)
    const result = await fetchChatClear({ chat_id: chatStore.active })
    if (result.err_code === 0)
      chatStore.clearChatByUuid(chatStore.active)
    const upresult = await fetchChatUpdate({ chat_id: chatStore.active, preset_id: checkPreset.value, chat_name: 'New Chat' })
    if (upresult.err_code === 0) {
      chatStore.updateHistory(chatStore.active, { presetid: checkPreset.value, title: 'New Chat' })
      message.success('AI 助手角色切换成功')
    }
  }
  show.value = false
}
onMounted(() => {
  fetchPreset()
  checkPreset.value = presetStore.getActiveUuid
})
</script>

<template>
  <NModal v-model:show="show" :auto-focus="false" preset="card" style="width: 95%; max-width: 640px">
    <NCard role="dialog" aria-modal="true" :title="$t('store.title')" :bordered="false" style="width: 100%; max-width: 640px;">
      <div class="flex flex-wrap items-center gap-4">
        <NRadioGroup v-model:value="checkPreset" name="radiobuttongroup1" size="small">
          <div class="card-container">
            <NRadio
              v-for="preset in currentPreset" :key="preset.preset_id"
              style="font-size: 16px"
              text
              :value="preset.preset_id"
              size="small"
              class="card-item"
            >
              {{ preset.preset_name }}
            </NRadio>
          </div>
        </NRadioGroup>
      </div>
      <div class="flex flex-wrap items-center gap-4">
        <span class="flex-shrink-0 w-[100px]" />
        <div class="text-gray-500">
          {{ $t('store.description') }}
        </div>
        <NButton type="primary" @click="updateChatpreset">
          {{ $t('common.confirm') }}
        </NButton>
      </div>
    </NCard>
  </NModal>
</template>

<style scoped>
.card-container {
  display: flex;
  flex-wrap: wrap;
}
.card-item {
  flex: 0 0  calc(30% - 10px);
  margin-right: 20px;
  margin-bottom: 20px;
}
@media (max-width: 600px) {
  .card-item {
    flex: 0 0 100%; /* 在移动端设置为占满一行 */
    min-width: 0; /* 取消最小宽度限制 */
  }
}
</style>
