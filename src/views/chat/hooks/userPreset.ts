import { fetchPresetList } from '@/api'
import type { PresetListRes } from '@/models'
import { usePresetStore } from '@/store/modules/preset'

/*
 * @Author: cloudyi.li
 * @Date: 2023-05-05 13:35:42
 * @LastEditTime: 2023-05-06 22:01:12
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/views/chat/hooks/userPreset.ts
 */
export function usePreset() {
  const presetStore = usePresetStore()

  const fetchPreset = async () => {
    try {
      const result = await fetchPresetList<PresetListRes>()
      if (result.data.preset_list === null)
        return

      const presetList = Array.from(result.data.preset_list)
      for (const i of presetList)
        presetStore.addPreset(i)
    }
    catch (error: any) {
      throw new Error(error.message)
    }
  }
  return {
    fetchPreset,
  }
}
