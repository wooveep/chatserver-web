<script setup lang='ts'>
import type { Ref } from 'vue'
import { computed, defineAsyncComponent, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { NAutoComplete, NButton, NInput, useDialog, useMessage } from 'naive-ui'
import html2canvas from 'html2canvas'
import { Message } from './components'
import { useScroll } from './hooks/useScroll'
import { useChat } from './hooks/useChat'
import { useCopyCode } from './hooks/useCopyCode'
import { useMemoryLevel } from './hooks/useUsingContext'
import HeaderComponent from './components/Header/index.vue'
import { HoverButton, SvgIcon } from '@/components/common'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { useAuthStore, useChatStore } from '@/store'
import { fetchChatChatting, fetchChatCreateNew, fetchChatRegen, fetchChatUpdate, fetchRefreshToken } from '@/api'
import { t } from '@/locales'
import type { ChatChattingReq, ChatCreateNewReq, ChatCreateNewRes, ChatRegenerategReq, UserLoginRes } from '@/models'

let controller = new AbortController()
const MemoryLevel = defineAsyncComponent(() => import('@/components/common/MemoryLevel/index.vue'))

const showMemoryLevel = ref(false)
const chattingreq = ref<ChatChattingReq>({
  chat_id: '',
  message: '',
  memory_level: 0,
})
const regenreq = ref<ChatRegenerategReq>({
  chat_id: '',
  question_id: '',
  memory_level: 0,

})

const chatnewreq = ref<ChatCreateNewReq>({
  chat_name: 'New Chat',
  preset_id: '1646361709138419712',
})

const route = useRoute()
const dialog = useDialog()
const ms = useMessage()
const authStore = useAuthStore()
const chatStore = useChatStore()
const needPermission = computed(() => !authStore.token)
useCopyCode()

const { isMobile } = useBasicLayout()
const { addChat, updateChat, updateChatSome, addHistory } = useChat()
const { scrollRef, scrollToBottom, scrollToBottomIfAtBottom } = useScroll()
const { usingMemory, toggleUsingContext } = useMemoryLevel()

let { chat_uuid } = route.params as { chat_uuid: string }
// const uuid = '1647868345921310720'
const dataSources = computed(() => chatStore.getChatByUuid(chat_uuid))
const currentChatHistory = computed(() => chatStore.getChatHistoryByCurrentActive)
const memorylevel = ref<number>(0)
// const conversationList = computed(() => dataSources.value.filter(item => (!item.inversion)))
const prompt = ref<string>('')
const loading = ref<boolean>(false)
const errorstatus = ref<boolean>(false)
const inputRef = ref<Ref | null>(null)
const questionid = ref<string>('')

// 添加PromptStore
// const promptStore = usePromptStore()

// 使用storeToRefs，保证store修改后，联想部分能够重新渲染
// const { promptList: promptTemplate } = storeToRefs<any>(promptStore)

// 未知原因刷新页面，loading 状态不会重置，手动重置
dataSources.value.forEach((item, index) => {
  if (item.loading)
    updateChatSome(chat_uuid, index, { loading: false })
})

async function fetchChatUUIDNew() {
  try {
    const result = await fetchChatCreateNew<ChatCreateNewRes>(chatnewreq.value)
    const chat_id = result.data.chat_id
    addHistory(
      {
        uuid: chat_id,
        title: chatnewreq.value.chat_name,
        isEdit: false,
      },
      [],
    )
    chat_uuid = chat_id
    await sleep(200)
  }
  catch (error: any) {
    loading.value = false
  }
}

async function fetchChattingOnce(lastText: string) {
  await fetchChatChatting<any>({
    prompt: chattingreq.value,
    signal: controller.signal,
    onDownloadProgress: ({ event }) => {
      const xhr = event.target
      const { responseText } = xhr
      const lastIndex = responseText.lastIndexOf('event:chatting\n', responseText.length - 2)
      let chunk = responseText
      if (lastIndex !== -1)
        chunk = responseText.substring(lastIndex)
      try {
        const chunkindex: number = chunk.indexOf('\n')
        const chunkdata: string = chunk.substring(chunkindex + 1)
        const resdataindex: number = chunkdata.indexOf(':')
        const resdata = chunkdata.substring(resdataindex + 1)
        const data = JSON.parse(resdata)
        if (data.delta)
          lastText = data.delta
        else if (data.text)
          lastText = data.text ?? ''
        questionid.value = data.question_id
        updateChat(
          chat_uuid,
          dataSources.value.length - 1,
          {
            dateTime: data.time,
            text: lastText,
            errmsg: '',
            inversion: false,
            error: false,
            loading: true,
            msgid: data.msgid,
          },
        )
        scrollToBottomIfAtBottom()
      }
      catch (error) {
        //
      }
    },
  })
  updateChatSome(chat_uuid, dataSources.value.length - 1, { loading: false })
}

async function fetchChattingRegenerate(lastText: string, index: number) {
  await fetchChatRegen<any>({
    prompt: regenreq.value,
    signal: controller.signal,
    onDownloadProgress: ({ event }) => {
      const xhr = event.target
      const { responseText } = xhr
      const lastIndex = responseText.lastIndexOf('event:chatting\n', responseText.length - 2)
      let chunk = responseText
      if (lastIndex !== -1)
        chunk = responseText.substring(lastIndex)
      try {
        const chunkindex: number = chunk.indexOf('\n')
        const chunkdata: string = chunk.substring(chunkindex + 1)
        const resdataindex: number = chunkdata.indexOf(':')
        const resdata = chunkdata.substring(resdataindex + 1)
        const data = JSON.parse(resdata)
        if (data.delta)
          lastText = data.delta
        else if (data.text)
          lastText = data.text ?? ''
        questionid.value = data.question_id
        updateChatSome(
          chat_uuid,
          index,
          {
            text: lastText,
            loading: true,
            msgid: data.msgid,
          },
        )
        scrollToBottomIfAtBottom()
      }
      catch (error) {
        //
      }
    },
  })
  updateChatSome(chat_uuid, index, { loading: false })
}

async function onConversation() {
  if (!chat_uuid || chat_uuid === '')
    await fetchChatUUIDNew()
  const message = prompt.value
  if (dataSources.value.length !== 0) {
    const { error } = dataSources.value[dataSources.value.length - 1]
    if (typeof error !== 'undefined') {
      if (error)
        return
    }
  }
  if (loading.value)
    return
  if (!message || message.trim() === '')
    return
  controller = new AbortController()

  addChat(
    chat_uuid,
    {
      dateTime: new Date().toLocaleString(),
      text: message,
      inversion: true,
      errmsg: '',
      error: false,
      msgid: '',
    },
  )
  if (dataSources.value.length === 1) {
    const title = currentChatHistory.value?.title ?? 'New Chat'
    await fetchChatUpdate({ chat_id: chat_uuid, chat_name: title })
  }
  scrollToBottom()

  loading.value = true
  prompt.value = ''
  addChat(
    chat_uuid,
    {
      dateTime: new Date().toLocaleString(),
      text: '',
      errmsg: '',
      loading: true,
      inversion: false,
      error: false,
      msgid: '',
    },
  )
  scrollToBottom()
  chattingreq.value.chat_id = chat_uuid
  chattingreq.value.message = message
  chattingreq.value.memory_level = usingMemory.value
  try {
    const lastText = ''
    await fetchChattingOnce(lastText)
  }
  catch (error: any) {
    const errorMessage = error?.message ?? t('common.wrong')
    if (error.message === 'canceled') {
      updateChatSome(
        chat_uuid,
        dataSources.value.length - 1,
        {
          loading: false,
        },
      )
      scrollToBottomIfAtBottom()
      return
    }

    updateChatSome(
      chat_uuid,
      dataSources.value.length - 1,
      {
        loading: false,
        error: true,
        errmsg: `[${errorMessage}]`,
      },
    )
    errorstatus.value = true
    scrollToBottomIfAtBottom()
  }
  finally {
    updateChatSome(chat_uuid, dataSources.value.length - 2, { msgid: questionid.value })
    loading.value = false
  }
}

async function onRegenerate(index: number) {
  if (loading.value)
    return

  controller = new AbortController()
  loading.value = true
  // const { msgid: regenmsgid } = dataSources.value[index]
  const { msgid: regenmsgid } = dataSources.value[index - 1]
  const { text: questionmsg } = dataSources.value[index - 1]
  updateChatSome(
    chat_uuid,
    index,
    {
      text: '',
      errmsg: '',
      error: false,
      loading: true,
    },
  )

  try {
    const lastText = ''
    if (regenmsgid !== '') {
      regenreq.value.chat_id = chat_uuid
      regenreq.value.question_id = regenmsgid
      regenreq.value.memory_level = usingMemory.value
      await fetchChattingRegenerate(lastText, index)
    }
    else {
      chattingreq.value.chat_id = chat_uuid
      chattingreq.value.message = questionmsg
      chattingreq.value.memory_level = usingMemory.value
      await fetchChattingOnce(lastText)
    }
  }
  catch (error: any) {
    if (error.message === 'canceled') {
      updateChatSome(
        chat_uuid,
        index,
        {
          loading: false,
        },
      )
      return
    }

    const errorMessage = error?.message ?? t('common.wrong')
    updateChatSome(
      chat_uuid,
      index,
      {
        loading: false,
        error: true,
        errmsg: `[${errorMessage}]`,
      },
    )
  }
  finally {
    updateChatSome(chat_uuid, index - 1, { msgid: questionid.value })
    loading.value = false
  }
}

function handleSubmit() {
  onConversation()
}

function handleExport() {
  if (loading.value)
    return

  const d = dialog.warning({
    title: t('chat.exportImage'),
    content: t('chat.exportImageConfirm'),
    positiveText: t('common.yes'),
    negativeText: t('common.no'),
    onPositiveClick: async () => {
      try {
        d.loading = true
        const ele = document.getElementById('image-wrapper')
        const canvas = await html2canvas(ele as HTMLDivElement, {
          useCORS: true,
        })
        const imgUrl = canvas.toDataURL('image/png')
        const tempLink = document.createElement('a')
        tempLink.style.display = 'none'
        tempLink.href = imgUrl
        tempLink.setAttribute('download', 'chat-shot.png')
        if (typeof tempLink.download === 'undefined')
          tempLink.setAttribute('target', '_blank')

        document.body.appendChild(tempLink)
        tempLink.click()
        document.body.removeChild(tempLink)
        window.URL.revokeObjectURL(imgUrl)
        d.loading = false
        ms.success(t('chat.exportSuccess'))
        Promise.resolve()
      }
      catch (error: any) {
        ms.error(t('chat.exportFailed'))
      }
      finally {
        d.loading = false
      }
    },
  })
}

function handleDelete(index: number) {
  if (loading.value)
    return

  dialog.warning({
    title: t('chat.deleteMessage'),
    content: t('chat.deleteMessageConfirm'),
    positiveText: t('common.yes'),
    negativeText: t('common.no'),
    onPositiveClick: () => {
      chatStore.deleteChatByUuid(chat_uuid, index)
    },
  })
}

// function handleClear() {
//   if (loading.value)
//     return

//   dialog.warning({
//     title: t('chat.clearChat'),
//     content: t('chat.clearChatConfirm'),
//     positiveText: t('common.yes'),
//     negativeText: t('common.no'),
//     onPositiveClick: () => {
//       chatStore.clearChatByUuid(chat_uuid)
//     },
//   })
// }

function handleMemory() {
  showMemoryLevel.value = true
  memorylevel.value = chatStore.getMemoryLevel
}
function handleEnter(event: KeyboardEvent) {
  if (!isMobile.value) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSubmit()
    }
  }
  else {
    if (event.key === 'Enter' && event.ctrlKey) {
      event.preventDefault()
      handleSubmit()
    }
  }
}

