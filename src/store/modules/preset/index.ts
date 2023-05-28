/*
 * @Author: cloudyi.li
 * @Date: 2023-05-04 17:20:01
 * @LastEditTime: 2023-05-27 10:14:33
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/store/modules/preset/index.ts
 */
import { defineStore } from 'pinia'
import { getLocalState, setLocalState } from './helper'
import type { Preset } from '@/typings/preset'

export const usePresetStore = defineStore('preset-store', {
  state: (): Preset.PresetStore => getLocalState(),

  getters: {
    getPresetNameByActive(state: Preset.PresetStore) {
      const index = state.list.findIndex(item => item.preset_id === state.active)
      if (index !== -1)
        return state.list[index].preset_name
      return null
    },

    getPresetTipsByActive(state: Preset.PresetStore) {
      const index = state.list.findIndex(item => item.preset_id === state.active)
      if (index !== -1)
        return state.list[index].preset_tips
      return null
    },

    getActiveUuid(state: Preset.PresetStore) {
      return state.active
    },

    getPresetList(state: Preset.PresetStore) {
      return state.list
    },

  },
  actions: {

    resetPresetStore() {
      this.active = ''
      this.list = []
      this.recordState()
    },

    addPreset(preset: Preset.Preset) {
      const index = this.list.findIndex(item => item.preset_id === preset.preset_id)
      if (index !== -1)
        this.list[index] = preset
      else
        this.list.unshift(preset)
      this.recordState()
    },
    setActive(uuid: string) {
      this.active = uuid
    },
    recordState() {
      setLocalState(this.$state)
    },
  },
})
