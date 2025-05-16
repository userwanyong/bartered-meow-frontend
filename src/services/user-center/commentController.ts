// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { API_PREFIX } from '../../../config/api';

/** 此处后端没有提供注释 POST /comment/add */
export async function addComment(body: API.CommentAddRequestDTO, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>(`${API_PREFIX}/comment/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /comment/delete/${param0} */
export async function deleteComment(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteCommentParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseBoolean>(`${API_PREFIX}/comment/delete/${param0}`, {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /comment/list/${param0} */
export async function listCommentById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listCommentByIdParams,
  options?: { [key: string]: any },
) {
  const { userId: param0, ...queryParams } = params;
  return request<API.BaseResponseFinallyCommentResponseDTO>(
    `${API_PREFIX}/comment/list/${param0}`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 此处后端没有提供注释 POST /comment/update */
export async function updateComment(
  body: API.CommentAddRequestDTO,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean>(`${API_PREFIX}/comment/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
