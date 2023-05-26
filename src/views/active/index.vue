<!--
 * @Author: cloudyi.li
 * @Date: 2023-05-10 17:01:10
 * @LastEditTime: 2023-05-26 12:49:13
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/views/active/index.vue
-->
<script setup lang='ts'>
import { useMessage } from 'naive-ui'
import { onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchUserActive } from '@/api'

const route = useRoute()
const message = useMessage()
const router = useRouter()
const title = '用户激活'
const cardDesc = '请填写您的激活码'

const rules = {
  activeCode: [{ required: true, message: '请输入激活码', trigger: 'blur' }],
}

const form = reactive({
  activeCode: '',
})
const { activecode } = route.params as { activecode: string }

const activate = async () => {
  try {
    const activeCode = activecode
    await fetchUserActive(activeCode)
    message.success('激活成功')
    router.push('login')
  }
  catch (err) {
    message.error('激活失败')
    console.error(err)
  }
}

onMounted(() => {
  activate()
})
</script>

<template>
  <div>
    <n-card :inline-desc="cardDesc">
      <template #header>
        <h1>{{ title }}</h1>
      </template>
      <n-form ref="form" :rules="rules" :model="form" label-placement="left">
        <n-form-item label="激活码" prop="activeCode">
          <n-input v-model="form.activeCode" />
        </n-form-item>
        <n-form-item>
          <n-button type="primary" @click="activate">
            激活
          </n-button>
        </n-form-item>
      </n-form>
    </n-card>
  </div>
</template>
