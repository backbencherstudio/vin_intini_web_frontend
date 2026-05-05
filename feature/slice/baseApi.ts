import { clearToken, getToken, getTokenIssuedAt, setToken } from "@/lib/token";
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const extractAccessToken = (payload: any): string | null => {
  return payload?.token || payload?.data?.token || null;
};

const REFRESH_INTERVAL_MS = 20 * 60 * 1000;

const rawBaseQuery = fetchBaseQuery({
  baseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://vin.apphero.agency/api",
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

const isRefreshRequest = (args: string | FetchArgs) => {
  const requestUrl = typeof args === "string" ? args : args.url;
  return requestUrl.includes("/refresh");
};

const shouldRefreshToken = async () => {
  const token = await getToken();
  const issuedAt = await getTokenIssuedAt();

  if (!token || !issuedAt) {
    return false;
  }

  return Date.now() - issuedAt >= REFRESH_INTERVAL_MS;
};

const refreshAccessToken = async (
  api: any,
  extraOptions: any,
): Promise<string | null> => {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
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
      } catch {
        await clearToken();
        return null;
      } finally {
        refreshPromise = null;
      }
    })();
  }

  return refreshPromise;
};

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  if (!isRefreshRequest(args) && (await shouldRefreshToken())) {
    await refreshAccessToken(api, extraOptions);
  }

  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (isRefreshRequest(args)) {
      await clearToken();
      return result;
    }

    const tokenFromPromise = await refreshAccessToken(api, extraOptions);

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
  tagTypes: [
    "User",
    "experience",
    "study",
    "Post",
    "Comment",
    "Like",
    "connect",
    "follow",
    "group",
    "Notifications",
  ],
});

export default baseApiSlice;
