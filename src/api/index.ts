/*
 * @Author: cloudyi.li
 * @Date: 2023-03-23 13:51:37
 * @LastEditTime: 2023-05-26 16:33:21
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/api/index.ts
 */
import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'
import { get, hdelete, post, postEvent } from '@/utils/request'
import type {
  ChatChattingReq, ChatClearReq, ChatCreateNewReq, ChatDeleteReq, ChatRecordHistoryReq, ChatRegenerategReq,
  ChatUpdateReq, UserBillReq, UserCdkeyPayReq, UserForgetPasswordReq, UserLoginReq, UserRegisterReq, UserRegisterRes,
  UserResetPasswordReq,
  UserUpadatePasswordReq,
  UserVerifyEmailReq, UserVerifyRes,
  UserVerifyUserNameReq,
} from '@/models'

export function fetchRegister<T = UserRegisterRes>(user: UserRegisterReq) {
  return post<T>({
    url: '/register',
    data: user,
  })
}

export function fetchLogin<UserLoginRes>(user: UserLoginReq) {
  return post<UserLoginRes>({
    url: '/login',
    data: user,
  })
}

export function fetchCaptCha<CaptChaRes>() {
  return get<CaptChaRes>({
    url: '/captcha',
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

export function fetchForgetPassword<T = any>(fpassword: UserForgetPasswordReq) {
  return post<T>({
    url: '/forget',
    data: fpassword,
  })
}

export function fetchResetPassword<T = any>(rpassword: UserResetPasswordReq) {
  return post<T>({
    url: '/resetpassword',
    data: rpassword,
  })
}

export function fetchUserActive<T = any>(code: string) {
  const getparams = `active_code=${code}`
  return get<T>({
    url: `/active?${getparams}`,
  })
}

export function fetchUserInfo<UserInfoRes>() {
  return get<UserInfoRes>({
    url: '/user/info',
  })
}

export function fetchUserAvatar<UserAvatarRes>() {
  return get<UserAvatarRes>({
    url: '/user/avatar',
  })
}

export function fetchUserBalance<UserBalanceRes>() {
  return get<UserBalanceRes>({
    url: '/user/balance',
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

export function fetchInviteLink<UserInviteLinkRes>() {
  return get<UserInviteLinkRes>({
    url: '/user/invitelink',
  })
}

export function fetchCardList<UserGiftCardRes>() {
  return get<UserGiftCardRes>({
    url: '/user/giftcard',
  })
}

export function fetchUserBills<UserBillRes>(bill: UserBillReq) {
  const getparams = `pagesize=${bill.pagesize}&page=${bill.page}&date=${bill.date}`
  return get<UserBillRes>({
    url: `/user/bill?${getparams}`,
  })
}

export function fetchCdkeyPay<T = any>(codekey: UserCdkeyPayReq) {
  return post<T>({
    url: '/user/cdkeypay',
    data: codekey,
  })
}

export function fetchUpadatePassword<T = any>(upassword: UserUpadatePasswordReq) {
  return post<T>({
    url: '/user/updatepassword',
    data: upassword,
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

export function fetchChatClear<T = any>(chat: ChatClearReq) {
  const deleteparams = `chat_id=${chat.chat_id}`
  return hdelete<T>({
    url: `/chat/clear?${deleteparams}`,
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

export function fetchPresetList<PresetListRes>() {
  return get<PresetListRes>({
    url: '/preset/list',
  })
}
