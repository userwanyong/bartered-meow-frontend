// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { API_PREFIX } from '../../../config/api';

/** 此处后端没有提供注释 GET /oauth */
export async function list1(options?: { [key: string]: any }) {
  return request<string[]>(`${API_PREFIX}/oauth`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /oauth/${param0}/callback */
export async function login2(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.login2Params,
  options?: { [key: string]: any },
) {
  const { type: param0, ...queryParams } = params;
  return request<API.BaseResponseUserResponseDTO>(`${API_PREFIX}/oauth/${param0}/callback`, {
    method: 'GET',
    params: {
      ...queryParams,
      callback: undefined,
      ...queryParams['callback'],
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /oauth/${param0}/callback */
export async function login5(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.login5Params,
  options?: { [key: string]: any },
) {
  const { type: param0, ...queryParams } = params;
  return request<API.BaseResponseUserResponseDTO>(`${API_PREFIX}/oauth/${param0}/callback`, {
    method: 'PUT',
    params: {
      ...queryParams,
      callback: undefined,
      ...queryParams['callback'],
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /oauth/${param0}/callback */
export async function login4(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.login4Params,
  options?: { [key: string]: any },
) {
  const { type: param0, ...queryParams } = params;
  return request<API.BaseResponseUserResponseDTO>(`${API_PREFIX}/oauth/${param0}/callback`, {
    method: 'POST',
    params: {
      ...queryParams,
      callback: undefined,
      ...queryParams['callback'],
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /oauth/${param0}/callback */
export async function login7(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.login7Params,
  options?: { [key: string]: any },
) {
  const { type: param0, ...queryParams } = params;
  return request<API.BaseResponseUserResponseDTO>(`${API_PREFIX}/oauth/${param0}/callback`, {
    method: 'DELETE',
    params: {
      ...queryParams,
      callback: undefined,
      ...queryParams['callback'],
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PATCH /oauth/${param0}/callback */
export async function login6(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.login6Params,
  options?: { [key: string]: any },
) {
  const { type: param0, ...queryParams } = params;
  return request<API.BaseResponseUserResponseDTO>(`${API_PREFIX}/oauth/${param0}/callback`, {
    method: 'PATCH',
    params: {
      ...queryParams,
      callback: undefined,
      ...queryParams['callback'],
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /oauth/login/${param0} */
export async function login1(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.login1Params,
  options?: { [key: string]: any },
) {
  const { type: param0, ...queryParams } = params;
  return request<any>(`${API_PREFIX}/oauth/login/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}
