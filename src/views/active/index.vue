<!--
 * @Author: cloudyi.li
 * @Date: 2023-05-10 17:01:10
 * @LastEditTime: 2023-06-09 11:04:17
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/views/active/index.vue
-->
<script setup lang='ts'>
import type { CountdownProps } from 'naive-ui'
import { NCard, NCountdown, NText, useMessage } from 'naive-ui'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { fetchUserActive } from '@/api'

const route = useRoute()
const message = useMessage()
// const router = useRouter()
const title = '用户激活'
// const cardDesc = '请填写您的激活码'
const activestatus = ref(false)
const isactive = ref(false)
// const rules = {
//   activeCode: [{ required: true, message: '请输入激活码', trigger: 'blur' }],
// }

// const form = reactive({
//   activeCode: '',
// })
const { activecode } = route.params as { activecode: string }

const activate = async () => {
  try {
    const activeCode = activecode
    await fetchUserActive(activeCode)
    message.success('激活成功')
    activestatus.value = true
    //
  }
  catch (err) {
    message.error('激活失败')
    console.error(err)
  }
}
const renderCountdown: CountdownProps['render'] = ({
  seconds,
}) => {
  return `${String(seconds).padStart(2, '0')}`
}
function goToLogin() {
  window.location.replace('/#/login')
}

onMounted(() => {
  if (activecode !== '') {
    isactive.value = true
    activate()
  }
})
</script>

<template>
  <div class="login">
    <NCard class="login-card">
      <template #header>
        <h1>{{ title }}</h1>
      </template>
      <div v-if="isactive">
        <NText size="large">
          激活成功！
        </NText>
        <NText>您现在可以登录了。</NText>
        <NCountdown :duration="3000" :active="true" :render="renderCountdown" :on-finish="goToLogin" />
      </div>
      <div v-if="!isactive">
        <NText size="large">
          注册成功！
        </NText>
        <NText>请前往您的邮箱确认激活链接。</NText>
        <NText type="warning">
          如果您没有收到邮件，请检查一下垃圾邮箱。
        </NText>
      </div>
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
</style>
