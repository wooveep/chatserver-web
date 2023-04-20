/*
 * @Author: cloudyi.li
 * @Date: 2023-04-15 18:18:20
 * @LastEditTime: 2023-04-16 17:52:22
 * @LastEditors: cloudyi.li
 * @FilePath: /whatserver-web/src/models/user.ts
 */
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
       * @type {string}
       * @memberof UserLoginRes
       */
  expire_at: string
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
 * @interface UserInfoRes
 */
export interface UserInfoRes {
  /**
       *
       * @type {string}
       * @memberof UserInfoRes
       */
  avatar_url: string
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
  expired_at: string
}
