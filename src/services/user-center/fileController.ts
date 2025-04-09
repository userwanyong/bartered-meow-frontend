// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { API_PREFIX } from '../../../config/api';

/** 此处后端没有提供注释 POST /file/upload */
export async function upload(
  formData: FormData,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseString>(`${API_PREFIX}/file/upload`, {
    method: 'POST',
    data: formData,  // 使用 data 而不是 params
    requestType: 'form',  // 指定请求类型为 form
    ...(options || {}),
  });
}
