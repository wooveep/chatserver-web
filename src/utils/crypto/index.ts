/*
 * @Author: cloudyi.li
 * @Date: 2023-03-23 13:51:37
 * @LastEditTime: 2023-05-26 16:36:09
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/utils/crypto/index.ts
 */
import CryptoJS from 'crypto-js'

const CryptoSecret = '__CRYPTO_SECRET__'
const PasswordKey = 'QLHDYGCODHTAPWEB'
export function enCrypto(data: any) {
  const str = JSON.stringify(data)
  return CryptoJS.AES.encrypt(str, CryptoSecret).toString()
}

export function deCrypto(data: string) {
  const bytes = CryptoJS.AES.decrypt(data, CryptoSecret)
  const str = bytes.toString(CryptoJS.enc.Utf8)

  if (str)
    return JSON.parse(str)

  return null
}

export function CryptoPassword(data: string) {
  const str = CryptoJS.enc.Utf8.parse(data)
  const encrypted = CryptoJS.AES.encrypt(str, CryptoJS.enc.Utf8.parse(PasswordKey), {
    iv: CryptoJS.enc.Utf8.parse(PasswordKey),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })
  return CryptoJS.enc.Base64.stringify(encrypted.ciphertext)
}
