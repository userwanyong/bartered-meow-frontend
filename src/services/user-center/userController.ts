// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 POST /user/add */
export async function add(body: API.UserAddRequestDTO, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/api/user/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /user/current */
export async function getCurrentUser(options?: { [key: string]: any }) {
  return request<API.BaseResponseUserResponseDTO>('/api/user/current', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /user/delete/${param0} */
export async function deleteUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteUsingPOSTParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseBoolean>(`/api/user/delete/${param0}`, {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /user/list */
export async function list(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseListUserResponseDTO>('/api/user/list', {
    method: 'GET',
    params: {
      ...params,
      userQueryRequestDTO: undefined,
      ...params['userQueryRequestDTO'],
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /user/login */
export async function login(body: API.UserLoginRequestDTO, options?: { [key: string]: any }) {
  return request<API.BaseResponseUserResponseDTO>('/api/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /user/register */
export async function register(body: API.UserRegisterRequestDTO, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/api/user/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /user/update */
export async function update(body: API.UserUpdateRequestDTO, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/api/user/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
