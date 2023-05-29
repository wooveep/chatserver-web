<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import type {
  FormInst,
  FormItemInst,
  FormItemRule,
  FormRules,
  MessageReactive,
  MessageType,
} from 'naive-ui'
import {
  NButton,
  NCard, NForm,
  NFormItem,
  NImage,
  NInput,
  NTabPane,
  NTabs, useMessage,
} from 'naive-ui'
import { useRoute, useRouter } from 'vue-router'

import { useAuthStore } from '@/store'
import { fetchCaptCha, fetchLogin, fetchRegister, fetchVerifyEmail, fetchVerifyUsername } from '@/api'
import type { CaptChaRes, UserLoginReq, UserLoginRes, UserRegisterReq, UserRegisterRes, UserVerifyEmailReq, UserVerifyRes, UserVerifyUserNameReq } from '@/models'
import { CryptoPassword } from '@/utils/crypto'
import { myTrim } from '@/utils/format'
import { t } from '@/locales'

const rPasswordFormItemRef = ref<FormItemInst | null>(null)
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const message = useMessage()
const formRef = ref<FormInst | null>(null)
// const loading = ref(false)
const needPermission = computed(() => !authStore.token)

const captcha = ref<string>('')

interface ModelType {
  username: string | null
  email: string | null
  password: string | null
  reenteredPassword: string | null
  captcha: string | null
}

const types: MessageType[] = [
  'success',
  'info',
  'warning',
  'error',
  'loading',
]

let loginModelRef = ref<UserLoginReq>({
  username: null,
  password: null,
  captcha: null,
})

let registerModelRef = ref<ModelType>({
  username: null,
  email: null,
  password: null,
  reenteredPassword: null,
  captcha: null,
})

const user = ref<UserRegisterReq>({
  username: null,
  email: null,
  password: null,
  invite_code: null,
  captcha: null,
})
const { invitecode } = route.params as { invitecode: string }

const verifyusername = ref<UserVerifyUserNameReq>({
  username: null,

})
const verifyemail = ref<UserVerifyEmailReq>({
  email: null,
})

let msgReactive: MessageReactive | null = null

function validatePasswordStartWith(
  rule: FormItemRule,
  value: string,
): boolean {
  return (
    !!registerModelRef.value.password
        && registerModelRef.value.password.startsWith(value)
        && registerModelRef.value.password.length >= value.length
  )
}
function validatePasswordSame(rule: FormItemRule, value: string): boolean {
  return value === registerModelRef.value.password
}

const loginRules: FormRules = {
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
  if (msgReactive) {
    msgReactive.destroy()
    msgReactive = null
  }
  msgReactive = message.create('正在登录中,请等待', {
    type: types[4],
    closable: true,
    duration: 6000,
  })
  try {
    const username = myTrim(loginModelRef.value.username ?? '')
    const password = CryptoPassword(myTrim(loginModelRef.value.password ?? ''))
    const captcha = myTrim(loginModelRef.value.captcha ?? '')
    const result = await fetchLogin<UserLoginRes>({ username, password, captcha })
    if (result.err_code !== 0)
      throw new Error(result.message)
    await authStore.setToken(result.data.token, result.data.timeout)
    if (msgReactive) {
      msgReactive.type = types[0]
      msgReactive.content = '登录成功'
    }
    router.push('/')
  }
  catch (error: any) {
    if (msgReactive) {
      msgReactive.type = types[3]
      msgReactive.content = `${error.message}`
    }
    authStore.removeToken()
    await getCaptCha()
    loginModelRef.value.password = null
    loginModelRef.value.captcha = null
  }
  finally {
    loginModelRef.value.password = null
  }
}
function handlePress(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleLoginButtonClick()
  }
}

