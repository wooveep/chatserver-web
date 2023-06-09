<!--
 * @Author: cloudyi.li
 * @Date: 2023-03-24 09:20:29
 * @LastEditTime: 2023-05-25 13:59:34
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/views/chat/layout/Permission.vue
-->
<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import {
  NButton, NForm, NFormItem,
  NImage,
  NInput,
  NModal,
  useMessage,
} from 'naive-ui'

import type {
  FormInst,
  FormRules,
} from 'naive-ui'
import { useRouter } from 'vue-router'
import { useChat } from '../hooks/useChat'
import { useAuthStore } from '@/store'
import Icon403 from '@/icons/403.vue'
import { fetchCaptCha, fetchLogin } from '@/api'
import type { CaptChaRes, UserLoginReq, UserLoginRes } from '@/models'
import { myTrim } from '@/utils/format'
import { CryptoPassword } from '@/utils/crypto'
defineProps<Props>()
const { fetchChatHistoryList, resetChat } = useChat()

const router = useRouter()

interface Props {
  visible: boolean
}
// const router = useRouter()
const authStore = useAuthStore()
const message = useMessage()
const formRef = ref<FormInst | null>(null)
// const loading = ref(false)
const captcha = ref<string>('')
const modelRef = ref<UserLoginReq>({
  username: null,
  password: null,
  captcha: null,
})

const rules: FormRules = {
  username: [{
    required: true,
    message: ' 请输入用户名',
    trigger: ['input', 'blur'],

  }],
  password: [{
    required: true,
    message: '请输入密码',
    trigger: ['input', 'blur'],
  }],
  captcha: [{
    required: true,
    message: '请输入验证码',
    trigger: ['input', 'blur'],
  }],
}

async function handleLoginButtonClick() {
  try {
    const username = myTrim(modelRef.value.username ?? '')
    const password = CryptoPassword(myTrim(modelRef.value.password ?? ''))
    const captcha = myTrim(modelRef.value.captcha ?? '')
    const result = await fetchLogin<UserLoginRes>({ username, password, captcha })
    if (result.err_code !== 0)
      throw new Error(result.message)

    await authStore.setToken(result.data.token, result.data.timeout)
    message.success('success')
    router.push('/')
    resetChat()
    await fetchChatHistoryList()
  }
  catch (error: any) {
    message.error(error.message)
    authStore.removeToken()
    await getCaptCha()
    modelRef.value.password = null
    modelRef.value.captcha = null
  }
  finally {
    modelRef.value.password = null
  }
}

function handlePress(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleLoginButtonClick()
  }
}
async function getCaptCha() {
  const result = await fetchCaptCha<CaptChaRes>()
  captcha.value = `data:image/png;base64,${result.data.image}`
}

onMounted(async () => {
  await getCaptCha()
})
</script>

<template>
  <NModal :show="visible" style="width: 90%; max-width: 640px">
    <div class="p-10 bg-white rounded dark:bg-slate-800">
      <div class="space-y-4">
        <header class="space-y-2">
          <h2 class="text-2xl font-bold text-center text-slate-800 dark:text-neutral-200">
            {{ $t('common.loginpage') }}
          </h2>
          <p class="text-base text-center text-slate-500 dark:text-slate-500">
            {{ $t('common.unauthorizedTips') }}
          </p>
          <Icon403 class="w-[200px] m-auto" />
        </header>
        <NForm ref="formRef" label-placement="left" :label-width="120" :model="modelRef" :rules="rules">
          <NFormItem path="username" :label="$t('common.username')" label-width="100px">
            <NInput
              v-model:value="modelRef.username"
              size="large"
              :placeholder="$t('common.usernameplaceholder')"
              clearable
              autofocus
              @keydown.enter.prevent
            />
          </NFormItem>
          <NFormItem path="password" :label="$t('common.password')" label-width="100px">
            <NInput
              v-model:value="modelRef.password"
              size="large"
              :placeholder="$t('common.passwordplaceholder')"
              clearable
              type="password"
              show-password-on="mousedown"
              @keydown.enter.prevent
            />
          </NFormItem>
          <NFormItem path="captcha" :label="$t('common.captcha')" label-width="100px">
            <NInput
              v-model:value="modelRef.captcha"
              autosizes
              placeholder=""
              clearable
              autofocus
              style="min-width: 50%"
              @keypress="handlePress"
            />
            <NImage
              width="100"
              :src="captcha"
            />
          </NFormItem>
          <NButton
            class="login-button"
            :disabled="modelRef.username === null || modelRef.password === null"
            round
            type="primary"
            size="large"
            @click="handleLoginButtonClick"
          >
            <span class="button-text">{{ $t('common.login') }}</span>
          </NButton>
        </NForm>
        <div class="login-signup">
          <a href="#/register">{{ $t('user.register_link') }}</a>
        </div>
        <div class="login-forget">
          <a href="#/forgetpassword">{{ $t('user.forget_link') }}</a>
        </div>
      </div>
    </div>
  </NModal>
</template>

<style scoped>
.login-button {
  width: 70%;
  margin: 20px auto;
  display: block;
}
.button-text {
  font-weight: bold;
  margin: 0 auto;
  text-align: center;
 }
.login-signup {
  font-weight: bold;
  margin: 30px auto;
  text-align: center;
}
.login-forget {
  font-weight: bold;
  margin: 30px auto;
  text-align: center;
  text-decoration: underline;
}
</style>
