<script lang="ts" setup>
import { onMounted, ref } from 'vue'
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
  useMessage,
} from 'naive-ui'
import { useRoute } from 'vue-router'
import type { CaptChaRes, UserRegisterReq, UserRegisterRes, UserVerifyEmailReq, UserVerifyRes, UserVerifyUserNameReq } from '@/models'
import { fetchCaptCha, fetchRegister, fetchVerifyEmail, fetchVerifyUsername } from '@/api'
import { CryptoPassword } from '@/utils/crypto'
import { myTrim } from '@/utils/format'
import { t } from '@/locales'

interface ModelType {
  username: string | null
  email: string | null
  password: string | null
  reenteredPassword: string | null
  captcha: string | null
}
const route = useRoute()
const formRef = ref<FormInst | null>(null)
// const router = useRouter()
const rPasswordFormItemRef = ref<FormItemInst | null>(null)
const message = useMessage()
const captcha = ref<string>('')
const modelRef = ref<ModelType>({
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

function validatePasswordStartWith(
  rule: FormItemRule,
  value: string,
): boolean {
  return (
    !!modelRef.value.password
        && modelRef.value.password.startsWith(value)
        && modelRef.value.password.length >= value.length
  )
}
function validatePasswordSame(rule: FormItemRule, value: string): boolean {
  return value === modelRef.value.password
}
const types: MessageType[] = [
  'success',
  'info',
  'warning',
  'error',
  'loading',
]
let msgReactive: MessageReactive | null = null

const rules: FormRules = {
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
  if (modelRef.value.reenteredPassword)
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
    user.value.username = modelRef.value.username
    user.value.email = modelRef.value.email
    user.value.password = CryptoPassword(myTrim(modelRef.value.password ?? ''))
    user.value.invite_code = invitecode
    user.value.captcha = myTrim(modelRef.value.captcha ?? '')
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
    modelRef.value.password = null
    modelRef.value.reenteredPassword = null
    modelRef.value.captcha = null
  }
  finally {
    modelRef.value.password = null
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
  <div class="register">
    <NCard class="register-card">
      <h2 class="register-title">
        注册
      </h2>
      <NForm ref="formRef" label-placement="left" :label-width="120" :model="modelRef" :rules="rules">
        <NFormItem path="username" label="用户名" label-width="100px">
          <NInput
            v-model:value="modelRef.username" size="large" placeholder="请输入用户名" clearable autofocus
            @keydown.enter.prevent
          />
        </NFormItem>
        <NFormItem path="email" label="电子邮箱" label-width="100px">
          <NInput v-model:value="modelRef.email" size="large" placeholder="请输入邮箱" clearable @keydown.enter.prevent />
        </NFormItem>
        <NFormItem path="password" label="密码" label-width="100px">
          <NInput
            v-model:value="modelRef.password" size="large" placeholder="请输入密码" clearable type="password" show-password-on="mousedown"
            @input="handlePasswordInput"
            @keydown.enter.prevent
          />
        </NFormItem>
        <NFormItem ref="rPasswordFormItemRef" first path="reenteredPassword" label="确认密码" label-width="100px">
          <NInput
            v-model:value="modelRef.reenteredPassword" size="large" placeholder="请再次输入密码" clearable type="password" show-password-on="mousedown"
            :disabled="!modelRef.password"
            @keydown.enter.prevent
          />
        </NFormItem>
        <NFormItem path="captcha" :label="$t('common.captcha')" label-width="100px">
          <NInput
            v-model:value="modelRef.captcha"
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
          class="register-button"
          :disabled="modelRef.username === null || modelRef.email === null || modelRef.captcha === null"
          round
          type="primary" size="large" @click="handleRegisterButtonClick"
        >
          <span class="button-text">注册</span>
        </NButton>
      </NForm>
    </NCard>
    <div class="register-footer">
      <p>wooveep 版权所有 © 2023 wooveep.net</p>
    </div>
  </div>
</template>

<style scoped>
.register {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  /* background-color: #f2f2f2; */
}
.register-card {
  width: 400px;
  /* background-color: #fff; */
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.register-title {
  margin: 20px 0;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  /* color: #333; */
}
.register-button {
  width: 70%;
  margin: 20px auto;
  display: block;
}
.button-text {
  font-weight: bold;
  margin: 0 auto;
  text-align: center;
 }
 .register-footer {
  position: fixed;
  bottom: 20px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 12px;
  color: #999;
}
</style>