const registerRules: FormRules = {
  username: [
    {
      required: true,
      validator(rule: FormItemRule, value: string) {
        const pattern = /^[a-zA-Z][a-zA-Z0-9]*$/
        if (!value)
          return new Error('用户名需要填写')
        else if (!pattern.test(value))
          return new Error('用户名只能包含字母和数字,不能以数字开头')
        return true
      },
      trigger: ['input', 'blur'],
    },
    {
      asyncValidator: async (rule: FormItemRule, value: string) => {
        if (!value)
          return Promise.resolve()

        verifyusername.value.username = value
        const result = await fetchVerifyUsername<UserVerifyRes>(verifyusername.value)
        if (!result.data.is_valid)
          return Promise.reject(Error('用户名已被使用'))
      },
      trigger: 'blur',
    },
  ],
  email: [
    {
      required: true,
      validator(rule: FormItemRule, value: string) {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!value)
          return new Error('邮件地址需要填写')
        else if (!pattern.test(value))
          return new Error('邮箱地址格式不正确')
        return true
      },
      trigger: ['input', 'blur'],
    },

    {
      asyncValidator: async (rule: FormItemRule, value: string) => {
        if (!value)
          return Promise.resolve()

        verifyemail.value.email = value
        const result = await fetchVerifyEmail<UserVerifyRes>(verifyemail.value)
        if (!result.data.is_valid)
          return Promise.reject(Error('邮箱已被注册'))
      },
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
    },
    {
      min: 8, max: 16, message: 'Password must be between 8 and 16 characters',

    },
    {
      validator(rule: FormItemRule, value: string) {
        const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]+$/
        if (!value)
          return new Error('请输入密码')
        else if (!pattern.test(value))
          return new Error('密码至少包含一个数字、一个小写字母、一个大写字母')
        return true
      },
      trigger: ['input', 'blur'],
    },
  ],
  reenteredPassword: [
    {
      required: true,
      message: '请再次输入密码',
      trigger: ['input', 'blur'],
    },
    {
      validator: validatePasswordStartWith,
      message: '两次密码输入不一致',
      trigger: 'input',
    },
    {
      validator: validatePasswordSame,
      message: '两次密码输入不一致',
      trigger: ['blur', 'password-input'],
    },
  ],
}

function handlePasswordInput() {
  if (registerModelRef.value.reenteredPassword)
    rPasswordFormItemRef.value?.validate({ trigger: 'password-input' })
}
async function handleRegisterButtonClick(e: MouseEvent) {
  if (msgReactive) {
    msgReactive.destroy()
    msgReactive = null
  }
  msgReactive = message.create('正在注册,请等待', {
    type: types[4],
    closable: true,
    duration: 0,
  })
  e.preventDefault()

  try {
    if (registerModelRef.value.reenteredPassword !== registerModelRef.value.password)
      throw new Error('两次密码输入不一致')

    user.value.username = registerModelRef.value.username
    user.value.email = registerModelRef.value.email
    user.value.password = CryptoPassword(myTrim(registerModelRef.value.password ?? ''))
    user.value.invite_code = invitecode
    user.value.captcha = myTrim(registerModelRef.value.captcha ?? '')
    const result = await fetchRegister<UserRegisterRes>(user.value)
    const isSuccess = result.data.is_success
    if (isSuccess) {
      if (msgReactive) {
        msgReactive.type = types[0]
        msgReactive.content = `${t('common.registerSuccess')}`
      }
      window.location.replace('/#/login')
    }
  }
  catch (error: any) {
    if (msgReactive) {
      msgReactive.type = types[3]
      msgReactive.content = `${error.message}\n${t('common.registerFail')}`
    }
    await getCaptCha()
    registerModelRef.value.password = null
    registerModelRef.value.reenteredPassword = null
    registerModelRef.value.captcha = null
  }
  finally {
    registerModelRef.value.password = null
  }
}

async function getCaptCha() {
  const result = await fetchCaptCha<CaptChaRes>()
  captcha.value = `data:image/png;base64,${result.data.image}`
}

async function changeTabName() {
  registerModelRef = ref<ModelType>({
    username: null,
    email: null,
    password: null,
    reenteredPassword: null,
    captcha: null,
  })
  loginModelRef = ref<UserLoginReq>({
    username: null,
    password: null,
    captcha: null,
  })
  await getCaptCha()
}

