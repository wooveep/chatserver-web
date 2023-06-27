/*
 * @Author: cloudyi.li
 * @Date: 2023-03-23 13:51:37
 * @LastEditTime: 2023-06-12 18:58:48
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/router/index.ts
 */
import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
import { ChatLayout } from '@/views/chat/layout'
import { AdminLayout } from '@/views/admin/layout'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Root',
    component: ChatLayout,
    redirect: '/chat',
    children: [
      {
        path: '/chat/:chat_uuid?',
        name: 'Chat',
        component: () => import('@/views/chat/index.vue'),
      },
    ],
  },
  {
    path: '/admin',
    component: AdminLayout,
    name: 'Admin',
    meta: {
      title: '管理',
    },
    children: [
      {
        path: 'index/workplace',
        name: 'WorkPlace',
        component: (): any => import('@/views/admin/index/WorkPlace.vue'),
        meta: {
          title: '工作台',
        },
      },
      {
        path: 'user/usermanage',
        name: 'UserManage',
        component: (): any => import('@/views/admin/user/UserManage.vue'),
        meta: {
          title: '用户管理',
        },
      },
      {
        path: 'chat/presetmanage',
        name: 'PresetManage',
        component: (): any => import('@/views/admin/chat/PresetManage.vue'),
        meta: {
          title: '预设管理',
        },
      },
      {
        path: 'chat/msgmanager',
        name: 'MsgManager',
        component: (): any => import('@/views/admin/chat/MsgManager.vue'),
        meta: {
          title: '消息管理',
        },
      },
      {
        path: 'chat/sensitivewords',
        name: 'SensitiveWords',
        component: (): any => import('@/views/admin/chat/SensitiveWords.vue'),
        meta: {
          title: '敏感词设置',
        },
      },
      {
        path: 'system/keymanage',
        name: 'KeyManage',
        component: (): any => import('@/views/admin/system/KeyManage.vue'),
        meta: {
          title: 'KEY管理',
        },
      },
      {
        path: 'system/emailsettings',
        name: 'EmailSettings',
        component: (): any => import('@/views/admin/system/EmailSettings.vue'),
        meta: {
          title: '邮箱设置',
        },
      },
      {
        path: 'system/proxysettings',
        name: 'ProxySettings',
        component: (): any => import('@/views/admin/system/ProxySettings.vue'),
        meta: {
          title: '代理设置',
        },
      },
      {
        path: 'recharge/cdkeygenerated',
        name: 'CdkeyGenerated',
        component: (): any => import('@/views/admin/recharge/CdkeyGenerated.vue'),
        meta: {
          title: 'CDKEY生成',
        },
      },
      {
        path: 'recharge/giftcardSet',
        name: 'GiftCardSet',
        component: (): any => import('@/views/admin/recharge/GiftCardSet.vue'),
        meta: {
          title: '礼品卡管理',
        },
      },
      {
        path: 'recharge/cdkeymanagement',
        name: 'CdkeyManagement',
        component: (): any => import('@/views/admin/recharge/CdkeyManagement.vue'),
        meta: {
          title: 'CDKEY管理',
        },
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
  },
  {
    path: '/active/:activecode?',
    name: 'active',
    component: () => import('@/views/active/index.vue'),
  },
  {
    path: '/register/:invitecode?',
    name: 'register',
    component: () => import('@/views/login/index.vue'),
  },
  {
    path: '/forgetpassword',
    name: 'forgetpassword',
    component: () => import('@/views/password/forget.vue'),
  },
  {
    path: '/resetpassword/:tempcode?',
    name: 'resetpassword',
    component: () => import('@/views/password/reset.vue'),
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/exception/403/index.vue'),
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/exception/404/index.vue'),
  },
  {
    path: '/500',
    name: '500',
    component: () => import('@/views/exception/500/index.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    redirect: '/404',
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

export async function setupRouter(app: App) {
  app.use(router)
  await router.isReady()
}
