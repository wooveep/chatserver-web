<!--
 * @Author: cloudyi.li
 * @Date: 2023-03-23 13:51:37
 * @LastEditTime: 2023-05-27 00:24:23
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/components/common/Setting/Password.vue
-->
<script lang='ts' setup>
import type { FormInst, FormItemInst, FormItemRule, FormRules, MessageReactive, MessageType } from 'naive-ui'
import { NButton, NForm, NFormItem, NInput, useMessage } from 'naive-ui'
import { ref } from 'vue'
import { fetchLogOut, fetchUpadatePassword } from '@/api'
import type { UserUpadatePasswordReq } from '@/models'
// import { router } from '@/router'
import { CryptoPassword } from '@/utils/crypto'
import { myTrim } from '@/utils/format'
// import { router } from '@/router'
import { useAuthStore, useChatStore } from '@/store'
import { t } from '@/locales'
// import { ref } from 'vue'
const authStore = useAuthStore()
const chatStore = useChatStore()
const message = useMessage()

interface ModelType {
  oldpassword: string | null
  password: string | null
  reenteredPassword: string | null
}
const types: MessageType[] = [
  'success',
  'info',
  'warning',
  'error',
  'loading',
]
let msgReactive: MessageReactive | null = null

const formRef = ref<FormInst | null>(null)
const rPasswordFormItemRef = ref<FormItemInst | null>(null)
const modelRef = ref<ModelType>({
  oldpassword: null,
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
const updatePassword = ref<UserUpadatePasswordReq>({
  old_password: null,
  new_password: null,
})

async function handleModifypasswordButtonClick(e: MouseEvent) {
  if (msgReactive) {
    msgReactive.destroy()
    msgReactive = null
  }
  msgReactive = message.create('正在提交修改', {
    type: types[4],
    duration: 600,
  })
  e.preventDefault()
  try {
    updatePassword.value.old_password = CryptoPassword(myTrim(modelRef.value.oldpassword ?? ''))
    updatePassword.value.new_password = CryptoPassword(myTrim(modelRef.value.reenteredPassword ?? ''))
    await fetchUpadatePassword<any>(updatePassword.value)
    try {
      await fetchLogOut()
      authStore.removeToken()
      chatStore.resetChatState()
      if (msgReactive) {
        msgReactive.type = types[0]
        msgReactive.content = '密码修改成功；请重新登录'
      }
      window.location.replace('/#/login')
    }
    catch (error: any) {
      if (msgReactive) {
        msgReactive.type = types[3]
        msgReactive.content = `${error.message}`
      }
    }
  }
  catch (error: any) {
    if (msgReactive) {
      msgReactive.type = types[3]
      msgReactive.content = `${error.message}，密码修改失败！`
    }
    modelRef.value.oldpassword = ''
    modelRef.value.password = ''
    modelRef.value.reenteredPassword = ''
  }
  finally {
    modelRef.value.oldpassword = ''
    modelRef.value.password = ''
    modelRef.value.reenteredPassword = ''
  }
}

function validatePasswordSame(rule: FormItemRule, value: string): boolean {
  return value === modelRef.value.password
}
const rules: FormRules = {
  oldpassword: [
    {
      required: true,
      message: t('user.passinput'),
      trigger: ['input', 'blur'],
    },
  ],
  password: [
    {
      required: true,
      message: t('user.passinput'),
    },
    {
      min: 8, max: 16, message: 'Password must be between 8 and 16 characters',

    },
    {
      validator(rule: FormItemRule, value: string) {
        const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]+$/
        if (!value)
          return new Error(t('user.passinput'))
        else if (!pattern.test(value))
          return new Error(t('user.passinputregx'))
        return true
      },
      trigger: ['input', 'blur'],
    },
  ],
  reenteredPassword: [
    {
      required: true,
      message: t('user.passinputagain'),
      trigger: ['input', 'blur'],
    },
    {
      validator: validatePasswordStartWith,
      message: t('user.confirmpasserr'),
      trigger: 'input',
    },
    {
      validator: validatePasswordSame,
      message: t('user.confirmpasserr'),
      trigger: ['blur', 'password-input'],
    },
  ],
}
function handlePasswordInput() {
  if (modelRef.value.reenteredPassword)
    rPasswordFormItemRef.value?.validate({ trigger: 'password-input' })
}
// const loading = ref(false)
</script>

<template>
  <div class="p-4 space-y-5 min-h-[200px]">
    <div class="space-y-6">
      <h2 class="password-title">
        {{ $t("setting.modifypass") }}
      </h2>
    </div>
    <NForm ref="formRef" label-placement="left" :label-width="120" :model="modelRef" :rules="rules">
      <NFormItem path="oldpassword" :label="$t('user.oldpasswd')" label-width="100px">
        <NInput
          v-model:value="modelRef.oldpassword" size="large" :placeholder="$t('user.currpassholder')" clearable type="password" show-password-on="mousedown"
          @input="handlePasswordInput"
          @keydown.enter.prevent
        />
      </NFormItem>
      <NFormItem path="password" :label="$t('user.newpasswd')" label-width="100px">
        <NInput
          v-model:value="modelRef.password" size="large" :placeholder="$t('user.newpassholder')" clearable type="password" show-password-on="mousedown"
          @input="handlePasswordInput"
          @keydown.enter.prevent
        />
      </NFormItem>
      <NFormItem ref="rPasswordFormItemRef" first path="reenteredPassword" :label="$t('user.confirmpasswd')" label-width="100px">
        <NInput
          v-model:value="modelRef.reenteredPassword" size="large" :placeholder="$t('user.repnewpassholder')" clearable type="password" show-password-on="mousedown"
          :disabled="!modelRef.password"
          @keydown.enter.prevent
        />
      </NFormItem>
      <NButton
        class="password-button"
        :disabled="modelRef.oldpassword === null || modelRef.reenteredPassword === null"
        round
        type="primary" size="large" @click="handleModifypasswordButtonClick"
      >
        <span class="button-text">{{ $t('user.confirm') }}</span>
      </NButton>
    </NForm>
  </div>
</template>

<style scoped>
.password-title {
    margin: 20px 0;
    text-align: left;
    font-size: 20px;
    font-weight: bold;
    /* color: #333; */
  }
  .password-button {
  width: 70%;
  margin: 20px auto;
  display: block;
}
.button-text {
  font-weight: bold;
  margin: 0 auto;
  text-align: center;
 }
</style>
