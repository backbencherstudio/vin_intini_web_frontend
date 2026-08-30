import { clearToken, getToken, setToken } from "@/lib/token";
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const rawBaseQuery = fetchBaseQuery({
  baseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://vini.pixelstack.cloud/api",
  credentials: "include",
  prepareHeaders: async (headers) => {
    const token = await getToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
    headers.set("Accept", "application/json");
    return headers;
  },
});

let isRefreshing = false;
let pendingRequests: Array<() => void> = [];

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  const isUnauthorized =
    result?.error?.status === 401 ||
    (result?.data as any)?.message?.toLowerCase?.()?.includes("unauthorized");

  if (!isUnauthorized) {
    return result;
  }

  // রিফ্রেশ রিকোয়েস্ট নিজেই ফেইল করলে লগআউট
  if (typeof args === "object" && args.url.includes("/refresh")) {
    await clearToken();
    if (typeof window !== "undefined") window.location.href = "/login";
    return result;
  }

  // অন্যান্য সমান্তরাল রিকোয়েস্টগুলোকে কিউতে রাখা
  if (isRefreshing) {
    return new Promise((resolve) => {
      pendingRequests.push(() => {
        resolve(rawBaseQuery(args, api, extraOptions));
      });
    });
  }

  isRefreshing = true;
  try {
    const currentToken = await getToken();
    const refreshResult = await rawBaseQuery(
      {
        url: "/refresh",
        method: "POST",
        headers: {
          ...(currentToken ? { Authorization: `Bearer ${currentToken}` } : {}),
          Accept: "application/json",
        },
      },
      api,
      extraOptions
    );

    const newToken =
      (refreshResult.data as any)?.token ||
      (refreshResult.data as any)?.data?.token ||
      (refreshResult.data as any)?.access_token;

    if (newToken) {
      await setToken(newToken);
      pendingRequests.forEach((cb) => cb());
      pendingRequests = [];
      return await rawBaseQuery(args, api, extraOptions);
    }

    // রিফ্রেশ টোকেনও ইনভ্যালিড হলে লগআউট
    pendingRequests = [];
    await clearToken();
    if (typeof window !== "undefined") window.location.href = "/login";
    return result;
  } catch {
    pendingRequests = [];
    await clearToken();
    if (typeof window !== "undefined") window.location.href = "/login";
    return result;
  } finally {
    isRefreshing = false;
  }
};

export const baseApiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: [
    "User",
    "Post",
    "Notifications",
    "conversationList",
    "getConversationList",
    "message",
    "loginActivities",
    "activeSessions",
    "overview",
    "connect",
    "psychology",
    "follow",
    "group",
    "neuroscience",
    "Comment",
    "Like",
    "experience",
    "study",
  ],
});

export default baseApiSlice;