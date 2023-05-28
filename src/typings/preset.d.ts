/*
 * @Author: cloudyi.li
 * @Date: 2023-05-04 17:15:55
 * @LastEditTime: 2023-05-27 10:13:27
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/typings/preset.d.ts
 */
import { namespace } from "naive-ui/es/_utils/cssr"

declare namespace Preset{
	interface Preset{
		preset_id:string
		preset_name: string
        preset_tips: string
	}
    interface PresetStore{
        active: string
        list: Preset[]
    }
}
