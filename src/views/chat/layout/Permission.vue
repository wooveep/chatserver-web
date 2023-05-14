<!--
 * @Author: cloudyi.li
 * @Date: 2023-03-24 09:20:29
 * @LastEditTime: 2023-05-12 00:25:43
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/views/chat/layout/Permission.vue
-->
<script setup lang='ts'>
import { ref } from 'vue'
import {
  NButton, NForm, NFormItem,

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
import { fetchLogin } from '@/api'
import type { UserLoginReq, UserLoginRes } from '@/models'
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
const modelRef = ref<UserLoginReq>({
  username: null,
  password: null,
})

const rules: FormRules = {
  username: [{
    required: true,
    message: '用户名',
  }],
  password: [{
    required: true,
    message: '请输入密码',
  }],
}

async function handleLoginButtonClick() {
  try {
    const username = myTrim(modelRef.value.username ?? '')
    const password = CryptoPassword(myTrim(modelRef.value.password ?? ''))
    const result = await fetchLogin<UserLoginRes>({ username, password })
    if (result.err_code !== 0)
      throw new Error(result.message)

    await authStore.setToken(result.data.token, result.data.expire_at)
    message.success('success')
    router.push('/')
    resetChat()
    await fetchChatHistoryList()
  }
  catch (error: any) {
    message.error(error.message)
    authStore.removeToken()
    modelRef.value.password = ''
  }
  finally {
    modelRef.value.password = ''
  }
}

function handlePress(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleLoginButtonClick()
  }
}
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
              @keypress="handlePress"
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
          <a href="#/register">还没有账号? 点击注册</a>
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
</style>
