/*
 * @Author: cloudyi.li
 * @Date: 2023-04-15 18:18:20
 * @LastEditTime: 2023-05-25 23:27:15
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/models/user.ts
 */

/**
 *
 * @export
 * @interface CaptChaRes
 */
export interface CaptChaRes {
  /**
        *
        * @type {string}
        * @memberof CaptChaRes
        */
  image: string
}
/**
 *
 * @export
 * @interface UserLoginReq
 */
export interface UserLoginReq {
  /**
       *
       * @type {string}
       * @memberof UserLoginReq
       */
  username: string | null
  /**
       *
       * @type {string}
       * @memberof UserLoginReq
       */
  password: string | null
  /**
       *
       * @type {string}
       * @memberof UserLoginReq
       */
  captcha: string | null
}

/**
   *
   * @export
   * @interface UserLoginRes
   */
export interface UserLoginRes {
  /**
       *
       * @type {string}
       * @memberof UserLoginRes
       */
  token: string
  /**
       *
       * @type {number}
       * @memberof UserLoginRes
       */
  timeout: number
}

/**
 *
 * @export
 * @interface UserRegisterReq
 */
export interface UserRegisterReq {
  /**
     *
     * @type {string}
     * @memberof UserRegisterReq
     */
  username: string | null
  /**
     *
     * @type {string}
     * @memberof UserRegisterReq
     */
  email: string | null
  /**
     *
     * @type {string}
     * @memberof UserRegisterReq
     */
  password: string | null
  /**
     *
     * @type {string}
     * @memberof UserRegisterReq
     */
  invite_code: string | null

  /**
       *
       * @type {string}
       * @memberof UserRegisterReq
       */
  captcha: string | null

}
/**
   *
   * @export
   * @interface UserRegisterRes
   */
export interface UserRegisterRes {
  /**
     *
     * @type {boolean}
     * @memberof UserRegisterRes
     */
  is_success: boolean
}

/**
   *
   * @export
   * @interface UserVerifyUserNameReq
   */
export interface UserVerifyUserNameReq {
  /**
     *
     * @type {string}
     * @memberof UserVerifyUserNameReq
     */
  username: string | null
}
/**
   *
   * @export
   * @interface UserVerifyEmailReq
   */
export interface UserVerifyEmailReq {
  /**
     *
     * @type {string}
     * @memberof UserVerifyEmailReq
     */
  email: string | null
}
/**
   *
   * @export
   * @interface UserVerifyRes
   */
export interface UserVerifyRes {
  /**
     *
     * @type {boolean}
     * @memberof UserVerifyRes
     */
  is_valid: boolean
}

/**
   *
   * @export
   * @interface UserInviteLinkRes
   */
export interface UserInviteLinkRes {
  /**
      *
      * @type {string}
      * @memberof UserInviteLinkRes
      */
  invite_link: string
  /**
      *
      * @type {number}
      * @memberof UserInviteLinkRes
      */
  invite_number: number
  /**
      *
      * @type {number}
      * @memberof UserInviteLinkRes
      */
  invite_reward: number
}

/**
   *
   * @export
   * @interface UserCdkeyPayReq
   */
export interface UserCdkeyPayReq {
  /**
       *
       * @type {string}
       * @memberof UserCdkeyPayReq
       */
  code_key: string | null
}
/**
   *
   * @export
   * @interface UserGiftCardRes
   */
export interface UserGiftCardRes {
  /**
        *
        * @type {UserGiftCard}
        * @memberof UserGiftCardRes
        */
  card_list: Array<UserGiftCard> | undefined
}

/**
   *
   * @export
   * @interface UserGiftCard
   */
export interface UserGiftCard {
  /**
        *
        * @type {string}
        * @memberof UserGiftCard
        */
  card_id: string | null
  /**
        *
        * @type {string}
        * @memberof UserGiftCard
        */
  card_name: string | null
  /**
        *
        * @type {string}
        * @memberof UserGiftCard
        */
  card_comment: string | null
  /**
        *
        * @type {string}
        * @memberof UserGiftCard
        */
  card_discount: number | null
  /**
        *
        * @type {string}
        * @memberof UserGiftCard
        */
  card_amount: number | null
  /**
        *
        * @type {string}
        * @memberof UserGiftCard
        */
  card_link: string | null
}

/**
   *
   * @export
   * @interface UserUpadatePasswordReq
   */
export interface UserUpadatePasswordReq {
  /**
        *
        * @type {string}
        * @memberof UserUpadatePasswordReq
        */
  new_password: string | null
  /**
        *
        * @type {string}
        * @memberof UserUpadatePasswordReq
        */
  old_password: string | null
}
/**
   *
   * @export
   * @interface UserResetPasswordReq
   */
export interface UserResetPasswordReq {
  /**
         *
         * @type {string}
         * @memberof UserResetPasswordReq
         */
  new_password: string | null
  /**
         *
         * @type {string}
         * @memberof UserResetPasswordReq
         */
  temp_code: string | null
}

/**
   *
   * @export
   * @interface UserForgetPasswordReq
   */
export interface UserForgetPasswordReq {
  /**
         *
         * @type {string}
         * @memberof UserForgetPasswordReq
         */
  email: string | null

  /**
       *
       * @type {string}
       * @memberof UserForgetPasswordReq
       */
  captcha: string | null
}

/**
 *
 * @export
 * @interface UserAvatarRes
 */
export interface UserAvatarRes {
  /**
       *
       * @type {string}
       * @memberof UserAvatarRes
       */
  avatar: string
}

/**
 *
 * @export
 * @interface UserBalanceRes
 */
export interface UserBalanceRes {
  /**
        *
        * @type {string}
        * @memberof UserBalanceRes
        */
  balance: string
}

/**
 *
 * @export
 * @interface UserInfoRes
 */
export interface UserInfoRes {
  /**
       *
       * @type {number}
       * @memberof UserInfoRes
       */
  balance: number
  /**
       *
       * @type {string}
       * @memberof UserInfoRes
       */
  email: string
  /**
       *
       * @type {string}
       * @memberof UserInfoRes
       */
  nickname: string
  /**
       *
       * @type {string}
       * @memberof UserInfoRes
       */
  phone: string
  /**
       *
       * @type {string}
       * @memberof UserInfoRes
       */
  username: string
  /**
       *
       * @type {string}
       * @memberof UserInfoRes
       */
  role: string
}
