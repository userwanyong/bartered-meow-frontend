// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { API_PREFIX } from '../../../config/api';

/** 此处后端没有提供注释 GET /ai/service */
export async function service(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.serviceParams,
  options?: { [key: string]: any },
) {
  return request<string[]>(`${API_PREFIX}/ai/service`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /ai/service */
export async function service3(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.service3Params,
  options?: { [key: string]: any },
) {
  return request<string[]>(`${API_PREFIX}/ai/service`, {
    method: 'PUT',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /ai/service */
export async function service2(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.service2Params,
  options?: { [key: string]: any },
) {
  return request<string[]>(`${API_PREFIX}/ai/service`, {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /ai/service */
export async function service5(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.service5Params,
  options?: { [key: string]: any },
) {
  return request<string[]>(`${API_PREFIX}/ai/service`, {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PATCH /ai/service */
export async function service4(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.service4Params,
  options?: { [key: string]: any },
) {
  return request<string[]>(`${API_PREFIX}/ai/service`, {
    method: 'PATCH',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
