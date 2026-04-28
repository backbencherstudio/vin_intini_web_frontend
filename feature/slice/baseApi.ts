import { clearToken, getToken, setToken } from "@/lib/token";
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const extractAccessToken = (payload: any): string | null => {
  return payload?.token || payload?.data?.token || null;
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://vin.apphero.agency/api",
  credentials: "include",
  prepareHeaders: async (headers) => {
    if (typeof window !== "undefined") {
      const token = await getToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }
    headers.set("accept", "application/json");
    return headers;
  },
});

let refreshPromise: Promise<any> | null = null;

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);
  const requestUrl = typeof args === "string" ? args : args.url;
  const isRefreshRequest = requestUrl.includes("/refresh");
  const isUnAuthorized = result.error && result.error.status === 401;

  if (isUnAuthorized && !isRefreshRequest) {
    if (!refreshPromise) {
      refreshPromise = (async () => {
        const refreshResult = await rawBaseQuery(
          { url: "/refresh", method: "POST" },
          api,
          extraOptions,
        );
        const newToken = extractAccessToken(refreshResult.data);
        if (newToken) {
          await setToken(newToken);
          return newToken;
        }

        await clearToken();
        return null;
      })().finally(() => {
        refreshPromise = null;
      });
    }
    const newToken = await refreshPromise;
    if (newToken) {
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      await clearToken();
    }
  }
  return result;
};

const baseApiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: ["User", "Course", "Progress", "Discussion","connect", "follow"],
});

export default baseApiSlice;
