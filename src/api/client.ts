import { HttpCode, HttpResponse } from '@/utils/types';
import { addToast } from '@heroui/react';

const BASE_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

export enum Method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export interface Options {
  token?: string;
  body?: object | FormData | null;
}

async function request<T>(
  url: string,
  method: Method = Method.GET,
  options: Options = {},
): Promise<HttpResponse<T>> {
  let headers = null;
  let body = null;
  const bearerToken = options.token ? `Bearer ${options.token}` : null;
  headers = {
    'Content-Type': 'application/json',
    Authorization: bearerToken,
  };
  if (typeof options.body === 'object') {
    body = JSON.stringify(options.body);
  }
  if (options.body instanceof FormData) {
    body = options.body;
    headers = {
      Authorization: bearerToken,
    };
  }

  try {
    let response;
    let fullUrl = `${BASE_URI}${url}`;
    if (method === Method.GET) {
      if (options.body && typeof options.body === 'object') {
        const params = new URLSearchParams();
        Object.entries(options.body).forEach(([key, value]) => {
          if (value != undefined) {
            params.append(key, value.toString());
          }
        });
        fullUrl += '?' + params.toString();
      }
      response = await fetch(fullUrl, {
        headers,
        method,
      } as RequestInit);
    } else {
      response = await fetch(fullUrl, {
        headers,
        method,
        body,
      } as RequestInit);
    }
    if (response.status === HttpCode.UN_AUTHORIZED) {
      addToast({
        title: 'Un Authorized',
        description: 'Please login and try again',
        color: 'danger',
        variant: 'flat',
      });
      return {
        code: HttpCode.UN_AUTHORIZED,
        message: 'No Authorization',
      } as HttpResponse<T>;
    }
    const result: HttpResponse<T> = await response.json();
    if (response.status === HttpCode.BAD_REQUEST) {
      addToast({
        title: 'Bad Request',
        description: String(result.data),
        color: 'warning',
        variant: 'flat',
      });
    }
    if (response.status === HttpCode.INTERNAL_SERVER_ERROR) {
      addToast({
        title: 'Internal Server Error',
        description: String(result.data),
        color: 'danger',
        variant: 'flat',
      });
    }
    return result as HttpResponse<T>;
  } catch (error) {
    addToast({
      title: 'System Error',
      description: String(error),
      color: 'danger',
      variant: 'flat',
    });
    return {
      code: HttpCode.INTERNAL_SERVER_ERROR,
      message: 'Unknown Error',
      data: null as T,
    };
  }
}

export default request;
