// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { API_PREFIX } from '../../../config/api';

/** 此处后端没有提供注释 POST /cart/add */
export async function addCart(body: API.CartAddRequestDTO, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>(`${API_PREFIX}/cart/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /cart/delete/${param0} */
export async function deleteCart(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteCartParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseBoolean>(`${API_PREFIX}/cart/delete/${param0}`, {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /cart/list */
export async function listCart(options?: { [key: string]: any }) {
  return request<API.BaseResponseListCartResponseDTO>(`${API_PREFIX}/cart/list`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /cart/update */
export async function updateCart(body: API.CartAddRequestDTO, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>(`${API_PREFIX}/cart/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
