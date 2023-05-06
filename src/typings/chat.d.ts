import { namespace } from "naive-ui/es/_utils/cssr"

/*
 * @Author: cloudyi.li
 * @Date: 2023-03-23 13:51:37
 * @LastEditTime: 2023-05-06 15:38:50
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/typings/chat.d.ts
 */
declare namespace Chat {
	interface Record {
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
		presetid: string
	}

	interface ChatState {
		active: string
		memory: number
		history: History[]
		chat: { uuid: string; data: Record[] }[]
	}
	interface ChatOne {
		chat_id: string
        preset_id: string
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

