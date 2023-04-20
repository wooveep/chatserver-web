<script lang="ts" setup>
import { ref } from 'vue'
import type {
  FormInst,
  FormRules,
} from 'naive-ui'
import {

  NButton, NCard,
  NForm,
  NFormItem,
  NInput,
  useMessage,
} from 'naive-ui'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store'
import { fetchLogin } from '@/api'
import type { UserLoginReq, UserLoginRes } from '@/models'

const router = useRouter()
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
    const result = await fetchLogin<UserLoginRes>(modelRef.value)
    if (result.err_code !== 0)
      throw new Error(result.message)

    await authStore.setToken(result.data.token, result.data.expire_at)
    message.success('success')
    router.push('/')
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
  <div class="login">
    <NCard class="login-card">
      <h2 class="login-title">
        {{ $t('common.loginpage') }}
      </h2>
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
    </NCard>
    <div class="login-footer">
      <p>Cloudyi Li 🧡 版权所有 © 2023 wooveep.com</p>
    </div>
  </div>
</template>

<style scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-card {
  width: 400px;
  /* background-color: #fff; */
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.login-title {
  margin: 20px 0;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}

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
.login-footer {
  position: fixed;
  bottom: 20px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 12px;
  color: #999;
}

.login-signup {
  font-weight: bold;
  margin: 30px auto;
  text-align: center;
}
</style>
