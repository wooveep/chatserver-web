/*
 * @Author: cloudyi.li
 * @Date: 2023-04-17 16:21:36
 * @LastEditTime: 2023-04-24 17:09:02
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/models/chat.ts
 */
/**
 *
 * @export
 * @interface ChatChattingRes
 */
export interface ChatChattingRes {
  /**
         *
         * @type {string}
         * @memberof ChatChattingRes
         */
  msg: string
  /**
         *
         * @type {string}
         * @memberof ChatChattingRes
         */
  time: string
}

/**
 *
 * @export
 * @interface ChatChattingReq
 */
export interface ChatChattingReq {
  /**
           *
           * @type {string}
           * @memberof ChatChattingReq
           */
  chat_id: string
  /**
           *
           * @type {string}
           * @memberof ChatChattingReq
           */
  message: string

  /**
           *
           * @type {number}
           * @memberof ChatChattingReq
           */
  memory_level: number
}

/**
 *
 * @export
 * @interface ChatRegenerategReq
 */
export interface ChatRegenerategReq {
  /**
           *
           * @type {string}
           * @memberof ChatRegenerategReq
           */
  chat_id: string
  /**
           *
           * @type {string}
           * @memberof ChatRegenerategReq
           */
  question_id: string
  /**
           *
           * @type {number}
           * @memberof ChatRegenerategReq
           */
  memory_level: number
}

/**
 *
 * @export
 * @interface ChatCreateNewReq
 */
export interface ChatCreateNewReq {
  /**
           *
           * @type {string}
           * @memberof ChatCreateNewReq
           */
  chat_name: string
  /**
           *
           * @type {string}
           * @memberof ChatCreateNewReq
           */
  preset_id: string
}

/**
 *
 * @export
 * @interface ChatCreateNewRes
 */
export interface ChatCreateNewRes {
  /**
           *
           * @type {string}
           * @memberof ChatCreateNewRes
           */
  chat_id: string
}

/**
 *
 * @export
 * @interface ChatUpdateReq
 */
export interface ChatUpdateReq {
  /**
           *
           * @type {string}
           * @memberof ChatUpdateReq
           */
  chat_name: string
  /**
           *
           * @type {string}
           * @memberof ChatUpdateReq
           */
  chat_id: string
}

/**
 *
 * @export
 * @interface ChatUpdateRes
 */
export interface ChatUpdateRes {
  /**
     *
     * @type {boolean}
     * @memberof ChatUpdateRes
     */
  is_success: boolean
}

/**
 *
 * @export
 * @interface ChatDeleteReq
 */
export interface ChatDeleteReq {
  /**
           *
           * @type {string}
           * @memberof ChatDeleteReq
           */
  chat_id: string
}

/**
 *
 * @export
 * @interface ChatListRes
 */
export interface ChatListRes {
  /**
           *
           * @type {Array<Chat.ChatOne>}
           * @memberof ChatListRes
           */
  chat_list: Array<Chat.ChatOne> | null
}

/**
 *
 * @export
 * @interface ChatRecordHistoryReq
 */
export interface ChatRecordHistoryReq {
  /**
           *
           * @type {string}
           * @memberof ChatRecordHistoryReq
           */
  chat_id: string
}

/**
 *
 * @export
 * @interface ChatRecordHistoryRes
 */
export interface ChatRecordHistoryRes {
  /**
           *
           * @type {string}
           * @memberof ChatRecordHistoryRes
           */
  chat_id: string
  /**
           *
           * @type {Array<Chat.ChatRecordOne>}
           * @memberof ChatRecordHistoryRes
           */
  record_list: Array<Chat.ChatRecordOne> | null

}
