<!--
 * @Author: cloudyi.li
 * @Date: 2023-05-26 11:29:33
 * @LastEditTime: 2023-05-26 16:32:23
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/components/common/Bills/index.vue
-->
<script lang='ts' setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { NDataTable, NDatePicker, NModal } from 'naive-ui'
import type { UserBillRes } from '@/models'
import { fetchUserBills } from '@/api'

const props = defineProps<Props>()

const emit = defineEmits<Emit>()
// const nowtime = computed(() => new Date().getTime())
const timestamp = ref<number | undefined>(undefined)
interface Props {
  visible: boolean
}

interface DataType {
  key: number
  change_time: string
  change: number
  comment: string
  balance: number
}
const loadingRef = ref(true)
const paginationReactive = reactive({
//   page: 1,
//   pageCount: 10,
  pageSize: 15,
})
interface Emit {
  (e: 'update:visible', visible: boolean): void
}

const columns = [
  {
    title: '变动时间',
    key: 'change_time',
  },
  {
    title: '变动金额',
    key: 'change',
  },
  {
    title: '变动说明',
    key: 'comment',
  },
  {
    title: '最新余额',
    key: 'balance',
  },
]

const show = computed({
  get() {
    return props.visible
  },
  set(visible: boolean) {
    emit('update:visible', visible)
  },
})

const data = ref<Array<DataType>>([])

async function onChangeDate(v: number) {
  if (!loadingRef.value) {
    loadingRef.value = true
    timestamp.value = v
    await getBillList()
  }
}

async function getBillList() {
  const result = await fetchUserBills<UserBillRes>({ page: 0, pagesize: 0, date: timestamp.value ?? 0 })
  const billlist = result.data.bill_list ?? []
  data.value = Array.from({ length: billlist.length }).map((_, index) => ({
    key: index,
    change_time: billlist[index].change_time,
    change: billlist[index].change,
    comment: billlist[index].comment,
    balance: billlist[index].balance,
  }))
  loadingRef.value = false
}
async function handlePageChange() {

}
function rowClassName(row: DataType) {
  if (row.change < 0)
    return 'reduce'
  return 'increase'
}
onMounted(async () => {
  await getBillList()
})
</script>

<template>
  <NModal
    v-model:show="show" :auto-focus="true" preset="card" embedded
    style="width: 95%; max-width: 640px"
  >
    <div class="p-4 space-y-5 min-h-[200px]">
      <h2 class="recharge-title">
        账单明细
      </h2>
      <div>
        <NDatePicker
          v-model:value="timestamp" type="date" size="small" input-readonly
          @update:value="onChangeDate"
        />
      </div>
      <div class="card-container">
        <NDataTable
          remote
          :loading="loadingRef"
          :columns="columns"
          :data="data"
          :pagination="paginationReactive"
          :max-height="250"
          :row-class-name="rowClassName"
          striped
          @update:page="handlePageChange"
        />
      </div>
    </div>
  </NModal>
</template>

<style scoped>
:deep(.reduce td) {
  color: rgba(37, 153, 41, 0.75) !important;
}
:deep(.increase td) {
  color: rgba(229, 5, 5, 0.75) !important;
}
.recharge-title {
    margin: 20px 0;
    text-align: left;
    font-size: 20px;
    font-weight: bold;
    /* color: #333; */
  }

.card-container {
  display: flex;
  flex-wrap: wrap;
}
</style>
