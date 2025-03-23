// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** add POST /api/user/add */
export async function addUsingPost(body: API.UserAddDTO, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean_>('/api/user/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** getCurrentUser GET /api/user/current */
export async function getCurrentUserUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseUserVo_>('/api/user/current', {
    method: 'GET',
    ...(options || {}),
  });
}

/** delete POST /api/user/delete/${param0} */
export async function deleteUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteUsingPOSTParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseBoolean_>(`/api/user/delete/${param0}`, {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** list GET /api/user/list */
export async function listUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseListUserVo_>('/api/user/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** login POST /api/user/login */
export async function loginUsingPost(body: API.UserLoginDTO, options?: { [key: string]: any }) {
  return request<API.BaseResponseUserVo_>('/api/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** logout POST /api/user/logout */
export async function logoutUsingPost(options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean_>('/api/user/logout', {
    method: 'POST',
    ...(options || {}),
  });
}

/** register POST /api/user/register */
export async function registerUsingPost(
  body: API.UserRegisterDTO,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/api/user/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** update POST /api/user/update */
export async function updateUsingPost(body: API.UserUpdateDTO, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean_>('/api/user/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
