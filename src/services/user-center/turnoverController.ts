// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { API_PREFIX } from '../../../config/api';

/** 此处后端没有提供注释 GET /turnover/admin/list */
export async function listTurnoverAdmin(options?: { [key: string]: any }) {
  return request<API.BaseResponseListTurnoverResponseDTO>(`${API_PREFIX}/turnover/admin/list`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /turnover/delete/${param0} */
export async function deleteTurnover(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteTurnoverParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseBoolean>(`${API_PREFIX}/turnover/delete/${param0}`, {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /turnover/list */
export async function listTurnover(options?: { [key: string]: any }) {
  return request<API.BaseResponseListTurnoverResponseDTO>(`${API_PREFIX}/turnover/list`, {
    method: 'GET',
    ...(options || {}),
  });
}
