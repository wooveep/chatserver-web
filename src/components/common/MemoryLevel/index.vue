<!--
 * @Author: cloudyi.li
 * @Date: 2023-04-20 18:57:17
 * @LastEditTime: 2023-04-21 15:10:23
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/components/common/MemoryLevel/index.vue
-->
<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
import { NCard, NModal, NSlider } from 'naive-ui'
import { useChatStore } from '@/store'

const props = defineProps<Props>()

const emit = defineEmits<Emit>()

interface Props {
  visible: boolean
  mobile: boolean

}

interface Emit {
  (e: 'update:visible', visible: boolean): void

}
const chatStore = useChatStore()

const show = computed({
  get() {
    return props.visible
  },
  set(visible: boolean) {
    emit('update:visible', visible)
  },
})
const memory = ref(0)

function updateChatgptParams(memory: number) {
  chatStore.setMemoryLevel(memory)
}
onMounted(() => {
  memory.value = chatStore.getMemoryLevel
})
</script>

<template>
  <NModal v-model:show="show" :auto-focus="false" preset="card" style="width: 95%; max-width: 640px">
    <NCard role="dialog" aria-modal="true" :title="$t('setting.chatgpt_memory_title')" :bordered="false" style="width: 100%; max-width: 640px;">
      <div class="flex flex-wrap items-center gap-4">
        <NSlider
          v-if="!mobile"
          v-model:value="memory"
          :marks="{
            0: $t('setting.chatgpt_memory_choice_0'),
            6: $t('setting.chatgpt_memory_choice_1'),
            12: $t('setting.chatgpt_memory_choice_2'),
            20: $t('setting.chatgpt_memory_choice_3'),
          }"
          :step="2"
          :min="0"
          :max="20"
          @update:value="updateChatgptParams(memory) "
        />
        <NSlider
          v-if="mobile"
          v-model:value="memory"
          :marks="{
            0: $t('setting.chatgpt_memory_mobile_choice_0'),
            6: $t('setting.chatgpt_memory_mobile_choice_1'),
            12: $t('setting.chatgpt_memory_mobile_choice_2'),
            20: $t('setting.chatgpt_memory_mobile_choice_3'),
          }"
          :step="2"
          :min="0"
          :max="20"
          @update:value="updateChatgptParams(memory) "
        />
      </div>
      <div class="flex flex-wrap items-center gap-4">
        <span class="flex-shrink-0 w-[100px]" />
        <div class="w-[300px]  text-gray-500">
          {{ $t('setting.chatgpt_memory_memo') }}
        </div>
      </div>
    </NCard>
  </NModal>
</template>
