<script lang="ts" setup>
import { ref } from 'vue'
import type {
  FormInst,
  FormItemInst,
  FormItemRule,
  FormRules,
} from 'naive-ui'
import {
  NButton,
  NCard, NForm,
  NFormItem,
  NInput,
  useMessage,
} from 'naive-ui'
import { useRoute, useRouter } from 'vue-router'
import { fetchResetPassword } from '@/api'
import { CryptoPassword } from '@/utils/crypto'
import { myTrim } from '@/utils/format'
interface ModelType {
  password: string | null
  reenteredPassword: string | null
}

const route = useRoute()
const router = useRouter()
const message = useMessage()
const formRef = ref<FormInst | null>(null)
// const loading = ref(false)
const { tempcode } = route.params as { tempcode: string }
const rPasswordFormItemRef = ref<FormItemInst | null>(null)

const modelRef = ref<ModelType>({
  password: null,
  reenteredPassword: null,

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

const rules: FormRules = {
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

async function handleResetButtonClick() {
  try {
    const new_password = CryptoPassword(myTrim(modelRef.value.password ?? ''))
    const temp_code = tempcode
    await fetchResetPassword<any>({ new_password, temp_code })
    message.success('success')
    router.push('login')
  }
  catch (error: any) {
    message.error(error.message)
    modelRef.value.password = null
    modelRef.value.reenteredPassword = null
  }
  finally {
    modelRef.value.password = null
    modelRef.value.reenteredPassword = null
  }
}
function handlePress(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleResetButtonClick()
  }
}
</script>

<template>
  <div class="login">
    <NCard class="login-card">
      <h2 class="login-title">
        {{ $t('common.resetpage') }}
      </h2>
      <NForm ref="formRef" label-placement="left" :label-width="120" :model="modelRef" :rules="rules">
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
            @keypress="handlePress"
          />
        </NFormItem>
        <NButton
          class="login-button"
          :disabled="modelRef.password === null"
          round
          type="primary"
          size="large"
          @click="handleResetButtonClick"
        >
          <span class="button-text">{{ $t('common.login') }}</span>
        </NButton>
      </NForm>
    </NCard>
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
