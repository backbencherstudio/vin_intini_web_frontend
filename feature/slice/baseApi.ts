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
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://vini.pixelstack.cloud/api",
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

const isUnauthorizedResponse = (data: any): boolean => {
  return (
    data &&
    typeof data === "object" &&
    data.success === false &&
    data.message === "Unauthorized"
  );
};

const refreshAccessToken = async (
  api: any,
  extraOptions: any,
): Promise<string | null> => {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const currentToken = await getToken();

        const refreshArgs: FetchArgs = {
          url: "/refresh",
          method: "POST",
          headers: {
            ...(currentToken
              ? { Authorization: `Bearer ${currentToken}` }
              : {}),
            accept: "application/json",
          },
        };

        const refreshResult = await rawBaseQuery(
          refreshArgs,
          api,
          extraOptions,
        );

        if (refreshResult.error) {
          // on any refresh error, clear token and redirect to login
          await clearToken();
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          return null;
        }

        const newToken = extractAccessToken(refreshResult.data);

        if (newToken) {
          await setToken(newToken);
          return newToken;
        }

        return null;
      } catch {
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
  let result = await rawBaseQuery(args, api, extraOptions);

  const isUnauthorized =
    (result.error && result.error.status === 401) ||
    isUnauthorizedResponse(result.data);

  if (isUnauthorized) {
    if (isRefreshRequest(args)) {
      await clearToken();
      return result;
    }

    const tokenFromPromise = await refreshAccessToken(api, extraOptions);

    if (tokenFromPromise) {
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      await clearToken();
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
    "psychology",
    "neuroscience",
    "conversationList",
    "getConversationList",
    "message",
    "loginActivities",
    "activeSessions",
    "overview"
  ],
});

export default baseApiSlice;
