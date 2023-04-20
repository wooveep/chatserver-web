/*
 * @Author: cloudyi.li
 * @Date: 2023-03-23 16:09:49
 * @LastEditTime: 2023-04-16 21:18:36
 * @LastEditors: cloudyi.li
 * @FilePath: /whatserver-web/src/enums/httpEnum.ts
 */
/**
 * @description: 请求结果集
 */
export enum RequestEnums {
  SUCCESS = 200,
  BAD = 400,
  ERROR = -1,
  TIMEOUT = 10042,
  TYPE = 'success',
  AUTHFAIL = 40001,
}

/**
   * @description: 请求方法
   */
export enum RequestEnum {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

/**
   * @description:  常用的contentTyp类型
   */
export enum ContentTypeEnum {
  // json
  JSON = 'application/json;charset=UTF-8',
  // json
  TEXT = 'text/plain;charset=UTF-8',
  // form-data 一般配合qs
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  // form-data  上传
  FORM_DATA = 'multipart/form-data;charset=UTF-8',
}
