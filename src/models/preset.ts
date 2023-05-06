/*
 * @Author: cloudyi.li
 * @Date: 2023-05-04 16:06:40
 * @LastEditTime: 2023-05-05 13:42:23
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/models/preset.ts
 */

import type { Preset } from '@/typings/preset'

/**
*
* @export
* @interface PresetListRes
*/
export interface PresetListRes {
  /**
    *
    * @type {Array<Preset.Preset>}
    * @memberof PresetListRes
    */
  preset_list: Array<Preset.Preset> | null
}
