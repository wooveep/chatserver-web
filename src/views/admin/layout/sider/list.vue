<script lang="ts" setup>
import { computed, h } from 'vue'
import { NMenu } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import { RouterLink } from 'vue-router'

const props = defineProps<Props>()

const emit = defineEmits<Emit>()

interface Props {
  collapsed: boolean
}

interface Emit {
  (e: 'update:collapsed', collapsed: boolean): void
}

const collapsed = computed({
  get() {
    return props.collapsed
  },
  set(visible: boolean) {
    emit('update:collapsed', visible)
  },
})

const menuOptions: MenuOption[] = [
  {
    label: '主页',
    key: 'dashboard',
    disabled: false,
    children: [
      {
        label: () =>
          h(
            RouterLink,
            {
              to: {
                name: 'WorkPlace',
              },
            },
            { default: () => '工作台' },
          ),
        key: 'WorkPlace',
      },
    ],
  },
  {
    label: '会员管理',
    key: 'member',
    disabled: false,
    children: [
      {
        label: () =>
          h(
            RouterLink,
            {
              to: {
                name: 'UserManage',
              },
            },
            { default: () => '用户管理' },
          ),
        key: 'UserManage',
      },
      // {
      //   label: () =>
      //     h(
      //       RouterLink,
      //       {
      //         to: {
      //           name: 'MemberSettings',
      //         },
      //       },
      //       { default: () => '会员设置' },
      //     ),
      //   key: 'MemberSettings',
      // },
    ],
  },
  {
    label: '会话管理',
    key: 'chat',
    disabled: false,
    children: [
      {
        label: () =>
          h(
            RouterLink,
            {
              to: {
                name: 'PresetManage',
              },
            },
            { default: () => '预设管理' },
          ),
        key: 'PresetManage',
      },
      {
        label: () =>
          h(
            RouterLink,
            {
              to: {
                name: 'MsgManager',
              },
            },
            { default: () => '消息管理' },
          ),
        key: 'MsgManager',
      },
      {
        label: () =>
          h(
            RouterLink,
            {
              to: {
                name: 'SensitiveWords',
              },
            },
            { default: () => '敏感词设置' },
          ),
        key: 'SensitiveWords',
      },
    ],
  },
  {
    label: '系统管理',
    key: 'system',
    disabled: false,
    children: [
      {
        label: () =>
          h(
            RouterLink,
            {
              to: {
                name: 'KeyManage',
              },
            },
            { default: () => 'KEY管理' },
          ),
        key: 'KeyManage',
      },
      {
        label: () =>
          h(
            RouterLink,
            {
              to: {
                name: 'EmailSettings',
              },
            },
            { default: () => '邮箱设置' },
          ),
        key: 'EmailSettings',
      },
      {
        label: () =>
          h(
            RouterLink,
            {
              to: {
                name: 'ProxySettings',
              },
            },
            { default: () => '代理设置' },
          ),
        key: 'ProxySettings',
      },
    ],
  },
  {
    label: '充值管理',
    key: 'recharge',
    disabled: false,
    children: [
      {
        label: () =>
          h(
            RouterLink,
            {
              to: {
                name: 'CdkeyGenerated',
              },
            },
            { default: () => 'CDKEY生成' },
          ),
        key: 'CdkeyGenerated',
      },
      {
        label: () =>
          h(
            RouterLink,
            {
              to: {
                name: 'GiftCardSet',
              },
            },
            { default: () => '礼品卡管理' },
          ),
        key: 'GiftCardSet',
      },
      {
        label: () =>
          h(
            RouterLink,
            {
              to: {
                name: 'CdkeyManagement',
              },
            },
            { default: () => 'CDKEY管理' },
          ),
        key: 'CdkeyManagement',
      },
    ],
  },
]

// function renderMenuLabel(option: MenuOption) {
//   if ('href' in option) {
//     return h(
//       'a',
//       { href: option.href, target: '_blank' },
//       option.label as string,
//     )
//   }
//   return option.label as string
// }

// function renderMenuIcon(option: MenuOption) {
//   // 渲染图标占位符以保持缩进
//   if (option.key === 'sheep-man')
//     return true
//   // 返回 falsy 值，不再渲染图标及占位符
//   if (option.key === 'food')
//     return null
//   return h(NIcon, null, { default: () => h(BookmarkOutline) })
// }
// function expandIcon() {
//   return h(NIcon, null, { default: () => h(CaretDownOutline) })
// }
</script>

<template>
  <NMenu
    :collapsed="collapsed"
    :collapsed-width="64"
    :collapsed-icon-size="22"
    :options="menuOptions"
  />
</template>
