/*
 * @Author: cloudyi.li
 * @Date: 2023-03-23 13:51:37
 * @LastEditTime: 2023-05-04 17:22:10
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/store/modules/preset/helper.ts
 */
import type { Preset } from '@/typings/preset'
import { ss } from '@/utils/storage'

const LOCAL_NAME = 'presetStorage'

export function defaultState(): Preset.PresetStore {
  return {
    active: '',
    list: [],
  }
}

export function getLocalState(): Preset.PresetStore {
  const localState = ss.get(LOCAL_NAME)
  return { ...defaultState(), ...localState }
}

export function setLocalState(state: Preset.PresetStore) {
  ss.set(LOCAL_NAME, state)
}

export function removeLocalState() {
  return ss.remove(LOCAL_NAME)
}
