import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';

type RequestWithOptionalFormDataParams = {
  method: 'post' | 'put';
  url: string;
  data?: unknown;
  config?: Partial<AxiosRequestConfig>;
};
type RequestDataConfig = Pick<
  RequestWithOptionalFormDataParams,
  'data' | 'config'
>;

function withFormDataContentType(config?: Partial<AxiosRequestConfig>) {
  return {
    ...config,
    headers: {
      ...config?.headers,
      'Content-Type': 'multipart/form-data',
    },
  };
}

function requestWithOptionalFormData({
  method,
  url,
  data,
  config,
}: RequestWithOptionalFormDataParams) {
  if (typeof FormData !== 'undefined' && data instanceof FormData) {
    return api[method](url, data, withFormDataContentType(config));
  }

  return api[method](url, data, config);
}

const API_TIMEOUT_MS = 5000;

const defaultOptions: Partial<AxiosRequestConfig> = {
  baseURL: 'api/v1/',
  timeout: API_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
};

const api: AxiosInstance = axios.create(defaultOptions);

function get(url: string, config?: Partial<AxiosRequestConfig>) {
  return api.get(url, config);
}

function del(url: string, config?: Partial<AxiosRequestConfig>) {
  return api.delete(url, config);
}

function post(url: string, { data, config }: RequestDataConfig) {
  return requestWithOptionalFormData({ method: 'post', url, data, config });
}

function put(url: string, { data, config }: RequestDataConfig) {
  return requestWithOptionalFormData({ method: 'put', url, data, config });
}

const apiClient = {
  get,
  post,
  put,
  delete: del,
};

export default apiClient;
