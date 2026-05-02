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
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "https://vin.apphero.agency/api",
  credentials: "include",
  prepareHeaders: async (headers) => {
    const token = await getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("accept", "application/json");
    return headers;
  },
});

let refreshPromise: Promise<string | null> | null = null;

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const requestUrl = typeof args === "string" ? args : args.url;
    
    if (requestUrl.includes("/refresh")) {
      await clearToken();
      return result;
    }

    if (!refreshPromise) {
      refreshPromise = (async () => {
        try {
          const refreshResult = await rawBaseQuery(
            { url: "/refresh", method: "POST" },
            api,
            extraOptions
          );

          const newToken = extractAccessToken(refreshResult.data);
          
          if (newToken) {
            await setToken(newToken);
            return newToken;
          }

          await clearToken();
          return null;
        } catch {
          await clearToken();
          return null;
        } finally {
          refreshPromise = null;
        }
      })();
    }

    const tokenFromPromise = await refreshPromise;

    if (tokenFromPromise) {
      result = await rawBaseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const baseApiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: ["User", "experience", "study", "Discussion", "connect", "follow", "group"],
});

export default baseApiSlice;