function handleStop() {
  if (loading.value) {
    controller.abort()
    loading.value = false
  }
}

const placeholder = computed(() => {
  if (isMobile.value)
    return t('chat.placeholderMobile')
  return t('chat.placeholder')
})

const buttonDisabled = computed(() => {
  return loading.value || !prompt.value || prompt.value.trim() === '' || errorstatus.value
})

const footerClass = computed(() => {
  let classes = ['p-4']
  if (isMobile.value)
    classes = ['sticky', 'left-0', 'bottom-0', 'right-0', 'p-2', 'pr-3', 'overflow-hidden']
  return classes
})

async function refreshToken() {
  const tokenExpire = authStore.getTokenTime ?? 0
  const timenow = new Date().getTime()
  const timediff = tokenExpire - timenow
  if (timediff <= 600) {
    const result = await fetchRefreshToken<UserLoginRes>().then((response) => {
      const data = response.data
      return data
    })

    authStore.setToken(result.token, result.expire_at)
    return result.token
  }
}
onMounted(() => {
  if (!needPermission.value)
    refreshToken()
  scrollToBottom()
  if (inputRef.value && !isMobile.value)
    inputRef.value?.focus()
})

onUnmounted(() => {
  if (loading.value)
    controller.abort()
})

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
</script>

<template>
  <div class="flex flex-col w-full h-full">
    <HeaderComponent
      v-if="isMobile"
      :using-memory="usingMemory"
      :show-memory-level="showMemoryLevel"
      @export="handleExport"
      @toggle-using-context="toggleUsingContext"
    />
    <main class="flex-1 overflow-hidden">
      <div id="scrollRef" ref="scrollRef" class="h-full overflow-hidden overflow-y-auto">
        <div
          id="image-wrapper"
          class="w-full max-w-screen-xl m-auto dark:bg-[#101014]"
          :class="[isMobile ? 'p-2' : 'p-4']"
        >
          <template v-if="!dataSources.length">
            <div class="flex items-center justify-center mt-4 text-center text-neutral-300">
              <SvgIcon icon="ri:bubble-chart-fill" class="mr-2 text-3xl" />
              <span>Hello!</span>
            </div>
          </template>
          <template v-else>
            <div>
              <Message
                v-for="(item, index) of dataSources"
                :key="index"
                :date-time="item.dateTime"
                :text="item.text"
                :inversion="item.inversion"
                :error="item.error"
                :loading="item.loading"
                :errmsg="item.errmsg"
                @regenerate="onRegenerate(index)"
                @delete="handleDelete(index)"
              />
              <div class="sticky bottom-0 left-0 flex justify-center">
                <NButton v-if="loading" type="warning" @click="handleStop">
                  <template #icon>
                    <SvgIcon icon="ri:stop-circle-line" />
                  </template>
                  Stop Responding
                </NButton>
              </div>
            </div>
          </template>
        </div>
      </div>
    </main>
    <footer :class="footerClass">
      <div class="w-full max-w-screen-xl m-auto">
        <div class="flex items-center justify-between space-x-2">
          <HoverButton v-if="!isMobile" @click="handleExport">
            <span class="text-xl text-[#4f555e] dark:text-white">
              <SvgIcon icon="ri:download-2-line" />
            </span>
          </HoverButton>
          <HoverButton v-if="!isMobile" @click="handleMemory">
            <span class="text-xl" :class="{ 'text-[#4b9e5f]': usingMemory, 'text-[#a8071a]': !usingMemory }">
              <SvgIcon icon="ri:chat-history-line" />
            </span>
          </HoverButton>
          <MemoryLevel v-if="showMemoryLevel" v-model:visible="showMemoryLevel" :mobile="false" :memorylevel="memorylevel" />

          <NAutoComplete v-model:value="prompt">
            <template #default="{ handleInput, handleBlur, handleFocus }">
              <NInput
                ref="inputRef"
                v-model:value="prompt"
                type="textarea"
                :placeholder="placeholder"
                :autosize="{ minRows: 1, maxRows: isMobile ? 4 : 8 }"
                @input="handleInput"
                @focus="handleFocus"
                @blur="handleBlur"
                @keypress="handleEnter"
              />
            </template>
          </NAutoComplete>
          <NButton type="primary" :disabled="buttonDisabled" @click="handleSubmit">
            <template #icon>
              <span class="dark:text-black">
                <SvgIcon icon="ri:send-plane-fill" />
              </span>
            </template>
          </NButton>
        </div>
      </div>
    </footer>
  </div>
</template>
