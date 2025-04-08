// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /goods */
export async function listGoodsByTagId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listGoodsByTagIdParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseListGoodsResponseDTO>('/api/goods', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /goods/add */
export async function addGoods(body: API.GoodsAddRequestDTO, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/api/goods/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /goods/delete/${param0} */
export async function deleteGoodsById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteGoodsByIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseBoolean>(`/api/goods/delete/${param0}`, {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /goods/list */
export async function listGoods(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listGoodsParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseListGoodsResponseDTO>('/api/goods/list', {
    method: 'GET',
    params: {
      ...params,
      goodsQueryRequestDTO: undefined,
      ...params['goodsQueryRequestDTO'],
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /goods/tag/add */
export async function addTag(body: API.TagAddRequestDTO, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/api/goods/tag/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /goods/tag/delete/${param0} */
export async function deleteTag(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteTagParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseBoolean>(`/api/goods/tag/delete/${param0}`, {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /goods/tag/list */
export async function listTag(options?: { [key: string]: any }) {
  return request<API.BaseResponseListTagResponseDTO>('/api/goods/tag/list', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /goods/tag/update */
export async function updateTag(body: API.TagUpdateRequestDTO, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/api/goods/tag/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /goods/update */
export async function updateGoods(
  body: API.GoodsUpdateRequestDTO,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean>('/api/goods/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
