<!--
 * @Author: cloudyi.li
 * @Date: 2023-04-20 18:57:17
 * @LastEditTime: 2023-05-06 22:26:24
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/components/common/PresetStore/index.vue
-->
<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
import { NButton, NCard, NModal, NRadioButton, NRadioGroup, NSpace, useMessage } from 'naive-ui'
import { useChatStore, usePresetStore } from '@/store'
import { fetchChatClear, fetchChatUpdate } from '@/api'

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
// const activePreset = computed(() => presetStore.getActiveUuid)
const checkPreset = ref('')
const show = computed({
  get() {
    return props.visible
  },
  set(visible: boolean) {
    emit('update:visible', visible)
  },
})

function updateActivePreset(UUID: string) {
  presetStore.setActive(UUID)
  // 访问更新会话Preset ID接口
  // 更新chatstore中的preset值
}
async function updateChatpreset() {
  const result = await fetchChatClear({ chat_id: chatStore.active })
  if (result.err_code === 0)
    chatStore.clearChatByUuid(chatStore.active)
  const upresult = await fetchChatUpdate({ chat_id: chatStore.active, preset_id: checkPreset.value, chat_name: 'New Chat' })
  if (upresult.err_code === 0) {
    chatStore.updateHistory(chatStore.active, { presetid: checkPreset.value, title: 'New Chat' })
    message.success('AI 助手角色切换成功')
  }
  show.value = false
}
onMounted(() => {
  checkPreset.value = presetStore.getActiveUuid
})
</script>

<template>
  <NModal v-model:show="show" :auto-focus="false" preset="card" style="width: 95%; max-width: 640px">
    <NCard role="dialog" aria-modal="true" :title="$t('setting.sotre_title')" :bordered="false" style="width: 100%; max-width: 640px;">
      <div class="flex flex-wrap items-center gap-4">
        <NRadioGroup v-model:value="checkPreset" name="radiobuttongroup1" size="large" @update-value="updateActivePreset">
          <NSpace vertical>
            <NRadioButton
              v-for="preset in currentPreset" :key="preset.preset_id"
              style="font-size: 16px"
              :value="preset.preset_id"
            >
              {{ preset.preset_name }}
            </NRadioButton>
          </NSpace>
        </NRadioGroup>
      </div>
      <div class="flex flex-wrap items-center gap-4">
        <span class="flex-shrink-0 w-[100px]" />
        <div class="text-gray-500">
          请点击“确定”按钮切换AI助手的角色，切换后将会清空当前会话内容。
          建议新建会话切换角色。
        </div>
        <NButton type="primary" @click="updateChatpreset">
          确定
        </NButton>
      </div>
    </NCard>
  </NModal>
</template>
