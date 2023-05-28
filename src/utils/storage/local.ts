/*
 * @Author: cloudyi.li
 * @Date: 2023-03-23 13:51:37
 * @LastEditTime: 2023-05-27 00:09:30
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/utils/storage/local.ts
 */
import { deCrypto, enCrypto } from '../crypto'

interface StorageData<T = any> {
  data: T
  expire: number | null
}

export function createLocalStorage(options?: { expire?: number | null; crypto?: boolean }) {
  const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7

  const { expire, crypto } = Object.assign(
    {
      expire: DEFAULT_CACHE_TIME,
      crypto: true,
    },
    options,
  )

  function set<T = any>(key: string, data: T) {
    const storageData: StorageData<T> = {
      data,
      expire: expire !== null ? new Date().getTime() + expire * 1000 : null,
    }

    const json = crypto ? enCrypto(storageData) : JSON.stringify(storageData)
    window.localStorage.setItem(key, json)
  }
  function setWithExpire<T = any>(key: string, data: T, expire: number) {
    const storageData: StorageData<T> = {
      data,
      expire: expire !== null ? expire : null,
    }

    const json = crypto ? enCrypto(storageData) : JSON.stringify(storageData)
    window.localStorage.setItem(key, json)
  }

  function getExprieTime(key: string) {
    const json = window.localStorage.getItem(key)
    if (json) {
      let storageData: StorageData | null = null

      try {
        storageData = crypto ? deCrypto(json) : JSON.parse(json)
      }
      catch {
        return null
      }

      if (storageData) {
        const { expire } = storageData
        return expire
      }
      // remove(key)
      return null
    }
    return null
  }

  function get(key: string) {
    const json = window.localStorage.getItem(key)
    if (json) {
      let storageData: StorageData | null = null

      try {
        storageData = crypto ? deCrypto(json) : JSON.parse(json)
      }
      catch {
        // Prevent failure
      }

      if (storageData) {
        const { data, expire } = storageData
        if (expire === null || expire >= Date.now())
          return data
      }

      remove(key)
      return null
    }
  }

  function remove(key: string) {
    window.localStorage.removeItem(key)
  }

  function clear() {
    window.localStorage.clear()
  }

  return {
    set,
    get,
    remove,
    clear,
    setWithExpire,
    getExprieTime,
  }
}

export const ls = createLocalStorage()

// export const ss = createLocalStorage({ expire: null, crypto: false })