onMounted(async () => {
  if (!needPermission.value)
    router.push('/')

  await getCaptCha()
})
</script>

<template>
  <div class="login">
    <NCard class="login-card">
      <NTabs
        default-value="signin" size="large" animated justify-content="space-around"
        pane-wrapper-style="margin: 0 -4px"
        pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
        tab-style="text-3xl"
        @active-name-change="changeTabName"
      >
        <NTabPane name="signin">
          <template #tab>
            <div>
              <span class="text-2xl font-bold">登录</span>
            </div>
          </template>
          <NForm ref="formRef" label-placement="left" :label-width="120" :model="loginModelRef" :rules="loginRules">
            <NFormItem path="username" :label="$t('common.username')" label-width="100px">
              <NInput
                v-model:value="loginModelRef.username"
                size="large"
                :placeholder="$t('common.usernameplaceholder')"
                clearable
                autofocus
                @keydown.enter.prevent
              />
            </NFormItem>
            <NFormItem path="password" :label="$t('common.password')" label-width="100px">
              <NInput
                v-model:value="loginModelRef.password"
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
                v-model:value="loginModelRef.captcha"
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
              :disabled="loginModelRef.username === null || loginModelRef.password === null || loginModelRef.captcha === null"
              round
              type="primary"
              size="large"
              @click="handleLoginButtonClick"
            >
              <span class="button-text">{{ $t('common.login') }}</span>
            </NButton>
          </NForm>
          <div class="login-forget">
            <a href="#/forgetpassword">{{ $t('user.forget_link') }}</a>
          </div>
        </NTabPane>
        <NTabPane name="register">
          <template #tab>
            <div class="tab-title">
              <span class="text-2xl font-bold">注册</span>
            </div>
          </template>
          <NForm ref="formRef" label-placement="left" :label-width="120" :model="registerModelRef" :rules="registerRules">
            <NFormItem path="username" label="用户名" label-width="100px">
              <NInput
                v-model:value="registerModelRef.username" size="large" placeholder="请输入用户名" clearable autofocus
                @keydown.enter.prevent
              />
            </NFormItem>
            <NFormItem path="email" label="电子邮箱" label-width="100px">
              <NInput v-model:value="registerModelRef.email" size="large" placeholder="请输入邮箱" clearable @keydown.enter.prevent />
            </NFormItem>
            <NFormItem path="password" label="密码" label-width="100px">
              <NInput
                v-model:value="registerModelRef.password" size="large" placeholder="请输入密码" clearable type="password" show-password-on="mousedown"
                @input="handlePasswordInput"
                @keydown.enter.prevent
              />
            </NFormItem>
            <NFormItem ref="rPasswordFormItemRef" first path="reenteredPassword" label="确认密码" label-width="100px">
              <NInput
                v-model:value="registerModelRef.reenteredPassword" size="large" placeholder="请再次输入密码" clearable type="password" show-password-on="mousedown"
                :disabled="!registerModelRef.password"
                @keydown.enter.prevent
              />
            </NFormItem>
            <NFormItem path="captcha" :label="$t('common.captcha')" label-width="100px">
              <NInput
                v-model:value="registerModelRef.captcha"
                autosizes
                placeholder="请输入验证码"
                clearable
                autofocus
                style="min-width: 50%"
                @keydown.enter.prevent
              />
              <NImage
                width="100"
                :src="captcha"
              />
            </NFormItem>
            <NButton
              class="login-button"
              :disabled="registerModelRef.username === null || registerModelRef.email === null || registerModelRef.captcha === null"
              round
              type="primary" size="large" @click="handleRegisterButtonClick"
            >
              <span class="button-text">注册</span>
            </NButton>
          </NForm>
        </NTabPane>
      </NTabs>
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

.login-forget {
  font-weight: bold;
  margin: 30px auto;
  text-align: center;
  text-decoration: underline;
}
</style>
