import { AxiosInstance, AxiosInstanceBlog } from "./axios-instance";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import Cookies from "js-cookie";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiRequestConfig<T = unknown> {
  params?: Record<string, string | number | boolean | null>;
  urlParams?: Record<string, string | number>;
  data?: T;
}

type ConfigWithUrlParams<T> = T & {
  urlParams: Record<string, string | number>;
};
type ConfigWithParams<T> = T & {
  params: Record<string, string | number | boolean | null>;
};
type ConfigWithData<T, D> = T & { data: D };

export function createApiRequest<
  RequestData = unknown,
  ResponseData = unknown,
>(options: {
  endpoint: string;
  method: HttpMethod;
  withAuth?: boolean;
  isBlog?: boolean;
  transformResponse?: (data: unknown) => ResponseData;
  extraConfig?: (
    config: ApiRequestConfig<RequestData>,
  ) => Record<string, unknown>;
}) {
  return async (
    config?: ApiRequestConfig<RequestData>,
  ): Promise<ResponseData> => {
    const {
      endpoint,
      method,
      withAuth = true,
      isBlog = false,
      transformResponse,
    } = options;
    const safeConfig = config || {};

    let finalEndpoint = endpoint;
    if (config && "urlParams" in safeConfig) {
      const configWithUrlParams = safeConfig as ConfigWithUrlParams<
        typeof safeConfig
      >;
      Object.entries(configWithUrlParams.urlParams).forEach(([key, value]) => {
        finalEndpoint = finalEndpoint.replace(`{${key}}`, String(value));
      });
    }

    try {
      const extraConfigResult = options.extraConfig
        ? options.extraConfig(safeConfig as ApiRequestConfig<RequestData>)
        : {};

      if (extraConfigResult.url) {
        finalEndpoint = String(extraConfigResult.url);
        delete extraConfigResult.url;
      }

      const axiosConfig: AxiosRequestConfig = {
        ...extraConfigResult,
      };

      if (safeConfig && "params" in safeConfig) {
        const configWithParams = safeConfig as ConfigWithParams<
          typeof safeConfig
        >;
        axiosConfig.params = configWithParams.params;
      }

      if (withAuth) {
        const AUTH_TOKEN = Cookies.get("auth_token");
        if (!AUTH_TOKEN) {
          throw new Error(
            "Authentication token required but not found in cookies",
          );
        }

        if (!axiosConfig.headers) {
          axiosConfig.headers = {};
        }
        axiosConfig.headers.Authorization = `Bearer ${AUTH_TOKEN}`;
      }

      const axiosClient = isBlog ? AxiosInstanceBlog : AxiosInstance;
      let response: AxiosResponse;

      switch (method) {
        case "GET":
          response = await axiosClient.get(finalEndpoint, axiosConfig);
          break;
        case "POST": {
          const postData =
            safeConfig && "data" in safeConfig
              ? (safeConfig as ConfigWithData<typeof safeConfig, RequestData>)
                  .data
              : safeConfig;
          response = await axiosClient.post(
            finalEndpoint,
            postData,
            axiosConfig,
          );
          break;
        }
        case "PUT": {
          const putData =
            safeConfig && "data" in safeConfig
              ? (safeConfig as ConfigWithData<typeof safeConfig, RequestData>)
                  .data
              : safeConfig;
          response = await axiosClient.put(finalEndpoint, putData, axiosConfig);
          break;
        }
        case "PATCH": {
          const patchData =
            safeConfig && "data" in safeConfig
              ? (safeConfig as ConfigWithData<typeof safeConfig, RequestData>)
                  .data
              : safeConfig;
          response = await axiosClient.patch(
            finalEndpoint,
            patchData,
            axiosConfig,
          );
          break;
        }
        case "DELETE":
          response = await axiosClient.delete(finalEndpoint, axiosConfig);
          break;
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }

      if (transformResponse) {
        return transformResponse(response.data);
      }

      return response.data as ResponseData;
    } catch (error) {
      console.error(`API Error (${method} ${endpoint}):`, error);
      throw error;
    }
  };
}
