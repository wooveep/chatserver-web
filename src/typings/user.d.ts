/*
 * @Author: cloudyi.li
 * @Date: 2023-05-21 21:54:12
 * @LastEditTime: 2023-05-26 13:11:00
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/typings/user.d.ts
 */
import { namespace } from "naive-ui/es/_utils/cssr"

declare namespace User{
	interface UserStore{
        username: string
        nickname: string
        email: string
        phone: string
        avatar: string
        balance: string
        role: string
    }

    interface UserBill{
        change_time: string
        change: number
        balance: number
        comment: string 
    }
}
