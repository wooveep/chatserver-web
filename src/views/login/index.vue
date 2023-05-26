<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import type {
  FormInst,
  FormRules,
} from 'naive-ui'
import {
  NButton,
  NCard, NForm,
  NFormItem,
  NImage,
  NInput,
  useMessage,
} from 'naive-ui'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store'
import { fetchCaptCha, fetchLogin } from '@/api'
import type { CaptChaRes, UserLoginReq, UserLoginRes } from '@/models'
import { CryptoPassword } from '@/utils/crypto'
import { myTrim } from '@/utils/format'

const router = useRouter()
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
          :disabled="modelRef.username === null || modelRef.password === null || modelRef.captcha === null"
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
    </NCard>
    <div class="login-footer">
      <p>wooveep 版权所有 © 2023 wooveep.net</p>
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
  text-decoration: underline;

}
.login-forget {
  font-weight: bold;
  margin: 30px auto;
  text-align: center;
  text-decoration: underline;
}
</style>
