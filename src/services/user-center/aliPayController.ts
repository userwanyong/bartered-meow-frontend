// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { API_PREFIX } from '../../../config/api';

/** 此处后端没有提供注释 POST /alipay/notify */
export async function payNotify(options?: { [key: string]: any }) {
  return request<string>(`${API_PREFIX}/alipay/notify`, {
    method: 'POST',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /alipay/pay */
export async function pay(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.payParams,
  options?: { [key: string]: any },
) {
  return request<any>(`${API_PREFIX}/alipay/pay`, {
    method: 'GET',
    params: {
      ...params,
      arg0: undefined,
      ...params['arg0'],
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /alipay/return */
export async function returnPay(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.returnPayParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponse>(`${API_PREFIX}/alipay/return`, {
    method: 'GET',
    params: {
      ...params,
      arg0: undefined,
      ...params['arg0'],
    },
    ...(options || {}),
  });
}
