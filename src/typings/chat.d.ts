/*
 * @Author: cloudyi.li
 * @Date: 2023-03-23 13:51:37
 * @LastEditTime: 2023-04-20 16:32:04
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/typings/chat.d.ts
 */
declare namespace Chat {
	interface Chat {
		msgid: string
		dateTime: string
		text: string
		errmsg: string
		inversion?: boolean
		error?: boolean
		loading?: boolean
	}
	interface History {
		title: string
		isEdit: boolean
		uuid: string
	}

	interface ChatState {
		active: string
		memory: number
		history: History[]
		chat: { uuid: string; data: Chat[] }[]
	}
	interface ChatOne {
		chat_id: string
		chat_name: string
		created_at: string 
	}
	interface ChatRecordOne {
		record_id: string
		sender: string
		message: string
		created_at: string
	}
}
