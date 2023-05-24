<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import type {
  FormInst,
  FormRules, MessageReactive, MessageType,
} from 'naive-ui'
import {
  NButton,
  NCard, NForm,
  NFormItem,
  NImage,
  NInput,
  useMessage,
} from 'naive-ui'
import { fetchCaptCha, fetchForgetPassword } from '@/api'
import type { CaptChaRes, UserForgetPasswordReq } from '@/models'
import { myTrim } from '@/utils/format'

const types: MessageType[] = [
  'success',
  'info',
  'warning',
  'error',
  'loading',
]
let msgReactive: MessageReactive | null = null

const message = useMessage()
const formRef = ref<FormInst | null>(null)
// const loading = ref(false)
const captcha = ref<string>('')
const modelRef = ref<UserForgetPasswordReq>({
  email: null,
  captcha: null,
})

const rules: FormRules = {
  email: [{
    required: true,
    message: ' 请输入邮箱',
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
  msgReactive = message.create('正在验证,请等待', {
    type: types[4],
    closable: true,
    duration: 0,
  })
  try {
    const email = myTrim(modelRef.value.email ?? '')
    const captcha = myTrim(modelRef.value.captcha ?? '')
    const result = await fetchForgetPassword<any>({ email, captcha })
    if (result.err_code !== 0)
      throw new Error(result.message)
    if (msgReactive) {
      msgReactive.type = types[0]
      msgReactive.content = '已将密码重置链接发送到您的电子邮箱中，请注意查收'
    }
  }
  catch (error: any) {
    if (msgReactive) {
      msgReactive.type = types[3]
      msgReactive.content = `${error.message}`
    }
    await getCaptCha()
    modelRef.value.email = null
    modelRef.value.captcha = null
  }
  finally {
    modelRef.value.email = null
    modelRef.value.captcha = null
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
        {{ $t('common.forgetpage') }}
      </h2>
      <NForm ref="formRef" label-placement="left" :label-width="120" :model="modelRef" :rules="rules">
        <NFormItem path="email" :label="$t('common.email')" label-width="100px">
          <NInput
            v-model:value="modelRef.email"
            size="large"
            :placeholder="$t('common.emailplaceholder')"
            clearable
            autofocus
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
            @keydown.enter.prevent
            @keypress="handlePress"
          />
          <NImage
            width="100"
            :src="captcha"
          />
        </NFormItem>
        <NButton
          class="login-button"
          :disabled="modelRef.email === null || modelRef.captcha === null"
          round
          type="primary"
          size="large"
          @click="handleLoginButtonClick"
        >
          <span class="button-text">{{ $t('user.confirm') }}</span>
        </NButton>
      </NForm>
    </NCard>
    <!-- <div class="login-footer">
      <p>Cloudyi Li 🧡 版权所有 © 2023 wooveep.com</p>
    </div> -->
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
.login-forget {
  font-weight: bold;
  margin: 30px auto;
  text-align: center;
}
</style>
