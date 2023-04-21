/*
 * @Author: cloudyi.li
 * @Date: 2023-03-23 13:51:37
 * @LastEditTime: 2023-04-21 09:22:39
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/api/index.ts
 */
import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'
import { get, hdelete, post, postEvent } from '@/utils/request'
import type {
  ChatChattingReq, ChatCreateNewReq, ChatDeleteReq, ChatRecordHistoryReq, ChatRegenerategReq,
  ChatUpdateReq, UserLoginReq, UserRegisterReq, UserRegisterRes,
  UserVerifyEmailReq, UserVerifyRes,
  UserVerifyUserNameReq,
} from '@/models'

export function fetchChatAPI<T = any>(
  prompt: string,
  options?: { conversationId?: string; parentMessageId?: string },
  signal?: GenericAbortSignal,
) {
  return post<T>({
    url: '/chat',
    data: { prompt, options },
    signal,
  })
}

export function fetchChatConfig<T = any>() {
  return post<T>({
    url: '/config',
  })
}

export function fetchRegister<T = UserRegisterRes>(user: UserRegisterReq) {
  return post<T>({
    url: '/register',
    data: user,
  })
}

export function fetchVerifyUsername<T = UserVerifyRes>(username: UserVerifyUserNameReq) {
  return post<T>({
    url: '/checkusername',
    data: username,
  })
}

export function fetchVerifyEmail<T = UserVerifyRes>(email: UserVerifyEmailReq) {
  return post<T>({
    url: '/checkemail',
    data: email,
  })
}

export function fetchLogin<UserLoginRes>(user: UserLoginReq) {
  return post<UserLoginRes>({
    url: '/login',
    data: user,
  })
}

export function fetchUserInfo<UserInfoRes>() {
  return get<UserInfoRes>({
    url: '/user/info',
  })
}

export function fetchLogOut<T = any >() {
  return get<T>({
    url: '/user/logout',
  })
}

export function fetchRefreshToken<UserLoginRes>() {
  return get<UserLoginRes>({
    url: '/user/refresh',
  })
}

export function fetchChatCreateNew<ChatCreateNewRes>(chat: ChatCreateNewReq) {
  return post<ChatCreateNewRes>({
    url: '/chat/new',
    data: chat,
  })
}

export function fetchChatUpdate<T = any>(chat: ChatUpdateReq) {
  return post<T>({
    url: '/chat/update',
    data: chat,
  })
}

export function fetchChatlist<ChatListRes>() {
  return get<ChatListRes>({
    url: '/chat/list',
  })
}

export function fetchChatDelete<T = any>(chat: ChatDeleteReq) {
  const deleteparams = `chat_id=${chat.chat_id}`
  return hdelete<T>({
    url: `/chat/delete?${deleteparams}`,
    // data: deleteparams,
  })
}

export function fetchChatRecordHistory<ChatRecordHistoryRes>(chat: ChatRecordHistoryReq) {
  const getparams = `chat_id=${chat.chat_id}`
  return get<ChatRecordHistoryRes>({
    url: `/chat/history?${getparams}`,
    // data: deleteparams,
  })
}

export function fetchChatChatting<T = any>(
  params: {
    prompt: ChatChattingReq
    signal?: GenericAbortSignal
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void },
) {
  return postEvent<T>({
    url: '/chat/chatting',
    data: params.prompt,
    signal: params.signal,
    onDownloadProgress: params.onDownloadProgress,
  })
}

export function fetchChatRegen<T = any>(
  params: {
    prompt: ChatRegenerategReq
    signal?: GenericAbortSignal
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void },
) {
  return postEvent<T>({
    url: '/chat/regenerate',
    data: params.prompt,
    signal: params.signal,
    onDownloadProgress: params.onDownloadProgress,
  })
}
