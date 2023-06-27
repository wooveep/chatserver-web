<script lang='ts' setup>
import type { FormInst, FormItemRule, FormRules, MessageReactive, MessageType } from 'naive-ui'
import { NAvatar, NButton, NCard, NDivider, NForm, NFormItem, NIcon, NInput, NModal, NRow, NScrollbar, NSpin, NThing, useMessage } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import { CardOutline as CardIcon, ShareSocialOutline as ShareIcon } from '@vicons/ionicons5'
import type { UserCdkeyPayReq, UserGiftCard, UserGiftCardRes } from '@/models'
import { fetchCardList, fetchCdkeyPay } from '@/api'
import { myTrim } from '@/utils/format'
import { useUserStore } from '@/store'

const props = defineProps<Props>()

const emit = defineEmits<Emit>()

interface Props {
  visible: boolean
}
interface Emit {
  (e: 'update:visible', visible: boolean): void
}
const show = computed({
  get() {
    return props.visible
  },
  set(visible: boolean) {
    emit('update:visible', visible)
  },
})

const message = useMessage()
const userStore = useUserStore()
const formRef = ref<FormInst | null>(null)
// const loading = ref(false)
const modelRef = ref<UserCdkeyPayReq>({
  code_key: null,
})
const loading = ref(false)
const types: MessageType[] = [
  'success',
  'info',
  'warning',
  'error',
  'loading',
]
let msgReactive: MessageReactive | null = null
const cardlist = ref<Array<UserGiftCard>>([])

const rules: FormRules = {
  code_key: [{
    required: true,
    message: '请输入CDKEY卡密',
  },
  {
    validator(rule: FormItemRule, value: string) {
      const pattern = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{1}$/
      if (!value)
        return new Error('请输入CDKEY卡密')
      else if (!pattern.test(value))
        return new Error('CDKEY卡密不合法，请检查是否有其他内容')
      return true
    },
    trigger: ['input', 'blur'],
  },
  ],
}

async function handleRechargeButtonClick() {
  if (msgReactive) {
    msgReactive.destroy()
    msgReactive = null
  }
  msgReactive = message.create('正在核销', {
    type: types[4],
    duration: 5000,
  })
  try {
    const code_key = myTrim(modelRef.value.code_key ?? '')
    await fetchCdkeyPay<any>({ code_key })
    if (msgReactive) {
      msgReactive.type = types[0]
      msgReactive.content = 'CDKEY核销成功，感谢使用'
    }
    await userStore.setUserBalance()
  }
  catch (error: any) {
    if (msgReactive) {
      msgReactive.type = types[3]
      msgReactive.content = 'CDKEY核销失败，请联系管理员或者卖家'
    }
    modelRef.value.code_key = ''
  }
  finally {
    modelRef.value.code_key = ''
  }
}
function handlePress(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleRechargeButtonClick()
  }
}
async function GetCardList() {
  try {
    loading.value = true
    const result = await fetchCardList<UserGiftCardRes>()
    cardlist.value = result.data.card_list ?? []
  }
  finally {
    loading.value = false
  }
}

onMounted(async () => {
  await GetCardList()
})
</script>

<template>
  <NModal
    v-model:show="show" :auto-focus="true" preset="card" embedded
    style="width: 95%; max-width: 640px" :title="$t('giftcard.cdkeyinput')"
  >
    <div class="p-1 space-y-4 min-h-[200px]">
      <!-- <div class="space-y-4">
        <h2 class="recharge-title">
          {{ $t("giftcard.cdkeyinput") }}
        </h2>
      </div> -->
      <NForm ref="formRef" label-placement="left" :label-width="80" inline :model="modelRef" :rules="rules">
        <NFormItem path="code_key" :label="$t('giftcard.cdkey')" label-width="40px">
          <NInput
            v-model:value="modelRef.code_key"
            size="large"
            :placeholder="$t('giftcard.cdkeyplaceholder')"
            clearable
            autofocus
            @keydown.enter.prevent
            @keypress="handlePress"
          />
        </NFormItem>
        <NButton
          :disabled="modelRef.code_key === null "
          round
          type="primary"
          size="large"
          @click="handleRechargeButtonClick"
        >
          {{ $t('giftcard.cdkeycheck') }}
        </NButton>
      </NForm>
      <NDivider />
      <NSpin :show="loading">
        <NScrollbar style="max-height: 180px" trigger="none">
          <div class="card-container">
            <NCard
              v-for="item in cardlist" :key="item.card_id ?? ''" embedded
              :bordered="false" :hoverable="true" class="card-item" size="small"
            >
              <NThing>
                <template #avatar>
                  <NAvatar>
                    <NIcon>
                      <CardIcon />
                    </NIcon>
                  </NAvatar>
                </template>
                <template #header>
                  {{ item.card_name }}
                </template>
                <template #header-extra>
                  <p class="card-link">
                    <NIcon size="14">
                      <ShareIcon />
                    </NIcon>
                    <a :href="item.card_link ?? '' " target="_blank">{{ $t('giftcard.buy') }}</a>
                  </p>
                </template>
                <NRow>
                  <span class="card-discount">¥ {{ item.card_discount }} 元</span>
                </NRow>
                <NRow>
                  <span class="card-amount">¥ {{ item.card_amount }} 元</span>
                </NRow>
                <template #footer>
                  {{ item.card_comment }}
                </template>
              </NThing>
            </NCard>
          </div>
        </NScrollbar>
      </NSpin>
    </div>
  </NModal>
</template>

<style scoped>
.card-container {
  display: flex;
  flex-wrap: wrap;
}
.card-item {
  flex: 0 0  calc(50% - 10px);
  margin-right: 10px;
  margin-bottom: 10px;
}
.card-amount {
  color: red;
  text-decoration: line-through;
}

.card-discount {
  font-size: 1.4em;
}
.card-link {
  text-align: right;
}

.card-link a {
  font-size: 1.3em;
  color: rgb(0, 98, 255);
  text-decoration: underline;
}
@media (max-width: 600px) {
  .card-item {
    flex: 0 0 100%; /* 在移动端设置为占满一行 */
    min-width: 0; /* 取消最小宽度限制 */
  }
}
</style>
